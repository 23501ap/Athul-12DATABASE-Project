var GLOBAL_user;
var GLOBAL_profile;
var authenticationListener;
 
function fb_login() {
    authenticationListener = firebase.auth().onAuthStateChanged(fb_handleLogin);
}
 
function fb_handleLogin(user) {
    if (user) {
        GLOBAL_user = user;
 
        firebase.database().ref('/users/' + GLOBAL_user.uid).once('value').then((snapshot) => {
            if (snapshot.exists()) {
                GLOBAL_profile = snapshot.val();

                if (window.location.pathname.endsWith("home.html")) {
                    showWelcomeMessage();
                    HighScores();
                } else {
                    goHome();
                }
            } else {
                window.location.href = "username.html";
            }
        }).catch((error) => {
            console.error("Error checking user data: ", error);
        });
    } else {
        fb_popupLogin();
    }
}
 
function fb_popupLogin() {
    var provider = new firebase.auth.GoogleAuthProvider();
 
    firebase.auth().signInWithPopup(provider).then((result) => {
        GLOBAL_user = result.user;
    }).catch((error) => {
        console.error("Login failed: ", error);
    });
}
 
function fb_logout() {
    authenticationListener = null;
    firebase.auth().signOut().then(() => {
        window.location.href = "index.html";
    });
}
 
function Submit_1(event) {
    event.preventDefault();
 
    if (!GLOBAL_user) {
        return;
    }
 
    const form = document.getElementById('myform');
    const name = form.name.value.trim();
    const username = form.Username.value.trim();
    const age = form.Age.value.trim();
 
    if (!name || !username || !age) {
        alert("Please fill in name, username, and age.");
        return;
    }
 
    const profile = {
        name: name,
        age: age,
        username: username,
        email: GLOBAL_user.email,
        uid: GLOBAL_user.uid
    };
 
    firebase.database().ref('/users/' + GLOBAL_user.uid).set(profile)
        .then(() => {
            GLOBAL_profile = profile;
            goHome();
        })
        .catch((error) => {
            console.error("Error saving profile: ", error);
        });
}
 
function goHome() {
    window.location.href = "home.html";
}
 
function showWelcomeMessage() {
    if (!GLOBAL_user) return;
 
    firebase.database().ref('/users/' + GLOBAL_user.uid).once('value').then((snapshot) => {
        if (snapshot.exists()) {
            GLOBAL_profile = snapshot.val();
            const el = document.getElementById('welcomeMessage');
            if (el) {
                el.innerHTML = "Welcome back, " + GLOBAL_profile.username + "!";
            }
        }
    });
}
 
function Game01() {
    window.location.href = "Geodash.html";
}
 
function Game02() {
    window.location.href = "Throw the rock.html";
}
 
function Home_1() {
    window.location.href = "home.html";
}
 
function saveHighScore(gameId, score) {
    if (!GLOBAL_user || !GLOBAL_profile) {
        return;
    }
 
    const scoreRef = firebase.database().ref('/highscores/' + gameId + '/' + GLOBAL_user.uid);
 
    scoreRef.once('value').then((snapshot) => {
        const existing = snapshot.exists() ? snapshot.val().score : -Infinity;
 
        if (score > existing) {
            scoreRef.set({
                username: GLOBAL_profile.username,
                score: score
            }).catch((error) => {
                console.error("Error saving high score: ", error);
            });
        }
    });
}
 
function getHighScores(gameId, callback) {
    firebase.database().ref('/highscores/' + gameId).on('value', (snapshot) => {
        const scores = [];
        snapshot.forEach((child) => {
            scores.push(child.val());
        });
        scores.sort((a, b) => b.score - a.score);
        if (callback) callback(scores);
    });
}
 
function HighScores() {
    getHighScores("Game01", (scores) => {
        const top5 = scores.slice(0, 5);
        const el = document.getElementById('game01Scores');
        if (el) {
            el.innerHTML = top5.map((s) => s.username + " - " + s.score).join("<br>");
        }
    });
 
    getHighScores("Game02", (scores) => {
        const top5 = scores.slice(0, 5);
        const el = document.getElementById('game02Scores');
        if (el) {
            el.innerHTML = top5.map((s) => s.username + " - " + s.score).join("<br>");
        }
    });
}