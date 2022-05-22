import { connectToDatabase } from "./connect_db";
import { ShortenedUrl } from "./types";

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

export const getPopular = async(): Promise<{mostVisited: ShortenedUrl[], mostAttemps: ShortenedUrl[]} | null> => {
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

        return {
            mostVisited: parsedMostVisited,
            mostAttemps: paresdAttemps
        }
    } catch(err) {
        return null;
    }
}