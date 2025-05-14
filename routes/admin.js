const express = require('express');
const router = express.Router();
const DefaultQuestion = require('../models/DefaultQuestion');
const Course = require('../models/Course');
const Feedback = require('../models/Feedback');
const crypto = require('crypto');

// Default questions (cannot be modified by users)
const defaultQuestions = [
    { text: 'How would you rate the course content?', type: 'option', options: ['1', '2', '3', '4', '5'] },
    { text: 'How would you rate the instructor?', type: 'option', options: ['1', '2', '3', '4', '5'] },
    { text: 'What did you like about the course?', type: 'subjective' },
    { text: 'What improvements would you suggest?', type: 'subjective' }
];

// Middleware for admin authentication
// ...existing code...

// Get all courses
router.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find();
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

// Get all default questions
router.get('/default-questions', async (req, res) => {
    try {
        const questions = await DefaultQuestion.find();
        res.status(200).json(questions);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching default questions' });
    }
});

// Add a new default question
router.post('/default-questions', async (req, res) => {
    const { text, type, options } = req.body;
    try {
        const question = new DefaultQuestion({ text, type, options });
        await question.save();
        res.status(201).json(question);
    } catch (err) {
        res.status(500).json({ error: 'Error adding default question' });
    }
});

// Update a default question
router.put('/default-questions/:questionId', async (req, res) => {
    const { questionId } = req.params;
    const updates = req.body;
    try {
        const question = await DefaultQuestion.findByIdAndUpdate(questionId, updates, { new: true });
        if (!question) {
            return res.status(404).json({ error: 'Default question not found' });
        }
        res.status(200).json(question);
    } catch (err) {
        res.status(500).json({ error: 'Error updating default question' });
    }
});

// Delete a default question
router.delete('/default-questions/:questionId', async (req, res) => {
    const { questionId } = req.params;
    try {
        const question = await DefaultQuestion.findByIdAndDelete(questionId);
        if (!question) {
            return res.status(404).json({ error: 'Default question not found' });
        }
        res.status(200).json({ message: 'Default question deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting default question' });
    }
});

// Create a new course
router.post('/courses', async (req, res) => {
    const { name, id, professorId, year, type, customQuestions } = req.body;
    try {
        const defaultQuestions = await DefaultQuestion.find(); // Fetch updated default questions
        const questions = [...defaultQuestions, ...(customQuestions || [])];
        const course = new Course({ name, id, professorId, year, type, questions });
        await course.save();
        res.status(201).json(course);
    } catch (err) {
        res.status(500).json({ error: 'Error creating course' });
    }
});

// Edit a course
router.put('/courses/:courseId', async (req, res) => {
    const { courseId } = req.params;
    const updates = req.body;
    try {
        const course = await Course.findByIdAndUpdate(courseId, updates, { new: true });
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (err) {
        res.status(500).json({ error: 'Error updating course' });
    }
});

// Delete a course
router.delete('/courses/:courseId', async (req, res) => {
    const { courseId } = req.params;
    try {
        const course = await Course.findByIdAndDelete(courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting course' });
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