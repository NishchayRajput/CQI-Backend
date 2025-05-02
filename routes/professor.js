const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Feedback = require('../models/Feedback');
const User = require('../models/User');
// Middleware for professor authentication
// ...implement authentication middleware here...

// Get professor list
router.get('/list', async (req, res) => {
    try {
        // Fetch all users with the role of 'professor'
        const professors = await User.find({ role: 'professor' }).select('username Name email');
        res.status(200).json(professors);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching professor list' });
    }
});

// Get all courses for a professor
router.get('/courses', async (req, res) => {
    const { professorId } = req.session.user; // Assume professorId is stored in session
    try {
        const courses = await Course.find({ professorId });
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching courses' });
    }
});

// Get feedback for a specific course
router.get('/courses/:courseId/feedback', async (req, res) => {
    const { courseId } = req.params;
    try {
        const feedbacks = await Feedback.find({ courseId }).select('-studentId'); // Exclude studentId for anonymity
        res.status(200).json(feedbacks);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching feedback' });
    }
});

// Get a specific feedback entry
router.get('/courses/:courseId/feedback/:feedbackId', async (req, res) => {
    const { feedbackId } = req.params;
    try {
        const feedback = await Feedback.findById(feedbackId).select('-studentId'); // Exclude studentId for anonymity
        if (!feedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }
        res.status(200).json(feedback);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching feedback' });
    }
});

// Get feedback for a professor's courses
router.get('/feedback', async (req, res) => {
    const { professorId } = req.query; // Assume professorId is passed as a query parameter
    try {
        const courses = await Course.find({ professorId });
        const courseIds = courses.map(course => course._id);

        const feedbacks = await Feedback.find({ courseId: { $in: courseIds } })
            .populate('courseId', 'name year type') // Populate course details
            .select('-studentId'); // Exclude studentId to maintain anonymity

        res.status(200).json(feedbacks);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching feedback' });
    }
});

module.exports = router;
