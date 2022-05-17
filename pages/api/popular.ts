import { NextApiRequest, NextApiResponse } from "next";

export default async(req: NextApiRequest, res: NextApiResponse) => {
    try {
        
        res.status(200).json({hello: "Hello"});
    } catch(e) {
        res.status(500).json({error: e});
    }
}