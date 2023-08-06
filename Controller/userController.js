const CustomError = require('../Errors')
const User = require('../Models/User')
const { StatusCodes } = require('http-status-codes')
const {
    createTokenUser,
    createJWT,
    isTokenValid,
    attachCookiesToResponse,
} = require('../utils')
const getAllUserslist = async (req, res) => {
    const user = await User.find({ role: 'user' }).select('-password')
    if (!user) {
        throw new CustomError.NotFoundError('Users not found')
    }
    res.status(StatusCodes.OK).json({ user })
}

const getOneUser = async (req, res) => {
    const { id: userId } = req.params
    const user = await User.findOne({ _id: userId }).select('-password')

    if (!user) {
        throw new CustomError.NotFoundError(`No User found with id ${userId}`)
    }
    res.status(201).json(user)
}

const deleteUser = async (req, res) => {
    const userId = req.user.userId
    const user = await User.findByIdAndDelete({ _id: userId })
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    })
    res.status(200).json({ msg: ` you can exit this route ` })
}
const updateUser = async (req, res) => {
    const { email, name } = req.body
    if (!email || !name) {
        throw new CustomError.BadRequestError('Please provide all values')
    }
    const user = await User.findOneAndUpdate(
        { _id: req.user.userId },
        { email: email, name: name }
    )

    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({ res, user: tokenUser })
    res.status(StatusCodes.CREATED).json({ user: tokenUser })
}

const getCurrentUser = async (req, res) => {
    res.status(200).json({ user: req.user })
}

module.exports = {
    getAllUserslist,
    getOneUser,
    updateUser,
    deleteUser,
    getCurrentUser,
}
