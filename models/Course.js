const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    feedbackToken: { type: String, default: null },
    tokenExpiry: { type: Date, default: null }
});

module.exports = mongoose.model('Course', courseSchema);
