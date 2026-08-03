const mongoose = require('mongoose');

const connectDB = async () => {
    // Fail fast with a clear message instead of the confusing "undefined" mongoose error
    if (!process.env.MONGO_URI) {
        console.error(
            '❌ MONGO_URI is not set.\n' +
            '   - Local machine: check that backend/.env exists and has MONGO_URI=...\n' +
            '   - Render/hosting: go to your service → Environment tab → add MONGO_URI ' +
            'as an Environment Variable (the .env file is NOT deployed, it is git-ignored on purpose).'
        );
        process.exit(1);
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
