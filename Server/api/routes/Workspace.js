const express = require("express");
const Workspace = require("./models/Workspace");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const workspaceController = require('../controller/Workspace.controller');

const app = express();

app.post('/workspace', workspaceController.addWorkspace);
app.delete('/workspace', workspaceController.deleteWorkspace);
app.put('/workspace', workspaceController.updateWorkspace);
app.get('/workspace', workspaceController.getWorkspace);
