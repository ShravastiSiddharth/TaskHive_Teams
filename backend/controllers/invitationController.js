const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Team = require('../models/Team');
require('dotenv').config();




const sendInvite = async (req, res) => {
    const { email, teamId } = req.body;

    if (!email || !teamId) {

        return res.status(500).json({ msg: "email or teamId not provided" });
    }

    const validID = await Team.findById(teamId);
    if (!validID) {
        return res.status(500).json({ msg: "Team Id is incorrect" });
    }


    try {

        const secret = process.env.JWT_SECRET;
        const expiration = '15m';


        const token = jwt.sign({ email, teamId }, secret, { expiresIn: expiration });

        const inviteLink = `https://yourapp.com/signup?token=${token}`;


        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'codeclout.in@gmail.com',
                pass: process.env.MY_APP_PASS
            }
        });

        const mailOptions = {
            from: 'codeclout.in@gmail.com',
            to: email,
            subject: 'You are Invited to Join a Team!',
            text: `Click this link to join the team: ${inviteLink}`
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ msg: "success", token: token });
    }
    catch (error) {
        return res.status(500).json({ error });
    }
};

module.exports = { sendInvite };