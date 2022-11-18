const express = require('express')
const router = express.Router()
const { registerUser, loginUser, userPanel, userConfirmEmail, userResetPassword, userForgotPassword, userEditProfile} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/panel', protect, userPanel)
router.put('/confirm-email/:userID/:confirmToken', userConfirmEmail)
router.post('/forgot-password', userForgotPassword)
router.put('/reset-password', userResetPassword)
router.put('/edit-profile', protect, userEditProfile)


module.exports = router