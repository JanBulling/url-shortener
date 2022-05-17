import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/connect_db";
import ShortenedUrl from "../../lib/model/shortened_url";

export default async(req: NextApiRequest, res: NextApiResponse) => {
    try {
        // the short url is passed as an query parameter to this endpoint
        const queryParam = req.query.short as string;

        if (!queryParam) {
            res.status(400).json({error: `No short-url given`});
            return;
        }

        const { db } = await connectToDatabase();

        const data = await db.collection<ShortenedUrl>("url").findOneAndUpdate(
            { shortened_url: queryParam },
            { $inc: { visited: 1 } },
            {
                projection: {_id: 0, visited: 0, attempts: 0},
            }
        );

        if (!data || !data.value) {
            res.status(400).json({error: `The short-url '${queryParam}' does not exist!`});
            return;
        }
        
        res.status(200).json(JSON.parse(JSON.stringify(data.value)));
    } catch(e) {
        res.status(500).json({error: e});
    }
}