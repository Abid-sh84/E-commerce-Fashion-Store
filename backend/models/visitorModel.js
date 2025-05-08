import mongoose from 'mongoose';

const visitorSchema = mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    count: {
      type: Number,
      required: true,
      default: 1,
    },
    uniqueCount: {
      type: Number,
      required: true,
      default: 0,
    },
    // Store unique visitor IDs to avoid counting the same visitor multiple times
    uniqueVisitors: {
      type: Map,
      of: Date,
      default: {},
    },
    // Track page views
    pageViews: {
      type: Number,
      default: 0,
    },
    // Track different pages
    pages: {
      type: Map,
      of: Number,
      default: {},
    },
    // Store device information
    devices: {
      desktop: { type: Number, default: 0 },
      mobile: { type: Number, default: 0 },
      tablet: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
    },
    // Store browser information
    browsers: {
      chrome: { type: Number, default: 0 },
      firefox: { type: Number, default: 0 },
      safari: { type: Number, default: 0 },
      edge: { type: Number, default: 0 },
      ie: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
    },
    // Store referrer information
    referrers: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Visitor = mongoose.model('Visitor', visitorSchema);

export default Visitor;