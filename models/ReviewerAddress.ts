import mongoose from "mongoose";

const ReviewerAddressSchema = new mongoose.Schema(
  {
    programName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

if (process.env.NODE_ENV === "production") {
  ReviewerAddressSchema.set("toObject", { getters: true });
  ReviewerAddressSchema.set("toJSON", { getters: true });
}

export const ReviewerAddress =
  mongoose.models.Contact ||
  mongoose.model("ReviewerAddress", ReviewerAddressSchema);
