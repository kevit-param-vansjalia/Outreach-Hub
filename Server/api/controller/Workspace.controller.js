const Workspace = require("../models/Workspace.model");
const middleware = require("../Middleware/verifyToken");

const getWorkspace = async (req, res, next) => {
  try {
    const workspaces = await Workspace.find();
    res.status(200).json({
      message: "Workspaces found",
      workspaces,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching workspaces",
      error: err.message,
    });
  }
};

const addWorkspace = async (req, res, next) => {
  try {
    const newWorkspace = new Workspace({
      name: req.body.name,
      createdBy: req.user.id
    });

    const savedWorkspace = await newWorkspace.save();

    res.status(201).json({
      message: "Workspace added successfully",
      workspace: savedWorkspace,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error creating workspace",
      error: err.message,
    });
  }
};

const updateWorkspace = async (req, res, next) => {
  const id = req.params._id;

  try {
    const updatedWorkspace = await Workspace.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedWorkspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.status(200).json({
      message: "Workspace updated successfully",
      workspace: updatedWorkspace,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating workspace",
      error: err.message,
    });
  }
};

const deleteWorkspace = async (req, res, next) => {
  const id = req.params._id;

  try {
    const deletedWorkspace = await Workspace.findByIdAndDelete(id);

    if (!deletedWorkspace) { 
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.status(200).json({ message: "Workspace deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting workspace",
      error: err.message,
    });
  }
};

module.exports = {
  getWorkspace,
  addWorkspace,
  updateWorkspace,
  deleteWorkspace,
};
