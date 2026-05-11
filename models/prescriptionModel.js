const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  prescription_image: {
    type: String,
    required: [true, 'A prescription must have an image']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Prescription must belong to a user']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;
