/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const database = firebase.database();

/* function setPersistenceNone() {
  // [START auth_set_persistence_none]
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
    .then(() => {
      let provider = new firebase.auth.GoogleAuthProvider();
      // In memory persistence will be applied to the signed in Google user
      // even though the persistence was set to 'none' and a page redirect
      // occurred.
      return firebase.auth().signInWithRedirect(provider);
    })
    .catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
    });
  // [END auth_set_persistence_none]
}
*/
/* function incCount() {
  console.log('incing the count');
  firebase.database().ref('blogpost/count').set(5 + 1);
}
*/
/*
function testDel() {
  firebase.database().ref('blogpost/test').remove();
}
*/

// const btnSignUp = document.getElementById('btnSignUp');
const btnLogin = document.getElementById('btnLogin');
const btnLogout = document.getElementById('btnLogout');
const btnSignUp = document.getElementById('btnSignUp');
const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const txtConfirm = document.getElementById('txtConfirm');

// Add login event

if (btnLogin != null){
  btnLogin.addEventListener('click', (e) => {
    console.log('Logging in');
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    // Sign in
    const promise = auth.signInWithEmailAndPassword(email, pass)
    .then(() => {
      if(firebase.auth().currentUser){
        window.location = 'temp.html';
      }
    });

    promise.catch((e) => console.log(e.message));
  })
}

// Add siginup event
 if (btnSignUp != null){
   btnSignUp.addEventListener('click', (e) => {
    if(txtPassword.value != txtConfirm.value){
      console.log("Password's don't match");
      return;
    }
    console.log('Signing up');
    const email = txtEmail.value;
    const password = txtPassword.value;
    const auth = firebase.auth();
    
    // Sign in
    const promise = auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      if(firebase.auth().currentUser){
        window.location = 'temp.html';
      }
    });
    promise.catch((e) => console.log(e.message));
   
  })
}

firebase.auth().onAuthStateChanged((firebaseUser) => {
  if(firebaseUser){

  }
  else{
    console.log('Invalid Username And/Or password');
  }
  console.log('authChange');

});

// Logout function
if(btnLogout!=null)btnLogout.addEventListener('click', (e) => {
  firebase.auth().signOut();
  window.location = 'index.html';
});