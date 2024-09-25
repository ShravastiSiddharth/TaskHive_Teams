const { default: mongoose } = require('mongoose');
const Task = require('../models/Task');
const Team = require('../models/Team');
const User = require('../models/User');



const createTeam = async (req, res) => {
    const { title } = req.body;

    try {

        const newTeam = new Team({
            user: req.user.id,
            title,

        });


        const team = await newTeam.save();


        res.json(team);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
};



const beAMember = async (req, res) => {
    const { teamCode } = req.body;

    try {

        const team = await Team.findOne({ teamcode: teamCode });

        if (!team) {
            return res.status(404).json({ status: 404, msg: 'Team Code is Wrong' });
        }


        const existingMember = team.members.find(member => member.userId.toString() === req.user.id.toString());

        if (existingMember) {
            return res.status(400).json({ status: 400, msg: 'User is already a member' });
        }


        team.members.push({
            userId: req.user.id,
            status: 0
        });


        await team.save();


        return res.status(200).json({ status: 200, msg: 'Request sent successfully' });
    } catch (error) {
        console.error('Error updating team members:', error.message);
        return res.status(500).json({ status: 500, msg: 'Internal Server Error' });
    }
};

const getMembers = async (req, res) => {

    const { teamId } = req.body;
    const userId = req.user.id;

    try {
        const team = await Team.findOne({ user: userId, _id: teamId }).populate('members.userId','name');
        if (!team) {
            return res.status(404).json({ status: 404, msg: 'Team with this creator and Code not found' });
        }

        const membersWithNames = team.members.map(member => ({
            ...member.toObject(), 
            userName: member.userId ? member.userId.name : null 
        }));

        return res.status(200).json({status:200, members: membersWithNames});
    }
    catch (error) {
        console.error('Error retrieving team members:', error.message);
        return res.status(500).json({ status: 500, msg: 'Internal Server Error' });
    }

};

const getTeams = async (req,res) => {

    try{
    const user = await Team.find({user: req.user.id});
    const teams = user.map(team=>({
        id: team._id,
        title: team.title

    })) 

    return res.status(200).json(teams);
}
catch(error){
    return res.status(500).json("Internal error", error);
}

}
module.exports = { createTeam, beAMember, getMembers, getTeams };