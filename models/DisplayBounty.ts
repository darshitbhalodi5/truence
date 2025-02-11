import mongoose from 'mongoose';

const displayBountySchema = new mongoose.Schema({
  networkName: {
    type: String,
    required: true,
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
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

// Virtual field for status
displayBountySchema.virtual('status').get(function() {
  const now = new Date();
  
  if (!this.startDate) {
    return 'LIVE_SOON';
  }
  
  if (this.endDate && now > this.endDate) {
    return 'CLOSED';
  }
  
  if (now > this.startDate) {
    return 'IN_PROCESS';
  }
  
  return 'UPCOMING';
});

displayBountySchema.set('toJSON', { virtuals: true });
displayBountySchema.set('toObject', { virtuals: true });

const DisplayBounty = mongoose.models.DisplayBounty || mongoose.model('DisplayBounty', displayBountySchema);
export default DisplayBounty; 