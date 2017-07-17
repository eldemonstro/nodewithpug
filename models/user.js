const mongoose = require('mongoose');

// User Schema
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  regDate: {
    type: Date,
    default: Date.now
  },
  smallId: {
    type: Number,
    required: true
  },
  admin: Boolean
});

const User = module.exports = mongoose.model('User', UserSchema);
