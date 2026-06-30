var firebaseConfig = {
    apiKey: "AIzaSyCRFEEaBxknFnx2RI4Tl5eKz0_9HUdQAZg",
    authDomain: "athul-12database-project.firebaseapp.com",
    databaseURL: "https://athul-12database-project-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "athul-12database-project",
    storageBucket: "athul-12database-project.firebasestorage.app",
    messagingSenderId: "378430784037",
    appId: "1:378430784037:web:07d0633890fb04411c35cc",
    measurementId: "G-3SSMLK5SC7"
};

firebase.initializeApp(firebaseConfig);


var user = null;
var profile = null;


function login() {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
        .then(function (result) {
            user = result.user;
            checkUser();
        })
        .catch(function (error) {
            console.log(error);

            if (error.code === "auth/popup-blocked" || error.code === "auth/popup-closed-by-user") {
                alert("Popup was blocked. Please allow popups and try again.");
            }
        });
}

function fb_popupLogin() {
    login();
}

function logout() {
    firebase.auth().signOut()
        .then(function () {
            user = null;
            profile = null;
            goTo("index.html");
        });
}

function fb_logout() {
    logout();
}

function checkUser() {
    if (user === null) {
        if (pageName() !== "index.html") {
            goTo("index.html");
        }

        return;
    }

    firebase.database().ref("users/" + user.uid).once("value")
        .then(function (snapshot) {
            if (snapshot.exists()) {
                profile = snapshot.val();
            } else {
                profile = null;
            }

            if (profile === null || profile.username === undefined || profile.username === "") {
                if (pageName() !== "username.html") {
                    goTo("username.html");
                }
            } else {
                if (pageName() === "index.html" || pageName() === "username.html") {
                    goTo("home.html");
                } else {
                    showWelcomeMessage();
                    HighScores();
                }
            }
        });
}

function fb_login() {
    firebase.auth().onAuthStateChanged(function (currentUser) {
        user = currentUser;
        checkUser();
    });
}

function getValue(id) {
    var input = document.getElementById(id);

    if (input) {
        return input.value.trim();
    }

    return "";
}
function getValueFromMany(ids) {
    for (var i = 0; i < ids.length; i++) {
        var value = getValue(ids[i]);

        if (value !== "") {
            return value;
        }
    }

    return "";
}
function Submit_1(event) {
    if (event) {
        event.preventDefault();
    }

    if (user === null) {
        alert("Please login first.");
        return;
    }

    var name = getValueFromMany(["name", "Name", "Your Name", "yourName"]);
    var username = getValueFromMany(["username", "Username"]);
    var age = getValueFromMany(["age", "Age"]);

    if (name === "" || username === "" || age === "") {
        alert("Please fill everything.");
        return;
    }

    profile = {
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
    HighScores();
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
    window.location.href = page;
}

function pageName() {
    var path = window.location.pathname;
    return path.substring(path.lastIndexOf("/") + 1);
}

fb_login();
