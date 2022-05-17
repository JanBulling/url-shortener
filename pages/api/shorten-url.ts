import md5 from "md5";
import { WithId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/connect_db";
import ShortenedUrl from "../../lib/model/shortened_url";

export default async(req: NextApiRequest, res: NextApiResponse) => {
    try {

        if (req.method !== 'POST') {
            res.status(405).send({ error: "Only 'POST' requests allowed" });
            return;
        }

        let longUrl: string = "";

        try {
            const body = JSON.parse(req.body);

            longUrl = body["url"] as string;
        } catch(e) {
            res.status(400).json({ error: "Unable to convert post-payload" });
            return;
        }

        const formattedUrl = formatUrl(longUrl);
        
        if (!formattedUrl) {
            res.status(400).json({ error: `Url '${longUrl}' is not a valid url.` });
            return;
        }

        // the given url is hashed and then formatted in base62
        const hash = md5(formattedUrl);
        const encoded = encodeBase62(hash);

        // connect to database
        const { db } = await connectToDatabase();
        const collection = db.collection<ShortenedUrl>("url");

        // Algorithm: the first 7 characters from the encoded string are taken.
        // if there is already an url encoded with the same shorturl in the databse and
        // it origniates from the same long-url, the number of attempts is increased.
        // If the unlikly event occures, where the same short-url is already in the database,
        // but the long-url is not matching, then the algorithm tries the next 7 characters
        // in the encoded string.
        let existing: WithId<ShortenedUrl> | null = null;
        for (let i = 0; i < encoded.length - 7; i++) {
            const shortUrl = encoded.slice(i, i+7);

            existing = await collection.findOne(
                { shortened_url: shortUrl },
                {
                    projection: { _id: 0, visits: 0, attempts: 0 },
                }
            )

            if(!existing) {
                break;
            }

            if (existing.url === formattedUrl) {
                await collection.updateOne(
                    { shortened_url: shortUrl },
                    { $inc: { attempts: 1 } },
                )

                res.status(200).json(JSON.parse(JSON.stringify(existing)));

                return;
            }
        }

        // if the code reaches this point, the short url does not exist in the databse
        const shortUrl = encoded.slice(0, 7);

        const shortenedUrl: ShortenedUrl = {
            shortened_url: shortUrl,
            url: formattedUrl,
            visits: 0,
            attempts: 1,
        };

        const insertedDoc = await collection.insertOne(shortenedUrl);

        const data = await collection.findOne(
            { "_id": insertedDoc.insertedId },
            {
                projection: { _id: 0, visits: 0, attempts: 0 },
            }
        );

        res.status(200).json(JSON.parse(JSON.stringify(data)));
        

    } catch(e) {
        res.status(500).json({error: e });
    }
}

function formatUrl(url: string): string | null {
    // basic checks, if the given string is an url
    if (!url.startsWith("htpp://") && !url.startsWith("https://")) {
        url = "http://" + url;
    }

    if (!url.includes(".")) {
        return null;
    }

    // try parsing the url to see, if the url is valid
    try {
        new URL(url);
        return encodeURI(url);
    } catch(e) {
        return null;
    }
}

// the sting has to be in hexadecimal format
function encodeBase62(s: string): string {
    const charSet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

    let int = parseInt("0x" + s);

    if (int === 0) return "0";

    let encoded: string[] = [];

    while(int > 0) {
        encoded = [charSet[int % 62], ...encoded];
        int = Math.floor(int / 62);
    }

    return encoded.join('');
}