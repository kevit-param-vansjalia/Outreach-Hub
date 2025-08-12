// middleware/verifyToken.js
const jwt = require('jsonwebtoken');
const BlacklistedToken = require('../models/BlacklistedToken');
 
module.exports = async function (req, res, next) {
  const authHeader = req.headers.authorization;
 
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
 
  const jwtToken = authHeader.replace("Bearer", "").trim();
 
  const blacklisted = await BlacklistedToken.findOne({ jwtToken });
  if (blacklisted) {
    return res.status(401).json({ message: 'Token has been invalidated. Please login again.' });
  }
 
  try {
    const decoded = jwt.verify(jwtToken, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
