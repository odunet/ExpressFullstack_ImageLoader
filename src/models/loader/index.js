const mongoose = require('mongoose');

//Create newSchema (async)
const loaderSchema = new mongoose.Schema(
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
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    binaryImageSrc: {
      type: Buffer,
      required: true,
    },
    base64ImageSrc: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const loaderModel = mongoose.model('loaderModel', loaderSchema);

module.exports = loaderModel;
