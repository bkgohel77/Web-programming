/*********************************************************************************
*  WEB700 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Bhavesh K. Gohel Student ID: 151005238 Date: 16/7/2024
*
********************************************************************************/ 


const express = require('express');
const path = require('path');
const collegeData = require('./collegeData');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/students', (req, res) => {
    if (req.query.course) {
        collegeData.getStudentsByCourse(req.query.course)
            .then(students => res.json(students))
            .catch(err => res.json({ message: "no results" }));
    } else {
        collegeData.getAllStudents()
            .then(students => res.json(students))
            .catch(err => res.json({ message: "no results" }));
    }
});

app.get('/tas', (req, res) => {
    collegeData.getTAs()
        .then(tas => res.json(tas))
        .catch(err => res.json({ message: "no results" }));
});

app.get('/courses', (req, res) => {
    collegeData.getCourses()
        .then(courses => res.json(courses))
        .catch(err => res.json({ message: "no results" }));
});

app.get('/student/:num', (req, res) => {
    collegeData.getStudentByNum(req.params.num)
        .then(student => res.json(student))
        .catch(err => res.json({ message: "no results" }));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/htmlDemo', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'htmlDemo.html'));
});

app.get('/students/add', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'addStudent.html'));
});

app.post('/students/add', (req, res) => {
    collegeData.addStudent(req.body)
        .then(() => {
            res.redirect('/students');
        })
        .catch(err => {
            res.status(500).send("Error adding student");
        });
});

// 404 Route
app.use((req, res) => {
    res.status(404).send('Page Not THERE, Are you sure of the path?');
});

collegeData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`Server running on port ${HTTP_PORT}`);
        });
    })
    .catch(err => {
        console.error(`Failed to initialize: ${err}`);
    });
