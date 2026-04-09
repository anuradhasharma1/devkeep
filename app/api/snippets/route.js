import { connectDB } from "@/core/db";
import Snippet from "@/models/snippets";

// CREATE SNIPPET
export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();

        const snippet = await Snippet.create({
            title: body.title,
            code: body.code,
            tags: body.tags || [],
            language: body.language || "javascript",
            isPublic: body.isPublic ?? true,
        });

        return Response.json(
            { success: true, snippet },
            { status: 201 }
        );
    } catch (error) {
        return Response.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// GET ALL SNIPPETS +search
export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search");

        let query = {};

        if (search) {
            query = {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { tags: { $regex: search, $options: "i" } },
                ],
            };
        }

        const snippets = await Snippet.find(query).sort({ createdAt: -1 });

        return Response.json({
            success: true,
            snippets,
        });
    } catch (error) {
        return Response.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}