const express = require('express');
const router = express.Router();
const { upload, documentFields } = require('../middleware/upload');
const {
    createSurvey,
    getSurveys,
    getSurveyById
} = require('../controllers/surveyController');

// POST /api/surveys - submit a filled survey (multipart/form-data: text fields + file_1..file_11)
router.post('/', upload.fields(documentFields), createSurvey);

// GET /api/surveys - list all submissions (useful for an admin view)
router.get('/', getSurveys);

// GET /api/surveys/:id - get one submission
router.get('/:id', getSurveyById);

module.exports = router;
