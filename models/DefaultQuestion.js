const mongoose = require('mongoose');

const defaultQuestionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    type: { type: String, enum: ['option', 'subjective'], required: true },
    options: {
        type: [String],
        default: [],
        validate: {
            validator: function (value) {
                // Ensure options are provided only for 'option' type questions
                if (this.type === 'option' && (!value || value.length === 0)) {
                    return false; // Invalid if no options are provided for 'option' type
                }
                return true; // Valid otherwise
            },
            message: 'Options are required for questions of type "option".'
        }
    }
});

module.exports = mongoose.model('DefaultQuestion', defaultQuestionSchema);