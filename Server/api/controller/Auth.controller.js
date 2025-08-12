const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const BlacklistedToken = require("../models/BlacklistedToken");


const loginUser = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(401).json({ message: "Invalid Email or Password" });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid Email or Password" });
  }
  const token = jwt.sign(
    { email: user.email, id: user._id },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );
  res.status(200).json({ token: token, message: "Login Success" });
  console.log(token);
  console.log(user);
};

const logoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token
 
    if (!token) {
      return res.status(400).json({ message: 'Token missing' });
    }
 
    const decoded = jwt.decode(token);
 
    if (!decoded || !decoded.exp) {
      return res.status(400).json({ message: 'Invalid token' });
    }
 
    const expiry = new Date(decoded.exp * 1000);
 
    await BlacklistedToken.create({ token, expiresAt: expiry });
 
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { loginUser, logoutUser };  