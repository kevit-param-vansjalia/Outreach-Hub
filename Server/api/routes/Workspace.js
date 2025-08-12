const express = require("express");
const workspaceController = require('../controller/Workspace.controller');
const middleware = require("../Middleware/verifyToken");


const router = express.Router();
router.use(middleware);

router.post('/create', workspaceController.addWorkspace);
router.delete('/delete/:_id', workspaceController.deleteWorkspace);
router.put('/update/:_id', workspaceController.updateWorkspace);
router.get('/get', workspaceController.getWorkspace);

module.exports = router;