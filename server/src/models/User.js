const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  deleted: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
