const express= require('express');
const router = express.Router();
const {CodeExecute} = require('../controllers/codeExecute.controller');
router.post('/execute', CodeExecute);
module.exports = router;