import mongoose from "mongoose";


const SnippetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    language: {
      type: String,
      default: "javascript",
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// to avoids overwrite error
const Snippet =
  mongoose.models.Snippet || mongoose.model("Snippet", SnippetSchema);

export default Snippet;