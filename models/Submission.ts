import mongoose, { Schema } from 'mongoose';

const submissionSchema = new Schema({
  programName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    maxLength: 100,
  },
  description: {
    type: String,
    required: true,
    maxLength: 2500, // Approximately 500 words
  },
  severityLevel: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low'],
    required: true,
  },
  files: [{
    type: String,
    required: false,
  }],
  walletAddress: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Submission || mongoose.model('Submission', submissionSchema);