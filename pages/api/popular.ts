import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/connect_db";
import ShortenedUrl from "../../lib/model/shortened_url";

export default async(req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { db } = await connectToDatabase();

        const collection = db.collection<ShortenedUrl>("url");

        const mostVisitedData = await collection
            .find({}, { projection: {_id: 0} })
            .sort({visits: -1})
            .limit(10).toArray();

        const mostAttemptsData = await collection
            .find({}, { projection: {_id: 0} })
            .sort({attempts: -1})
            .limit(10).toArray();
        
        const jsonResponse = {
            mostVisited: JSON.parse(JSON.stringify(mostVisitedData)), 
            mostAttemps: JSON.parse(JSON.stringify(mostAttemptsData))
        };

        res.status(200).json(jsonResponse);
    } catch(e) {
        res.status(500).json({error: e});
    }
}