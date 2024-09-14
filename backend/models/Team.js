const mongoose = require('mongoose');

// Function to generate a unique team code
const generateTeamCode = async () => {
    const length = 8; // Length of the team code
    let code;
    let isUnique = false;

    while (!isUnique) {
        // Generate a random alphanumeric string
        code = Math.random().toString(36).substr(2, length).toUpperCase();

        // Check for uniqueness in the database
        const existingTeam = await mongoose.models.Team.findOne({ teamcode: code });
        if (!existingTeam) {
            isUnique = true;
        }
    }

    return code;
};

// Define the schema
const TeamSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    title: {
        type: String,
        required: true,
    },
    teamcode: {
        type: String,
        unique: true
    },
    members:[{
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'User',
          
        },
        Status:{
            type: Number,
            enum:[1,0],
            default:0
        }
    }]


    
}, { timestamps: true });
TeamSchema.path('members').default([]);
// Pre-save hook to set teamcode
TeamSchema.pre('save', async function (next) {
    if (!this.teamcode) { // Only generate a teamcode if it is not already set
        this.teamcode = await generateTeamCode();
    }
    next();
});

module.exports = mongoose.model('Team', TeamSchema);
