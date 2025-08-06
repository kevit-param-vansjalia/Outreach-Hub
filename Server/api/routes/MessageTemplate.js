const express = require("express");
const messageTemplateController = require('../controller/MessageTemplate.controller');
const verifyToken = require('../Middleware/verifyToken');

const router = express.Router();
router.use(verifyToken);

router.post('/create', messageTemplateController.addMessageTemplate);
router.delete('/delete/:id', messageTemplateController.deleteMessageTemplate);
router.put('/update/:id', messageTemplateController.updateMessageTemplate);
router.get('/get', messageTemplateController.getMessageTemplate);

module.exports = router;