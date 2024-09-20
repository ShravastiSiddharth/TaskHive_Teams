// server/routes/authRoutes.js
const express = require('express');
const { register, login, signupWithToken,getAuthUser } = require('../controllers/authController');
const { ensureAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', ensureAuth, getAuthUser);
router.post('/register/team', signupWithToken);

module.exports = router;
