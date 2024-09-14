// server/routes/taskRoutes.js
const express = require('express');
const { createTeam,beAMember,getMembers } = require('../controllers/teamController');

const router = express.Router();


router.post('/create',createTeam);
router.post('/request',beAMember);
router.post('/members',getMembers);

module.exports = router;
