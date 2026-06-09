
function helloWorld() {
  console.log(helloWorld)
  firebase.database().ref('/').set(
    {
      message: 'Kia ora te ao'
    }
  )
}

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
    });
}

function handleLoginSuccess() {
   
    window.location.href = "home.js";
}


 