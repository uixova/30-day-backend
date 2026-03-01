const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter a title'], 
        trim: true,
        maxlength: [50, 'Title cannot be longer than 50 charactersz'],
        minlength: [3, 'The title must be at least 3 characters']
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'in-progress', 'completed'],
            message: '{VALUE} It is not a valid situation. Just: pending, in-progress, completed'
        },
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
        validate: {
            validator: function(v) {
                return !(this.title && this.title.length < 5 && v === 'high');
            },
            message: 'Short titles cant be assigned high priority!'
        }
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

taskSchema.pre('save', function() {
    this.updatedAt = Date.now();
});

taskSchema.virtual('fullTitle').get(function() {
    return `[${this.priority.toUpperCase()}] ${this.title}`;
});

module.exports = mongoose.model('Task', taskSchema);