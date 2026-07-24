// Part 1 - Initialization, Validation, Student Addition + Render Table


// Student Storage
let students = [];
let nextStudentNumber = 1001;

const API_BASE = 'http://localhost:5000/api/student'


// Courses for each Major
const majorCourses = {

    "Computer Science": [
        "Web Development",
        "Data Structures",
        "Database Systems"
    ],

    "Information Technology": [
        "Networking",
        "Cloud Computing",
        "System Administration"
    ],

    "Cybersecurity": [
        "Ethical Hacking",
        "Secure Software Development",
        "Digital Forensics"
    ],

    "Data Science": [
        "Data Analytics",
        "Machine Learning",
        "Statistics"
    ],

    "Software Engineering": [
        "Software Design",
        "Software Testing",
        "Agile Development"
    ]

};


// HTML Elements
const addStudentForm = document.getElementById("addStudentForm");

const studentName = document.getElementById("studentName");
const studentMajor = document.getElementById("studentMajor");
const studentCourse = document.getElementById("studentCourse");
const studentMarks = document.getElementById("studentMarks");

// Create table body
let studentTableBody = document.getElementById("studentTableBody");

if (!studentTableBody) {

    const table = document.querySelector(".dataGridTable");

    studentTableBody = document.createElement("tbody");
    studentTableBody.id = "studentTableBody";

    table.appendChild(studentTableBody);

}

//Get students fetch() call, loads on start
async function loadStudents(){
    try{
        const response = await fetch(API_BASE)
        if(!response.ok) throw new Error(`HTTP ${response.status}`);
        students = await response.json()
        renderTable();
    } catch (error) {
        console.error('Error loading students: ', error)
        showNotification('Failed to load students.', false)
    }
}




// Student ID Generator
function generateStudentID(major) {

    let prefix = "ST";

    if (major === "Computer Science") prefix = "CS";
    if (major === "Information Technology") prefix = "IT";
    if (major === "Cybersecurity") prefix = "CY";
    if (major === "Data Science") prefix = "DS";
    if (major === "Software Engineering") prefix = "SE";

    return prefix + nextStudentNumber++;

}


// Update Course Dropdown
function updateCourseList() {

    studentCourse.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.textContent = "-- Select Course --";
    defaultOption.value = "";

    studentCourse.appendChild(defaultOption);

    const courses = majorCourses[studentMajor.value];

    if (!courses) return;

    courses.forEach(course => {

        const option = document.createElement("option");

        option.value = course;
        option.textContent = course;

        studentCourse.appendChild(option);

    });

}

studentMajor.addEventListener("change", updateCourseList);


// Grade Calculator
function calculateGrade(mark) {

    if (mark >= 93)
        return {
            grade: "A",
            meaning: "Excellent / Outstanding",
            className: "gradeDarkGreen",
            status: "Pass"
        };

    if (mark >= 90)
        return {
            grade: "A-",
            meaning: "Excellent",
            className: "gradeGreen",
            status: "Pass"
        };

    if (mark >= 87)
        return {
            grade: "B+",
            meaning: "Very Good",
            className: "gradeLightGreen",
            status: "Pass"
        };

    if (mark >= 83)
        return {
            grade: "B",
            meaning: "Good",
            className: "gradeBlue",
            status: "Pass"
        };

    if (mark >= 80)
        return {
            grade: "B-",
            meaning: "Above Average",
            className: "gradeLightBlue",
            status: "Pass"
        };

    if (mark >= 77)
        return {
            grade: "C+",
            meaning: "Satisfactory Plus",
            className: "gradeYellowGreen",
            status: "Pass"
        };

    if (mark >= 73)
        return {
            grade: "C",
            meaning: "Satisfactory",
            className: "gradeYellow",
            status: "Pass"
        };

    if (mark >= 70)
        return {
            grade: "C-",
            meaning: "Minimum Satisfactory",
            className: "gradeOrange",
            status: "Pass"
        };

    if (mark >= 67)
        return {
            grade: "D+",
            meaning: "Poor but Passing",
            className: "gradeLightRed",
            status: "Pass"
        };

    if (mark >= 60)
        return {
            grade: "D",
            meaning: "Minimum Passing",
            className: "gradeRed",
            status: "Pass"
        };

    return {

        grade: "F",
        meaning: "Failing",
        className: "gradeDarkRed",
        status: "Fail"

    };

}


