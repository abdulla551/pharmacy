const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  pharmacy: {
    type: mongoose.Schema.ObjectId,
    ref: 'ContractedPharmacy',
    required: [true, 'Notification must belong to a pharmacy']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Notification must belong to a user']
  },
  prescription: {
    type: mongoose.Schema.ObjectId,
    ref: 'Prescription',
    required: [true, 'Notification must be linked to a prescription']
  },
  message: {
    type: String,
    required: [true, 'Notification must have a message']
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
