import { NextApiRequest, NextApiResponse } from "next";
import { getAllUrls } from "../../lib/urls";

export default async(req: NextApiRequest, res: NextApiResponse) => {
    const data = await getAllUrls();
    if (data) {
        res.status(200).json(JSON.parse(JSON.stringify(data)));
    } else {
        res.status(500).json({error: "Error occured"});
    }
}