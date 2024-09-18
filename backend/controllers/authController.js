const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Team = require('../models/Team');
require('dotenv').config();

const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const newUser = new User({ name, email, password });
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        await newUser.save();

        const payload = { id: newUser.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = { id: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
const getAuthUser = (req, res) => {
    res.json({ user: req.user });
};


const signupWithToken = async (req, res) => {

    const token = req.header('Authorization');
    const { name, email, password } = req.body;

    if (!email || !name || !password) {
        return res.status(401).json({ msg: "Required parameters for registration are not provided" });
    }

    if (!token) {
        return res.status(401).json({ msg: "No Token Provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const TeamId = decoded.teamId;
        const tokenTeamId = await Team.findById(TeamId);

        if (!tokenTeamId) {
            return res.status(401).json({ msg: "Team ID is not Valid for Registration" });
        }

        if (email != decoded.email) {
            return res.status(401).json({ msg: "Invitation Email does not match with register email" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const newUser = new User({ name, email, password, TeamId });
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        await newUser.save();

        const newUserId = newUser._id;

        tokenTeamId.members.push(newUserId);
        await tokenTeamId.save();

        const payload = { id: newUser.id };
        const newToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' });

        return res.status(200).json({ newToken });

    }
    catch (error) {

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ valid: false, message: 'Token expired' });
        } else {
            return res.status(500).json({ msg: "Internal Server Error" });
        }
    }

}
module.exports = { register, login, getAuthUser, signupWithToken };
