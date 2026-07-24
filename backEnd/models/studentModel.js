const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    studentId: { type: String, required: true, unique: true }, //for current id model "CS1001", will want to use mongodb _id. Still need to implement/integrate that with front end
    name: { type: String, required: [true, 'Student name is required'] },
    major: { type: String, required: [true, 'Major is required'] },
    Course: { type: String, required: [true, 'Course is required'] },
    marks: { type: Number, min: 0, max: 100, required: true },
}, {
    timestamps:  true 
})

module.exports = mongoose.model('Student', studentSchema)