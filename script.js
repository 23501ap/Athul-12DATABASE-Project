
var GLOBAL_user;
var authenticationListener;
function fb_login() {
    authenticationListener = firebase.auth().onAuthStateChanged(fb_popupLogin);
}
function fb_handleLogin(_user) {
    if (_user) {

        GLOBAL_user = _user;
        console.log("User is logged in - Starting the popup process")
        console.log("User details: ", GLOBAL_user);
        firebase.database().ref('Game/users/' + GLOBAL_user.uid).once('value').then((snapshot) => {
            if (snapshot.exists()) {
                console.log("User data already exists in the database.");//checks for the user data in the database and if it exists, it will log a message to the console.
            } else {
                console.log("User data does not exist in the database. Creating new entry.");
                firebase.database().ref('/users/' + GLOBAL_user.uid).set({
                    name: GLOBAL_user.displayName,
                    email: GLOBAL_user.email,
                    uid: GLOBAL_user.uid,
                    age: GLOBAL_user.age,
                    username: GLOBAL_user.username
                })
                    .then(() => {
                        console.log("User data saved successfully!");
                    })
                    .catch((error) => {
                        console.error("Error saving user data: ", error);
                    });
            }
        }).catch((error) => {
            console.error("Error checking user data: ", error);
        });



    }

    else {
        console.log("User is NOT logged in - Starting the popup process")
        fb_popupLogin();
    }

}
function fb_popupLogin() {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then((result) => {
        GLOBAL_user = result.user; //Save the user details object to a global variable
        console.log("User has logged in")
        window.location.href = "home.html" //Moving to Home Page
    });
}

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
    firebase.database().ref('/Game01').once('value').then((snapshot) => {
        console.log(snapshot.val());
        score = snapshot.val().score;
    });
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
    firebase.database().ref('/users/' + form.Username.value).set({
        name: form.name.value,
        age: form.Age.value
    });


    //Prevent standard page reload if you are handling submission 
    event.preventDefault();

    //Your submission logic goes here
    console.log("Form is valid! Submitting.");
    window.location.href = "home.html"
}


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

        return;
    }
    console.log("Here")

    console.log(GLOBAL_user.displayName + " likes " + Username + " They have it " + Yourname + " times")
    firebase.database().ref('/users/' + GLOBAL_user.uid).update(
        {
            name: name,
            age: Age,
            username: Username
        }
    )

    HTML_OUTPUT.innerHTML = GLOBAL_user.displayName + " likes " + Username + " They have it " + Yourname + " times"
    window.location.href = "home.html" //Moving to game Pages
}

