import { connectDB } from "@/core/db";
import Snippet from "@/models/snippets";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// GET SINGLE SNIPPET
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const snippet = await Snippet.findById(id);

    if (!snippet) {
      return Response.json({ error: "Snippet not found" }, { status: 404 });
    }
    // Allow if public OR if owner
    const session = await getServerSession(authOptions);
    const isOwner = session?.user?.id && snippet.author?.toString() === session.user.id;

    if (!snippet.isPublic && !isOwner) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    return Response.json({ snippet });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/snippets/:id
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;   // ← await params

    // Check ownership first
    const existing = await Snippet.findById(id);
    if (!existing) {
      return Response.json({ error: "Snippet not found" }, { status: 404 });
    }
    if (existing.author?.toString() !== session.user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    const updated = await Snippet.findByIdAndUpdate(
      id,
      {
        title: body.title ?? existing.title,
        description: body.description ?? existing.description,
        code: body.code ?? existing.code,
        tags: body.tags ?? existing.tags,
        language: body.language ?? existing.language,
        isPublic: body.isPublic ?? existing.isPublic,
      },
      { new: true }
    );

    return Response.json({ snippet: updated });
  } catch (error) {
    console.error("[PUT /api/snippets/:id]", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/snippets/:id
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;   // ← await params

    const existing = await Snippet.findById(id);
    if (!existing) {
      return Response.json({ error: "Snippet not found" }, { status: 404 });
    }
    if (existing.author?.toString() !== session.user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    await existing.deleteOne();

    return Response.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("[DELETE /api/snippets/:id]", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
