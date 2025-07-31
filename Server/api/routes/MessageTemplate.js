const express = require("express");
const User = require("./models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const messageTemplateController = require('../controller/MessageTemplate.controller');

const app = express();

app.post('/messageTemplate', messageTemplateController.addMessageTemplate);
app.delete('/messageTemplate', messageTemplateController.deleteMessageTemplate);
app.put('/messageTemplate', messageTemplateController.updateMessageTemplate);
app.get('/messageTemplate', messageTemplateController.getMessageTemplate);

