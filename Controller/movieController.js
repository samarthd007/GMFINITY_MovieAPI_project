const axios = require('axios')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../Errors')

const searchMovies = async (req, res) => {
    const { movie } = req.query
    const apikey = process.env.API_KEY

    try {
        const url = `https://www.omdbapi.com/?s=${movie}&apikey=${apikey}`
        const result = await axios.get(url)
        const data = result.data

        res.status(200).json(data)
    } catch (error) {
        throw new CustomError.NotFoundError(
            `movie not found with name ${movie}`
        )
    }
}

const latestMovies = async (req, res) => {
    const apikey = process.env.API_KEY
    try {
        const url = `https://www.omdbapi.com/?s=oppen&apikey=${apikey}&page=1-6`
        const result = await axios.get(url)
        const data = result.data

        res.status(200).json(data)
    } catch (error) {
        throw new CustomError.NotFoundError(
            `movie not found with name ${movie}`
        )
    }
}

module.exports = { searchMovies, latestMovies }
