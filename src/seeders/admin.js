// Check if there is an admin account
// If there is non, create an admin account
const Loader = require('../models/loader');
const { findData, createData } = require('../models/loader/loaderMethod');
const bcrypt = require('bcryptjs');

exports.seedAdmin = async () => {
  //Check if there is an admin account
  try {
    let data = await findData(Loader, { isAdmin: true });

    if (data.length != 0) {
      console.log('Seeder: Admin account already exists');
      return 'Admin account already exists';
    }

    //else
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash('starman', salt);
    let entry = {
      id: data.length + 1,
      firstName: 'Ayokunle',
      lastName: 'Odutayo',
      userName: 'odunet2000',
      passwordHash: hash,
      isAdmin: true,
      base64ImageSrc: ' ',
      binaryImageSrc: ' ',
    };

    await createData(Loader, entry);
    console.log('Seeder: Admin account created');
    return 'Admin account created';
  } catch (err) {
    throw err;
  }
};
