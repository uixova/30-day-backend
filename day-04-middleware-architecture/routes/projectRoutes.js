const express = require('express');
const router = express.Router();
const fs = require('fs');

const getProjects = () => {
    const data = fs.readFileSync('data.json', 'utf-8');
    return JSON.parse(data);
}

const checkNewProject = (req, res, next) => {
    const { id, message } = req.body;

    if (!id || !message) {
        return res.status(400).json({ 
            success: false, 
            message: "Missing data! You must provide both ID and Project name."
        });
    }
    next();
}

const checkUpdateProject = (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ 
            success: false, 
            message: "Update failed! Body cannot be empty." 
        });
    }
    next();
}

router.get('/', (req, res) => {
    const projects = getProjects();
    res.json(projects)
});

router.post('/add', checkNewProject, (req, res) => {
    const projects = getProjects();
    const newProject = req.body;
    projects.push(newProject);

    fs.writeFileSync('data.json', JSON.stringify(projects, null, 2));
    res.status(201).json({ success: true, message: "Added successfully!" });
});

router.put('/update/:id', checkUpdateProject, (req, res) => {
    const projects = getProjects();
    const projectId = parseInt(req.params.id);
    const updatedContent = req.body;

    const projectIndex = projects.findIndex(p => p.id === projectId);

    if (projectIndex !== -1) {
        projects[projectIndex] = {...projects[projectIndex], ...updatedContent};

        fs.writeFileSync('data.json', JSON.stringify(projects, null, 2));

        res.json({
            success: true,
            message: `Project with ID ${projectId} updated successfully.`,
            updatedData: projects[projectIndex]
        });
    } else {
        res.status(404).json({
            success: false,
            message: "Project not found in database!"
        });
    }
});

module.exports = router;