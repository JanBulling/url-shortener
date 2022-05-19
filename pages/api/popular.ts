import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/connect_db";
import ShortenedUrl from "../../lib/model/shortened_url";

interface PopularUrls {
    mostVisited: ShortenedUrl[],
    mostAttemps: ShortenedUrl[],
}

export const getPopular = async(): Promise<PopularUrls | null> => {
    try {
        const { db } = await connectToDatabase();

        const collection = db.collection<ShortenedUrl>("url");

        const mostVisitedData = await collection
            .find({}, { projection: {_id: 0} })
            .sort({visits: -1})
            .limit(6).toArray();

        const mostAttemptsData = await collection
            .find({}, { projection: {_id: 0} })
            .sort({attempts: -1})
            .limit(6).toArray();
        
        const parsedMostVisited = mostVisitedData.map((data) => <ShortenedUrl>{
           url: data.url,  
           shortened_url: data.shortened_url, 
           attempts: data.attempts, 
           visits: data.visits
        });

        const paresdAttemps = mostAttemptsData.map((data) => <ShortenedUrl>{
            url: data.url,  
            shortened_url: data.shortened_url, 
            attempts: data.attempts, 
            visits: data.visits
        });

        return <PopularUrls>{
            mostVisited: parsedMostVisited,
            mostAttemps: paresdAttemps
        }
    } catch(err) {
        return null;
    }
}

export default async(req: NextApiRequest, res: NextApiResponse) => {
    const data = await getPopular();

    if (data) {
        const jsonResponse = {
            mostVisited: JSON.parse(JSON.stringify(data.mostVisited)), 
            mostAttemps: JSON.parse(JSON.stringify(data.mostAttemps))
        };
        res.status(200).json(jsonResponse);
    } else {
        res.status(500).json({error: "Something went wrong"});
    }
}