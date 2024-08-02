/********************************************************************************* 
 *  WEB700 – Assignment 06
 *  I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
 *  of this assignment has been copied manually or electronically from any other source 
 *  (including 3rd party web sites) or distributed to other students. 
 *  
 *  Name: Bhavesh Ketan Gohel
 *  Student ID: 151005238
 *  Date: 01/08/2024 
 ********************************************************************************/
const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const data = require("./modules/collegeData.js");

const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.engine('.hbs', exphbs.engine({ 
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') + 
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }        
    }
}));

app.set('view engine', '.hbs');

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(function(req, res, next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));    
    next();
});

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/htmlDemo", (req, res) => {
    res.render("htmlDemo");
});

app.get("/students", (req, res) => {
    if (req.query.course) {
        data.getStudentsByCourse(req.query.course)
            .then((students) => {
                res.render("students", { students: students.length > 0 ? students : undefined, message: students.length === 0 ? "no results" : undefined });
            })
            .catch(() => {
                res.render("students", { message: "no results" });
            });
    } else {
        data.getAllStudents()
            .then((students) => {
                res.render("students", { students: students.length > 0 ? students : undefined, message: students.length === 0 ? "no results" : undefined });
            })
            .catch(() => {
                res.render("students", { message: "no results" });
            });
    }
});

app.get("/students/add", (req, res) => {
    res.render("addStudent");
});

app.post("/students/add", (req, res) => {
    data.addStudent(req.body)
        .then(() => res.redirect("/students"))
        .catch((err) => console.log(err));
});

app.get("/student/:studentNum", (req, res) => {
    data.getStudentByNum(req.params.studentNum)
        .then((student) => res.render("student", { student: student }))
        .catch(() => {
            res.render("student", { message: "no results" });
        });
});

app.post("/student/update", (req, res) => {
    data.updateStudent(req.body)
        .then(() => res.redirect("/students"))
        .catch((err) => console.log(err));
});

app.get("/courses", (req, res) => {
    data.getCourses()
        .then((courses) => {
            res.render("courses", { courses: courses.length > 0 ? courses : undefined, message: courses.length === 0 ? "no results" : undefined });
        })
        .catch(() => {
            res.render("courses", { message: "no results" });
        });
});

app.get('/course/:id', (req, res) => {
    data.getCourseById(req.params.id)
        .then((course) => {
            if (course) {
                res.render('course', { course: course });
            } else {
                res.status(404).send("Course Not Found");
            }
        })
        .catch(() => {
            res.status(500).send("Unable to Retrieve Course");
        });
});

app.get('/courses/add', (req, res) => {
    res.render('addCourse');
});

app.post('/courses/add', (req, res) => {
    data.addCourse(req.body)
        .then(() => res.redirect('/courses'))
        .catch(() => {
            res.status(500).send("Unable to Add Course");
        });
});

app.post('/course/update', (req, res) => {
    data.updateCourse(req.body)
        .then(() => res.redirect('/courses'))
        .catch(() => {
            res.status(500).send("Unable to Update Course");
        });
});

app.get('/course/delete/:id', (req, res) => {
    data.deleteCourseById(req.params.id)
        .then(() => res.redirect('/courses'))
        .catch(() => {
            res.status(500).send("Unable to Remove Course / Course not found");
        });
});

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

data.initialize().then(function(){
    app.listen(HTTP_PORT, function(){
        console.log("Server listening on: " + HTTP_PORT);
    });
}).catch(function(err){
    console.log("unable to start server: " + err);
});
