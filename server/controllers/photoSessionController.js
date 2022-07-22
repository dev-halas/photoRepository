// @access PIRAVE
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const PhotoSession = require('../models/photoSessionModel')
const User = require('../models/userModel')
const fs = require('fs')



// @description GET all photo sessions
// @route GET /api/photoSessions
const getPhotoSessions = asyncHandler(async (req, res) => {
    const photoSessions = await PhotoSession.find({ user: req.user.id })
    await res.status(200).json(photoSessions)
})

// @description GET one photo session
// @route GET /api/photoSessions/:id
const getPhotoSession = asyncHandler(async (req, res) => {
    
    // PhotoSession exist check
    const photoSession = await PhotoSession.findOne({ _id: req.params.id})
    if(!photoSession) {
        res.status(401)
        throw new Error('PhotoSession not found')
    }

    // User exist/auth check
    const user = await User.findById(req.user.id)
    if(!photoSession) {
        res.status(401)
        throw new Error('User not found')
    }

    //check user match photoSession
    if(photoSession.user.toString() !== user.id) {
        res.status(401)
        throw new Error('Ups... Not authorized user')
    }

    res.status(200).json(photoSession.images)
})

// @description create photo session
// @route POST /api/photoSessions
const createPhotoSession = asyncHandler(async (req, res, next) => {
    
    const { title, published, clientPassword } = req.body
    
    /*
    if(!title) {
        res.status(400) 
        throw new Error('Please add session name')
    }
    */

    const photoSession = await PhotoSession.create({
        user: req.user.id,
        title: req.body.title,
        published: published,
        clientPassword: clientPassword
    })

    req.params.id = photoSession._id

    next()
})

const checkPhotoSessionExist = asyncHandler(async( req, res, next )=>{
    
    // PhotoSession exist check
    const photoSession = await PhotoSession.findOne({ _id: req.params.id})
    if(!photoSession) {
        res.status(404)
        throw new Error('PhotoSession not found')
    }

    // User exist/auth check
    const user = await User.findById(req.user.id)
    if(!photoSession) {
        res.status(404)
        throw new Error('User not found')
    }

    //check user match photoSession
    if(photoSession.user.toString() !== user.id) {
        res.status(401)
        throw new Error('Ups... Not authorized user')
    }

    next()
    
})

// @description update photo session
// @route PUT /api/photoSessions/:id
const uploadPhotoSessionImages = asyncHandler(async (req, res) => {

    const photoSession = await PhotoSession.findOne({ _id: req.params.id})
    
    const uploadPhotos = () => {
        const files = req.files.length
        for (let index = 0; index < files; index++) {
            photoSession.images.push({
                image: req.files[index].path
            })
        }
        console.log(files)
    }
    
    await PhotoSession.updateOne({ _id: req.params.id}, {
        images: uploadPhotos()
    })
    
    photoSession.save()

    res.status(200).json(photoSession)
    
})

// @description update photo session
// @route PUT /api/photoSessions/:id
const updatePhotoSession = asyncHandler(async (req, res, next) => {

    const { title, published, clientPassword, firstPhoto} = req.body

    const photoSession = await PhotoSession.findOne({ _id: req.params.id})
    
    await photoSession.updateOne({
        title: title,
        clientPassword: clientPassword,
        published: published,
        firstPhoto: firstPhoto
    })

    next() 
})

// @description DELETE photo session
// @route DELETE /api/photoSessions/:id
const deletePhotoSession = asyncHandler(async (req, res) => {

    const photoSession = await PhotoSession.findOne({ _id: req.params.id})

    if(!photoSession) {
        res.status(400)
        throw new Error('PhotoSession not found')
    }

    // User exist/auth check
    const user = await User.findById(req.user.id)
    if(!photoSession) {
        res.status(401)
        throw new Error('User not found')
    }
    
    //check user match photoSession
    if(photoSession.user.toString() !== user.id) {
        res.status(401)
        throw new Error('Ups... Not authorized user')
    }

    await photoSession.remove({user: req.user.id})
    

    res.status(200).json({message: 'DELETE TODO Successfuly'})
})


// @description Get public photo session
// @route GET /api/photoSessions/guest/:id
const guestLogin = asyncHandler(async (req, res) => {

    const { password } = req.body
    const photoSessionId  = req.params.id  
    

 


    const photoSession = await PhotoSession.findById(photoSessionId)

    if(res.status === 404) {
        throw new Error('test')
    }

    if(photoSession === null) {
        res.status(404)
        throw new Error('ups... Photo session not found')
    }

    if(photoSession && (password === photoSession.clientPassword)) {
        const token = generateToken(photoSession.id, photoSession.text)
        res.json({
            _id: photoSession.id,
            token: token
        })
    } else {
        res.status(400)
        throw new Error('Incorrect password')
    }
    
})

const getGuestPublicParams = asyncHandler(async (req, res) => {

    const photoSessionId  = req.params.id
    
    const photoSession = await PhotoSession.findById(photoSessionId)


    if(photoSession === null) {
        res.status(400)
        throw new Error('ups... Photo session not found')
    }

    if(photoSession) {
        res.json({
            title: photoSession.title,
            firstPhoto: photoSession.firstPhoto
        })
    } else {
        res.status(400)
        throw new Error('Incorrect email or password')
    }
    
})



// @description Get public photo session
// @route GET /api/photoSessions/published/:id/all
const getPublishedPhotoSession = asyncHandler(async (req, res) => {

    const photoSession = await PhotoSession.findById(req.photoSession).select("-clientPassword");

    if(!photoSession){
        res.status(404)
        throw new Error('ups... Photo session not found')
    }

    const imgId = req.params.imgId

    if(imgId) {
        
        const onePhoto = await photoSession.images[imgId]

        if(!onePhoto){
            res.status(404)
            throw new Error('Photo not found')
        } else {
            res.status(200).json(onePhoto)
        }

    } else {
        res.status(200).json(photoSession)
    }
})


// @description Get one image from public photo session
// @route PUT /api/photoSessions/published/:id/:imgId
const choseOnePublishedPhotoSession = asyncHandler(async (req, res) => {


    const photoSession = await PhotoSession.findById(req.photoSession).select("-clientPassword");

    if(!photoSession) {
        res.status(404)
        throw new Error('Photo session not found')
    }

    const choseImage = req.params.imgId

    let selectedImage = photoSession.images[choseImage]

    if(!selectedImage) {
        res.status(404)
        throw new Error('Image not found')
    }

    
    const setImage = () => selectedImage.chosen = true
    const unsetImage = () => selectedImage.chosen = false
    
    selectedImage.chosen === true ?  unsetImage() : setImage()

    photoSession.save()

    res.status(200).json(photoSession)
    
})




// @description Generate JWT 
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET_KEY_GUEST, {
        expiresIn: '7d'
    })
}

module.exports = { 
    getPhotoSessions, 
    getPhotoSession, 
    createPhotoSession, 
    checkPhotoSessionExist,
    updatePhotoSession,
    uploadPhotoSessionImages,
    deletePhotoSession, 
    guestLogin,
    getGuestPublicParams,
    getPublishedPhotoSession, 
    choseOnePublishedPhotoSession,
}