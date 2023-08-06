const CustomError = require('../Errors')
const { StatusCodes } = require('http-status-codes')
const axios = require('axios')
const Playlist = require('../Models/Playlist')

const createplayList = async (req, res) => {
    const { imdbIDreq, name, type } = req.query
    const apikey = process.env.API_KEY
    const user = req.user.userId

    try {
        const url = `https://www.omdbapi.com/?i=${imdbIDreq}&apikey=${apikey}`
        const result = await axios.get(url)
        const data = result.data
        const image = data.Poster
        const year = data.Year
        const title = data.Title
        const language = data.Language
        const imdbID = data.imdbID

        if (!data) {
            throw new CustomError.BadRequestError('something went wrong')
        }

        const playlist = await Playlist.findOne({ name: name })

        if (playlist) {
            throw new CustomError.ConflictError(
                `play already exist with name ${name}`
            )
        }

        const create = await Playlist.create({
            user,
            image,
            imdbID,
            type,
            language,
            title,
            year,
            name,
        })

        res.status(201).json(create)
    } catch (error) {
        throw new CustomError.BadRequestError(`Something went wrong...${error}`)
    }
}

const getMyPlaylist = async (req, res) => {
    const user = req.user.userId

    const playlist = await Playlist.find({ user: user, type: 'private' })
    if (!playlist) {
        throw new CustomError.NotFoundError(`No playlist Found `)
    }

    res.status(200).json(playlist)
}

const getMyPublicPlayList = async (req, res) => {
    const playlist = await Playlist.find({ type: 'public' })

    if (!playlist) {
        throw new CustomError.NotFoundError(`No public playlist present`)
    }

    res.status(200).json(playlist)
}

const addToplayList = async (req, res) => {
    const { imdbIDreq, name, type } = req.query
    const apikey = process.env.API_KEY
    const user = req.user.userId

    try {
        const url = `https://www.omdbapi.com/?i=${imdbIDreq}&apikey=${apikey}`
        const result = await axios.get(url)

        const data = result.data
        const image = data.Poster
        const year = data.Year
        const title = data.Title
        const language = data.Language
        const imdbID = data.imdbID

        if (!data) {
            throw new CustomError.BadRequestError('something went wrong')
        }
        const playlist = await Playlist.findOne({ name: name })

        if (!playlist) {
            throw new CustomError.NotFoundError(
                `no playlist found with name ${name}`
            )
        }

        if (playlist.imdbID === imdbID) {
            throw new CustomError.ConflictError(
                `movie already exist in playlist ${name}`
            )
        }

        const create = await Playlist.create({
            user,
            image,
            imdbID,
            type,
            language,
            title,
            year,
            name,
        })

        res.status(201).json(create)
    } catch (error) {
        throw new CustomError.BadRequestError(
            'Something went wrong...' + String(error)
        )
    }
}

const deletePlayList = async (req, res) => {
    const user = req.user.userId
    const { imdbID, name } = req.query

    const playlist = await Playlist.findOneAndDelete({
        user: user,
        imdbID: imdbID,
        name: name,
    })

    if (!playlist) {
        throw new CustomError.NotFoundError(
            `no playlist found with name ${imdbID}`
        )
    }

    res.status(200).json({ msg: 'sucess..' })
}

const findTheplayList = async (req, res) => {
    const { name } = req.query
    const playlist = await Playlist.find({ name: name, type: 'public' })

    if (!playlist) {
        throw new CustomError.NotFoundError(
            `no playlist found with name ${name}`
        )
    }

    res.status(200).json(playlist)
}
module.exports = {
    createplayList,
    getMyPlaylist,
    deletePlayList,
    addToplayList,
    getMyPublicPlayList,
    findTheplayList,
}
