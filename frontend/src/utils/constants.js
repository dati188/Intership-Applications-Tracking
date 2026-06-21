export const STATUS_VALUES = [
  'Wishlist',
  'Applied',
  'Phone Screen',
  'Interviewing',
  'Offer',
  'Rejected',
  'Withdrawn',
  'Accepted',
];

export const PIPELINE_STATUSES = [
  'Wishlist',
  'Applied',
  'Phone Screen',
  'Interviewing',
  'Offer',
  'Accepted',
];

export const ROUND_TYPE_VALUES = [
  'Phone Screen',
  'Technical',
  'Behavioral',
  'Take-home',
  'Onsite',
  'Final',
  'Other',
];

export const ROUND_OUTCOME_VALUES = ['Scheduled', 'Pending', 'Passed', 'Failed', 'Cancelled'];

export const DOCUMENT_TYPES = ['Resume', 'Cover Letter', 'Portfolio', 'Transcript', 'Other'];

// Maps each status to Tailwind classes for the "stamped ticket" status-stub styling
export const STATUS_STYLES = {
  Wishlist: 'bg-slate-light text-ink',
  Applied: 'bg-amber-light text-amber-dark',
  'Phone Screen': 'bg-amber-light text-amber-dark',
  Interviewing: 'bg-amber text-ink',
  Offer: 'bg-teal-light text-teal-dark',
  Accepted: 'bg-teal text-ink',
  Rejected: 'bg-coral-light text-coral-dark',
  Withdrawn: 'bg-slate-light text-slate-dark',
};

export const ROUND_OUTCOME_STYLES = {
  Scheduled: 'bg-amber-light text-amber-dark',
  Pending: 'bg-slate-light text-slate-dark',
  Passed: 'bg-teal-light text-teal-dark',
  Failed: 'bg-coral-light text-coral-dark',
  Cancelled: 'bg-slate-light text-slate-dark',
};

export const PRIORITY_STYLES = {
  Low: 'text-slate',
  Medium: 'text-amber-dark',
  High: 'text-coral-dark',
};
