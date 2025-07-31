const User = require("../models/User.model");

const getUser = async (req, res, next) => {
  const user = await user
    .find()
    .then((res) => {
      res.status(200).json({ message: "User found", user: res });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error fetching user", error: err });
    });
};

const addUser = async (req, res, next) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    passwordHash: req.body.passwordHash,
    isAdmin: req.body.isAdmin,
    workspaces: [
      {
        workspaceId: req.body.workspace.workspaceId,
        role: req.body.workspaces.role,
      },
    ],
  });
  await newUser
    .save()
    .then((res) => {
      res.status(201).json({
        message: "User added successfully",
        user: newUser,
      });
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

const updateUser = async (req, res, next) => {
  const id = req.params._id;
  const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true })
    .then((res) => {
      res.status(200).json({ message: "User updated successfully", user: res });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error updating user", error: err });
    });
};

const deleteUser = async (req, res, next) => {
  const id = req.params._id;
  await user
    .findByIdAndDelete(id)
    .then((res) => {
      res.status(200).json({ message: "User deleted successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error deleting user", error: err });
    });
};

module.exports = {
  getUser,
  addUser,
  updateUser,
  deleteUser,
};
