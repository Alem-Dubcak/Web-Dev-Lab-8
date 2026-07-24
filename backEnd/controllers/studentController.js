const asyncHandler = require('express-async-handler')

const Student = require('../models/studentModel')


// @desc Get student
// @route GET /api/student
// @access Private
const getStudents = asyncHandler(async (req, res) => {
    const student = await Student.find()

    res.status(200).json(student)
})

const prefixes = {
    "Computer Science": "CS",
    "Information Technology": "IT",
    "Cybersecurity": "CY",
    "Data Science": "DS",
    "Software Engineering": "SE"
}

// @desc Set student
// @route POST /api/student
// @access Private
const setStudent = asyncHandler(async (req, res) => {
    const { name, major, course, marks } = req.body

    if(!name || !major || !course || marks === undefined){
        res.status(400)
        throw new Error('Please fill in all required fields')
    }

    const prefix = prefixes[major] || "ST"
    const count = await Student.countDocuments({ major })
    const sutdentId = `${prefix}${1001 + count}`

    const student = await Student.create({ studentId, name, major, course, marks })

    res.status(200).json(student)
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

    res.status(200).json(student)
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

    const { name, major, course, marks } = req.body; 

    const updatedStudent = await Student.findByIdAndUpdate(
        req.params.id, 
        { name, major, course, marks }, 
        { new: true }
    )

    res.status(200).json(updatedStudent)
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

    res.status(200).json({ id: req.params.id })
})

module.exports = { getStudents, setStudent, getOneStudent, updateStudent, deleteStudent }