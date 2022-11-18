// @access PIRAVE
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const PhotoSession = require('../models/photoSessionModel');
const User = require('../models/userModel');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// @description GET all photo sessions
// @route GET /api/photoSessions
const getPhotoSessions = asyncHandler(async (req, res) => {
    const photoSessions = await PhotoSession.find({ user: req.user.id });
    await res.status(200).json(photoSessions);
});

// @description GET one photo session
// @route GET /api/photoSessions/:id
const getPhotoSession = asyncHandler(async (req, res) => {
    // PhotoSession exist check
    const photoSession = await PhotoSession.findOne({ _id: req.params.id });
    if (!photoSession) {
        res.status(401);
        throw new Error('PhotoSession not found');
    }

    // User exist/auth check
    const user = await User.findById(req.user.id);
    if (!photoSession) {
        res.status(401);
        throw new Error('User not found');
    }

    //check user match photoSession
    if (photoSession.user.toString() !== user.id) {
        res.status(401);
        throw new Error('Ups... Not authorized user');
    }

    res.status(200).json(photoSession);
});

// @description create photo session
// @route POST /api/photoSessions
const createPhotoSession = asyncHandler(async (req, res, next) => {
    const photoSession = await PhotoSession.create({
        user: req.user.id,
    });

    req.params.id = photoSession._id;

    next();
});

const checkPhotoSessionExist = asyncHandler(async (req, res, next) => {
    // PhotoSession exist check
    const photoSession = await PhotoSession.findOne({ _id: req.params.id });
    if (!photoSession) {
        res.status(404);
        throw new Error('PhotoSession not found');
    }

    // User exist/auth check
    const user = await User.findById(req.user.id);
    if (!photoSession) {
        res.status(404);
        throw new Error('User not found');
    }

    //check user match photoSession
    if (photoSession.user.toString() !== user.id) {
        res.status(401);
        throw new Error('Ups... Not authorized user');
    }

    next();
});

// @description update photo session
// @route PUT /api/photoSessions/:id
const uploadPhotoSessionImages = asyncHandler(async (req, res) => {
    const { title, published, clientPassword } = req.body;
    const photoSession = await PhotoSession.findOne({ _id: req.params.id });

    console.log('title:', req.body.title);

    const files = req.files.length;

    const uploadPhotos = () => {
        for (let index = 0; index < files; index++) {
            photoSession.images.push({
                image: req.files[index].path,
                thumbnail: `${req.files[index].destination}/small-${req.files[index].filename}`,
            });
        }
    };

    const thumbnailPhotos = () => {
        for (let index = 0; index < files; index++) {
            sharp(req.files[index].path).resize(800).jpeg({ quality: 80 }).toFile(`${req.files[index].destination}/small-${req.files[index].filename}`);
        }
    };

    thumbnailPhotos();

    await PhotoSession.updateOne(
        { _id: req.params.id },
        {
            title: title,
            published: published,
            clientPassword: clientPassword,
            images: uploadPhotos(),
        }
    );

    photoSession.save();

    res.status(200).json('Success processing');
});

const uploadCoverImage = asyncHandler(async (req, res) => {
    const photoSession = await PhotoSession.findOne({ _id: req.params.id });

    const photo = req.file;

    const tinyPath = 'uploads/' + req.username + '/' + photoSession._id + '/';

    await sharp(req.file.path).resize(1920).jpeg({ quality: 75 }).toFile(`${tinyPath}cover-${req.file.filename}`);

    await PhotoSession.updateOne(
        { _id: req.params.id },
        {
            coverPhoto: `${tinyPath}cover-${req.file.filename}`,
        }
    );

    console.log(photo);

    photoSession.save();

    res.status(200).json(photoSession);
});

// @description update photo session
// @route PUT /api/photoSessions/:id
const updatePhotoSession = asyncHandler(async (req, res, next) => {
    const { title, published, clientPassword, coverPhoto } = req.body;

    const photoSession = await PhotoSession.findOne({ _id: req.params.id });

    await photoSession.updateOne({
        title: req.body.title,
        clientPassword: clientPassword,
        published: published,
        coverPhoto: coverPhoto,
    });

    next();
});

