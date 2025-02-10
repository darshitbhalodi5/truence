import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  region: {
    type: String,
    required: true,
    enum: [
      'North America',
      'South America',
      'Europe',
      'Asia',
      'Africa',
      'Australia',
      'Antarctica'
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema); 