const asyncHandler = require('express-async-handler')

const Student = require('../models/studentModel')


// @desc Get student
// @route GET /api/student
// @access Private
const getStudents = asyncHandler(async (req, res) => {
    const student = await Student.find()

    res.status(200).json(student) //find out how to implement with front end
})

// @desc Set student
// @route POST /api/student
// @access Private
const setStudent = asyncHandler(async (req, res) => {
    if(!req.body?.text){ //Will probably have to change ".text"
        res.status(400)
        throw new Error('Please add a text field') //Need to change eventually
    }

    const student = await Student.create({
        text: req.body.text//fix using student model
    })

    res.status(200).json(student) //find out how to implement with front end
})

// @desc Get oneStudent
// @route GET /api/student/:id
// @access Private
const getOneStudent = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id)

    if(!student){
        res.status(400)
        throw new Error('Student not found')
    }

    res.status(200).json(student) //find out how to implement with front end
})

// @desc update student
// @route PUT /api/student/:id
// @access Private
const updateStudent = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id)

    if(!student){
        res.status(400)
        throw new Error('Student not found')
    }

    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true }) //will have to change to meet the schema

    res.status(200).json(updatedStudent) //find out how to implement with front end
})

// @desc delete student
// @route DELETE /api/student/:id
// @access Private
const deleteStudent = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id)

    if(!student){
        res.status(400)
        throw new Error('Student not found')
    }

    await student.deleteOne()

    res.status(200).json({ id: req.params.id }) //find out how to implement with front end
})

module.exports = { getStudents, setStudent, getOneStudent, updateStudent, deleteStudent }