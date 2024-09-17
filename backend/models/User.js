const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    teamcode:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Team'
    }
});

module.exports = mongoose.model('User', UserSchema);
