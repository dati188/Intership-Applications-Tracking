const mongoose = require('mongoose');

const STATUS_VALUES = [
  'Wishlist',
  'Applied',
  'Phone Screen',
  'Interviewing',
  'Offer',
  'Rejected',
  'Withdrawn',
  'Accepted',
];

const ROUND_TYPE_VALUES = [
  'Phone Screen',
  'Technical',
  'Behavioral',
  'Take-home',
  'Onsite',
  'Final',
  'Other',
];

const ROUND_OUTCOME_VALUES = ['Scheduled', 'Pending', 'Passed', 'Failed', 'Cancelled'];

const interviewRoundSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ROUND_TYPE_VALUES,
      default: 'Other',
    },
    title: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    date: {
      type: Date,
    },
    outcome: {
      type: String,
      enum: ROUND_OUTCOME_VALUES,
      default: 'Scheduled',
    },
    interviewers: [
      {
        type: String,
        trim: true,
      },
    ],
    notes: {
      type: String,
      maxlength: 5000,
    },
  },
  { timestamps: true }
);

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    role: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      maxlength: 2000,
    },
  },
  { timestamps: true }
);

const documentSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    type: {
      type: String,
      enum: ['Resume', 'Cover Letter', 'Portfolio', 'Transcript', 'Other'],
      default: 'Other',
    },
    url: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: 150,
    },
    role: {
      type: String,
      required: [true, 'Role title is required'],
      trim: true,
      maxlength: 150,
    },
    location: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    remote: {
      type: String,
      enum: ['On-site', 'Hybrid', 'Remote', 'Unknown'],
      default: 'Unknown',
    },
    status: {
      type: String,
      enum: STATUS_VALUES,
      default: 'Wishlist',
    },
    jobPostingUrl: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    appliedDate: {
      type: Date,
    },
    deadline: {
      type: Date,
    },
    salary: {
      amount: { type: Number, min: 0 },
      period: {
        type: String,
        enum: ['hourly', 'monthly', 'yearly', 'stipend'],
        default: 'hourly',
      },
      currency: { type: String, default: 'USD', trim: true },
      negotiated: { type: Boolean, default: false },
    },
    rounds: [interviewRoundSchema],
    contacts: [contactSchema],
    documents: [documentSchema],
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    notes: {
      type: String,
      maxlength: 10000,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

applicationSchema.index({ user: 1, status: 1 });
applicationSchema.index({ user: 1, company: 1 });
applicationSchema.index({ user: 1, archived: 1 });

applicationSchema.virtual('latestRound').get(function getLatestRound() {
  if (!this.rounds || this.rounds.length === 0) return null;
  return [...this.rounds].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
});

applicationSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Application', applicationSchema);
module.exports.STATUS_VALUES = STATUS_VALUES;
module.exports.ROUND_TYPE_VALUES = ROUND_TYPE_VALUES;
module.exports.ROUND_OUTCOME_VALUES = ROUND_OUTCOME_VALUES;
