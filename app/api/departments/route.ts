import { unstable_noStore as noStore } from "next/cache";
import axios from "axios";

export async function GET() {
    noStore();
    try {
        const { data } = await axios.get(`${process.env.API_ENDPOINT}/departments`);

        return Response.json(data);
    } catch (error) {
        throw Error(`Failed to get departments, error: ${error}`)
    }
}

export async function POST(req: Request) {
    noStore();
    const body = await req.json();

    try {
        const {data} = await axios.post(`${process.env.API_ENDPOINT}/departments`, {
            ...body,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
        
        return Response.json(data);
    } catch (error) {
        throw Error(`Failed to create departments, error: ${error}`)
    }
}