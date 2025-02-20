import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    usefulLinks: {
      type: [String],
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
  ContactSchema.set("toObject", { getters: true });
  ContactSchema.set("toJSON", { getters: true });
}

export const Contact =
  mongoose.models.Contact || mongoose.model("Contact", ContactSchema);
