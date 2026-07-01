
var user = null;
var profile = null;


function login() {// login when user click the login button
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
        .then(function (result) {//check for user profile in the database
            user = result.user;
            checkUser();
        })

}


function fb_popupLogin() {// login pop up when user click the login button
    login();
}

function logout() {// logout when user click the logout button
    firebase.auth().signOut()
        .then(function () {// logout successful
            user = null;// set user to null when user logout
            profile = null;// set profile to null when user logout
            goTo("index.html");// go to index.html when user logout
        });
}

function fb_logout() {// logout when user click the logout button
    logout();
}

function checkUser() {// check if user is logged in or not
    if (user === null) {
        if (pageName() !== "index.html") {// if user is not logged in and not on index.html page then go to index.html page
            goTo("index.html");// go to index.html page when user is not logged in
        }

        return;
    }// if user is logged in then check for user profile in the database
    console.log("hello");
    firebase.database().ref("users/" + user.uid).once("value")// check for user profile in the database
        .then(function (snapshot) {
            if (snapshot.exists()) {
                profile = snapshot.val();// set profile to the user profile in the database
            } else {
                profile = null;// set profile to null if user profile not found in the database
            }
            console.log(profile)
            if (profile === null || profile.username === undefined || profile.username === "") { // if user profile not found in the database or username is not set then go to username.html page
                console.log("checking")
                if (pageName() !== "username.html") {
                    goTo("username.html"); // go to username.html page when user profile not found in the database or username is not set
                }
            } else {
                if (pageName() === "index.html" || pageName() === "username.html") {
                    console.log()// if user is logged in and on index.html or username.html page then go to home.html page
                    goTo("home.html");// go to home.html page when user is logged in and on index.html or username.html page
                } else {
                    showWelcomeMessage();//Welcome message when user is logged in and on home.html page
                }
            }
        });
}

function fb_login() {// login when user click the login button
    firebase.auth().onAuthStateChanged(function (currentUser) {
        user = currentUser;
        checkUser();
    });
}

function getValue(id) {// get value from input field by id
    var input = document.getElementById(id);// get input field by id

    if (input) {
        return input.value.trim();// return value of input field
    }// return empty string if input field not found

    return "";
}
function getValueFromMany(ids) {// get value from input field by id from many ids
    for (var i = 0; i < ids.length; i++) {// loop through all ids
        var value = getValue(ids[i]);

        if (value !== "") {// return value if input field found and not empty
            return value;
        }
    }

    return "";
}

function Submit_1(event) {// submit user profile to the database
    if (event) {
        event.preventDefault();//prevent default form submission behavior
    }

    if (user === null) {// if user is not logged in then show alert message
        alert("Please login first.");
        return;
    }

    var name = getValueFromMany(["name", "Name", "Your Name", "yourName"]);//get value from input field by id from many ids
    var username = getValueFromMany(["username", "Username"]);
    var age = getValueFromMany(["age", "Age"]);

    if (name === "" || username === "" || age === "") {// if any of the input field is empty then show alert message
        alert("Please fill everything.");
        return;
    }

    profile = {// create user profile object
        name: name,
        email: user.email,
        username: username,
        age: age,
        uid: user.uid,
        game01HighScore: 0,
        game02HighScore: 0,
        scores: []

    };

    firebase.database().ref("users/" + user.uid).set(profile)
        .then(function () {
            goTo("home.html");
        });
}

function submitUsername(event) {
    Submit_1(event);
}

function showWelcomeMessage() {
    var box = document.getElementById("welcomeMessage");

    if (box && profile) {
        box.innerHTML = "Welcome, " + profile.username;
    }
}

function saveHighScore(gameName, score) {
    if (user === null || profile === null) {
        console.log("No user/profile found, score not saved.");
        return;
    }

    score = Number(score);

    if (isNaN(score)) {
        console.log("Score is not a number.");
        return;
    }

    var scoreRef = firebase.database().ref("highscores/" + score + "/" + user.uid);

    scoreRef.once("value")
        .then(function (snapshot) {
            var oldScore = 0;

            if (snapshot.exists()) {
                oldScore = Number(snapshot.val().score);
            }

            if (score > oldScore) {
                return scoreRef.set({
                    username: profile.username,
                    score: score
                });
            }
        });
}

function saveScore(gameName, score) {
    saveHighScore(gameName, score);
}

function showTopScores(gameName, boxId) {
    firebase.database().ref("highscores/" + gameName).once("value")
        .then(function (snapshot) {
            var allScores = [];

            snapshot.forEach(function (child) {
                allScores.push(child.val());
            });

            allScores.sort(function (a, b) {
                return b.score - a.score;
            });

            var topFive = allScores.slice(0, 5);
            var box = document.getElementById(boxId);

            if (box === null) {
                return;
            }

            if (topFive.length === 0) {
                box.innerHTML = "No scores yet.";
                return;
            }

        });
}

function HighScores() {
    showTopScores("Game01", "game01Scores");
    showTopScores("Game02", "game02Scores");
}

function HighScoreButton() {
    HighScores(score);
}

function Game01() {
    goTo("Geodash.html");
    console.log("Game01 button clicked");
}

function Game02() {
    goTo("Throw the rock.html");
    console.log("Game02 button clicked");
}

function Home_1() {
    goTo("home.html");
    console.log("Home button clicked");
}



function goTo(page) {
    console.log("move to another page", page)
    window.location.href = page;
}

function pageName() {
    var path = window.location.pathname;
    return path.substring(path.lastIndexOf("/") + 1);
}


