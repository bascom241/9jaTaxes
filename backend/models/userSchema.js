import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is Required"],
        unique: true,

    },
    password: {
        type: String,
        required: [true, "Password is Required"],
    
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    verificationToken: String,
    verificationTokenExpiresDate: Date
});

export default mongoose.model("User", userSchema);
