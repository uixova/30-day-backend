const fs = require('fs');
const middleWare = require('../middlewares/validation');

const getTasksFromFile = () => {
    const data = fs.readFileSync('data.json', 'utf-8');
    return JSON.parse(data);
};

const saveTasksToFile = (tasks) => {
    fs.writeFileSync('data.json', JSON.stringify(tasks, null, 2), 'utf-8');
};

exports.getAllTask = (req, res) => {
    let tasks = getTasksFromFile();
    const { status, priority } = req.query;

    if (status) {
        tasks = tasks.filter(t => t.status === status);
    }
    
    if (priority) {
        tasks = tasks.filter(t => t.priority === priority);
    }

    res.status(200).json(tasks);
};

exports.getSingleTask = (req, res) => {
    let tasks = getTasksFromFile();
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({ message: "Mission not found!" });
    }

    res.status(200).json(task);
};

exports.addTask = (req, res) => {
    let tasks = getTasksFromFile();

    const newId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
    
    const newTask = {
        id: newId,
        ...req.body,
        createdAt: new Date().toISOString().split('T')[0]
    };

    tasks.push(newTask);
    saveTasksToFile(tasks);

    res.status(201).json({ success: true, data: newTask });
};

exports.deleteTask = (req, res) => {
    let tasks = getTasksFromFile();
    const id = parseInt(req.params.id);

    const filteredTasks = tasks.filter(t => t.id !== id);

    saveTasksToFile(filteredTasks);
    res.json({ success: true, message: `Task with ID ${id} deleted forever!` });
};

exports.updateTask = (req, res) => {
    let tasks = getTasksFromFile();
    const id = parseInt(req.params.id);
    const index = tasks.findIndex(t => t.id === id);

    tasks[index] = { ...tasks[index], ...req.body };

    saveTasksToFile(tasks);
    res.json({ success: true, message: "Task updated!", updatedTask: tasks[index] });
}