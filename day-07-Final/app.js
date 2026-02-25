const express = require('express');
const app = express();
const taskRoutes = require('./routes/taskRoutes');

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} request received to: ${req.url}`);
    next();
});

app.use('/task', taskRoutes);

app.listen(3000, () => {
    console.log("Server is running on port 3000 with professional structure!");
});