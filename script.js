
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
        window.location.href = "Username.html" // Moved to other page
    });
}
var authenticationListener // this is a global variable to store the listener

function fb_login() {
    authenticationListener = firebase.auth().onAuthStateChanged(handleLogin);

}
function fb_logout() {
    authenticationListener(); // this line turns off the listener
    firebase.auth().signOut();
    console.log("logged out (hopefully)")
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

function Submit_1(event) {
    const form = document.getElementById('myForm');

    // Prevent standard page reload if you are handling submission 
    event.preventDefault();

    // Your submission logic goes here
    console.log("Form is valid! Submitting...");
    window.location.href = "home.html"
}

function HighScores() {
    firebase.database().ref('/Games').set(
        {
            Game1: {
                users: {

                }

            },
            Game2: {
                users: {

                }
            }

        }

    );
}



