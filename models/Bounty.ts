import mongoose from "mongoose";

const severityDescriptionSchema = new mongoose.Schema(
  {
    severity: {
      type: String,
      enum: ["Critical", "High", "Medium", "Low"],
      required: true,
    },
    description: {
      type: [String],
      required: true,
      validate: {
        validator: function (v: string[]) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "At least one description is required",
      },
    },
  },
  { _id: false }
);

const bountySchema = new mongoose.Schema(
  {
    networkName: {
      type: String,
      required: true,
      index: true,
    },
    finalSeverity: {
      type: Boolean,
      default: false,
      required: true,
    },
    initialSeverities: {
      type: [
        {
          type: String,
          enum: ["Critical", "High", "Medium", "Low"],
        },
      ],
      validate: {
        validator: function (this: any, v: string[]) {
          return !this.finalSeverity || (v && v.length > 0);
        },
        message: "Initial severities are required when finalSeverity is true",
      },
    },
    criticalReward: {
      type: Number,
      default: 0,
      index: true,
    },
    highReward: {
      type: Number,
      default: 0,
      index: true,
    },
    mediumReward: {
      type: Number,
      default: 0,
      index: true,
    },
    lowReward: {
      type: Number,
      default: 0,
      index: true,
    },
    severityDescriptions: {
      type: [severityDescriptionSchema],
      default: undefined,
      validate: {
        validator: function (descriptions: any[]) {
          if (!descriptions) return true;
          // Check for duplicate severities
          const severities = descriptions.map((desc) => desc.severity);
          return severities.length === new Set(severities).size;
        },
        message: "Duplicate severity levels are not allowed",
      },
    },
    additionalDetails: {
      scope: String,
      eligibility: String,
      rules: String,
      rewards: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "completed"],
      default: "active",
      index: true,
    },
    startDate: {
      type: Date,
      index: true,
    },
    endDate: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
    autoIndex: true,
  }
);

bountySchema.index({ status: 1, startDate: -1 });
bountySchema.index({ networkName: 1, status: 1 });
bountySchema.index({ criticalReward: -1, highReward: -1 });

bountySchema.index({
  networkName: "text",
  "additionalDetails.scope": "text",
  "additionalDetails.eligibility": "text",
});

bountySchema.pre("save", function (next) {
  if (this.severityDescriptions && !Array.isArray(this.severityDescriptions)) {
    next(new Error("severityDescriptions must be an array"));
  }
  next();
});

bountySchema.statics.findActiveBounties = function () {
  return this.find({
    status: "active",
    startDate: { $lte: new Date() },
    $or: [{ endDate: { $gt: new Date() } }, { endDate: null }],
  }).sort({ startDate: -1 });
};

bountySchema.statics.findByNetwork = function (networkName: string) {
  return this.findOne({
    networkName,
    status: "active",
  }).select("-__v");
};

const cacheOptions = {
  expires: 60 * 5,
  background: true,
};

if (process.env.NODE_ENV === "production") {
  bountySchema.set("toObject", { getters: true });
  bountySchema.set("toJSON", { getters: true });
}

export default mongoose.models.Bounty || mongoose.model("Bounty", bountySchema);
