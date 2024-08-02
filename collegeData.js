const Sequelize = require('sequelize');

const sequelize = new Sequelize('SenecaDB', 'SenecaDB_owner', 'pEy7ALYJRc5g', {
    host: 'ep-patient-grass-a50xr0we.us-east-2.aws.neon.tech',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

const Student = sequelize.define('Student', {
    studentNum: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING,
    course: Sequelize.INTEGER // Foreign key field
});

const Course = sequelize.define('Course', {
    courseId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING
});

Course.hasMany(Student, { foreignKey: 'course' });
Student.belongsTo(Course, { foreignKey: 'course' });

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        sequelize.sync()
            .then(() => resolve())
            .catch(err => reject("unable to sync the database: " + err));
    });
};

module.exports.getAllStudents = function(){
    return new Promise((resolve, reject) => {
        Student.findAll()
            .then(data => resolve(data))
            .catch(err => reject("no results returned: " + err));
    });
};

module.exports.getCourses = function(){
   return new Promise((resolve, reject) => {
       Course.findAll()
           .then(data => resolve(data))
           .catch(err => reject("no results returned: " + err));
   });
};

module.exports.getStudentByNum = function (num) {
    return new Promise((resolve, reject) => {
        Student.findAll({ where: { studentNum: num } })
            .then(data => {
                if (data.length > 0) resolve(data[0]);
                else reject("query returned 0 results");
            })
            .catch(err => reject("no results returned: " + err));
    });
};

module.exports.getStudentsByCourse = function (course) {
    return new Promise((resolve, reject) => {
        Student.findAll({ where: { course: course } })
            .then(data => resolve(data))
            .catch(err => reject("query returned 0 results: " + err));
    });
};

module.exports.getCourseById = function (id) {
    return new Promise((resolve, reject) => {
        Course.findAll({ where: { courseId: id } })
            .then(data => {
                if (data.length > 0) resolve(data[0]);
                else reject("query returned 0 results");
            })
            .catch(err => reject("no results returned: " + err));
    });
};

module.exports.addStudent = function (studentData) {
    studentData.TA = (studentData.TA) === "on" ? true : false;
    return new Promise((resolve, reject) => {
        Student.create(studentData)
            .then(() => resolve())
            .catch(err => {
                console.log(err)
                reject("unable to add student: " + err)
            });
    });
};

module.exports.updateStudent = function (studentData) {
    studentData.TA = (studentData.TA) ? true : false;
    return new Promise((resolve, reject) => {
        Student.update(studentData, { where: { studentNum: studentData.studentNum } })
            .then(() => resolve())
            .catch(err => reject("unable to update student: " + err));
    });
};

module.exports.addCourse = function(courseData) {
    for (let key in courseData) {
        if (courseData[key] === "") {
            courseData[key] = null;
        }
    }
    return new Promise((resolve, reject) => {
        Course.create(courseData)
            .then(() => resolve())
            .catch(err => reject("unable to add course: " + err));
    });
};


module.exports.updateCourse = function(courseData) {
    for (let key in courseData) {
        if (courseData[key] === "") {
            courseData[key] = null;
        }
    }
    return new Promise((resolve, reject) => {
        Course.update(courseData, { where: { courseId: courseData.courseId } })
            .then(() => resolve())
            .catch(err => reject("unable to update course: " + err));
    });
};

module.exports.deleteCourseById = function(id) {
    return new Promise((resolve, reject) => {
        Course.destroy({ where: { courseId: id } })
            .then(() => resolve())
            .catch(err => reject("unable to delete course: " + err));
    });
};

module.exports.deleteStudentByNum = function(studentNum) {
    return new Promise((resolve, reject) => {
        Student.destroy({ where: { studentNum: studentNum } })
            .then(() => resolve())
            .catch((err) => reject("Error deleting student: " + err));
    });
};