// Validation
function validateForm() {

    const nameRegex = /^[A-Za-z ]+$/;

    if (studentName.value.trim() === "") {

        alert("Student name is required.");
        return false;

    }

    if (!nameRegex.test(studentName.value.trim())) {

        alert("Student name must contain only letters.");
        return false;

    }

    if (studentMajor.value === "") {

        alert("Select a major.");
        return false;

    }

    if (studentCourse.value === "") {

        alert("Select a course.");
        return false;

    }

    const marks = Number(studentMarks.value);

    if (isNaN(marks) || marks < 0 || marks > 100) {

        alert("Marks must be between 0 and 100.");
        return false;

    }

    return true;

}


// Add Student, uses POST fetch() call
addStudentForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    if (!validateForm())
        return;

    const marks = Number(studentMarks.value);
    const gradeInfo = calculateGrade(marks);

    const newStudent = {
        name: studentName.value.trim(),
        major: studentMajor.value,
        course: studentCourse.value,
        marks: marks
    }

    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newStudent)
        })

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const savedStudent = await response.json()
        students.push(savedStudent)
        renderTable()
        addStudentForm.reset()
        showNotification("Student record added successfully.")
    } catch (error) {
        console.error(error)
        showNotification("Failed to add student.", false)
    }

    studentCourse.innerHTML =
        "<option value=''>-- Awaiting Program Selection --</option>";

});


// Render Table
function renderTable() {

    studentTableBody.innerHTML = "";

    students.forEach(student => {

        const row = document.createElement("tr");

        row.innerHTML = `

        <td>${student.studentId}</td>

        <td>${student.name}</td>

        <td>${student.major}</td>

        <td>${student.course}</td>

        <td>${student.marks}</td>

        <td>
            <span class="badgeIndicator ${student.color}">
                ${student.grade}
            </span>
        </td>

        <td>${student.meaning}</td>

        <td>
            <span class="badgeIndicator ${student.status === "Pass" ? "statusPass" : "statusFail"}">
                ${student.status}
            </span>
        </td>

        <td>

            <div class="actionButtonGroup">

                <button class="actionBtn editBtn">
                    Edit
                </button>

                <button class="actionBtn deleteBtn">
                    Delete
                </button>

            </div>

        </td>

        `;

        studentTableBody.appendChild(row);

    });

}
// Part 2
// Edit Student Modal
const editStudentModal = document.getElementById("editStudentModal");
const editStudentForm = document.getElementById("editStudentForm");

const editRowDatabaseId = document.getElementById("editRowDatabaseId");
const editStudentName = document.getElementById("editStudentName");
const editStudentMajor = document.getElementById("editStudentMajor");
const editStudentCourse = document.getElementById("editStudentCourse");
const editStudentMarks = document.getElementById("editStudentMarks");

const closeModalButton = document.getElementById("closeModalButton");
const cancelModalButton = document.getElementById("ButtonCancelModal");



// Update Course List In Modal Edit
function updateEditCourseList(selectedCourse = "") {

    editStudentCourse.innerHTML = "";

    const courses = majorCourses[editStudentMajor.value];

    if (!courses) return;

    courses.forEach(course => {

        const option = document.createElement("option");

        option.value = course;
        option.textContent = course;

        if (course === selectedCourse) {
            option.selected = true;
        }

        editStudentCourse.appendChild(option);

    });

}


