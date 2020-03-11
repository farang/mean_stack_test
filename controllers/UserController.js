const UserHelper = require('./../model_helpers/UserHelper');
const RoleHelper = require('./../model_helpers/RoleHelper');
const ServerResponse = require('./../helpers/ServerResponse');
const ValueValidator = require('./../helpers/ValueValidator');

class UserController {
    static getAllUsers(request, response) {
        const searchQuery = request.query.search;
        const searchRole = request.query.searchRole;
        const params = {
            skip: request.query.skip,
            limit: request.query.limit,
            searchQuery: [],
            filters: []
        };

        if (searchRole) {
            params.filters.push({role: searchRole});
        }

        if (searchQuery) {
            params.searchQuery.push(searchQuery);
        }

        const targetFields = '_id firstName lastName email role';

        const helper = new UserHelper();

        helper.get(params, targetFields)
            .then(list => {
                helper.countRecords(params, targetFields)
                    .then(count => {
                        const responseData = { ...new ServerResponse(200, list).toJson(), total: count };
                        response.send(responseData);
                    }).catch(err => {
                        response.send(new ServerResponse(500, err).toJson());
                    });

            })
            .catch(err => {
                response.send(new ServerResponse(500, err).toJson());
            });
    }

    static async getCounts(request, response) {
        const searchQuery = request.query.search;
        const searchRole = request.query.searchRole;
        const params = {
            skip: request.query.skip,
            limit: request.query.limit,
            searchQuery: [],
            filters: [],
            not: {}
        };

        if (searchQuery) {
            params.searchQuery.push(searchQuery);
        }

        if (searchRole) {
            params.filters.push({ role: searchRole });
        }

        const targetFields = '_id firstName lastName email role';

        const roleHelper = new RoleHelper();
        const userHelper = new UserHelper();

        const designerRoleId = (await roleHelper.get({ filters: [{ name: 'designer' }] }, '_id'))[0].id;

        const countTotal = await userHelper.countRecords(params, targetFields);

        params.filters.push({ 'role': designerRoleId });

        const countDesigners = await userHelper.countRecords(params, targetFields);

        const responseData = { ...new ServerResponse(200, 'OK').toJson(), total: countTotal, designers: countDesigners };

        response.send(responseData);
    }

    static deleteUser(request, response) {
        new UserHelper().delete(request.body._id)
            .then(list => {
                response.send(new ServerResponse(200, list).toJson());
            })
            .catch(err => {
                response.send(new ServerResponse(500, err).toJson());
            });
    }

    static async createUser(request, response) {
        const body = request.body;
        const valueValidator = new ValueValidator();

        valueValidator.isName(body.firstName, 'First Name');
        valueValidator.required(body.firstName, 'First Name');
        valueValidator.isName(body.lastName, 'Last Name');
        valueValidator.required(body.lastName, 'Last Name');
        valueValidator.isEmail(body.email, 'Email');
        valueValidator.required(body.email, 'Email');
        valueValidator.required(body.role, 'Role');

        if (valueValidator.errors.length) {
            return response.send(new ServerResponse(500, valueValidator.errors).toJson());
        }

        const artManagerExists = await UserController.roleExists('art_manager', body.role);

        if (artManagerExists) {
            return response.send(new ServerResponse(500, 'Art Manager role is busy.'));
        }

        new UserHelper(request.body)
            .create()
            .then(data => {
                response.send(new ServerResponse(200, data).toJson());
            })
            .catch(err => {
                if (err === 11000) {
                    response.send(new ServerResponse(500, 'The email address is taken.'));
                } else {
                    response.send(new ServerResponse(500, err));
                }
            });
    }

    static async roleExists(roleId, currentRoleId) {
        const roleHelper = new RoleHelper();
        const userHelper = new UserHelper();

        const artManagerId = (await roleHelper.get({ filters: [{ name: roleId }] }, '_id'))[0].id;
        const artManagerExists = (await userHelper.get({ filters: [{ role: artManagerId }] }, '_id'))[0];

        return artManagerExists && artManagerId === currentRoleId;
    }

    static async updateUser(request, response) {
        const body = request.body;
        const valueValidator = new ValueValidator();

        valueValidator.required(body._id, 'Id');
        valueValidator.isName(body.firstName, 'First Name');
        valueValidator.isName(body.lastName, 'Last Name');
        valueValidator.isEmail(body.email, 'Email');

        if (valueValidator.errors.length) {
            return response.send(new ServerResponse(500, valueValidator.errors).toJson());
        }

        const artManagerExists = await UserController.roleExists('art_manager', body.role);

        if (artManagerExists) {
            return response.send(new ServerResponse(500, 'Art Manager role is busy.'));
        }

        new UserHelper(body)
            .update(body._id)
            .then(data => {
                response.send(new ServerResponse(200, data).toJson());
            })
            .catch(err => {
                if (err === 11000) {
                    response.send(new ServerResponse(500, 'The email address is taken.'));
                } else {
                    response.send(new ServerResponse(500, err));
                }
            });
    }
}


module.exports = UserController;