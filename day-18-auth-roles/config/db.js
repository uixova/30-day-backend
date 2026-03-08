const mongoose = require('mongoose');

const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("Connected to DB!");
        })
        .catch((err) => {
            console.error("Failed to connect to DB!");
            process.exit(1);
        });
}

module.exports = connectDB;