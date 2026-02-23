const express = require('express');
const app = express();
const projectRoutes = require('./routes/projectRoutes')

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} request received!`);
    next();
});

app.use('/projects', projectRoutes);

app.listen(3000, () => {
    console.log("Server is running on port 3000 with professional structure!");
});