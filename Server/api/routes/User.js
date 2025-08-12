const express = require("express");
const userController = require('../controller/User.controller');
const router = express.Router();

router.post('/create', userController.addUser);
router.delete('/delete/:_id', userController.deleteUser);
router.put('/update/:_id', userController.updateUser);
router.get('/get', userController.getUser);

module.exports = router;