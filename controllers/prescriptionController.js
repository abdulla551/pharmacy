const multer = require('multer');
const Prescription = require('../models/prescriptionModel');
const ContractedPharmacy = require('../models/contractedPharmacyModel');
const Notification = require('../models/notificationModel');
const AppError = require('../utils/appError');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  }
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('هذا الملف ليس صورة! من فضلك قم برفع صور فقط.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadPrescriptionImage = upload.single('prescription_image');

exports.createPrescription = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('من فضلك قم برفع صورة الروشتة', 400));
    }

    const newPrescription = await Prescription.create({
      prescription_image: req.file.filename,
      user: req.user.id
    });


    const pharmacies = await ContractedPharmacy.find();


    const notificationPromises = pharmacies.map(pharmacy => {
      return Notification.create({
        pharmacy: pharmacy._id,
        user: req.user.id,
        prescription: newPrescription._id,
        message: `روشتة جديدة تم رفعها بواسطة ${req.user.name}`
      });
    });

    await Promise.all(notificationPromises);

    res.status(201).json({
      status: 'success',
      data: {
        prescription: newPrescription
      }
    });
  } catch (err) {
    next(err);
  }
};
