
var GLOBAL_user; // Google's user object

// Set up a listener for the login state of the user.
function fb_login() {
    authenticationListener = firebase.auth().onAuthStateChanged(fb_handleLogin);
}

// Run when the login state of the user changes.
function fb_handleLogin(_user) {
    if (_user) {
        console.log("User is logged in")
        GLOBAL_user = _user; // Save the user object to a global variable
        window.location.href = "Username.html" // Move to other page
    } else {
        console.log("User is NOT logged in - Starting the popup process")
        fb_popupLogin();

    }

}

// Run the Google login popup
function fb_popupLogin() {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then((result) => {
        GLOBAL_user = result.user; // Save the user object to a global variable
        console.log("User has logged in")
        window.location.href.once = "Username.html" // Moved to other page
    });
}

function fb_logout() {
    // this line turns off the listener
    firebase.auth().signOut();
    console.log("Successfully logged out")
    window.location.href = "index.html";
}

function Game01() {
    window.location.href = "Geodash.html" // Page to Game 1  Geodash
    console.log("Running Geodash")
}

function Game02() {
    window.location.href = "Throw the rock.html" // Page to Game 2 Throw the rock
    console.log("Running Throw the rock")
}

function Home_1() {
    window.location.href = "home.html" //Moving back to Home Page
    console.log("Back to Home Page")
}


function HighScores() { // setting up the database for high scores
    console.log(HighScores)
    firebase.database().ref('/').once('value').then((snapshot) => {
        console.log(snapshot.val());
    });
    function writeHighScores() {
        firebase.database().ref('/').set({
            Game01: {
                users: {
                    "user1": {
                        name: "Athul",
                        score: 100
                    },
                    "user2": {
                        name: "John",
                        score: 0

                    }

                }
            },
            Game02: {
                users: {
                    "user1": {
                        name: "Athul",
                        score: 50
                    },
                    "user2": {
                        name: "John",
                        score: 80
                    }

                }
            }
        })
    }
};


function Submit_1(event) {
    const form = document.getElementById('myForm');
    const username = form.Username.value;
    const name = form.name.value;
    const age = form.Age.value;

    // Prevent standard page reload
    event.preventDefault();

    // Reference to the specific user in the database
    const userRef = firebase.database().ref('/game1/users/' + username);

    // Check if the username already exists
    userRef.once('value').then((snapshot) => {
        if (snapshot.exists()) {
            alert("Error: Username already taken. Please choose another one.");
        } else {

            userRef.set({
                name: name,
                age: age
            }).then(() => {
                console.log("Form submitted successfully!");

                // Call the high score function here before leaving the page
                // This initializes their score to 0 using their custom username
                firebase.database().ref('/Game01/users/' + username).set({
                    name: name,
                    score: 0
                }).then(() => {
                    window.location.href = "home.html";
                });
            });
        }
    }).catch((error) => {
        console.error("Error checking username: ", error);
    });
};


//function Submit_1(event) {

// const form = document.getElementById('myForm');
// firebase.database().ref('/game1/users/' + form.Username.value).set({
// name: form.name.value,
// age: form.Age.value
//});


// Prevent standard page reload if you are handling submission 
//event.preventDefault();

// Your submission logic goes here
// console.log("Form is valid! Submitting.");
//window.location.href = "home.html"

function HighScores() {
    // setting up the database for high scores 
    console.log(HighScores);

    firebase.database().ref('/').once('value').then((snapshot) => {
        console.log(snapshot.val());
    });

    // Pass the username, name, and score as parameters
    function writeHighScores(username, name, score) {
        // Use the username variable inside the database path
        firebase.database().ref('/Game01/users/' + username).set({
            name: name,
            score: score
        })
            .then(() => {
                console.log("High score saved successfully!");
            })
            .catch((error) => {
                console.error("Error saving score: ", error);
            });
    }
}


