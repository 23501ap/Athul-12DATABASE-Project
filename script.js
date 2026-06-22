
var GLOBAL_user;
var authenticationListener;
function fb_login() {
    authenticationListener = firebase.auth().onAuthStateChanged(fb_handleLogin);
}
function fb_handleLogin(_user) {
    if (_user) {
        console.log("User is logged in")
        GLOBAL_user = _user;
        firebase.database().ref('/Games/users/' + GLOBAL_user.uid).update(
            {
                name: GLOBAL_user.displayName
            }
        );
        window.location.href = "home.html" //Moving to Home Page

    } else {
        console.log("User is NOT logged in - Starting the popup process")
        fb_popupLogin();

    }
}
function fb_popupLogin() {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then((result) => {
        GLOBAL_user = result.user; //Save the user details object to a global variable
        console.log("User has logged in")
        window.location.href = "Home.html" //Moving to Home Page
    });
}

var authenticantionListner
function fb_login() {
    authenticationListener = firebase.auth().onAuthStateChanged(fb_handleLogin);
}
function fb_logout() {
    authenticationListener = null; // this line turns off the listener
    firebase.auth().signOut();
    console.log("logged out successfully")
    window.location.href = "index.html" //Moving back to Login Page
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
        firebase.database().ref('/Games').set({
            Games: {

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

        });
    }
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

function Submit_1() {
    //Check if the user is logged in
    if (!GLOBAL_user) {
        alert("Please log in before submitting the form!");
        return;
    }
    // Get the form data
    const Yourname = document.getElementById("Your Name").value;
    const Age = document.getElementById("Age").value;
    const Username = document.getElementById("Username").value;
    console.log("Here")
    console.log(Username)

    console.log(GLOBAL_user.displayName + " likes " + Username + " They have it " + Yourname + " times")
    firebase.database().ref('/Games/users/' + GLOBAL_user.uid).update(
        {
            name: Yourname,
            age: Age,
            username: Username
        }
    )

    HTML_OUTPUT.innerHTML = GLOBAL_user.displayName + " likes " + Username + " They have it " + Yourname + " times"
}
function fb_readError(error) {
    console.log("There was an error reading reading the message");
    console.error(error);
};
