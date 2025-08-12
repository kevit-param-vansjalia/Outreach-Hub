const express = require("express");
const contactController = require('../controller/Contact.controller');
const verifyToken = require('../Middleware/verifyToken');

const router = express.Router();
router.use(verifyToken);

router.post('/create', contactController.addContact);
router.delete('/delete/:id', contactController.deleteContact);
router.put('/update/:id', contactController.updateContact);
router.get('/get', contactController.getContact);

module.exports = router;