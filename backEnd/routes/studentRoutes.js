const express = require('express')
const router = express.Router()
const {getStudents, setStudent, updateStudent, deleteStudent, getOneStudent} = require('../controllers/studentController')

router.route('/').get(getStudents).post(setStudent)
router.route('/:id').delete(deleteStudent).put(updateStudent).get(getOneStudent)

module.exports = router