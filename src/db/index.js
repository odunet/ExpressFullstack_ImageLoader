const mongoose = require('mongoose');
require('dotenv').config();
const { DATABASE_URI } = process.env;

//Create connection (async)
module.exports = async () => {
  try {
    await mongoose.connect(DATABASE_URI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log('MongoDB connected');
  } catch (err) {
    throw err;
  }
};
