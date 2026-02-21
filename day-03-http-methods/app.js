const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// ÇOK ÖNEMLİ: Sunucuya dışarıdan JSON verisi gönderdiğimizde 
// Express'in bunu anlayabilmesi için eklememiz ŞART
app.use(express.json());

const getProjects = () => {
    const data = fs.readFileSync('data.json', 'utf-8');
    return JSON.parse(data);
}

// 1
app.get('/', (req, res) => {
    const projects = getProjects();
    res.json(projects);
});

// 2
app.post('/add', (req, res) => {
    const projects = getProjects();
    const newProject = req.body;

    projects.push(newProject);

    fs.writeFileSync('data.json', JSON.stringify(projects, null, 2));

    req.status(201).json({
        message: "The project has been added successfully!",
        added: newProject,
        data: newProject
    })
}),

//3
app.put('/update/:id', (req, res) => {
    let projects = getProjects();
    const projectId = parseInt(req.params.id);
    const updatedContent = req.body;

    const projectIndex = projects.findIndex(p => p.id === projectId);

    if (projectIndex !== -1) {
        projects[projectIndex] = {...projects[projectIndex], ...updatedContent};

        fs.writeFileSync('data.json', JSON.stringify(projects, null, 2));

        res.json({
            success: true,
            message: `Project with ID ${projectId} has been updated.`,
            updatedData: projects[projectIndex]
        });
    } else {
        res.status(404).json({
            success: false,
            message: "Project not found!"
        });
    }
    
});

// 4
app.delete('/delete/:id', (req, res) => {
    let projects = getProjects();
    const projectId = parseInt(req.params.id);

    const newProjectList = projects.filter(p => p.id !== projectId);

    if (projects.length !== newProjectList.length) {
        fs.writeFileSync('data.json', JSON.stringify(newProjectList, null, 2));
        
        res.json({
            success: true,
            message: `Project with ID ${projectId} has been deleted.`
        });
    } else {
        res.status(404).json({
            success: false,
            message: "Project not found, nothing to delete."
        });
    }
});

app.listen(port, () => {
    console.log(`Day 3 server http://localhost:${port}`);
});