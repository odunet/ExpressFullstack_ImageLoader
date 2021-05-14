const {
  findData,
  findOneData,
  findAndUpdate,
  findandDelete,
  createData,
} = require('../models/loader/loaderMethod');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// @route   GET loader/ [Not Implemented]
// @desc    Get all or slected data based on query keys
// @access  Public
const checkData = (user) => async (req, res) => {
  try {
    if (`${JSON.stringify(req.query)}` === '{}') {
      let response = await findData(user);
      res.status(200).json({
        message: `All data retrieved`,
        data: response,
      });
    } else {
      let response = await findData(user, req.query);
      res.status(200).json({
        message: `Data with parameters: ${JSON.stringify(req.query)} retrieved`,
        data: response,
      });
    }
  } catch (e) {
    res.status(404).json({
      message: `Error: Data with parameters: ${JSON.stringify(
        req.query
      )} not retrieved`,
      'Error details': e,
    });
  }
};

// @route   GET loader/:Id [Not Implemented]
// @desc    Get one data by ID
// @access  Public
const checkOneData = (user) => async (req, res) => {
  try {
    let response = await findOneData(user, parseInt(req.params.id));
    res.status(200).json({
      message: `Data with ID: ${JSON.stringify(req.params.id)} retrieved`,
      data: response,
    });
  } catch (e) {
    res.status(404).json({
      message: `Error: Data with ID: ${JSON.stringify(
        req.params.id
      )} not retrieved`,
      'Error details': e,
    });
  }
};

// @route   DELETE loader/:Id [Not Implemented]
// @desc    Delete one data by ID
// @access  Public
const deleteOneData = (user) => async (req, res) => {
  try {
    let response = await findandDelete(user, parseInt(req.params.id));
    res.status(200).json({ message: 'Data deleted', data: response });
  } catch (e) {
    res.status(404).json({
      message: `Error: Data with ID: ${req.params.id} not deleted`,
      'Error details': e,
    });
  }
};

// @route   POST api/register
// @desc    Create new data
// @access  Public
const createNewData = (user) => async (req, res) => {
  const errors = validationResult(req);
  // Evaluate if there are errors
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //Get lenght of collection
    let temp = await findData(user);
    req.body['id'] = temp.length + 1;

    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(req.body.password, salt);
    req.body.passwordHash = hash;
    req.body.base64ImageSrc = `data:${
      req.file.mimetype
    };base64,${req.file.buffer.toString('base64')}`;
    req.body.binaryImageSrc = req.file.buffer;

    //Check if user is admin
    if (req.body.isAdmin) {
      req.body.isAdmin = true;
    } else {
      req.body.isAdmin = false;
    }

    let response = await createData(user, req.body);
    // Redirect to index page
    res.status(200).redirect('/loader/index?data=' + req.body.userName);
  } catch (e) {
    res.status(404).json({
      message: `Error: Data not created`,
      'Error details': e,
    });
  }
};

// @route   PATCH api/ [Not Implemented]
// @desc    Update selected data
// @access  Public
const updateData = (user) => async (req, res) => {
  try {
    let response = await findAndUpdate(user, req.params.id, req.body);
    res.status(200).json({ message: 'Data Updated', data: response });
  } catch (e) {
    res.status(404).json({
      message: `Error: Data not updated`,
      'Error details': e,
    });
  }
};

// @route   POST loader/auth/login
// @desc    Auth user(student, tutor, admin) and get token
// @access  Public
const loginUser = (User) => async (req, res) => {
  const errors = validationResult(req);

  // Evaluate if there are errors
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userName, password } = req.body;

  //else
  try {
    let user = await User.findOne({ userName });

    if (!user) {
      return res
        .status(400)
        .json({ statusCode: 400, message: 'Invalid credentials' });
    }

    //else check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch)
      return res
        .status(400)
        .json({ statusCode: 400, message: 'Invalid credentials' });

    //else password matches, send payload and signed token
    const payload = {
      user: {
        id: user._id,
      },
    };

    jwt.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: 36000,
      },
      (err, token) => {
        if (err) throw err;

        //Set in cookie and return token as JSON
        // res.cookie('x-auth-token', token, {
        //   maxAge: 86_400_400,
        //   sameSite: 'none',
        //   httpOnly: true,
        //   secure: true,
        // });
        // //Send response
        // res.status(200).json({
        //   statusCode: 200,
        //   message: 'Logged in successfully',
        //   user: {
        //     firstName: user.firstName,
        //     lastName: user.lastName,
        //     email: user.email,
        //     userRole: user.userRole,
        //     isTutor: user.isTutor,
        //     isAdmin: user.isAdmin,
        //   },
        //   token,
        // });

        //Redirect to auth route using cookie
        //Set in cookie
        res.cookie('x-auth-token', token, {
          maxAge: 86_400_400,
          sameSite: 'none',
          // httpOnly: true,
          secure: true,
        });

        //Redirect to auth page
        res.status(200).redirect('/loader/auth/user');
      }
    );
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

// @route   GET api/auth/
// @desc    Auth user(student, tutor, admin)
// @access  Public
const getLoggedInUser = (User) => async (req, res) => {
  try {
    // Get user from DB
    const user = await User.findById(req.user.id).select('-passwordHash');

    let username = req.query.data || 'Test User';
    res.status(200).render('user.hbs', {
      title: user.userName,
      time: user.createdAt,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.base64ImageSrc,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error.');
  }
};

module.exports = {
  checkData,
  checkOneData,
  createNewData,
  updateData,
  deleteOneData,
  loginUser,
  getLoggedInUser,
};
