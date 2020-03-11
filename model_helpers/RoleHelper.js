const RoleModel = require('./../models/RoleModel');
const DEFAULT_ROLES = require('./../constants/roles').DEFAULT_ROLES;
const CRUD_Base = require('./classes/model_crud_base');

class RoleHelper extends CRUD_Base {
    constructor(data) {
        super(data);
        this.model = RoleModel;
    }

    static async writeDefaults() {
        const rolesLength = (await RoleModel.find()).length;

        if (!rolesLength) {
            RoleModel.insertMany(DEFAULT_ROLES.map(roleName => ({
                name: roleName.toLowerCase().replace(/ /g, '_'),
                title: roleName
            })), { upsert: true });
        }
    }

}

module.exports = RoleHelper;
