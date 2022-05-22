import { NextApiRequest, NextApiResponse } from "next";
import { generateShortUrl } from "../../lib/shortenUrl";

export default async(req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        res.status(405).send({ error: "Only 'POST' requests allowed" });
        return;
    }

    let longUrl: string = "";

    try {       
        const body = JSON.parse(JSON.stringify(req.body));

        longUrl = body["url"] as string;
    } catch(e) {
        res.status(400).json({ error: "Unable to parse payload" });
        return;
    }

    const data = await generateShortUrl(longUrl);

    if (data) {
        res.status(200).json({url: data.url, shortened_url: data.shortened_url});
    } else {
        res.status(500).json({error: "Something went wrong"});
    }
}