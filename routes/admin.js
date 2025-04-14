const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const crypto = require('crypto');

// Middleware for admin authentication
// ...existing code...

// Create a new course
router.post('/courses', async (req, res) => {
    const { name } = req.body;
    try {
        const course = new Course({ name });
        await course.save();
        res.status(201).json(course);
    } catch (err) {
        res.status(500).json({ error: 'Error creating course' });
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

module.exports = router;