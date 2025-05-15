const express = require('express');
const router = express.Router();
const DefaultQuestion = require('../models/DefaultQuestion');
const Course = require('../models/Course');
const Feedback = require('../models/Feedback');
const User = require('../models/User');
const crypto = require('crypto');


// Get all courses
router.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching courses' });
    }
});


// Generate feedback token
router.post('/generate-token', async (req, res) => {
    const { courseId, expiryMinutes } = req.body;
    try {
        const token = crypto.randomBytes(16).toString('hex');
        const expiry = new Date(Date.now() + expiryMinutes * 60000);
        await Course.findByIdAndUpdate(courseId, { feedbackToken: token, tokenExpiry: expiry });
        res.status(200).json({ token, expiry });
    } catch (err) {
        res.status(500).json({ error: 'Error generating token' });
    }
});

// Get all user list except me
router.get('/users/list', async (req, res) => {
    try {
        console.log(req.session.user.id);
        const users = await User.find({ _id: { $ne: req.session.user.id } })
        console.log(users);
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching user list' });
    }
});

// Approve a professor
router.put('/approve-user/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Find the user by ID
        const user = await User.findById(userId);

        // Check if the user exists and is a professor
        if (!user || user.role !== 'professor') {
            return res.status(400).json({ error: 'User not found or not a professor' });
        }

        // Approve the user
        user.verify = true;
        await user.save();

        res.status(200).json({ message: 'Professor approved successfully', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error approving professor' });
    }
});

module.exports = router;