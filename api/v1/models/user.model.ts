import mongoose from "mongoose";
const userSchema = new mongoose.Schema({

    fullName: String,
    email: String,
    password: String,
    status: {
        type: String,
        default: "active"
    },
    token: String,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,

}, { timestamps: true });

const User = mongoose.model("User", userSchema, "user");

export default User;