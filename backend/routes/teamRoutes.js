// server/routes/taskRoutes.js
const express = require('express');
const { createTeam,beAMember,getMembers } = require('../controllers/teamController');
const {sendInvite} = require('../controllers/invitationController');
const router = express.Router();


router.post('/create',createTeam);
router.post('/request',beAMember);
router.post('/members',getMembers);
router.post('/add-member/invite',sendInvite);


module.exports = router;
