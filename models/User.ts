import mongoose, { Schema } from 'mongoose';

interface ISubmission {
  bountyId: mongoose.Types.ObjectId;
  networkName: string;
  title: string;
  submissionDate: Date;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
}

interface IReviewerTeamItem {
  bountyId: mongoose.Types.ObjectId;
  networkName: string;
  assignedDate: Date;
}

interface IManagerTeamItem {
  bountyId: mongoose.Types.ObjectId;
  networkName: string;
  assignedDate: Date;
}

const userSchema = new Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  submissions: [{
    bountyId: {
      type: Schema.Types.ObjectId,
      ref: 'DisplayBounty',
      required: true
    },
    networkName: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    submissionDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'accepted', 'rejected'],
      default: 'pending'
    }
  }],
  reviewerTeam: [{
    bountyId: {
      type: Schema.Types.ObjectId,
      ref: 'DisplayBounty',
      required: true
    },
    networkName: {
      type: String,
      required: true
    },
    assignedDate: {
      type: Date,
      default: Date.now
    }
  }],
  managerTeam: [{
    bountyId: {
      type: Schema.Types.ObjectId,
      ref: 'DisplayBounty',
      required: true
    },
    networkName: {
      type: String,
      required: true
    },
    assignedDate: {
      type: Date,
      default: Date.now
    }
  }],
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  autoIndex: true
});

// Indexes for better query performance
userSchema.index({ 'submissions.networkName': 1 });
userSchema.index({ 'submissions.status': 1 });
userSchema.index({ 'reviewerTeam.networkName': 1 });
userSchema.index({ 'managerTeam.networkName': 1 });
userSchema.index({ 'submissions.submissionDate': -1 });

// Static methods for common queries
userSchema.statics.findByWallet = function(walletAddress: string) {
  return this.findOne({ walletAddress: walletAddress.toLowerCase() })
    .select('-__v')
    .lean();
};

userSchema.statics.findUserSubmissions = function(walletAddress: string) {
  return this.findOne({ walletAddress: walletAddress.toLowerCase() })
    .select('submissions')
    .lean();
};

userSchema.statics.findUserReviewerBounties = function(walletAddress: string) {
  return this.findOne({ walletAddress: walletAddress.toLowerCase() })
    .select('reviewerTeam')
    .lean();
};

userSchema.statics.findUserManagerBounties = function(walletAddress: string) {
  return this.findOne({ walletAddress: walletAddress.toLowerCase() })
    .select('managerTeam')
    .lean();
};

// Method to add a new submission
userSchema.methods.addSubmission = async function(submission: ISubmission) {
  this.submissions.push(submission);
  return this.save();
};

// Method to update user's reviewer team
userSchema.methods.updateReviewerTeam = async function(bountyId: string, networkName: string) {
  const exists = this.reviewerTeam.some((item: IReviewerTeamItem) => item.bountyId.toString() === bountyId);
  if (!exists) {
    this.reviewerTeam.push({ bountyId, networkName });
    return this.save();
  }
  return this;
};

// Method to update user's manager team
userSchema.methods.updateManagerTeam = async function(bountyId: string, networkName: string) {
  const exists = this.managerTeam.some((item: IManagerTeamItem) => item.bountyId.toString() === bountyId);
  if (!exists) {
    this.managerTeam.push({ bountyId, networkName });
    return this.save();
  }
  return this;
};

// Add caching configuration for production
if (process.env.NODE_ENV === 'production') {
  userSchema.set('toObject', { getters: true });
  userSchema.set('toJSON', { getters: true });
}

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User; 