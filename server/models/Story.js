import mongoose from "mongoose";

const StorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ["image", "video"], required: true },
    // This field will be indexed to automatically delete the document after 24 hours
    expireAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // Default to 24 hours from now
    },
  },
  { timestamps: true },
);

// Create a TTL index on the 'expireAt' field
StorySchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const Story = mongoose.model("Story", StorySchema);
export default Story;
