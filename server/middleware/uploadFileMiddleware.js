const multer = require('multer');
const path = require('path')
const fs = require('fs')

const galleryStorage =  multer.diskStorage({
    destination: (req, file, cb) => {

        const userName = req.username
        if(!userName) {
            const error = new Error('Invalid user token');
            return cb(error)
        }

        const photoSessionId = req.params.id

        const sessionPath = `./uploads/${userName}/${photoSessionId}`

        fs.mkdirSync(sessionPath, { recursive: true })
        cb(null, sessionPath)
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const uploadGallery = multer({ storage: galleryStorage });

module.exports = { uploadGallery }