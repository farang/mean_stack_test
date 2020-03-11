const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

const UserModel = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = model('User', UserModel);
