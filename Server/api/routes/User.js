const express = require("express");
const User = require("./models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userController = require('../controller/Auth.controller');

const app = express();


app.post('/user', userController.addUser);
app.delete('/user', userController.deleteUser);
app.put('/user', userController.updateUser);
app.get('/user', userController.getUser);
