const Task = require('../models/Task');
const Team = require('../models/Team');
const mongoose = require('mongoose');

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id });
        res.json({ tasks }); 
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const createTask = async (req, res) => {
    const { title, description, status, priority, deadline } = req.body;

    try {
        const newTask = new Task({
            user: req.user.id,
            title,
            description,
            status,
            priority,
            deadline,
        });

        const task = await newTask.save();
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const updateTask = async (req, res) => {
    const { title, description, status, priority, deadline } = req.body;

    try {
        // Find the task by its ID
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        // Ensure that the task belongs to the authenticated user
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Validate the status value
        const allowedStatuses = ['To-Do', 'In Progress', 'Under Review', 'Completed'];
        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({ msg: 'Invalid status value' });
        }

        // Update the fields if provided, otherwise retain existing values
        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;
        task.priority = priority || task.priority;
        task.deadline = deadline || task.deadline;

        // Save the updated task
        await task.save();
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


const deleteTask = async (req, res) => {
    const token = req.header('Authorization');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ msg: 'Invalid task ID format' });
}

    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // await task.remove();
        // res.json({ msg: 'Task removed' });
        await Task.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Task removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


module.exports = { getTasks, createTask, updateTask, deleteTask};
