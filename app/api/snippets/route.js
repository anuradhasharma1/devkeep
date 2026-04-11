import { connectDB } from "@/core/db";
import Snippet from "@/models/snippets";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";


// CREATE SNIPPET
export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session.user?.id) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const body = await req.json();

        if (!body.title || !body.code || !body.language) {
            return Response.json({ error: "Title, code and language are required" }, { status: 400 });
        }

        const snippet = await Snippet.create({
            title: body.title,
            description: body.description || "",
            code: body.code,
            tags: body.tags || [],
            language: body.language,
            isPublic: body.isPublic ?? false,
            author: session.user.id,
        });

        return Response.json({ snippet }, { status: 201 });
    } catch (error) {
        console.error("[POST /api/snippets]", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}

// GET /api/snippets — get all snippets for logged-in user
export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search") || "";
        const language = searchParams.get("language") || "";
        const tag = searchParams.get("tag") || "";

        // Only fetch THIS user's snippets
        let query = { author: session.user.id };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { tags: { $regex: search, $options: "i" } },
            ];
        }

        if (language) query.language = language;
        if (tag) query.tags = { $in: [tag] };

        const snippets = await Snippet.find(query).sort({ createdAt: -1 });

        return Response.json({ snippets });
    } catch (error) {
        console.error("[GET /api/snippets]", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
