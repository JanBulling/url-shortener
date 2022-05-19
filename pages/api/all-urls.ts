import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/connect_db";
import ShortenedUrl from "../../lib/model/shortened_url";

export const getAllUrls = async (): Promise<ShortenedUrl[] | null> => {
    try {
        const { db } = await connectToDatabase();

        const data = await db.collection<ShortenedUrl>("url").find().limit(100).toArray();

        const paresdData = data.map((data) => <ShortenedUrl>{
            url: data.url,  
            shortened_url: data.shortened_url, 
            attempts: data.attempts, 
            visits: data.visits
        });

        return paresdData;
    } catch(err) {
        return null;
    }
}

export default async(req: NextApiRequest, res: NextApiResponse) => {
    const data = await getAllUrls();
    if (data) {
        res.status(200).json(JSON.parse(JSON.stringify(data)));
    } else {
        res.status(500).json({error: "Error occured"});
    }
}