require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');

const connectDB = require('./config/db');
const surveyRoutes = require('./routes/surveyRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

// --- Connect to MongoDB ---
connectDB();

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (so they can be viewed/downloaded later if needed)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve the frontend (index.html, css, js, images) from the ../public folder
app.use(express.static(path.join(__dirname, '..', 'public')));

// --- API routes ---
app.use('/api/surveys', surveyRoutes);

// --- Default route: serve the homepage (Welcome page) ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// --- Survey form route: serve the actual survey questionnaire ---
app.get('/survey', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'survey.html'));
});

// --- Basic error handler (e.g. multer file-size/type errors land here) ---
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Something went wrong on the server.'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 PMC Hoarding Survey server running at http://localhost:${PORT}`);
});
