import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: false,  // ← false — Google users have no password
            default: null,
            select: false,    // ← never return password in queries by default
        },
        avatar: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
)

export default mongoose.models.User || mongoose.model("User", UserSchema);