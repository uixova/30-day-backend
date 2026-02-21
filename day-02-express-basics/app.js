const fs = require('fs');

const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send("It could be my first server trial, this will be the first step of the backend!");
});

app.get('/about', (req, res) => { 
    res.json({
        message: "I'm uixova, I'm doing a 30-day backend challenge.",
        status: "Like a beast"
    });
});

app.get('/project', (req, res) => {
    const project = fs.readFileSync('project.json', 'utf8');

    const data = JSON.parse(project);

    res.json(data);
});

app.listen(port, () => {
    console.log(`Server ready at http://localhost:${port}!`);
});