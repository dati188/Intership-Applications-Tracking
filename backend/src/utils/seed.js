require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Application = require('../models/Application');

const seed = async () => {
  await connectDB();

  const email = 'demo@example.com';
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name: 'Demo User',
      email,
      password: 'password123',
    });
    console.log(`Created demo user: ${email} / password123`);
  } else {
    console.log(`Demo user already exists: ${email}`);
  }

  await Application.deleteMany({ user: user._id });

  const now = new Date();
  const daysAgo = (n) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000);

  const sampleApps = [
    {
      user: user._id,
      company: 'Stripe',
      role: 'Software Engineering Intern',
      location: 'San Francisco, CA',
      remote: 'Hybrid',
      status: 'Interviewing',
      appliedDate: daysAgo(30),
      source: 'Company website',
      priority: 'High',
      tags: ['backend', 'fintech'],
      salary: { amount: 55, period: 'hourly', currency: 'USD' },
      rounds: [
        { type: 'Phone Screen', date: daysAgo(20), outcome: 'Passed', notes: 'Went well, talked about REST APIs' },
        { type: 'Technical', date: daysAgo(10), outcome: 'Passed', notes: 'Two LeetCode mediums' },
        { type: 'Onsite', date: daysAgo(-3), outcome: 'Scheduled', notes: 'Virtual onsite, 4 rounds' },
      ],
      contacts: [{ name: 'Jamie Lin', role: 'Recruiter', email: 'jamie@stripe.com' }],
      documents: [{ label: 'Resume v3', type: 'Resume', url: 'https://example.com/resume.pdf' }],
      notes: 'Really excited about this one. Team works on payments infra.',
    },
    {
      user: user._id,
      company: 'Notion',
      role: 'Product Design Intern',
      location: 'Remote',
      remote: 'Remote',
      status: 'Applied',
      appliedDate: daysAgo(15),
      source: 'Referral',
      priority: 'Medium',
      tags: ['design'],
      contacts: [],
      rounds: [],
    },
    {
      user: user._id,
      company: 'Databricks',
      role: 'Data Engineering Intern',
      location: 'Seattle, WA',
      remote: 'On-site',
      status: 'Offer',
      appliedDate: daysAgo(60),
      source: 'Career fair',
      priority: 'High',
      tags: ['data', 'backend'],
      salary: { amount: 52, period: 'hourly', currency: 'USD', negotiated: true },
      rounds: [
        { type: 'Phone Screen', date: daysAgo(50), outcome: 'Passed' },
        { type: 'Technical', date: daysAgo(40), outcome: 'Passed' },
        { type: 'Final', date: daysAgo(25), outcome: 'Passed', notes: 'Offer extended next day!' },
      ],
      notes: 'Got the offer! Deciding by end of month.',
      deadline: daysAgo(-10),
    },
    {
      user: user._id,
      company: 'Robinhood',
      role: 'Backend Engineering Intern',
      location: 'Menlo Park, CA',
      remote: 'On-site',
      status: 'Rejected',
      appliedDate: daysAgo(45),
      source: 'LinkedIn',
      priority: 'Low',
      tags: ['backend', 'fintech'],
      rounds: [{ type: 'Phone Screen', date: daysAgo(35), outcome: 'Failed', notes: 'Struggled on system design question' }],
      notes: 'Rejected after phone screen. Need to study system design basics.',
    },
    {
      user: user._id,
      company: 'Figma',
      role: 'Frontend Engineering Intern',
      location: 'Remote',
      remote: 'Remote',
      status: 'Wishlist',
      priority: 'Medium',
      tags: ['frontend', 'design'],
      rounds: [],
    },
  ];

  await Application.insertMany(sampleApps);
  console.log(`Seeded ${sampleApps.length} sample applications`);

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
