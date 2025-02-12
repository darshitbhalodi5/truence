import mongoose from 'mongoose';

const severityDescriptionSchema = new mongoose.Schema({
  severity: {
    type: String,
    enum: ['Critical', 'High', 'Medium', 'Low'],
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, { _id: false });

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
  severityDescriptions: {
    type: [severityDescriptionSchema],
    default: undefined  // This ensures the field appears in the document only if set
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

bountySchema.pre('save', function(next) {
  if (this.severityDescriptions && !Array.isArray(this.severityDescriptions)) {
    next(new Error('severityDescriptions must be an array'));
  }
  next();
});

export default mongoose.models.Bounty || mongoose.model('Bounty', bountySchema); 