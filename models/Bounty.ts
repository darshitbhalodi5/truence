import mongoose from 'mongoose';

const bountySchema = new mongoose.Schema({
  networkName: {
    type: String,
    required: true,
  },
  maxRewards: {
    type: Number,
    required: true,
  },
  totalPaid: {
    type: Number,
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  additionalDetails: {
    scope: String,
    eligibility: String,
    rules: String,
    rewards: String,
  }
}, {
  timestamps: true,
});

export default mongoose.models.Bounty || mongoose.model('Bounty', bountySchema); 