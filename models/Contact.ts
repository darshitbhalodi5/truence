import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    index: true
  },
  company: {
    type: String,
    required: true,
    trim: true,
    index: true
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
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true,
  autoIndex: true
});

ContactSchema.index({ company: 1, region: 1 });
ContactSchema.index({ lastName: 1, firstName: 1 });

ContactSchema.index({
  firstName: 'text',
  lastName: 'text',
  company: 'text'
}, {
  weights: {
    firstName: 2,
    lastName: 2,
    company: 1
  }
});

ContactSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email }).select('-__v').lean();
};

ContactSchema.statics.findByCompany = function(company: string) {
  return this.find({ company })
    .sort({ lastName: 1, firstName: 1 })
    .select('-__v')
    .lean();
};

ContactSchema.statics.findByRegion = function(region: string) {
  return this.find({ region })
    .sort({ company: 1, lastName: 1 })
    .select('-__v')
    .lean();
};

if (process.env.NODE_ENV === 'production') {
  ContactSchema.set('toObject', { getters: true });
  ContactSchema.set('toJSON', { getters: true });
}

export const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema); 