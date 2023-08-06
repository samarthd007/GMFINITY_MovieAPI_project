const express = require('express')
const { searchMovies, latestMovies } = require('../Controller/movieController')
const { authenticateUser } = require('../Middlewares/authentication')
const router = express.Router()

router.route('/search').get(authenticateUser, searchMovies)

router.route('/latest').get(authenticateUser, latestMovies)

module.exports = router
