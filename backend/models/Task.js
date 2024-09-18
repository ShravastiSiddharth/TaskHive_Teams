const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        required: true,
        enum: ['To-Do', 'In Progress', 'Under Review', 'Completed'],
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'Urgent'],
    },
    deadline: {
        type: Date,
    }
},{timestamps:true
});

module.exports = mongoose.model('Task', TaskSchema);
