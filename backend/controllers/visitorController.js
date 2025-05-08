import asyncHandler from 'express-async-handler';
import Visitor from '../models/visitorModel.js';

// @desc    Record a new visitor or update existing data
// @route   POST /api/visitors
// @access  Public
const recordVisit = asyncHandler(async (req, res) => {
  const { page, device, browser, referrer, uniqueVisitor, visitorId } = req.body;
  
  // Get today's date with time set to 00:00:00
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Find or create visitor record for today
  let visitorRecord = await Visitor.findOne({ 
    date: { 
      $gte: today, 
      $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) 
    } 
  });
  
  if (!visitorRecord) {
    visitorRecord = new Visitor({
      date: today,
      count: 0,
      uniqueCount: 0,
      pageViews: 0,
      uniqueVisitors: new Map()
    });
  }
  
  // Update visitor count
  visitorRecord.count += 1;
  
  // Track unique visitors by their fingerprint ID
  if (visitorId) {
    // If this visitor ID hasn't been seen today, count as unique
    if (!visitorRecord.uniqueVisitors.has(visitorId) && uniqueVisitor) {
      visitorRecord.uniqueCount += 1;
      visitorRecord.uniqueVisitors.set(visitorId, Date.now());
    }
  } else if (uniqueVisitor) {
    // Fallback if no visitor ID provided but marked as unique
    visitorRecord.uniqueCount += 1;
  }
  
  // Update page views
  visitorRecord.pageViews += 1;
  
  // Update page stats
  if (page) {
    const currentPageCount = visitorRecord.pages.get(page) || 0;
    visitorRecord.pages.set(page, currentPageCount + 1);
  }
  
  // Update device stats
  if (device) {
    // Convert device type to lowercase for consistency
    const deviceType = device.toLowerCase();
    
    if (deviceType === 'desktop') {
      visitorRecord.devices.desktop += 1;
    } else if (deviceType === 'mobile') {
      visitorRecord.devices.mobile += 1;
    } else if (deviceType === 'tablet') {
      visitorRecord.devices.tablet += 1;
    } else {
      visitorRecord.devices.other += 1;
    }
  }
  
  // Update browser stats
  if (browser) {
    // Convert browser name to lowercase for consistency
    const browserName = browser.toLowerCase();
    
    if (browserName.includes('chrome')) {
      visitorRecord.browsers.chrome += 1;
    } else if (browserName.includes('firefox')) {
      visitorRecord.browsers.firefox += 1;
    } else if (browserName.includes('safari')) {
      visitorRecord.browsers.safari += 1;
    } else if (browserName.includes('edge')) {
      visitorRecord.browsers.edge += 1;
    } else if (browserName.includes('ie') || browserName.includes('internet explorer')) {
      visitorRecord.browsers.ie += 1;
    } else {
      visitorRecord.browsers.other += 1;
    }
  }
  
  // Update referrer stats
  if (referrer) {
    const currentReferrerCount = visitorRecord.referrers.get(referrer) || 0;
    visitorRecord.referrers.set(referrer, currentReferrerCount + 1);
  }
  
  await visitorRecord.save();
  
  res.status(200).json({ success: true });
});

// @desc    Get visitor analytics data for a specific period
// @route   GET /api/visitors
// @access  Private/Admin
const getVisitorAnalytics = asyncHandler(async (req, res) => {
  const { period = 'week' } = req.query;
  
  let startDate;
  const endDate = new Date();
  
  // Calculate start date based on period
  if (period === 'day') {
    startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
  } else if (period === 'week') {
    startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);
  } else if (period === 'month') {
    startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 1);
    startDate.setHours(0, 0, 0, 0);
  } else if (period === 'year') {
    startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);
    startDate.setHours(0, 0, 0, 0);
  } else {
    startDate = new Date(0); // All time data
  }
  
  // Get visitor data for the specified period
  const visitorData = await Visitor.find({ 
    date: { $gte: startDate, $lte: endDate } 
  }).sort({ date: 1 });
  
  // Calculate totals
  const totalVisits = visitorData.reduce((sum, record) => sum + record.count, 0);
  const totalUniqueVisits = visitorData.reduce((sum, record) => sum + record.uniqueCount, 0);
  const totalPageViews = visitorData.reduce((sum, record) => sum + record.pageViews, 0);
  
  // Calculate device statistics
  const devices = {
    desktop: visitorData.reduce((sum, record) => sum + record.devices.desktop, 0),
    mobile: visitorData.reduce((sum, record) => sum + record.devices.mobile, 0),
    tablet: visitorData.reduce((sum, record) => sum + record.devices.tablet, 0),
    other: visitorData.reduce((sum, record) => sum + record.devices.other, 0),
  };
  
  // Calculate browser statistics
  const browsers = {
    chrome: visitorData.reduce((sum, record) => sum + record.browsers.chrome, 0),
    firefox: visitorData.reduce((sum, record) => sum + record.browsers.firefox, 0),
    safari: visitorData.reduce((sum, record) => sum + record.browsers.safari, 0),
    edge: visitorData.reduce((sum, record) => sum + record.browsers.edge, 0),
    ie: visitorData.reduce((sum, record) => sum + record.browsers.ie, 0),
    other: visitorData.reduce((sum, record) => sum + record.browsers.other, 0),
  };
  
  // Calculate top pages
  const pagesMap = new Map();
  visitorData.forEach(record => {
    record.pages.forEach((count, page) => {
      const currentCount = pagesMap.get(page) || 0;
      pagesMap.set(page, currentCount + count);
    });
  });
  
  // Convert to array and sort by count
  const topPages = Array.from(pagesMap, ([page, count]) => ({ page, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 pages
  
  // Calculate top referrers
  const referrersMap = new Map();
  visitorData.forEach(record => {
    record.referrers.forEach((count, referrer) => {
      const currentCount = referrersMap.get(referrer) || 0;
      referrersMap.set(referrer, currentCount + count);
    });
  });
  
  // Convert to array and sort by count
  const topReferrers = Array.from(referrersMap, ([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 referrers
  
  // Create daily visitors data for charts
  const dailyData = [];
  
  // Generate dates array for the period
  const dateArray = [];
  const tempDate = new Date(startDate);
  
  while (tempDate <= endDate) {
    dateArray.push(new Date(tempDate));
    tempDate.setDate(tempDate.getDate() + 1);
  }
  
  // Map visitor data to dates
  dateArray.forEach(date => {
    const dateString = date.toISOString().split('T')[0];
    const record = visitorData.find(
      r => r.date.toISOString().split('T')[0] === dateString
    );
    
    dailyData.push({
      date: dateString,
      visits: record ? record.count : 0,
      uniqueVisits: record ? record.uniqueCount : 0,
      pageViews: record ? record.pageViews : 0,
    });
  });
  
  res.json({
    totalVisits,
    totalUniqueVisits,
    totalPageViews,
    dailyData,
    devices,
    browsers,
    topPages,
    topReferrers,
  });
});

export { recordVisit, getVisitorAnalytics };