// Update available courses whenever major is changed
editStudentMajor.addEventListener("change", function () {

    updateEditCourseList();

});


// Open Modal Edit
function openEditModal(index) {
    const student = students.find(s => s._id === id)

    editRowDatabaseId.value = student._id;

    editStudentName.value = student.name;
    editStudentMajor.value = student.major;

    updateEditCourseList(student.course);

    editStudentMarks.value = student.marks;

    editStudentModal.classList.remove("hidden");

}



// Close Modal Edit
function closeEditModal() {

    editStudentModal.classList.add("hidden");

}


// Close modal when X button is clicked
closeModalButton.addEventListener("click", closeEditModal);

// Close modal when Cancel button is clicked
cancelModalButton.addEventListener("click", closeEditModal);

// Close modal if user clicks outside the window
window.addEventListener("click", function (event) {

    if (event.target === editStudentModal) {

        closeEditModal();

    }

});



// Save Edited Student Info
editStudentForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const nameRegex = /^[A-Za-z ]+$/;

    // Validate student name
    if (editStudentName.value.trim() === "") {

        alert("Student name is required.");
        return;

    }

    if (!nameRegex.test(editStudentName.value.trim())) {

        alert("Student name must contain only letters.");
        return;

    }

    // Validate marks
    const marks = Number(editStudentMarks.value);

    if (isNaN(marks) || marks < 0 || marks > 100) {

        alert("Marks must be between 0 and 100.");
        return;

    }

    //const index = Number(editRowDatabaseId.value);
    const id = editRowDatabaseId.value; 

    const updatedFields = {
        name: editStudentName.value.trim(),
        major: editStudentMajor.value,
        course: editStudentCourse.value,
        marks: marks
    }

    // Recalculate grade info
    //const gradeInfo = calculateGrade(student.marks);

    try{
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedFields)
        })

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const updatedStudent = await response.json()
        const index = students.findIndex(s => s._id === id)
        students[index] = updatedStudent

        renderTable();
        closeEditModal();
        showNotification("Student record updated successfully.")
    } catch (error) {
        console.error(error)
        showNotification("Failed to update student.", false)
    }
});



// Delete Student Record
deleteStudent = async function(id) {
    const answer = confirm("Delete this student record?");

    if (!answer) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' })
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        students = students.filter(s => s._id !== id)
        renderTable()
        showNotification("Student deleted sucessfully.")
    } catch (error) {
        console.error(error)
        showNotification("Failed to delete student.", false)
    }

}


// Replace renderTable(), Will Add Edit and Delete button events
const originalRenderTable = renderTable;

renderTable = function () {

    studentTableBody.innerHTML = "";

    students.forEach((student, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `

        <td>${student.studentId}</td>

        <td>${student.name}</td>

        <td>${student.major}</td>

        <td>${student.course}</td>

        <td>${student.marks}</td>

        <td>
            <span class="badgeIndicator ${student.color}">
                ${student.grade}
            </span>
        </td>

        <td>${student.meaning}</td>

        <td>
            <span class="badgeIndicator ${student.status === "Pass" ? "statusPass" : "statusFail"}">
                ${student.status}
            </span>
        </td>

        <td>

            <div class="actionButtonGroup">

                <button class="actionBtn editBtn" data-id="${student._id}">
                    Edit
                </button>

                <button class="actionBtn deleteBtn" data-id="${student._id}">
                    Delete
                </button>

            </div>

        </td>

        `;

        studentTableBody.appendChild(row);

    });

    // Attach edit button events
    document.querySelectorAll(".editBtn").forEach(button => {

        button.addEventListener("click", function () {

            openEditModal(this.dataset.id);

        });

    });

    // Attach delete button events
    document.querySelectorAll(".deleteBtn").forEach(button => {

        button.addEventListener("click", function () {

            deleteStudent(this.dataset.id);

        });

    });

};
// Part 3
// Dashboard Statistics Elements
const totalStudents = document.getElementById("totalStudents");
const averageMarks = document.getElementById("averageMarks");
const highestStudent = document.getElementById("highestStudent");
const lowestStudent = document.getElementById("lowestStudent");
const passingCount = document.getElementById("passingCount");
const metricFailingCount = document.getElementById("metricFailingCount");

