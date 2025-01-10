const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            // Modern versions of Mongoose don't need additional options
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        // Log the full error in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Full error:', error);
        }
        process.exit(1);
    }
};

module.exports = connectDB;