const express = require('express');
const router = express.Router();
const UserController = require('./../controllers/UserController');
const RolesController = require('./../controllers/RolesController');

router.get('/users', UserController.getAllUsers);

router.post('/users', UserController.createUser);

router.put('/users', UserController.updateUser);

router.delete('/users', UserController.deleteUser);

router.get('/roles', RolesController.getAllRoles);

router.get('/usersCount', UserController.getCounts);

module.exports = router;