// @description DELETE photo session
// @route DELETE /api/photoSessions/:id
const deletePhotoSession = asyncHandler(async (req, res) => {
    const photoSession = await PhotoSession.findOne({ _id: req.params.id });

    if (!photoSession) {
        res.status(400);
        throw new Error('PhotoSession not found');
    }

    // User exist/auth check
    const user = await User.findById(req.user.id);
    if (!photoSession) {
        res.status(401);
        throw new Error('User not found');
    }

    //check user match photoSession
    if (photoSession.user.toString() !== user.id) {
        res.status(401);
        throw new Error('Ups... Not authorized user');
    }

    await photoSession.remove({ user: req.user.id });

    res.status(200).json({ message: 'DELETE TODO Successfuly' });
});

// @description Get public photo session
// @route GET /api/photoSessions/guest/:id
const guestLogin = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const photoSessionId = req.params.id;

    const photoSession = await PhotoSession.findById(photoSessionId);

    if (photoSession === null) {
        res.status(404);
        throw new Error('ups... Photo session not found');
    }

    if (photoSession && password === photoSession.clientPassword) {
        const token = generateToken(photoSession.id);
        res.json({
            _id: photoSession.id,
            token: token,
        });
    } else {
        res.status(400);
        throw new Error('Incorrect password');
    }
});

const getGuestPublicParams = asyncHandler(async (req, res) => {
    const photoSessionId = req.params.id;
    const photoSession = await PhotoSession.findById(photoSessionId);

    if (photoSession === null) {
        res.status(400);
        throw new Error('ups... Photo session not found');
    }

    if (photoSession) {
        res.json({
            title: photoSession.title,
            coverPhoto: photoSession.coverPhoto,
        });
    } else {
        res.status(400);
        throw new Error('Incorrect email or password');
    }
});

// @description Get public photo session
// @route GET /api/photoSessions/published/:id/all
const getPublishedPhotoSession = asyncHandler(async (req, res) => {
    const photoSession = await PhotoSession.findById(req.photoSession).select('-clientPassword');

    if (!photoSession) {
        res.status(404);
        throw new Error('ups... Photo session not found');
    }

    const imgId = req.params.imgId;

    if (imgId) {
        const onePhoto = await photoSession.images[imgId];

        if (!onePhoto) {
            res.status(404);
            throw new Error('Photo not found');
        } else {
            res.status(200).json(onePhoto);
        }
    } else {
        res.status(200).json(photoSession);
    }
});

// @description Get one image from public photo session
// @route PUT /api/photoSessions/published/:id/:imgId
const choseOnePublishedPhotoSession = asyncHandler(async (req, res) => {
    const photoSession = await PhotoSession.findById(req.photoSession).select('-clientPassword');

    if (!photoSession) {
        res.status(404);
        throw new Error('Photo session not found');
    }

    const choseImage = req.params.imgId;

    let selectedImage = photoSession.images[choseImage];

    if (!selectedImage) {
        res.status(404);
        throw new Error('Image not found');
    }

    const setImage = () => (selectedImage.chosen = true);
    const unsetImage = () => (selectedImage.chosen = false);

    selectedImage.chosen === true ? unsetImage() : setImage();

    photoSession.save();

    res.status(200).json(photoSession);
});

// @description Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY_GUEST, {
        expiresIn: '7d',
    });
};

module.exports = {
    getPhotoSessions,
    getPhotoSession,
    createPhotoSession,
    checkPhotoSessionExist,
    updatePhotoSession,
    uploadPhotoSessionImages,
    uploadCoverImage,
    deletePhotoSession,
    guestLogin,
    getGuestPublicParams,
    getPublishedPhotoSession,
    choseOnePublishedPhotoSession,
};
