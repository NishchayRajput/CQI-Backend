const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Session = require('../models/Session');
const Feedback = require('../models/Feedback');

// Submit feedback
router.post('/submit', async (req, res) => {
    const { courseId, token, responses } = req.body;
    console.log(courseId, token, responses);
    try {
        const session = await Session.findById(token);
        console.log(session);
        if (!session) {
            return res.status(400).json({ error: 'Invalid session token' });
        }
        const course = await Course.findById(courseId);
        console.log(course);
        if (!course) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }
       
        
        

        
        const feedback = new Feedback({ courseId, responses });
        await feedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error submitting feedback' });
    }
});

module.exports = router;
