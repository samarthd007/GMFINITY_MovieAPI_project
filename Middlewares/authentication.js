const CustomError = require('../Errors')
const { isTokenValid } = require('../utils')

const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token

    if (!token) {
        throw new CustomError.UnAuthenticatedError('Authentication invalid')
    }

    try {
        const { name, userId, role } = isTokenValid({ token })
        req.user = { name, userId, role }
        console.log(req.user)
        next()
    } catch (error) {
        throw new CustomError.UnAuthenticatedError('Authentication invalid')
    }
}

const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomError.UnAuthenticatedError(
                'Unauthorized to access this route'
            )
        }
        next()
    }
}

module.exports = {
    authenticateUser,
    authorizePermissions,
}
