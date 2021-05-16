const express = require('express');
const router = express.Router();
const loaderControllers = require('../controllers/loaderControllers');
const { check } = require('express-validator');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

//Set storage in local disc
// const storage = multer.diskStorage({
//   destination: './public/uploads/',
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + '-' + Date.now() + path.extname(file.originalname)
//     );
//   },
// });
// const upload = multer({ storage: storage });

//Set storage in buffer
const upload = multer({ storage: multer.memoryStorage() });

// Require middleware
const auth = require('../middleware/loaderRoute/loaderAuth');
const adminAuth = require('../middleware/loaderRoute/loaderCheckAdmin');

//Create schema
const loader = require('../models/loader');

/*
 * ROUTES
 */
// @route   GET loader/index
// @desc    Serves static landing page
// @access  Public
router.get('/index', loaderControllers.indexStatic);

// @route   GET loader/login
// @desc    Serves static login page
// @access  Public
router.get('/login', loaderControllers.loginStatic);

// @route   GET loader/auth/user
// @desc    Serves static user profile page
// @access  Public
router.get('/auth/user', auth, loaderControllers.getLoggedInUser(loader));

// @route   GET loader/register
// @desc    Serves static register page
// @access  Public
router.get('/register', loaderControllers.registerStatic);

// @route   GET loader/auth/userList
// @desc    Serves static list of users
// @access  Public
router.get('/auth/userList', adminAuth, loaderControllers.checkData(loader));

// // @route   POST loader/auth/register
// // @desc    Register user(user, admin) and redirect to homepage
// // @access  Public
router.post(
  '/auth/register',
  upload.single('photo'),
  [
    check('userName', 'Please enter a valid username').exists(),
    check('password', 'A valid password is required').exists(),
  ],
  loaderControllers.createNewData(loader)
);

// @route   POST loader/auth/login
// @desc    Register user(user, admin) and redirect to homepage
// @access  Public
router.post(
  '/auth/login',
  [
    check('userName', 'Please enter a valid username').exists(),
    check('password', 'A valid password is required').exists(),
  ],
  loaderControllers.loginUser(loader)
);

module.exports = router;
