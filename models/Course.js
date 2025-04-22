const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    type: { type: String, enum: ['option', 'subjective'], required: true },
    options: { type: [String], default: [] } // Only for 'option' type questions
});

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    professorId: { type: String, required: true },
    year: { type: Number, required: true },
    type: { type: String, enum: ['monsoon', 'winter', 'summer'], required: true },
    questions: { type: [questionSchema], required: true },
    feedbackToken: { type: String, default: null },
    tokenExpiry: { type: Date, default: null }
});

module.exports = mongoose.model('Course', courseSchema);
