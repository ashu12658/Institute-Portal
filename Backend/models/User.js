const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    contact: { type: String, required: true },
    instituteName: { type: String, default: 'Admin Institute' },
    role: { type: String, enum: ['tpo', 'admin'], required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
