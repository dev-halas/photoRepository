const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const sendEmail = require('../utils/sendEmail')
const crypto = require ('crypto')

// mail message import
const { verifyEmailMessage } = require('../utils/emailMessage')


// @description REGISTER USER
// @route POST /api/user
// @access public
const registerUser = asyncHandler( async (req, res) => {
    const { username, email, password} = req.body

    // @check if something field is empty
    if(!username || !email || !password) {
        res.status(400)
        throw new Error ('Please provide all fields')
    }

    // @check if user exist
    const userNameExist = await User.findOne({username})
    if(userNameExist) {
        res.status(400)
        throw new Error('Username already exist!')
    }

    // @check if user exist
    const userEmailExist = await User.findOne({email})
    if(userEmailExist) {
        res.status(400)
        throw new Error('User email already exist!')
    }

    // @salt password bcrypt 
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const verifyToken = crypto.randomBytes(20).toString('hex')
    const verifyEmailToken = crypto
        .createHash('sha256')
        .update(verifyToken)
        .digest('hex');  
    const verifyEmailTokenExpire = Date.now() + (60 * 1000) * 24 * 7;

    // @create user 
    const user = await User.create({
        username,
        email,
        password: hashPassword,
        verifyEmailToken: verifyEmailToken,
        verifyEmailTokenExpire: verifyEmailTokenExpire
    })

    if(!user) {
        res.status(400)
        throw new Error('Invalid user data')
    }

    const userID = user._id
    const verifyUrl = `${req.protocol}://${req.get('host')}/user/confirm-email/${userID}/${verifyEmailToken}`;

    const message = verifyEmailMessage(verifyUrl)

    const sendConfirmEmail = await sendEmail({
        to: user.email,
        subject: 'Verify your account',
        text: message,
    });
    

    res.status(201).json({
        message: 'Ok! Lets do it... We send verification account mail. Active Your account by clicking on link in email'
    })

    
})

// @description LOGIN USER
// @route  POST /api/user/login
// @access public
const loginUser = asyncHandler( async (req, res) => {
    const { email, password } = req.body
    
    const user = await User.findOne({email})

    if(user.verifyEmail === false) {
        res.status(401)
        throw new Error('Please confirm Your email')
    }

    if(user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id, user.username),

        })
    } else {
        res.status(400)
        throw new Error('Incorrect email or password')
    }

})

// @description GET USER ACCOUNT DATA
// @route  GET /api/user/panel
// @access private
const userPanel = asyncHandler( async (req, res) => {
    const { _id, username, email } = await User.findById(req.user)


    res.status(200).json({
        id: _id,
        username,
        email,

        jwtname: req.username
    })

})

// @description CONFIRM USER EMAIL
// @route  PUT /api/user/confirm-email
// @access private
const userConfirmEmail = asyncHandler( async (req, res) => {
    
    const { userID, confirmToken }  = req.params
    
    // @desc: check if the user is verified
    const isUserVerified = await User.findById({ _id: req.params.userID})
    if(isUserVerified.verifyEmail === true) {
        res.status(409)
        throw new Error('Your account is already activated')
    }
    
    // @desc: look user id, for token and expiration token date
    const user = await User.findOne({ 
        _id: userID,
        verifyEmailToken: confirmToken,
        verifyEmailTokenExpire: { $gt: Date.now() }
    })

    // @desc: check if user with request params exist
    if(!user){
        res.status(400)
        throw new Error('Invalid token or token expire!')
    }
    
    // @desc: change user value veryfing email to true and granting access to the account
    await User.updateOne({ _id: userID }, {
        verifyEmail: true,
    })
    

    // @desc: Change verify token and expire date to undefind
    user.verifyEmailToken = undefined;
    user.verifyEmailTokenExpire = undefined;
    
    await user.save();
    
    res.status(202).json({message: 'Account activated successfuly', user})

})

// @description FORGOT USER PASSWORD
// @route  POST /api/user/forgot-password
// @access public
const userForgotPassword = asyncHandler( async (req, res) => {
    
    const { email } = req.body
    const user = User.findOne({ email })
    
    if(!email) {
        res.status(401)
        throw new Error('please provide email!')
    }

    if(!user) {
        res.status(401)
        throw new Error('Incorrect credesial')
    }

    const resetToken = crypto.randomBytes(20).toString('hex')
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');  
    const resetPasswordTokenExpire = Date.now() +  15 * (60 * 1000)

    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/user/reset-password/${email}/${verifyEmailToken}`;

    //const message = 

    const sendConfirmEmail = await sendEmail({
        to: user.email,
        subject: 'Verify your account',
        text: message,
    });
    


    /*
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    */
    /*
    await User.updateOne({ email: req.body.email }, {
        verifyEmail: true
    })
    */

    //res.status(200).json({message: "OK"})
})

// @description RESET USER PASSWORD
// @route  PUT /api/user/forgot-password
// @access public
const userResetPassword = asyncHandler( async (req, res) => {
    
    const { email } = req.body
    
    if(!email) {
        res.status(401)
        throw new Error('please provide email to verificate!')
    }

    if(user.isModified('password')) {
        res.json('Modified')
    }

    await User.updateOne({ email: req.body.email }, {
        verifyEmail: true
    })

    res.status(200).json({message: "OK"})
})

// @description EDIT USER PROFILE
// @route  PUT /api/user/edit-profile
// @access private
const userEditProfile = asyncHandler( async (req, res) => {
    
    const { password, phone } = req.body

    const user = await User.findById(req.user.id)

    // @salt password bcrypt 
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)


    await user.updateOne({
        password: hashPassword,
        phone: phone,
        expire: Date.now()
    })

    res.status(200).json({message: "OK"})
})


// @description Generate JWT 
const generateToken = (id, username) => {
    return jwt.sign({id, username}, process.env.JWT_SECRET_KEY, {
        expiresIn: '7d'
    })
}


module.exports = {
    registerUser,
    loginUser,
    userPanel,
    userConfirmEmail,
    userForgotPassword,
    userResetPassword,
    userEditProfile
}