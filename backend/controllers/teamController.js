const Task = require('../models/Task');
const Team = require('../models/Team')



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

    const { teamCode } = req.body;
    const userId = req.user.id;

    try {
        const team = await Team.findOne({ user: userId, teamcode: teamCode });
        if (!team) {
            return res.status(404).json({ status: 404, msg: 'Team with this creator and Code not found' });
        }

        return res.status(200).json({status:200, members: team.members});
    }
    catch (error) {
        console.error('Error retrieving team members:', error.message);
        return res.status(500).json({ status: 500, msg: 'Internal Server Error' });
    }

};

module.exports = { createTeam, beAMember, getMembers };