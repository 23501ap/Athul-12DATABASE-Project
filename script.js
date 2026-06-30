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

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

var GLOBAL_user = null;
var GLOBAL_profile = null;
var authenticationListener = null;

function getPageName() {
    var page = window.location.pathname.split("/").pop().toLowerCase();
    return page || "index.html";
}

function goToPage(pageName) {
    if (getPageName() !== pageName.toLowerCase()) {
        window.location.href = pageName;
    }
}

function getInputValue(idList) {
    for (var i = 0; i < idList.length; i++) {
        var input = document.getElementById(idList[i]) || document.getElementsByName(idList[i])[0];

        if (input) {
            return input.value.trim();
        }
    }

    return "";
}

function fb_login() {
    if (authenticationListener) {
        authenticationListener();
    }

    authenticationListener = firebase.auth().onAuthStateChanged(fb_handleLogin);
}

function fb_handleLogin(user) {
    var page = getPageName();

    if (!user) {
        GLOBAL_user = null;
        GLOBAL_profile = null;

        if (page !== "index.html") {
            goToPage("index.html");
        }

        return;
    }

    GLOBAL_user = user;

    firebase.database().ref("/users/" + user.uid).once("value")
        .then(function(snapshot) {
            if (snapshot.exists()) {
                GLOBAL_profile = snapshot.val();
            } else {
                GLOBAL_profile = null;
            }

            if (!GLOBAL_profile || !GLOBAL_profile.username) {
                if (page !== "username.html") {
                    goToPage("username.html");
                }
                return;
            }

            if (page === "index.html" || page === "username.html") {
                goToPage("home.html");
                return;
            }

            showWelcomeMessage();
            HighScores();
        })
        .catch(function(error) {
            console.error("Error checking user data:", error);
        });
}

function fb_popupLogin() {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithRedirect(provider)
        .catch(function(error) {
            console.error("Login failed:", error);
        });
}
function fb_logout() {
    if (authenticationListener) {
        authenticationListener();
        authenticationListener = null;
    }

    firebase.auth().signOut()
        .then(function() {
            goToPage("index.html");
        })
        .catch(function(error) {
            console.error("Logout failed:", error);
        });
}

function Submit_1(event) {
    if (event) {
        event.preventDefault();
    }

    if (!GLOBAL_user) {
        alert("Please login first.");
        return;
    }

    var name = getInputValue(["name", "Name", "Your Name", "yourName"]);
    var username = getInputValue(["username", "Username"]);
    var age = getInputValue(["age", "Age"]);

    if (!name || !username || !age) {
        alert("Please fill in your name, username, and age.");
        return;
    }

    var profile = {
        name: name,
        username: username,
        age: age,
        email: GLOBAL_user.email || "",
        uid: GLOBAL_user.uid
    };

    firebase.database().ref("/users/" + GLOBAL_user.uid).set(profile)
        .then(function() {
            GLOBAL_profile = profile;
            goToPage("home.html");
        })
        .catch(function(error) {
            console.error("Error saving profile:", error);
        });
}

function showWelcomeMessage() {
    var message = document.getElementById("welcomeMessage");

    if (message && GLOBAL_profile) {
        message.innerHTML = "Welcome back, " + GLOBAL_profile.username + "!";
    }
}

function saveHighScore(gameId, score) {
    if (!GLOBAL_user || !GLOBAL_profile) {
        console.log("Login and username are needed before saving a score.");
        return;
    }

    var newScore = Number(score);

    if (isNaN(newScore)) {
        console.log("Score must be a number.");
        return;
    }

    var scoreRef = firebase.database().ref("/highscores/" + gameId + "/" + GLOBAL_user.uid);

    scoreRef.once("value")
        .then(function(snapshot) {
            var oldScore = snapshot.exists() ? Number(snapshot.val().score) : -1;

            if (newScore > oldScore) {
                return scoreRef.set({
                    username: GLOBAL_profile.username,
                    score: newScore,
                    uid: GLOBAL_user.uid
                });
            }

            return null;
        })
        .then(function() {
            console.log("Score checked/saved for " + gameId + ": " + newScore);
        })
        .catch(function(error) {
            console.error("Error saving high score:", error);
        });
}

function saveScore(gameId, score) {
    saveHighScore(gameId, score);
}

function getHighScores(gameId, callback) {
    firebase.database().ref("/highscores/" + gameId).once("value")
        .then(function(snapshot) {
            var scores = [];

            snapshot.forEach(function(child) {
                scores.push(child.val());
            });

            scores.sort(function(a, b) {
                return Number(b.score) - Number(a.score);
            });

            callback(scores.slice(0, 5));
        })
        .catch(function(error) {
            console.error("Error getting high scores:", error);
        });
}

function showTop5(gameId, elementId) {
    getHighScores(gameId, function(scores) {
        var output = document.getElementById(elementId);

        if (!output) {
            return;
        }

        if (scores.length === 0) {
            output.innerHTML = "No scores yet";
            return;
        }

        output.innerHTML = scores.map(function(item, index) {
            return (index + 1) + ". " + item.username + " - " + item.score;
        }).join("<br>");
    });
}

function HighScores() {
    showTop5("Game01", "game01Scores");
    showTop5("Game02", "game02Scores");
}

function HighScoreButton() {
    HighScores();
}

function Game01() {
    goToPage("Geodash.html");
}

function Game02() {
    goToPage("Throw the rock.html");
}

function Home_1() {
    goToPage("home.html");
}

window.addEventListener("load", function() {
    fb_login();
});
