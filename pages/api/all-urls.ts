import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/connect_db";
import ShortenedUrl from "../../lib/model/shortened_url";

export default async(req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { db } = await connectToDatabase();

        const data = await db.collection<ShortenedUrl>("url").find().limit(100).toArray();
        
        res.status(200).json(JSON.parse(JSON.stringify(data)));
    } catch(e) {
        res.status(500).json({error: e});
    }
}