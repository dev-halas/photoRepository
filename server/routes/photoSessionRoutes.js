const express = require('express')
const router = express.Router()
const { 
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
    choseOnePublishedPhotoSession
} = require('../controllers/photoSessionController')

const { testController, chechIfExist } = require('../controllers/testController')
const { protect } = require('../middleware/authMiddleware')
const { photoSessionProtect } = require('../middleware/guestAuthMiddleware')
const { uploadGallery } = require('../middleware/uploadFileMiddleware')

router.get('/all', protect, getPhotoSessions)
router.get('/:id', protect, getPhotoSession)
router.post('/create', protect, createPhotoSession, uploadGallery.array("images"), uploadPhotoSessionImages)
router.put('/uploadImages/:id', protect, uploadGallery.array("images"), uploadPhotoSessionImages)
router.put('/update/:id', protect, checkPhotoSessionExist, updatePhotoSession, uploadGallery.array("photos"), uploadPhotoSessionImages)
router.put('/coverPhoto/:id', protect, checkPhotoSessionExist, uploadGallery.single("cover"), uploadCoverImage)
router.post('/guest/:id?', guestLogin)
router.get('/guest/:id?', getGuestPublicParams)
router.get('/published/showGallery/:imgId?', photoSessionProtect, getPublishedPhotoSession)
router.put('/published/selectImage/:imgId', photoSessionProtect, choseOnePublishedPhotoSession)
router.delete('/delete/:id', protect, deletePhotoSession)



//router.put('/testController/:id', protect, chechIfExist, upload.array("files"), testController)

module.exports = router