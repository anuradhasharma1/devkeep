import mongoose from "mongoose";


const SnippetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      ref: "User",
      required: false,
    },
    description: {
      type: String,
      default: "",
      maxlength: 500,
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