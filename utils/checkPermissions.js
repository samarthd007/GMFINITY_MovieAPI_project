const CustomError = require('../Errors')

const chechPermissions = (requestUser, resourceUserId) => {
    // console.log(requestUser);
    // console.log(resourceUserId);
    // console.log(typeof resourceUserId);
    if (requestUser.role === 'admin') return
    if (requestUser.userId === resourceUserId.toString()) return
    throw new CustomError.UnAuthorizedError(
        'Not authorized to access this route'
    )
}

const checkPermissionForPrivatePlatList = (
    requestUser,
    resourceUserId,
    next
) => {
    if (requestUser === resourceUserId.toString()) {
        next()
    } else {
        throw new CustomError.UnAuthenticatedError(
            'Login is required to create a playlist'
        )
    }
}

module.exports = { chechPermissions, checkPermissionForPrivatePlatList }
