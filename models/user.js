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
            required: true,
            default: null,  //null for google users
        },
        avatar: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
)

export default mongoose.models.User || mongoose.model("User", UserSchema);