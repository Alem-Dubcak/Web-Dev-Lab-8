const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    /*firstName: { type: String, required: true },
    lastName: { type: String, required: true }, //might change to one full name
    major: { type: String, required: true },
    Course: { type: String}, //maybe required, figure out if need/how use array of classes
    marks: { type: Number, min: 0, max: 100, required: true },
    letterGrade: { type: String }, //Don't need might remove
    performanceMeaning: { type: String },
    colorLabel: { type: String },
    passFail: { type: Boolean, requred: true },
    timestamps: true*/
    text: {
        type: String, 
        required: [true, 'please enter a text value']
    }
})

module.exports = mongoose.model('Student', studentSchema)