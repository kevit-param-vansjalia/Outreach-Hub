const Workspace = require("../models/Workspace.model");

const getWorkspace = async (req, res, next) => {
  const workspace = await workspace
    .find()
    .then((res) => {
      res.status(200).json({ message: "Workspace found", workspace: res });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error fetching workspace", error: err });
    });
};

const addWorkspace = async (req, res, next) => {
  const newWorkspace = new Workspace({
    name: req.body.name,
    createdBy: req.body.userId,
  });
  await newWorkspace
    .save()
    .then((res) => {
      res
        .status(201)
        .json({
          message: "Workspace added successfully",
          workspace: newWorkspace,
        });
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

const updateWorkspace = async (req, res, next) => {
  const id = req.params._id;
  const updatedWorkspace = await Workspace
    .findByIdAndUpdate(id, req.body, { new: true })
    .then((res) => {
      res
        .status(200)
        .json({ message: "Workspace updated successfully", workspace: res });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error updating workspace", error: err });
    });
};

const deleteWorkspace = async (req, res, next) => {
  const id = req.params._id;
  await workspace
    .findByIdAndDelete(id)
    .then((res) => {
      res.status(200).json({ message: "Workspace deleted successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error deleting workspace", error: err });
    });
};

module.exports = {
  getWorkspace,
  addWorkspace,
  updateWorkspace,
  deleteWorkspace,
};
