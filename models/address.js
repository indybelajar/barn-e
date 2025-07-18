// models/address.js
import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  pincode: {
    type: String,
    required: true,
    trim: true
  },
  area: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index untuk optimasi query
addressSchema.index({ userId: 1, isDefault: 1 });

const Address = mongoose.models.Address || mongoose.model('Address', addressSchema);

export default Address;