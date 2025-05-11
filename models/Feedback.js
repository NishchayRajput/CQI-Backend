const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    responses: [
        {
            questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'DefaultQuestion', required: true },
            response: { type: mongoose.Schema.Types.Mixed, required: true } // Mixed type to allow both string and number
        }
    ],
    submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema)