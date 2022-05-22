import { NextApiRequest, NextApiResponse } from "next";
import { getPopular } from "../../lib/urls";

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