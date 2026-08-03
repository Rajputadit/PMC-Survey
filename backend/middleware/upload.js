const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

// Make sure the uploads folder exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Where and how to store each incoming file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        // e.g. file_3-1706598421345-873920123.pdf
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});

// Only allow common document/image types (adjust as needed)
const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
    }
};

const maxSizeMb = Number(process.env.MAX_FILE_SIZE_MB) || 10;

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: maxSizeMb * 1024 * 1024 }
});

// The form has 11 document upload slots: file_1 ... file_11
const documentFields = Array.from({ length: 11 }, (_, i) => ({
    name: `file_${i + 1}`,
    maxCount: 1
}));

module.exports = { upload, documentFields, UPLOAD_DIR };
