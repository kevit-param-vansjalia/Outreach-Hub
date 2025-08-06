const User = require("../models/User.model");

const addUser = async (req, res, next) => {
  try {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password,
      isAdmin: req.body.isAdmin || false
    });

    await newUser.save();
    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
};

const getUser = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ message: "Users found", users });
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};

const updateUser = async (req, res, next) => {
  const id = req.params._id;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err.message });
  }
};


const deleteUser = async (req, res, next) => {
  const id = req.params._id;
  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
};

module.exports = {
  getUser,
  addUser,
  updateUser,
  deleteUser,
};
