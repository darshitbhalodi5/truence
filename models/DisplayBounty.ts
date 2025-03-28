import mongoose from "mongoose";

const displayBountySchema = new mongoose.Schema(
  {
    networkName: {
      type: String,
      required: true,
      index: true,
    },
    logoUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    maxRewards: {
      type: Number,
      required: true,
      index: true,
    },
    totalPaid: {
      type: Number,
      default: 0,
      index: true,
    },
    startDate: {
      type: Date,
      default: null,
    },
    reviewerAddresses: [
      {
        type: String,
      },
    ],
    managerAddress: {
      type: String,
    },
    additionalPaymentRequired: {
      type: Boolean,
      default: false,
    },
    endDate: {
      type: Date,
      default: null,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field for status
displayBountySchema.virtual("status").get(function () {
  const now = new Date();

  if (!this.startDate) {
    return "LIVE_SOON";
  }

  if (this.endDate && now > this.endDate) {
    return "CLOSED";
  }

  if (now > this.startDate) {
    return "IN_PROCESS";
  }

  return "UPCOMING";
});

displayBountySchema.set("toJSON", { virtuals: true });
displayBountySchema.set("toObject", { virtuals: true });

const DisplayBounty =
  mongoose.models.DisplayBounty ||
  mongoose.model("DisplayBounty", displayBountySchema);
export default DisplayBounty;
