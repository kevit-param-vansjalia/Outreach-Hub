const MessageTemplate = require("../models/MessageTemplate.model");

const getMessageTemplate = async (req, res, next) => {
  try {
    const templates = await MessageTemplate.find();
    res.status(200).json({
      message: "Message templates found",
      messageTemplates: templates,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching message templates",
      error: err.message,
    });
  }
};

const addMessageTemplate = async (req, res, next) => {
  console.log(req.user);
  const newMessageTemplate = new MessageTemplate({
    name: req.body.name,
      type: req.body.type,
      message: {
        text: req.body.message.text,
        imageUrl: req.body.message.imageUrl
      },
      workspaceId: req.body.workspaceId,
      createdBy: req.user.id
  });
  await newMessageTemplate
    .save()
    .then((result) => {
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
  const id = req.params.id;

  try {
    const updatedMessageTemplate = await MessageTemplate.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedMessageTemplate) {
      return res.status(404).json({ message: "MessageTemplate not found" });
    }

    res.status(200).json({
      message: "MessageTemplate updated successfully",
      updatedMessageTemplate,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating messageTemplate",
      error: err.message,
    });
  }
};


const deleteMessageTemplate = async (req, res, next) => {
  const id = req.params.id;
  await MessageTemplate
    .findByIdAndDelete(id)
    .then((result) => {
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
