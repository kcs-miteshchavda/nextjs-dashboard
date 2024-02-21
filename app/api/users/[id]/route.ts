import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_noStore as noStore } from "next/cache";
import axios from "axios";

export async function GET(req: Request, context: { params: { id: string } }) {
    noStore();
    try {

        const { params } = context;
        const id = params.id;
        const { data } = await axios.get(`${process.env.API_ENDPOINT}/users?id=${id}`);

        return Response.json(data);
    } catch (error) {
        throw Error(`Failed to get data, error: ${error}`)
    }
}

export async function PUT(req: Request, context: { params: { id: string } }) {
    noStore();
    try {
        const body = await req.json();
        const { params } = context;
        const id = params.id;
        const { data } = await axios.put(`${process.env.API_ENDPOINT}/users/${id}`, {
            ...body,
            updatedAt: new Date().toISOString(),
        });

        return Response.json(data);
    } catch (error) {
        throw Error(`Failed to get data, error: ${error}`);
    }
}