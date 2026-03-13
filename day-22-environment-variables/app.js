require('dotenv').config({ path: './config/.env' });
const connectDB = require('./config/db');
const express = require("express");
const app = express();
const blogRoutes = require('./routes/blogRoutes');
const errorHandler = require('./middlewares/error');
const authRoutes = require('./routes/authRoutes');
const fileupload = require('express-fileupload');
const path = require('path');

app.use(express.json());
app.use(fileupload());

app.use('/api/blog', blogRoutes);
app.use('/api/auth', authRoutes);
app.use(errorHandler);
app.use(express.static(path.join(__dirname, 'public')));

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT} with professional structure!`);
    });
});