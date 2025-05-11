const express = require('express');
const { v4: uuidv4 } = require('uuid'); // Import uuid for generating unique IDs
const router = express.Router();
const Session = require('../models/Session');

// Create a session
router.post('/create', async (req, res) => {
    try {
        const { courseId } = req.body;

        // Validate request body
        if (!courseId) {
            return res.status(400).json({ error: 'courseId is required' });
        }

        // Generate a unique sessionId
        const sessionId = uuidv4();

        // Create a new session
        const newSession = new Session({ sessionId, courseId });
        await newSession.save();

        res.status(201).json({ message: 'Session created successfully', session: newSession });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create session', details: error.message });
    }
});

// Delete a session
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the session
        const deletedSession = await Session.findByIdAndDelete(id);

        if (!deletedSession) {
            return res.status(404).json({ error: 'Session not found' });
        }

        res.status(200).json({ message: 'Session deleted successfully', session: deletedSession });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete session', details: error.message });
    }
});

module.exports = router;