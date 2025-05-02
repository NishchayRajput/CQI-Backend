const express = require('express');
const router = express.Router();
const DefaultQuestion = require('../models/DefaultQuestion');

// Create default questions for course feedback
router.post('/create', async (req, res) => {
    try {
        // Define default questions
        const defaultQuestions = [
            // Option-based questions
            {
                text: 'How would you rate the overall quality of the course?',
                type: 'option',
                options: ['1', '2', '3', '4', '5', 'NA']
            },
            {
                text: 'How effective were the lectures in helping you understand the material?',
                type: 'option',
                options: ['1', '2', '3', '4', '5', 'NA']
            },
            {
                text: 'How would you rate the course materials (e.g., slides, notes)?',
                type: 'option',
                options: ['1', '2', '3', '4', '5', 'NA']
            },
            {
                text: 'How would you rate the professor’s ability to explain concepts?',
                type: 'option',
                options: ['1', '2', '3', '4', '5', 'NA']
            },
            {
                text: 'Would you recommend this course to other students?',
                type: 'option',
                options: ['1', '2', '3', '4', '5', 'NA']
            },
            // Subjective questions
            {
                text: 'What did you like most about the course?',
                type: 'subjective'
            },
            {
                text: 'What improvements would you suggest for the course?',
                type: 'subjective'
            },
            {
                text: 'Any additional comments or feedback?',
                type: 'subjective'
            }
        ];

        // Insert default questions into the database
        const createdQuestions = await DefaultQuestion.insertMany(defaultQuestions);

        res.status(201).json({
            message: 'Default questions created successfully',
            questions: createdQuestions
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating default questions' });
    }
});

// Get all questions
router.get('/list', async (req, res) => {
    try {
        // Fetch all questions from the database
        const questions = await DefaultQuestion.find();

        // Return the questions in the response
        res.status(200).json({
            message: 'Questions fetched successfully',
            questions
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching questions' });
    }
});

module.exports = router;