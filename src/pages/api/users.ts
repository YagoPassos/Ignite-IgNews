import { request } from "http";
import { NextApiRequest, NextApiResponse } from "next";

export default (request: NextApiRequest, response: NextApiResponse ) => {
    const users = [
        {id: 1, name: "John"},
        {id: 2, name: "Diego"},
        {id: 3, name: "Breno"},
    ]

    return response.json(users)
}