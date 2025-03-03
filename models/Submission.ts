import mongoose, { Schema } from "mongoose";

interface Vote {
  address: string;
  vote: string;
  severity: string;
  votedAt: Date;
  comment: string;
}

const submissionSchema = new Schema(
  {
    programName: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      maxLength: 100,
      index: "text",
    },
    description: {
      type: String,
      required: true,
      maxLength: 2500,
      index: "text",
    },
    severityLevel: {
      type: String,
      enum: ["critical", "high", "medium", "low"],
      required: true,
      index: true,
    },
    files: [
      {
        fileId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "fs.files",
        },
        url: String,
        originalName: String,
        type: String,
        size: Number,
      },
    ],
    walletAddress: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewing", "accepted", "rejected"],
      default: "pending",
      index: true,
    },
    misUseRange: {
      type: String,
      default: null,
    },
    // New fields for tracking votes
    reviewVotes: [
      {
        reviewerAddress: {
          type: String,
          required: true,
        },
        vote: {
          type: String,
          enum: ["accepted", "rejected"],
          required: true,
        },
        severity: {
          type: String,
          enum: ["Critical", "High", "Medium", "Low"],
        },
        votedAt: {
          type: Date,
          default: Date.now,
        },
        comment: String,
      },
    ],
    managerVote: {
      vote: {
        type: String,
        enum: ["accepted", "rejected"],
      },
      severity: {
        type: String,
        enum: ["Critical", "High", "Medium", "Low"],
      },
      votedAt: Date,
      comment: String,
    },
    votingStatus: {
      type: String,
      enum: ["pending", "in_review", "quorum_reached", "finalized"],
      default: "pending",
    },
    reviewedBy: {
      type: String,
      sparse: true,
      index: true,
    },
    reviewerSeverity: {
      type: String,
      enum: ["Critical", "High", "Medium", "Low"],
      sparse: true,
      index: true,
    },
    reviewedAt: {
      type: Date,
      sparse: true,
      index: true,
    },
  },
  {
    timestamps: true,
    autoIndex: true,
  }
);

// Compound indexes for common query patterns
submissionSchema.index({ programName: 1, status: 1 }); // For finding submissions by program and status
submissionSchema.index({ walletAddress: 1, createdAt: -1 }); // For finding user's submissions by date
submissionSchema.index({ status: 1, createdAt: -1 }); // For finding submissions by status and date

// Add text index for search functionality
submissionSchema.index(
  {
    title: "text",
    description: "text",
  },
  {
    weights: {
      title: 2,
      description: 1,
    },
  }
);

submissionSchema.methods.hasReachedQuorum = async function () {
  const Bounty = mongoose.model("Bounty");
  const bounty = await Bounty.findOne({ networkName: this.programName });

  if (
    !bounty ||
    !bounty.reviewerAddresses ||
    bounty.reviewerAddresses.length === 0
  ) {
    return false;
  }

  const totalReviewers = bounty.reviewerAddresses.length;
  const requiredVotes = Math.floor(totalReviewers / 2) + 1;

  return this.reviewVotes.length >= requiredVotes;
};

// Add method to get vote summary
submissionSchema.methods.getVoteSummary = function () {
  const acceptedVotes = this.reviewVotes.filter(
    (vote: Vote) => vote.vote === "accepted"
  ).length;
  const rejectedVotes = this.reviewVotes.filter(
    (vote: Vote) => vote.vote === "rejected"
  ).length;
  const totalVotes = this.reviewVotes.length;

  // Calculate most common severity if there are accepted votes
  let recommendedSeverity = null;
  if (acceptedVotes > 0) {
    const severityCounts: Record<string, number> = {};
    this.reviewVotes
      .filter((vote: Vote) => vote.vote === "accepted" && vote.severity)
      .forEach((vote: Vote) => {
        severityCounts[vote.severity] =
          (severityCounts[vote.severity] || 0) + 1;
      });

    let maxCount = 0;
    for (const [severity, count] of Object.entries(severityCounts)) {
      const countNumber = count as number;
      if (countNumber > maxCount) {
        maxCount = countNumber;
        recommendedSeverity = severity;
      }
    }
  }

  return {
    acceptedVotes,
    rejectedVotes,
    totalVotes,
    recommendedSeverity,
    result:
      acceptedVotes > rejectedVotes
        ? "accepted"
        : rejectedVotes > acceptedVotes
        ? "rejected"
        : "tie",
  };
};

// Static methods for common queries
submissionSchema.statics.findByProgram = function (programName: string) {
  return this.find({ programName })
    .sort({ createdAt: -1 })
    .select("-__v")
    .lean();
};

submissionSchema.statics.findByWallet = function (walletAddress: string) {
  return this.find({ walletAddress })
    .sort({ createdAt: -1 })
    .select("-__v")
    .lean();
};

submissionSchema.statics.findPendingSubmissions = function () {
  return this.find({ status: "pending" })
    .sort({ createdAt: 1 })
    .select("-__v")
    .lean();
};

// Add caching configuration
if (process.env.NODE_ENV === "production") {
  submissionSchema.set("toObject", { getters: true });
  submissionSchema.set("toJSON", { getters: true });
}

export default mongoose.models.Submission ||
  mongoose.model("Submission", submissionSchema);
