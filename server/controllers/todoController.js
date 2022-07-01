// @access PIRAVE

const asyncHandler = require('express-async-handler')
const Todo = require('../models/todoModel')

// @description GET TODOS
// @route GET /api/todos
const getTodos = asyncHandler(async (req, res) => {
    const todos = await Todo.find()
    await res.status(200).json(todos)
})

// @description CREATE TODO
// @route POST /api/todos
const createTodo = asyncHandler(async (req, res) => {
    if (!req.body.text) {
        res.status(400) 
        throw new Error('Please add a text')
    }

    const todo = await Todo.create({
        text: req.body.text
    })
        
   res.status(200).json(todo)
})

// @description UPDATE TODO
// @route PUT /api/todos/:id
const updateTodo = asyncHandler(async (req, res) => {

    const todo = await Todo.findOne({ _id: req.params.id})

    if(!todo) {
        res.status(400)
        throw new Error('Todo not found')
    }

    const updateTodo = await Todo.updateOne({ _id: req.params.id}, {
        text: req.body.text
    })

    res.status(200).json({message: 'Updated succesfuly!', todo, updateTodo})
})

// @description DELETE TODO
// @route DELETE /api/todos/:id
const deleteTodo = asyncHandler(async (req, res) => {

    const todo = await Todo.findOne({ _id: req.params.id})

    if(!todo) {
        res.status(400)
        throw new Error('Todo not found')
    }

    await todo.remove()

    res.status(200).json({message: 'DELETE TODO Successfuly'})
})

module.exports = { getTodos, createTodo, updateTodo, deleteTodo }