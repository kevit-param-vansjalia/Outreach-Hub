const express = require("express");
const User = require("./models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const campaignController = require('../controller/Campaign.controller');

const app = express();

app.post('/campaign', campaignController.addCampaign);
app.delete('/campaign', campaignController.deleteCampaign);
app.put('/campaign', campaignController.updateCampaign);
app.get('/campaign', campaignController.getCampaign);
