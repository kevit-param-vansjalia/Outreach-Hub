const express = require("express");
const User = require("./models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const contactController = require('../controller/Contact.controller');

const app = express();

app.post('/contact', contactController.addContact);
app.delete('/contact', contactController.deleteContact);
app.put('/contact', contactController.updateContact);
app.get('/contact', contactController.getContact);
