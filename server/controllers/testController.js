// @access PIRAVE
const asyncHandler = require('express-async-handler')
const PhotoSession = require('../models/photoSessionModel')

const fs = require('fs')



const showImages = asyncHandler(async (req, res) => {
    const photoSession = await PhotoSession.findOne({ _id: req.photoSession }).select('-images.chosen')
    res.json(photoSession.images)
})

const delTest = asyncHandler(async(req,res)=>{
    try {
        const dir = `uploads/${req.username}/${req.params.id}`

        if(!dir) {
            res.send('not found dir')
        }

        fs.rmSync(dir, { recursive: true, force: true })
        res.send('successfully deleted /tmp/hello');
    } catch (err) {
        res.json(err)
    }
})



module.exports = { 
    showImages,
    delTest,
}