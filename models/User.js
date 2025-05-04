const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    Name: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'professor'], required: true },
    email: { type: String, required: true, unique: true },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcryptjs.hash(this.password, 10);
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcryptjs.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
