const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    studentId: { type: String, required: true},
    name: { type: String, required: [true, 'Student name is required'] },
    major: { type: String, required: [true, 'Major is required'] },
    course: { type: String, required: [true, 'Course is required'] },
    marks: { type: Number, min: 0, max: 100, required: true },
}, {
    timestamps:  true 
})

module.exports = mongoose.model('Student', studentSchema)