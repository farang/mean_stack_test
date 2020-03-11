const RoleHelper = require('./../model_helpers/RoleHelper');
const ServerResponse = require('./../helpers/ServerResponse');

class RolesController {
    static getAllRoles(request, response) {
        new RoleHelper().get(null, 'name title')
            .then(list => {
                response.send(new ServerResponse(200, list).toJson());
            })
            .catch(err => {
                response.send(new ServerResponse(500, err).toJson());
            });
    }
}


module.exports = RolesController;