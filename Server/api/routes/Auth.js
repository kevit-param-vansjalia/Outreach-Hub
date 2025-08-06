const express = require("express");
const userController = require('../controller/Auth.controller');

const router = express.Router();

router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);

module.exports = router;