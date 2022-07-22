const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String, 
        required: [true, 'Please add username'],
        unique: true,
    },
    email: {
        type: String, 
        required: [true, 'Please add Your email adress...'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 
            'Invalid email... Please check email' 
        ]
    },
    phone: {
        type: Number,
    },
    password: {
        type: String, 
        required: [true, 'Please add a password...'],
        minlength: 8
    },
    verifyEmail: {
        type: Boolean,
        required: true,
        default: false
    },
    expire: Date,
    verifyEmailToken: String,
    verifyEmailTokenExpire: Date,

}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)