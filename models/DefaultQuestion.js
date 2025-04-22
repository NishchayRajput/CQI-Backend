const mongoose = require('mongoose');

const defaultQuestionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    type: { type: String, enum: ['option', 'subjective'], required: true },
    options: { type: [String], default: [] } // Only for 'option' type questions
});

module.exports = mongoose.model('DefaultQuestion', defaultQuestionSchema);
