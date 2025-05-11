const mongoose = require('mongoose');
const Course = require('./Course'); // Assuming Course is in the same directory

const sessionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    expiry: { type: Date } // Optional expiry field for session validity
});

module.exports = mongoose.model('Session', sessionSchema);