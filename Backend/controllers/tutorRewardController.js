const TutorReward = require('../models/TutorReward');
const Course = require('../models/Course');
const Blog = require('../models/Blog');
const Enrollment = require('../models/Enrollment');
const User = require('../models/user');

const POINTS = { perCourse: 50, perBlog: 20, perEnrollment: 10, perLearnContent: 15 };

const BADGES = [
  { name: '🌱 Newcomer', minPoints: 0 },
  { name: '⭐ Rising Star', minPoints: 100 },
  { name: '🔥 Active Tutor', minPoints: 300 },
  { name: '🏆 Top Educator', minPoints: 600 },
  { name: '💎 Elite Mentor', minPoints: 1000 }
];

function computePoints(breakdown) {
  return (
    breakdown.courses * POINTS.perCourse +
    breakdown.blogs * POINTS.perBlog +
    breakdown.enrollments * POINTS.perEnrollment +
    breakdown.learnContent * POINTS.perLearnContent
  );
}

function computeBadges(points) {
  return BADGES.filter(b => points >= b.minPoints).map(b => b.name);
}

function getCurrentBadge(points) {
  return [...BADGES].reverse().find(b => points >= b.minPoints) || BADGES[0];
}

// POST /api/rewards/tutor/:tutorId
// Body: { courses, blogs, enrollments, learnContent }
exports.saveTutorRewards = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const { courses = 0, blogs = 0, enrollments = 0, learnContent = 0 } = req.body;

    const breakdown = { courses, blogs, enrollments, learnContent };
    const points = computePoints(breakdown);
    const badges = computeBadges(points);

    const reward = await TutorReward.findOneAndUpdate(
      { tutorId },
      { points, badges, breakdown, lastUpdated: new Date() },
      { upsert: true, new: true }
    );

    res.json({ ...reward.toObject(), pointsConfig: POINTS, allBadges: BADGES });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/rewards/leaderboard
// Computes live stats for ALL tutors and returns ranked list
exports.getLeaderboard = async (req, res) => {
  try {
    // Fetch all tutors + all data in parallel
    const [tutors, allCourses, allBlogs, allEnrollments] = await Promise.all([
      User.find({ role: 'tutor' }).select('_id name profilePic'),
      Course.find().select('instructor _id'),
      Blog.find().select('author'),
      Enrollment.find().select('courseId')
    ]);

    // Build a courseId → instructorName map
    const courseInstructorMap = {};
    allCourses.forEach(c => { courseInstructorMap[String(c._id)] = c.instructor; });

    // Count enrollments per instructor name
    const enrollmentsByInstructor = {};
    allEnrollments.forEach(e => {
      const instructor = courseInstructorMap[String(e.courseId)];
      if (instructor) {
        enrollmentsByInstructor[instructor] = (enrollmentsByInstructor[instructor] || 0) + 1;
      }
    });

    // Count blogs per author name
    const blogsByAuthor = {};
    allBlogs.forEach(b => {
      if (b.author) blogsByAuthor[b.author] = (blogsByAuthor[b.author] || 0) + 1;
    });

    // Count courses per instructor name
    const coursesByInstructor = {};
    allCourses.forEach(c => {
      if (c.instructor) coursesByInstructor[c.instructor] = (coursesByInstructor[c.instructor] || 0) + 1;
    });

    // Build leaderboard entries for each tutor
    const entries = tutors.map(tutor => {
      const breakdown = {
        courses: coursesByInstructor[tutor.name] || 0,
        blogs: blogsByAuthor[tutor.name] || 0,
        enrollments: enrollmentsByInstructor[tutor.name] || 0,
        learnContent: 0
      };
      const points = computePoints(breakdown);
      const currentBadge = getCurrentBadge(points);

      return {
        tutorId: tutor._id,
        name: tutor.name,
        profilePic: tutor.profilePic || '',
        points,
        currentBadge: currentBadge.name,
        breakdown
      };
    });

    // Sort by points descending, return top 10
    entries.sort((a, b) => b.points - a.points);
    const top10 = entries.slice(0, 10);

    // Upsert reward records for all tutors in background
    for (const entry of entries) {
      TutorReward.findOneAndUpdate(
        { tutorId: entry.tutorId },
        {
          points: entry.points,
          badges: computeBadges(entry.points),
          breakdown: entry.breakdown,
          lastUpdated: new Date()
        },
        { upsert: true }
      ).catch(() => {});
    }

    res.json(top10);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/rewards/admin/all
// Returns full reward data for every tutor (live computed)
exports.getAllTutorRewards = async (req, res) => {
  try {
    const [tutors, allCourses, allBlogs, allEnrollments] = await Promise.all([
      User.find({ role: 'tutor' }).select('_id name profilePic email'),
      Course.find().select('instructor _id'),
      Blog.find().select('author'),
      Enrollment.find().select('courseId')
    ]);

    const courseInstructorMap = {};
    allCourses.forEach(c => { courseInstructorMap[String(c._id)] = c.instructor; });

    const enrollmentsByInstructor = {};
    allEnrollments.forEach(e => {
      const instructor = courseInstructorMap[String(e.courseId)];
      if (instructor) enrollmentsByInstructor[instructor] = (enrollmentsByInstructor[instructor] || 0) + 1;
    });

    const blogsByAuthor = {};
    allBlogs.forEach(b => { if (b.author) blogsByAuthor[b.author] = (blogsByAuthor[b.author] || 0) + 1; });

    const coursesByInstructor = {};
    allCourses.forEach(c => { if (c.instructor) coursesByInstructor[c.instructor] = (coursesByInstructor[c.instructor] || 0) + 1; });

    // Fetch stored reward records for bonus points
    const storedRewards = await TutorReward.find();
    const bonusMap = {};
    storedRewards.forEach(r => { bonusMap[String(r.tutorId)] = r.bonusPoints || 0; });

    const entries = tutors.map(tutor => {
      const breakdown = {
        courses: coursesByInstructor[tutor.name] || 0,
        blogs: blogsByAuthor[tutor.name] || 0,
        enrollments: enrollmentsByInstructor[tutor.name] || 0,
        learnContent: 0
      };
      const activityPoints = computePoints(breakdown);
      const bonus = bonusMap[String(tutor._id)] || 0;
      const points = activityPoints + bonus;
      return {
        tutorId: tutor._id,
        name: tutor.name,
        email: tutor.email,
        profilePic: tutor.profilePic || '',
        points,
        activityPoints,
        bonusPoints: bonus,
        currentBadge: getCurrentBadge(points).name,
        badges: computeBadges(points),
        breakdown
      };
    });

    entries.sort((a, b) => b.points - a.points);
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/rewards/admin/bonus/:tutorId
// Body: { bonus, reason }  — add/subtract bonus points
exports.adjustBonusPoints = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const { bonus = 0, reason = '' } = req.body;

    const reward = await TutorReward.findOneAndUpdate(
      { tutorId },
      {
        $inc: { bonusPoints: bonus },
        $push: { bonusHistory: { bonus, reason, date: new Date() } },
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({ message: 'Bonus updated', reward });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/rewards/admin/reset/:tutorId
// Resets bonus points for a tutor
exports.resetTutorReward = async (req, res) => {
  try {
    const { tutorId } = req.params;
    await TutorReward.findOneAndUpdate(
      { tutorId },
      { bonusPoints: 0, bonusHistory: [], lastUpdated: new Date() },
      { upsert: true }
    );
    res.json({ message: 'Reward reset successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
