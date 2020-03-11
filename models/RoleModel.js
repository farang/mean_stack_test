const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

const RoleModel = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    rights: {
        type: Array
    }
});

module.exports = model('Role', RoleModel);
