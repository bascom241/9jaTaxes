import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    summary: {
      type: String,
    },

    whatChanged: {
      type: String,
    },

    whoItAffects: {
      type: String,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isApproved: {
      type: Boolean,
      default: false, // admin approves if needed
    },

    tags: [String],

  },
  { timestamps: true } // gives createdAt (for date)
);

export default mongoose.model("News", newsSchema);