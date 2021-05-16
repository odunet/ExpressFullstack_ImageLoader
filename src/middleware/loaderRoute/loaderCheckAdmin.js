// Checks to see if there is a token in the header
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  //Send in cookie
  const token = req.cookies['x-auth-token'] || req.header('x-auth-token');

  // check if token does not exist
  if (!token)
    return res
      .status(401)
      .json({ statusCode: 401, message: 'No token, authorization denied' });

  // else
  try {
    const decoded = jwt.verify(token, process.env.SECRET);

    // Check if user is not Admin
    if (decoded.user.isAdmin === false)
      return res.status(401).json({
        statusCode: 401,
        message: 'Usr not admin, authorization denied',
      });

    // assign user to request object
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ statusCode: 401, message: 'Token is not valid' });
  }
};
