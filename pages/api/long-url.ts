import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/connect_db";
import ShortenedUrl from "../../lib/model/shortened_url";

export const getLongUrl = async (shortUrl: string): Promise<ShortenedUrl | null> => {
    try {
        const { db } = await connectToDatabase();

        const data = await db.collection<ShortenedUrl>("url").findOneAndUpdate(
            { shortened_url: shortUrl },
            { $inc: { visits: 1 } },
            {
                projection: {_id: 0, visits: 0, attempts: 0},
            }
        );

        if (!data || !data.value) {
            return null;
        }

        const paresdData = <ShortenedUrl>{
            url: data.value.url,
            shortened_url: data.value.shortened_url, 
            attempts: -1, 
            visits: -1
        }

        return paresdData;
    } catch(err) {
        return null;
    }
}

export default async(req: NextApiRequest, res: NextApiResponse) => {
    const queryParam = req.query.short as string;

    if (!queryParam) {
        res.status(400).json({error: `No short-url given`});
        return;
    }

    const data = await getLongUrl(queryParam);

    if (data) {
        res.status(200).json({url: data.url, shortened_url: data.shortened_url});
    } else {
        res.status(400).json({error: `The short-url '${queryParam}' does not exist!`});
    }
}