const countGradeA = document.getElementById("countGradeA");
const countGradeB = document.getElementById("countGradeB");
const countGradeC = document.getElementById("countGradeC");
const countGradeD = document.getElementById("countGradeD");
const countGradeF = document.getElementById("countGradeF");

const barGradeA = document.getElementById("barGradeA");
const barGradeB = document.getElementById("barGradeB");
const barGradeC = document.getElementById("barGradeC");
const barGradeD = document.getElementById("barGradeD");
const barGradeF = document.getElementById("barGradeF");



// Update Dashboard Stats
function updateStatistics() {

    const total = students.length;

    totalStudents.textContent = total;

    if (total === 0) {

        averageMarks.textContent = "0.0%";
        highestStudent.textContent = "N/A";
        lowestStudent.textContent = "N/A";

        passingCount.textContent = 0;
        metricFailingCount.textContent = 0;

        countGradeA.textContent = 0;
        countGradeB.textContent = 0;
        countGradeC.textContent = 0;
        countGradeD.textContent = 0;
        countGradeF.textContent = 0;

        barGradeA.style.width = "0%";
        barGradeB.style.width = "0%";
        barGradeC.style.width = "0%";
        barGradeD.style.width = "0%";
        barGradeF.style.width = "0%";

        return;
    }

    let totalMarks = 0;

    let highest = students[0];
    let lowest = students[0];

    let pass = 0;
    let fail = 0;

    let gradeA = 0;
    let gradeB = 0;
    let gradeC = 0;
    let gradeD = 0;
    let gradeF = 0;

    students.forEach(student => {

        totalMarks += student.marks;

        if (student.marks > highest.marks)
            highest = student;

        if (student.marks < lowest.marks)
            lowest = student;

        if (student.status === "Pass")
            pass++;
        else
            fail++;

        if (student.grade === "A" || student.grade === "A-")
            gradeA++;

        else if (
            student.grade === "B+" ||
            student.grade === "B" ||
            student.grade === "B-"
        )
            gradeB++;

        else if (
            student.grade === "C+" ||
            student.grade === "C" ||
            student.grade === "C-"
        )
            gradeC++;

        else if (
            student.grade === "D+" ||
            student.grade === "D"
        )
            gradeD++;

        else
            gradeF++;

    });

    averageMarks.textContent =
        (totalMarks / total).toFixed(1) + "%";

    highestStudent.textContent =
        highest.name + " (" + highest.marks + ")";

    lowestStudent.textContent =
        lowest.name + " (" + lowest.marks + ")";

    passingCount.textContent = pass;
    metricFailingCount.textContent = fail;

    countGradeA.textContent = gradeA;
    countGradeB.textContent = gradeB;
    countGradeC.textContent = gradeC;
    countGradeD.textContent = gradeD;
    countGradeF.textContent = gradeF;

    barGradeA.style.width = (gradeA / total) * 100 + "%";
    barGradeB.style.width = (gradeB / total) * 100 + "%";
    barGradeC.style.width = (gradeC / total) * 100 + "%";
    barGradeD.style.width = (gradeD / total) * 100 + "%";
    barGradeF.style.width = (gradeF / total) * 100 + "%";

}



// Update Dashboard Automatically

// Save current version of renderTable()
const previousRenderTable = renderTable;

// Replace it with a new version that will update statistics
renderTable = function () {

    previousRenderTable();

    updateStatistics();

};



// Initialize Dashboard
updateStatistics();

// Part 4
// Search & Filter Elements
const searchBar = document.getElementById("searchBar");
const filterMajor = document.getElementById("filterMajor");
const filterStatus = document.getElementById("filterStatus");



