import mongoose, { Schema } from 'mongoose';

const submissionSchema = new Schema({
  programName: {
    type: String,
    required: true,
    index: true // Add index for program name lookups
  },
  title: {
    type: String,
    required: true,
    maxLength: 100,
    index: 'text' // Add text index for search
  },
  description: {
    type: String,
    required: true,
    maxLength: 2500, // Approximately 500 words
    index: 'text' // Add text index for search
  },
  severityLevel: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low'],
    required: true,
    index: true // Add index for filtering by severity
  },
  files: [{
    fileId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'fs.files' // Reference to GridFS files
    },
    url: String,
    originalName: String,
    type: String,
    size: Number
  }],
  walletAddress: {
    type: String,
    required: true,
    index: true // Add index for wallet lookups
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'accepted', 'rejected'],
    default: 'pending',
    index: true // Add index for status filtering
  },
  misUseRange: {
    type: String,
    default: null,
  },
  reviewedBy: {
    type: String,
    sparse: true,
    index: true // Add sparse index for reviewer lookups
  },
  reviewerSeverity: {
    type: String,
    enum: ['Critical', 'High', 'Medium', 'Low'],
    sparse: true,
    index: true // Add sparse index for reviewer severity lookups
  },
  reviewedAt: {
    type: Date,
    sparse: true,
    index: true // Add sparse index for review date queries
  }
}, {
  timestamps: true,
  autoIndex: true
});

// Compound indexes for common query patterns
submissionSchema.index({ programName: 1, status: 1 }); // For finding submissions by program and status
submissionSchema.index({ walletAddress: 1, createdAt: -1 }); // For finding user's submissions by date
submissionSchema.index({ status: 1, createdAt: -1 }); // For finding submissions by status and date

// Add text index for search functionality
submissionSchema.index({
  title: 'text',
  description: 'text'
}, {
  weights: {
    title: 2,
    description: 1
  }
});

// Static methods for common queries
submissionSchema.statics.findByProgram = function(programName: string) {
  return this.find({ programName })
    .sort({ createdAt: -1 })
    .select('-__v')
    .lean();
};

submissionSchema.statics.findByWallet = function(walletAddress: string) {
  return this.find({ walletAddress })
    .sort({ createdAt: -1 })
    .select('-__v')
    .lean();
};

submissionSchema.statics.findPendingSubmissions = function() {
  return this.find({ status: 'pending' })
    .sort({ createdAt: 1 })
    .select('-__v')
    .lean();
};

// Add caching configuration
if (process.env.NODE_ENV === 'production') {
  submissionSchema.set('toObject', { getters: true });
  submissionSchema.set('toJSON', { getters: true });
}

export default mongoose.models.Submission || mongoose.model('Submission', submissionSchema);