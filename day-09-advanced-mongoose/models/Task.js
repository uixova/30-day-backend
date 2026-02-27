const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { 
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true } 
});

taskSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

taskSchema.virtual('fullTitle').get(function() {
    return `[${this.priority.toUpperCase()}] ${this.title}`;
});

module.exports = mongoose.model('Task', taskSchema);