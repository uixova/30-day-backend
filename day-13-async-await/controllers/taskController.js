const Task = require('../models/Task');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllTasks = asyncHandler(async(req, res, next) => {
    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        
    let query = Task.find(JSON.parse(queryStr));

    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt'); 
    }

    const tasks = await query;
    res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks
    });
});

exports.createTask = asyncHandler(async(req, res, next) => { 
    const newTask = await Task.create(req.body);
    res.status(201).json({
        success: true,
        data: newTask
    });
});

exports.getTaskById = asyncHandler(async(req, res, next) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        return res.status(404).json({ success: false, message: "Task not found!" });
    }

    res.status(200).json({ success: true, data: task });
});

exports.deleteTask = asyncHandler(async(req, res, next) => {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
        return res.status(404).json({ success: false, message: "No task found to delete!" });
    }

    res.status(200).json({ success: true, message: "Task successfully deleted!" });
});

exports.updateTask = asyncHandler(async(req, res, next) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!task) {
        return res.status(404).json({ success: false, message: "No task found to update!" });
    }

    res.status(200).json({
        success: true,
        message: "Task updated successfully!",
        data: task 
    });
});