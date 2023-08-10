const {
    createplayList,
    deletePlayList,
    getMyPlaylist,
    addToplayList,
    getMyPublicPlayList,
    findTheplayList,
    getAllpublicPlaylist,
} = require('../Controller/playlistController')

const express = require('express')
const { authenticateUser } = require('../Middlewares/authentication')
const router = express.Router()

router
    .route('/')
    .get(authenticateUser, getMyPlaylist)
    .post(authenticateUser, createplayList)
    .delete(authenticateUser, deletePlayList)

router.route('/mypublic').get(authenticateUser, getMyPublicPlayList)

router.route('/public').get(authenticateUser, getAllpublicPlaylist)

router.route('/add').post(authenticateUser, addToplayList)

router.route('/find').get(authenticateUser, findTheplayList)

module.exports = router
