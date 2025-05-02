const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    professorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User schema
    year: { type: String, required: true },
    type: { type: String, enum: ['monsoon', 'winter', 'summer'], required: true },
});

module.exports = mongoose.model('Course', courseSchema);