const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler( async (req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Getting token from req.header
            token = req.headers.authorization.split(' ')[1]

            // Verify token 
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

            // Get user
            req.user = await User.findById(decoded.id).select('-password')
            req.username = decoded.username


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
    protect
}