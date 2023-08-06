const User = require('../Models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../Errors')
const {
    createTokenUser,
    createJWT,
    isTokenValid,
    attachCookiesToResponse,
} = require('../utils')

const register = async (req, res) => {
    const { email, name, password, reEnter } = req.body
    if (!email || !name || !password) {
        throw new CustomError.BadRequestError(`Enter required credentials`)
    }

    if (password !== reEnter) {
        throw new CustomError.BadRequestError(`passwaord did'nt match`)
    }

    const ifExist = await User.findOne({ email })
    if (ifExist) {
        throw new CustomError.ConflictError(
            `User Already exist ${email} please login`
        )
    }
    // first registered user is an admin
    const isFirstAccount = (await User.countDocuments({})) === 0
    const role = isFirstAccount ? 'admin' : 'user'
    const user = await User.create({ email, name, password, role })

    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({ res, user: tokenUser })

    res.status(StatusCodes.CREATED).json({ user: tokenUser })
}

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new CustomError.BadRequestError('Invalid credentials')
    }
    const user = await User.findOne({ email })

    if (!user) {
        throw new CustomError.NotFoundError(
            `user not found with mail id : ${email}`
        )
    }

    const isPasswordCorrect = await user.comparePassword(password)

    if (!isPasswordCorrect) {
        throw new CustomError.UnAuthenticatedError('Invalid Credentials')
    }

    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({ res, user: tokenUser })

    res.status(StatusCodes.OK).json({ user: tokenUser })
}

const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    })
    res.status(StatusCodes.OK).json({ msg: 'user logged out!' })
}

module.exports = {
    register,
    login,
    logout,
}
