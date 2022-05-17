import { Db, MongoClient } from "mongodb";

interface MongoDb {
    db: Db,
    client: MongoClient,
}

const uri: string | undefined = process.env.MONGODB_URL;
const databaseName = "url-shortener";

let mongodb: MongoDb | null = null;

export async function connectToDatabase(): Promise<MongoDb> {
    if (mongodb) {
        return mongodb;
    }

    if (!uri) {
        throw new Error('Unable to connect to database');
    }

    let client = new MongoClient(uri);
    await client.connect();

    let db = client.db(databaseName);

    mongodb = {
        client: client,
        db: db,
    };

    return mongodb;
}