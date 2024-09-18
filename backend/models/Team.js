const mongoose = require('mongoose');

const generateTeamCode = async () => {
    const length = 8; 
    let code;
    let isUnique = false;

    while (!isUnique) {
        
        code = Math.random().toString(36).substr(2, length).toUpperCase();

       
        const existingTeam = await mongoose.models.Team.findOne({ teamcode: code });
        if (!existingTeam) {
            isUnique = true;
        }
    }

    return code;
};


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
            default:1
        },
        Roles:{
            type: Number,
            enum:[1,2,3,4],
            default: 2
        }
    }]


    
}, { timestamps: true });
TeamSchema.path('members').default([]);

TeamSchema.pre('save', async function (next) {
    
    if (!this.teamcode) { 
        this.teamcode = await generateTeamCode();
    }
    next();
});

module.exports = mongoose.model('Team', TeamSchema);
