const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Feedback = require('../models/Feedback');

// Submit feedback
router.post('/submit', async (req, res) => {
    const { courseId, token, studentId, responses } = req.body;
    try {
        const course = await Course.findById(courseId);
        if (!course || course.feedbackToken !== token || new Date() > course.tokenExpiry) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        const feedback = new Feedback({ courseId, studentId, responses });
        await feedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error submitting feedback' });
    }
});

module.exports = router;
