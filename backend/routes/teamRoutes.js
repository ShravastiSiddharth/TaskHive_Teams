const express = require('express');
const { createTeam,beAMember,getMembers, getTeams } = require('../controllers/teamController');
const {sendInvite} = require('../controllers/invitationController');
const router = express.Router();


router.post('/create',createTeam);
router.post('/request',beAMember);
router.post('/members',getMembers);
router.post('/add-member/invite',sendInvite);
router.get('/get-all-teams', getTeams);


module.exports = router;
