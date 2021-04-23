const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: {
    type: Number,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    max: 1000,
    min: 8
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
