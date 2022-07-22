const express = require('express')
const router = express.Router()
const { testController, showImages, delTest } = require('../controllers/testController')
const { photoSessionProtect } = require('../middleware/guestAuthMiddleware')

const { protect } = require('../middleware/authMiddleware')

router.get('/photoSession/show', photoSessionProtect, showImages)

router.delete('/delete/:id', protect, delTest)

module.exports = router