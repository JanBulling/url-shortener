import { NextApiRequest, NextApiResponse } from "next";
import { getLongUrl } from "../../lib/urls";

export default async(req: NextApiRequest, res: NextApiResponse) => {
    const queryParam = req.query.short as string;

    if (!queryParam) {
        res.status(400).json({error: `No short-url given`});
        return;
    }

    const data = await getLongUrl(queryParam);

    if (data) {
        res.status(200).json({url: data.url, shortened_url: data.shortened_url});
    } else {
        res.status(400).json({error: `The short-url '${queryParam}' does not exist!`});
    }
}