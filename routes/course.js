const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const User = require('../models/User');

// Create a new course
router.post('/create', async (req, res) => {
    const { name, id, professorId, year, type } = req.body;

    try {
        // Validate required fields
        if (!name || !id || !professorId || !year || !type) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }

        // Validate that the professorId corresponds to a user with the role of 'professor'
        const professor = await User.findOne({ _id: professorId, role: 'professor' });
        if (!professor) {
            return res.status(400).json({ error: 'Invalid professorId or user is not a professor' });
        }

        // Create a new course
        const course = new Course({
            name,
            id,
            professorId,
            year,
            type,
        });

        // Save the course to the database
        await course.save();
        res.status(201).json({ message: 'Course created successfully', course });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating course' });
    }
});

// Fetch all courses with professor details
router.get('/list', async (req, res) => {
    try {
        // Fetch all courses and populate professor details
        const courses = await Course.find()
            .populate('professorId', 'Name _id') // Populate professor's Name and ObjectId
            .select('name id year type professorId'); // Select specific fields to return

        res.status(200).json(courses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching courses' });
    }
});

module.exports = router;