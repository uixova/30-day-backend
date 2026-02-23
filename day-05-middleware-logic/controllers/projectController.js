const fs = require('fs');

const getProjects = () => {
    const data = fs.readFileSync('data.json', 'utf-8');
    return JSON.parse(data);
};

exports.getAllProjects = (req, res) => {
    const projects = getProjects();
    res.status(200).json(projects);
};

exports.addProject = (req, res) => {
    const projects = getProjects();
    projects.push(req.body);
    fs.writeFileSync('data.json', JSON.stringify(projects, null, 2));
    res.status(201).json({ success: true, message: "Controller added this!" });
};

exports.deleteProject = (req, res) => {
    const projects = getProjects();
    const projectId = parseInt(req.params.id);

    const filtederProjects = projects.findIndex(p => p.id !== projectId);

    if (projects.length === filteredProjects.length) {
        return res.status(404).json({ success: false, message: "Project not found!" });
    }

    fs.writeFileSync('data.json', JSON.stringify(filtederProjects, null, 2));

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