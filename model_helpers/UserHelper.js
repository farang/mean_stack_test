const UserModel = require('./../models/UserModel');
const CRUD_Base = require('./classes/model_crud_base');

class UserHelper extends CRUD_Base {
    constructor(data) {
        super(data);
        this.model = UserModel;
    }
}

module.exports = UserHelper;