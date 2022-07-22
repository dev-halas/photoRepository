const express = require('express')
const dotenv = require('dotenv').config()
const connectDB = require('./config/db_connect')
const path = require('path')
const { errorHandler } = require('./middleware/errorMiddleware')
const port = process.env.PORT || 5000
const proxy = require('express-http-proxy')
const cors = require('cors')

connectDB();

const app = express()
const uploader = express()

app.use(cors());

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false}))


// Import routes
app.use('/api/photo_session', require('./routes/photoSessionRoutes'))
app.use('/api/user', require('./routes/userRoutes'))

app.use(express.static('public')); 
app.use('/uploads', express.static('uploads'), require('./routes/uploadsRoutes'))



// errorMiddleware 
app.use(errorHandler)

app.listen(port, () => {
    console.log('server listening on port: ', port);
})

uploader.listen(8080, () => {
    console.log('server listening on port: ', 8080);
})

uploader.use('/', proxy('https://192.168.120.1/'))
