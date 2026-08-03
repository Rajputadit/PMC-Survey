const Survey = require('../models/Survey');

// Labels matching the Document Upload checklist in index.html (S.N 1-11)
const DOCUMENT_LABELS = {
    1: 'Copy of signed Agreement',
    2: 'Date of Agreement Proof',
    3: 'Extension Claim document',
    4: 'Photograph of the hoarding site',
    5: 'Copy of PMC Licence',
    6: 'Structural Safety Certificate',
    7: 'Agency KYC PAN Card',
    8: 'GST Registration Certificate',
    9: 'Company Registration Certificate',
    10: 'Registered Address Proof',
    11: 'Authorised Signatory ID Proof'
};

// Helper: convert an empty string to undefined so empty date fields don't crash Mongoose
const toDateOrUndefined = (val) => (val ? new Date(val) : undefined);

// POST /api/surveys  -> create a new survey submission
exports.createSurvey = async (req, res) => {
    try {
        const body = req.body;

        // Build the documents array from whichever file_N fields were actually uploaded
        const documents = [];
        for (let i = 1; i <= 11; i++) {
            const fieldName = `file_${i}`;
            const fileArr = req.files && req.files[fieldName];
            if (fileArr && fileArr.length > 0) {
                const f = fileArr[0];
                documents.push({
                    slNo: i,
                    label: DOCUMENT_LABELS[i],
                    attached: true,
                    fileName: f.filename,
                    originalName: f.originalname,
                    filePath: `uploads/${f.filename}`,
                    mimeType: f.mimetype,
                    size: f.size
                });
            } else {
                documents.push({
                    slNo: i,
                    label: DOCUMENT_LABELS[i],
                    attached: false
                });
            }
        }

        const survey = new Survey({
            refNo: body.refNo,
            surveyDate: toDateOrUndefined(body.surveyDate),
            wardNo: body.wardNo,
            zone: body.zone,

            agencyName: body.agencyName,
            businessType: body.businessType,
            registeredOfficeAddress: body.registeredOfficeAddress,
            gstNumber: body.gstNumber,
            panNumber: body.panNumber,
            contactPersonName: body.contactPersonName,
            mobileNumber: body.mobileNumber,
            email: body.email,

            siteAddress: body.siteAddress,
            gpsCoordinates: body.gpsCoordinates,
            nearestLandmark: body.nearestLandmark,
            landOwnership: body.landOwnership,
            qrTagNumber: body.qrTagNumber,

            structureType: body.structureType,
            dimensions: body.dimensions,
            totalHeightFt: body.totalHeightFt,
            displayFaces: body.displayFaces,
            material: body.material,
            approxAgeYears: body.approxAgeYears,

            hasPmcLicence: body.hasPmcLicence || '',
            licenceNo: body.licenceNo,
            licenceIssueDate: toDateOrUndefined(body.licenceIssueDate),
            licenceExpiryDate: toDateOrUndefined(body.licenceExpiryDate),
            agreementSigned: body.agreementSigned || '',
            agreementExecutionDate: toDateOrUndefined(body.agreementExecutionDate),
            agreementExtended: body.agreementExtended || '',
            extensionDetails: body.extensionDetails,
            feePaidDetails: body.feePaidDetails,

            hasStructuralCertificate: body.hasStructuralCertificate || '',
            engineerAgencyName: body.engineerAgencyName,
            lastInspectionDate: toDateOrUndefined(body.lastInspectionDate),

            lightingType: body.lightingType,
            powerConsumption: body.powerConsumption,
            powerSource: body.powerSource,

            currentBrandDisplayed: body.currentBrandDisplayed,
            rentalFee: body.rentalFee,

            declarationAccepted: body.declarationAccepted === 'true' || body.declarationAccepted === 'on',

            documents,
            submittedIp: req.ip
        });

        const saved = await survey.save();

        res.status(201).json({
            success: true,
            message: 'Survey submitted successfully.',
            data: saved
        });
    } catch (error) {
        console.error('Error creating survey:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to submit survey.'
        });
    }
};

// GET /api/surveys -> list all submissions (basic, no pagination — add if data grows large)
exports.getSurveys = async (req, res) => {
    try {
        const surveys = await Survey.find().sort({ createdAt: -1 });
        res.json({ success: true, count: surveys.length, data: surveys });
    } catch (error) {
        console.error('Error fetching surveys:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch surveys.' });
    }
};

// GET /api/surveys/:id -> get a single submission by its Mongo _id
exports.getSurveyById = async (req, res) => {
    try {
        const survey = await Survey.findById(req.params.id);
        if (!survey) {
            return res.status(404).json({ success: false, message: 'Survey not found.' });
        }
        res.json({ success: true, data: survey });
    } catch (error) {
        console.error('Error fetching survey:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch survey.' });
    }
};
