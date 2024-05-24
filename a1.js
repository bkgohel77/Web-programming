var serverVerbs = ["GET", "GET", "GET", "POST", "GET", "POST"];
var serverPaths = ["/", "/about", "/contact", "/login", "/panel", "/logout"];
var serverResponses = [
    "Welcome to WEB700 Assignment 1",
    "This course name is WEB700. This assignment was prepared by Bhavesh Ketan Gohel",
    "bkgohel1@myseneca.ca\nBhavesh Ketan Gohel",
    "Hello, User Logged In",
    "Main Panel",
    "Logout Complete. Goodbye"
];

function httpRequest(httpVerb, path) {
    for (let i = 0; i < serverVerbs.length; i++) {
        if (serverVerbs[i] === httpVerb && serverPaths[i] === path) {
            return `200: ${serverResponses[i]}`;
        }
    }
    return `404: Unable to process ${httpVerb} request for ${path}`;
}

console.log(httpRequest("GET", "/")); 
console.log(httpRequest("GET", "/about"));
console.log(httpRequest("GET", "/contact")); 
console.log(httpRequest("POST", "/login")); 
console.log(httpRequest("GET", "/panel")); 
console.log(httpRequest("POST", "/logout")); 
console.log(httpRequest("PUT", "/")); 

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// Function to automate the tests
function automateTests() {
    var testVerbs = ["GET", "POST"];
    var testPaths = ["/", "/about", "/contact", "/login", "/panel", "/logout", "/randomPath1", "/randomPath2"];

    function randomRequest() {
        var ranVerb = testVerbs[getRandomInt(testVerbs.length)];
        var ranPath = testPaths[getRandomInt(testPaths.length)];
        console.log(httpRequest(ranVerb, ranPath));
    }

    setInterval(randomRequest, 1000);
}

// Invoking the automateTests function to start the testing process
automateTests();