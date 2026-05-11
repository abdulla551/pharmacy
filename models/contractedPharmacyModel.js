const mongoose = require('mongoose');

const contractedPharmacySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A pharmacy must have a name'],
    unique: true
  },
  address: {
    type: String,
    required: [true, 'A pharmacy must have an address']
  },
  phone: {
    type: String,
    required: [true, 'A pharmacy must have a phone number'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  role: {
    type: String,
    default: 'pharmacy'
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

contractedPharmacySchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const bcrypt = require('bcryptjs');
  this.password = await bcrypt.hash(this.password, 12);
});

contractedPharmacySchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(candidatePassword, userPassword);
};

const ContractedPharmacy = mongoose.model('ContractedPharmacy', contractedPharmacySchema);

module.exports = ContractedPharmacy;
