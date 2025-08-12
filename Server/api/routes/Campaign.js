const express = require("express");
const campaignController = require('../controller/Campaign.controller');
const verifyToken = require('../Middleware/verifyToken'); // Assuming you have a middleware for token verification

const router = express.Router();
router.use(verifyToken); 

router.post('/create', campaignController.addCampaign);
router.delete('/delete/:id', campaignController.deleteCampaign);
router.put('/update/:id', campaignController.updateCampaign);
router.get('/get/all', campaignController.getAllCampaign);
router.get('/get', campaignController.getMyCampaign);

module.exports = router;