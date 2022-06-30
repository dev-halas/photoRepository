// @access PIRAVE

const asyncHandler = require('express-async-handler')

// @description GET TODOS
// @route GET /api/todos
const getTodos = asyncHandler(async (req, res) => {
    await res.status(200).json({message: 'GET ALL TODOS'})
})

// @description CREATE TODO
// @route POST /api/todos
const createTodo = asyncHandler(async (req, res) => {
    if (!req.body.text) {
        res.status(400) 
        throw new Error('Please add a text')
    }
        
   res.status(200).json({message: `CREATE TODO: ${req.body.text}`})
})

// @description UPDATE TODO
// @route PUT /api/todos/:id
const updateTodo = asyncHandler(async (req, res) => {
    res.status(200).json({message: `UPDATE TODO: ${req.params.id}`})
})

// @description DELETE TODO
// @route DELETE /api/todos/:id
const deleteTodo = asyncHandler(async (req, res) => {
    res.status(200).json({message: `DELETE TODO ${req.params.id}`})
})

module.exports = { getTodos, createTodo, updateTodo, deleteTodo }