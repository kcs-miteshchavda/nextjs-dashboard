import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_noStore as noStore } from "next/cache";
import axios from "axios";

export async function GET() {
    noStore();
    // const { params } = context;
    // const start = params.start;
    // const end = params.end;
    try {
        const { data } = await axios.get(`${process.env.API_ENDPOINT}/users`);

        return Response.json(data);
    } catch (error) {
        throw Error(`Failed to get users, error: ${error}`)
    }
}

export async function POST(req: Request) {
    noStore();
    const body = await req.json();

    try {
        const {data} = await axios.post(`${process.env.API_ENDPOINT}/users`, {
            ...body,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
        
        return Response.json(data);
    } catch (error) {
        throw Error(`Failed to create user, error: ${error}`)
    }
}