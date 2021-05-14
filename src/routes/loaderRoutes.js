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
const auth = require('../middleware/loggerAuth');

//Create schema
const loader = require('../models/loader');

/*
 * ROUTES
 */
// @route   GET loader/index
// @desc    Serves static landing page
// @access  Public
router.get('/index', (req, res) => {
  let message = '';
  if (req.header('Referer') && req.query.data) {
    message = `User: ${req.query.data} has been registered`;
  }
  res.render('index.hbs', { title: 'Home', message: message });
});

// @route   GET loader/login
// @desc    Serves static login page
// @access  Public
router.get('/login', (req, res) => {
  res.render('login.hbs', { title: 'Login' });
});

// @route   GET loader/auth/user?username=
// @desc    Serves static user profile page
// @access  Public
router.get('/auth/user', auth, loaderControllers.getLoggedInUser(loader));

// @route   GET loader/register
// @desc    Serves static register page
// @access  Public
router.get('/register', (req, res) => {
  res.render('register.hbs', { title: 'Register' });
});

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

// // @route   POST api/auth/login
// // @desc    Auth user(student, tutor, admin) and get token
// // @access  Public
// router.post(
//   '/auth/login',
//   [
//     check('email', 'Please enter a valid email').isEmail(),
//     check('password', 'A valid password is required').exists(),
//   ],
//   userControllers.loginUser(user)
// );

// // @route   GET api/auth/
// // @desc    Auth user(student, tutor, admin)
// // @access  Public
// router.get('/auth', auth, userControllers.getLoggedInUser(user));

// // @route   POST api/register
// // @desc    Auth user(student, tutor, admin)
// // @access  Public
// router.post(
//   '/register',
//   [
//     check('email', 'Please enter a valid email').isEmail(),
//     check('password', 'A valid password is required').exists(),
//   ],
//   userControllers.createNewData(user)
// );

// // @route   GET api/testCookieResponse
// // @desc    Recieves and logs in the terminal cookies sent from client, returns JSON {message: "Cookie recieved"}
// // @access  Public
// router.get('/testCookieResponse', (req, res) => {
//   if (!req.cookies['x-auth-token'])
//     return res.status(400).json({ message: 'No cookie recieved' });

//   //else
//   console.log(req.cookies['x-auth-token']);
//   return res.status(200).json({ message: 'Cookie recieved' });
// });

module.exports = router;
