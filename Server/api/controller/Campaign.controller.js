const Campaign = require("../models/Campaign.model");

const getCampaign = async (req, res, next) => {
  const campaign = await campaign
    .find()
    .then((res) => {
      res.status(200).json({ message: "Campaign found", campaign: res });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error fetching campaign", error: err });
    });
};

const addCampaign = async (req, res, next) => {
  const newCampaign = new Campaign({
    name: req.body.name,
    description: req.body.name,
    status: req.body.status,
    selectedTags: req.body.selectedTags,
    templateId: req.body.templateId,
    workspaceId: req.body.workspaceId,
    createdBy: req.body.userId,
      messages: [
        {
          contactId: req.body.messages.contactId,
          messageContent: req.body.messages.messageContent,
          sentAt: req.body.messages.sentAt,
        }
      ]
  });
  await newCampaign
    .save()
    .then((res) => {
      res
        .status(201)
        .json({
          message: "Campaign added successfully",
          campaign: newCampaign,
        });
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

const updateCampaign = async (req, res, next) => {
  const id = req.params._id;
  const updatedCampaign = await Campaign
    .findByIdAndUpdate(id, req.body, { new: true })
    .then((res) => {
      res
        .status(200)
        .json({ message: "Campaign updated successfully", campaign: res });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error updating campaign", error: err });
    });
};

const deleteCampaign = async (req, res, next) => {
  const id = req.params._id;
  await campaign
    .findByIdAndDelete(id)
    .then((res) => {
      res.status(200).json({ message: "Campaign deleted successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error deleting campaign", error: err });
    });
};

module.exports = {
  getCampaign,
  addCampaign,
  updateCampaign,
  deleteCampaign,
};
