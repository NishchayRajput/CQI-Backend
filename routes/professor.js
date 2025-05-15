const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Feedback = require('../models/Feedback');
const User = require('../models/User');
// Middleware for professor authentication
// ...implement authentication middleware here...

// Get professor list
router.get('/list/verified', async (req, res) => {
    try {
        // Fetch all users with the role of 'professor'
        const professors = await User.find({ role: 'professor', verify: 'true' }).select('username Name email');
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



module.exports = router;
