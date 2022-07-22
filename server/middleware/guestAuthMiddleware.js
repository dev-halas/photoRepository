const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const PhotoSession = require('../models/photoSessionModel')

const photoSessionProtect = asyncHandler( async (req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Getting token from req.header
            token = req.headers.authorization.split(' ')[1]

            // VERIFY TOKEN
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY_GUEST)

            // GET PHOTO SESSION
            req.photoSession = await PhotoSession.findById(decoded.id).select('-password')
            
            next()

        } catch (error) {
            console.log(error)
            res.status(401) 
            throw new Error('Unathorized invalid user token')
        }
    }
    if(!token) {
        res.status(401)
        throw new Error('Not authorized: token not found')
    }
})

module.exports = {
    photoSessionProtect
}