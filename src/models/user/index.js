const mongoose = require('mongoose');

//Create newSchema (async)
const userSchema = new mongoose.Schema(
  {
    id: Number,
    firstName: {
      type: String,
      required: true,
      minLength: 2,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
    },
    userRole: {
      type: String,
      enum: ['admin', 'tutor', 'student', 'not assigned'],
      default: 'not assigned',
    },
    isTutor: {
      type: Boolean,
      default: 0,
    },
    isAdmin: {
      type: Boolean,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model('userModel', userSchema);

module.exports = userModel;
