require('dotenv').config();
const connectDB = require('./config/db');
const express = require("express");
const app = express();
const blogRoutes = require('./routes/blogRoutes');
const errorHandler = require('./middlewares/error');
const authRoutes = require('./routes/authRoutes');
const fileupload = require('express-fileupload');
const path = require('path');

connectDB();
app.use(express.json());
app.use(fileupload());

app.use('/api/blog', blogRoutes);
app.use('/api/v1/auth', authRoutes);
app.use(errorHandler);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
    console.log("Server is running on port 3000 with professional structure!");
});