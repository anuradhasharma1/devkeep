import { connectDB } from "@/core/db";
import Snippet from "@/models/snippets";

// GET SINGLE SNIPPET
export async function GET(req, { params }) {
  try {
    await connectDB();

    const snippet = await Snippet.findById(params.id);

    if (!snippet) {
      return Response.json(
        { success: false, message: "Snippet not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, snippet });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// UPDATE SNIPPET
export async function PUT(req, { params }) {
  try {
    await connectDB();

    const body = await req.json();

    const updated = await Snippet.findByIdAndUpdate(
      params.id,
      {
        title: body.title,
        code: body.code,
        tags: body.tags,
        language: body.language,
        isPublic: body.isPublic,
      },
      { new: true }
    );

    if (!updated) {
      return Response.json(
        { success: false, message: "Snippet not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, snippet: updated });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE SNIPPET
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const deleted = await Snippet.findByIdAndDelete(params.id);

    if (!deleted) {
      return Response.json(
        { success: false, message: "Snippet not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}