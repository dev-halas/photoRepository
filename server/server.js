const express = require('express')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const port = process.env.PORT || 5000


const app = express()

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false}))

// Import routes
app.use('/api/todos', require('./routes/todosRoutes'))

// errorMiddleware 
app.use(errorHandler)

app.listen(port, () => {
    console.log('server listening on port: ', port);
})