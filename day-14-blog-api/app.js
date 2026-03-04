require('dotenv').config();
const connectDB = require('./config/db');
const express = require("express");
const app = express();
const blogRoutes = require('./routes/blogRoutes');
const errorHandler = require('./middlewares/error');

connectDB();
app.use(express.json());

app.use('/api/blog', blogRoutes);
app.use(errorHandler);

app.listen(3000, () => {
    console.log("Server is running on port 3000 with professional structure!");
});