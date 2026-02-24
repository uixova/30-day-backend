const fs = require('fs');

const getProjects = () => {
    const data = fs.readFileSync('data.json', 'utf-8');
    return JSON.parse(data);
};

exports.getSingleProject = (req, res) => {
    const projects = getProjects();
    const id = parseInt(req.params.id); 

    const project = projects.find(p => p.id === id);

    if (!project) {
        return res.status(404).json({ 
            success: false, 
            message: "Project not found!" 
        });
    }

    res.status(200).json({ success: true, data: project });
};

exports.getAllProjects = (req, res) => {
    const projects = getProjects();
    const { name } = req.query;

    if (name) {
        const filteredProjects = projects.filter(p => p.projects.toLowerCase().includes(name.toLowerCase()));
        return res.json(filteredProjects);
    }

    res.status(200).json(projects);
};

exports.addProject = (req, res) => {
    const projects = getProjects();
    const newProject = req.body;
    projects.push(newProject);
    fs.writeFileSync('data.json', JSON.stringify(projects, null, 2));
    res.status(201).json({ success: true, message: "Controller added this!" });
};

exports.deleteProject = (req, res) => {
    const projects = getProjects();
    const projectId = parseInt(req.params.id);

    const filteredProjects = projects.filter(p => p.id !== projectId);

    if (projects.length === filteredProjects.length) {
        return res.status(404).json({ success: false, message: "Project not found!" });
    }

    fs.writeFileSync('data.json', JSON.stringify(filteredProjects, null, 2));

    res.json({ success: true, message: `Project ${projectId} deleted.` });
};

exports.updateProject = (req, res) => {
    const projects = getProjects();
    const projectId = parseInt(req.params.id);
    const updatedContent = req.body;

    const index = projects.findIndex(p => p.id === projectId);

    if (index !== -1) {
        projects[index] = { ...projects[index], ...updatedContent };

        fs.writeFileSync('data.json', JSON.stringify(projects, null, 2));

        res.json({ success: true, updatedData: projects[index] });
    } else {
        res.status(404)({ success: false, message: "Project not found!" });
    }
};