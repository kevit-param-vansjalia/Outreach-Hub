const MessageTemplate = require("../models/MessageTemplate.model");

const getMessageTemplate = async (req, res, next) => {
  const messageTemplate = await messageTemplate
    .find()
    .then((res) => {
      res.status(200).json({ message: "MessageTemplate found", messageTemplate: res });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error fetching messageTemplate", error: err });
    });
};

const addMessageTemplate = async (req, res, next) => {
  const newMessageTemplate = new MessageTemplate({
    name: req.body.name,
      type: req.body.type,
      message: {
        text: req.body.text,
        imageUrl: req.body.imageUrl
      },
      workspaceId: req.body.workspaceId,
      createdBy: req.body.userId
  });
  await newMessageTemplate
    .save()
    .then((res) => {
      res
        .status(201)
        .json({
          message: "MessageTemplate added successfully",
          messageTemplate: newMessageTemplate,
        });
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

const updateMessageTemplate = async (req, res, next) => {
  const id = req.params._id;
  const updatedMessageTemplate = await MessageTemplate
    .findByIdAndUpdate(id, req.body, { new: true })
    .then((res) => {
      res
        .status(200)
        .json({ message: "MessageTemplate updated successfully", messageTemplate: res });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error updating messageTemplate", error: err });
    });
};

const deleteMessageTemplate = async (req, res, next) => {
  const id = req.params._id;
  await messageTemplate
    .findByIdAndDelete(id)
    .then((res) => {
      res.status(200).json({ message: "MessageTemplate deleted successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error deleting messageTemplate", error: err });
    });
};

module.exports = {
  getMessageTemplate,
  addMessageTemplate,
  updateMessageTemplate,
  deleteMessageTemplate,
};
