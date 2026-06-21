const Application = require('../models/Application');

// GET /api/analytics/summary
const getSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const applications = await Application.find({ user: userId, archived: false });

    const total = applications.length;

    const byStatus = {};
    Application.schema.path('status').enumValues.forEach((status) => {
      byStatus[status] = 0;
    });
    applications.forEach((app) => {
      byStatus[app.status] = (byStatus[app.status] || 0) + 1;
    });

    const appliedOrLater = applications.filter((app) => app.status !== 'Wishlist').length;

    const reachedInterview = applications.filter((app) => app.rounds && app.rounds.length > 0).length;

    const reachedOffer = applications.filter((app) =>
      ['Offer', 'Accepted'].includes(app.status)
    ).length;

    const rejected = applications.filter((app) => app.status === 'Rejected').length;

    const responseRate = appliedOrLater > 0
      ? Math.round(((appliedOrLater - byStatus['Applied']) / appliedOrLater) * 100)
      : 0;

    const interviewConversionRate = appliedOrLater > 0
      ? Math.round((reachedInterview / appliedOrLater) * 100)
      : 0;

    const offerConversionRate = reachedInterview > 0
      ? Math.round((reachedOffer / reachedInterview) * 100)
      : 0;

    const overallSuccessRate = appliedOrLater > 0
      ? Math.round((reachedOffer / appliedOrLater) * 100)
      : 0;

    // Applications over time (by month, last 12 months based on appliedDate/createdAt)
    const monthBuckets = {};
    applications.forEach((app) => {
      const date = app.appliedDate || app.createdAt;
      if (!date) return;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthBuckets[key] = (monthBuckets[key] || 0) + 1;
    });
    const applicationsOverTime = Object.entries(monthBuckets)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([month, count]) => ({ month, count }));

    // Total interview rounds breakdown by type
    const roundsByType = {};
    applications.forEach((app) => {
      (app.rounds || []).forEach((round) => {
        roundsByType[round.type] = (roundsByType[round.type] || 0) + 1;
      });
    });

    // Upcoming interviews (rounds with future dates)
    const now = new Date();
    const upcoming = [];
    applications.forEach((app) => {
      (app.rounds || []).forEach((round) => {
        if (round.date && new Date(round.date) >= now && round.outcome === 'Scheduled') {
          upcoming.push({
            applicationId: app._id,
            company: app.company,
            role: app.role,
            roundType: round.type,
            date: round.date,
          });
        }
      });
    });
    upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Average time from applied to first response (first round date)
    let totalDaysToResponse = 0;
    let countWithResponse = 0;
    applications.forEach((app) => {
      if (app.appliedDate && app.rounds && app.rounds.length > 0) {
        const sortedRounds = [...app.rounds].sort((a, b) => new Date(a.date) - new Date(b.date));
        const firstRoundDate = sortedRounds[0].date;
        if (firstRoundDate) {
          const days = Math.round(
            (new Date(firstRoundDate) - new Date(app.appliedDate)) / (1000 * 60 * 60 * 24)
          );
          if (days >= 0) {
            totalDaysToResponse += days;
            countWithResponse += 1;
          }
        }
      }
    });
    const avgDaysToResponse = countWithResponse > 0
      ? Math.round(totalDaysToResponse / countWithResponse)
      : null;

    res.status(200).json({
      total,
      byStatus,
      rates: {
        responseRate,
        interviewConversionRate,
        offerConversionRate,
        overallSuccessRate,
      },
      reachedInterview,
      reachedOffer,
      rejected,
      applicationsOverTime,
      roundsByType,
      upcoming: upcoming.slice(0, 10),
      avgDaysToResponse,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSummary };
