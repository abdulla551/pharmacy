const ContractedPharmacy = require('../models/contractedPharmacyModel');

exports.getAllPharmacies = async (req, res, next) => {
  try {
    const pharmacies = await ContractedPharmacy.find();

    res.status(200).json({
      status: 'success',
      results: pharmacies.length,
      data: {
        pharmacies
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.createPharmacy = async (req, res, next) => {
  try {
    const newPharmacy = await ContractedPharmacy.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        pharmacy: newPharmacy
      }
    });
  } catch (err) {
    next(err);
  }
};
