const {
    getAllUserslist,
    getOneUser,
    updateUser,
    deleteUser,
    getCurrentUser,
} = require('../Controller/userController')

const {
    authenticateUser,
    authorizePermissions,
} = require('../Middlewares/authentication')

const express = require('express')

const router = express.Router()

router
    .route('/')
    .get(authenticateUser, authorizePermissions('admin'), getAllUserslist)

router
    .route('/me')
    .get(authenticateUser, getCurrentUser)
    .delete(authenticateUser, deleteUser)

router
    .route('/:id')
    .get(authenticateUser, getOneUser)
    .patch(authenticateUser, updateUser)

module.exports = router
