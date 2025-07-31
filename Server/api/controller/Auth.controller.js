const User = require("./models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const loginUser = async (req, res, next) => {
  console.log(data);
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

module.exports = { loginUser };  