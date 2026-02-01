const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 1. Get the token from the header
  const token = req.header('x-auth-token');

  // 2. Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // 3. Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Success! Add the user from the payload to the request object
    req.user = decoded.user;
    next(); // Move to the actual route handler
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};