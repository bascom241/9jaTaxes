import mongoose from "mongoose";
import validator from "validator"
const wailistSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full Name is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        return validator.isEmail(value); 
      },
      message: "Please enter a valid email address",
    },
  },
  interest: {
    type: String,
  },
}  ,{ timestamps: true });

export default mongoose.model("Wailist", wailistSchema);
