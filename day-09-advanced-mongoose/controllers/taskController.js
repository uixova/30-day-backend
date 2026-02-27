const Task = require('../models/Task');

exports.getAllTasks = async (req, res) => {
    try {
        let query = { ...req.query };

        const tasks = await Task.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createTask = async (req, res) => {
    try {
        const newTask = await Task.create(req.body);

        res.status(201).json({
            success: true,
            data: newTask
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found!" });
        }

        res.status(200).json({ success: true, data: task });
    } catch (err) {
        res.status(500).json({ success: false, message: "ID format may be incorrect!" });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, message: "No task found to delete!" });
        }

        res.status(200).json({ success: true, message: "Task successfully deleted!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!task) {
            res.status(404).json({ success: false, message: "No quest found to update!" });
        }

        res.status(200).json({
            success: true,
            message: "Task updated successfully!",
            date: task
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}