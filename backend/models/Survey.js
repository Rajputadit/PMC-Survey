const mongoose = require('mongoose');

// Sub-schema for each uploaded document (file_1 ... file_11 in the form)
const documentSchema = new mongoose.Schema(
    {
        slNo: Number,                 // S.N in the checklist table (1-11)
        label: String,                // Document description shown to the user
        attached: { type: Boolean, default: false },
        fileName: String,             // Stored (disk) file name
        originalName: String,         // Original name from the user's computer
        filePath: String,             // Relative path on server, e.g. uploads/xxxx.pdf
        mimeType: String,
        size: Number
    },
    { _id: false }
);

const surveySchema = new mongoose.Schema(
    {
        // --- Meta header ---
        refNo: { type: String, trim: true },
        surveyDate: { type: Date },
        wardNo: { type: String, trim: true },
        zone: { type: String, trim: true },

        // --- Section A: Agency / Applicant KYC ---
        agencyName: { type: String, trim: true },
        businessType: { type: String, trim: true },
        registeredOfficeAddress: { type: String, trim: true },
        gstNumber: { type: String, trim: true, uppercase: true },
        panNumber: { type: String, trim: true, uppercase: true },
        contactPersonName: { type: String, trim: true },
        mobileNumber: { type: String, trim: true },
        email: { type: String, trim: true, lowercase: true },

        // --- Section B: Site Identification ---
        siteAddress: { type: String, trim: true },
        gpsCoordinates: { type: String, trim: true },
        nearestLandmark: { type: String, trim: true },
        landOwnership: { type: String, trim: true },
        qrTagNumber: { type: String, trim: true },

        // --- Section C: Structure & Technical Specifications ---
        structureType: { type: String, trim: true },
        dimensions: { type: String, trim: true },
        totalHeightFt: { type: String, trim: true },
        displayFaces: { type: String, trim: true },
        material: { type: String, trim: true },
        approxAgeYears: { type: String, trim: true },

        // --- Section D: Legal & Licensing Details ---
        hasPmcLicence: { type: String, enum: ['Yes', 'No', ''], default: '' },
        licenceNo: { type: String, trim: true },
        licenceIssueDate: { type: Date },
        licenceExpiryDate: { type: Date },
        agreementSigned: { type: String, enum: ['Yes', 'No', ''], default: '' },
        agreementExecutionDate: { type: Date },
        agreementExtended: { type: String, enum: ['Yes', 'No', ''], default: '' },
        extensionDetails: { type: String, trim: true },
        feePaidDetails: { type: String, trim: true },

        // --- Section E: Structural Safety ---
        hasStructuralCertificate: { type: String, enum: ['Yes', 'No', ''], default: '' },
        engineerAgencyName: { type: String, trim: true },
        lastInspectionDate: { type: Date },

        // --- Section F: Illumination & Power ---
        lightingType: { type: String, trim: true },
        powerConsumption: { type: String, trim: true },
        powerSource: { type: String, trim: true },

        // --- Section G: Commercial Details ---
        currentBrandDisplayed: { type: String, trim: true },
        rentalFee: { type: String, trim: true },

        // --- Declaration ---
        declarationAccepted: { type: Boolean, default: false },

        // --- Uploaded document checklist (11 items) ---
        documents: [documentSchema],

        // Basic metadata about the submission itself
        submittedIp: { type: String },
        status: { type: String, enum: ['submitted', 'reviewed', 'rejected'], default: 'submitted' }
    },
    { timestamps: true } // adds createdAt / updatedAt automatically
);

module.exports = mongoose.model('Survey', surveySchema);
