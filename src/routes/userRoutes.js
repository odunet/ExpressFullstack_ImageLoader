const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers');
const { check } = require('express-validator');
const path = require('path');

// Require middleware
const auth = require('../middleware/userRoute/userAuth');

//Create schema
const user = require('../models/user');

/*
 * ROUTES
 */

// @route   POST api/auth/login
// @desc    Auth user(student, tutor, admin) and get token
// @access  Public
router.post(
  '/auth/login',
  [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'A valid password is required').exists(),
  ],
  userControllers.loginUser(user)
);

// @route   GET api/auth/
// @desc    Auth user(student, tutor, admin)
// @access  Public
router.get('/auth', auth, userControllers.getLoggedInUser(user));

// @route   POST api/register
// @desc    Auth user(student, tutor, admin)
// @access  Public
router.post(
  '/register',
  [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'A valid password is required').exists(),
  ],
  userControllers.createNewData(user)
);

// @route   GET api/testCookieClient
// @desc    Serves Cookie Tester static page {public/indexCookieTester.html}
// @access  Public
router.get('/testCookieClient', (req, res) => {
  res.render('indexCookieTester.hbs');
});

// @route   GET api/testCookieResponse
// @desc    Recieves and logs in the terminal cookies sent from client, returns JSON {message: "Cookie recieved"}
// @access  Public
router.get('/testCookieResponse', (req, res) => {
  if (!req.cookies['x-auth-token'])
    return res.status(400).json({ message: 'No cookie recieved' });

  //else
  console.log(req.cookies['x-auth-token']);
  return res.status(200).json({ message: 'Cookie recieved' });
});

module.exports = router;
