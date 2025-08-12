const Campaign = require("../models/Campaign.model");

const getAllCampaign = async (req, res, next) => { //modify it to get all campaigns for perticular workspace
  const campaign = await Campaign
    .find()
    .then((result) => {
      res.status(200).json({ message: "Campaign found", campaign: result });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error fetching campaign", error: err });
    });
};

const getMyCampaign = async(req,res)=> {
    try {
    const {id} = req.user;
 
    const campaigns = await Campaign.find({
    
      createdBy: id
    })
    .sort({ createdAt: -1 });
 
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching campaigns', error: error.message });
  }
};
 

const addCampaign = async (req, res, next) => {
  const newCampaign = new Campaign({
    name: req.body.name,
    description: req.body.name,
    status: req.body.status,
    selectedTags: req.body.selectedTags,
    message: req.body.message,
    workspaceId: req.body.workspaceId,
    createdBy: req.user.id
  });
  await newCampaign
    .save()
    .then((result) => {
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
  const id = req.params.id;
  const updatedCampaign = await Campaign
    .findByIdAndUpdate(id, req.body, { new: true })
    .then((result) => {
      res
        .status(200)
        .json({ message: "Campaign updated successfully", campaign: result });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error updating campaign", error: err });
    });
};

const deleteCampaign = async (req, res, next) => {
  const id = req.params.id;
  await Campaign
    .findByIdAndDelete(id)
    .then((result) => {
      res.status(200).json({ message: "Campaign deleted successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error deleting campaign", error: err });
    });
};

module.exports = {
  getAllCampaign,
  getMyCampaign,
  addCampaign,
  updateCampaign,
  deleteCampaign,
};