// Filter Student Records
function filterStudents() {

    const searchText = searchBar.value.toLowerCase().trim();
    const majorFilter = filterMajor.value;
    const statusFilter = filterStatus.value;

    studentTableBody.innerHTML = "";

    students.forEach((student, index) => {

        const matchesSearch =
            student.studentId.toLowerCase().includes(searchText) ||
            student.name.toLowerCase().includes(searchText) ||
            student.course.toLowerCase().includes(searchText);

        const matchesMajor =
            majorFilter === "all" ||
            student.major === majorFilter;

        const matchesStatus =
            statusFilter === "all" ||
            student.status === statusFilter;

        if (!(matchesSearch && matchesMajor && matchesStatus))
            return;

        const row = document.createElement("tr");

        row.innerHTML = `

        <td>${student.studentId}</td>

        <td>${student.name}</td>

        <td>${student.major}</td>

        <td>${student.course}</td>

        <td>${student.marks}</td>

        <td>
            <span class="badgeIndicator ${student.color}">
                ${student.grade}
            </span>
        </td>

        <td>${student.meaning}</td>

        <td>
            <span class="badgeIndicator ${student.status === "Pass" ? "statusPass" : "statusFail"}">
                ${student.status}
            </span>
        </td>

        <td>

            <div class="actionButtonGroup">

                <button class="actionBtn editBtn" data-id="${student._id}">
                    Edit
                </button>

                <button class="actionBtn deleteBtn" data-id="${student._id}">
                    Delete
                </button>

            </div>

        </td>

        `;

        studentTableBody.appendChild(row);

    });

    document.querySelectorAll(".editBtn").forEach(button => {

        button.addEventListener("click", function () {

            openEditModal(this.dataset.id);

        });

    });

    document.querySelectorAll(".deleteBtn").forEach(button => {

        button.addEventListener("click", function () {

            deleteStudent(this.dataset.id);

        });

    });

}



// Event Search
searchBar.addEventListener("keyup", filterStudents);

filterMajor.addEventListener("change", filterStudents);

filterStatus.addEventListener("change", filterStudents);


// Update Table
const previousTableRender = renderTable;

renderTable = function () {

    previousTableRender();

    filterStudents();

};

// Part 5
// Notification System
const systemNotification = document.getElementById("systemNotification");

function showNotification(message, isSuccess = true) {

    systemNotification.textContent = message;

    systemNotification.classList.remove("hidden");

    if (isSuccess) {

        systemNotification.style.backgroundColor = "#d4edda";
        systemNotification.style.color = "#155724";

    } else {

        systemNotification.style.backgroundColor = "#f8d7da";
        systemNotification.style.color = "#721c24";

    }

    setTimeout(function () {

        systemNotification.classList.add("hidden");

    }, 3000);

}



//Notification After Adding a Student
/*const originalAddEvent = addStudentForm.onsubmit;

addStudentForm.addEventListener("submit", function () {

    showNotification("Student record added successfully.");

});*/


// Export Buttons
const ButtonExportPdf = document.getElementById("ButtonExportPdf");
const ButtonExportExcel = document.getElementById("ButtonExportExcel");

ButtonExportPdf.addEventListener("click", function (event) {

    event.preventDefault();

    alert("PDF Export will be connected to the backend later.");

});

ButtonExportExcel.addEventListener("click", function (event) {

    event.preventDefault();

    alert("Excel Export will be connected to the backend later.");

});



// Excel Import
const excelImportFile = document.getElementById("excelImportFile");

excelImportFile.addEventListener("change", function () {

    if (this.files.length === 0)
        return;

    alert(
        this.files[0].name +
        " selected.\n\nExcel import can be connected to MongoDB later."
    );

});

// Initialize Application
loadStudents();

updateStatistics();

updateCourseList();
