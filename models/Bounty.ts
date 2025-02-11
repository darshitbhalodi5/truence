import mongoose from 'mongoose';

const bountySchema = new mongoose.Schema({
  networkName: {
    type: String,
    required: true,
  },
  criticalReward:{
    type: Number,
    default: 0,
  },
  highReward:{
    type: Number,
    default: 0,
  },
  mediumReward:{
    type: Number,
    default: 0,
  },
  lowReward:{
    type: Number,
    default: 0,
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