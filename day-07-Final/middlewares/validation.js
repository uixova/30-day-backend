const fs = require('fs');

const getTasks = () => {
    const data = fs.readFileSync('data.json', 'utf-8');
    return JSON.parse(data);
};

const validateTask = (req, res, next) => {
    const { title, status, priority } = req.body;

    if (!title || title.trim().length < 3) {
        return res.status(400).json({ 
            message: "Error: Title is mandatory and must be at least 3 characters!" 
        });
    } 

    const allowedStatus = ["pending", "in-progress", "completed"];
    if (!status || !allowedStatus.includes(status)) {
        return res.status(400).json({ 
            message: `Error: Status must be one of: ${allowedStatus.join(", ")}` 
        });
    }

    const allowedPriority = ["low", "medium", "high"];
    if (!priority || !allowedPriority.includes(priority)) {
        return res.status(400).json({ 
            message: `Error: Priority must be one of: ${allowedPriority.join(", ")}` 
        });
    }

    next();
}

const validateId = (req, res, next) => {
    const tasks = getTasks();
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({ message: "Error: Task not found with this ID!" });
    }

    req.foundTask = task;
    next();
};

module.exports = { validateTask, validateId };