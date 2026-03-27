// firebase.js
const firebase = require('firebase');
const firebaseConfig = require('./firebaseConfig.json'); // Your Firebase config

// Initialize Firebase
function initializeFirebase() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
}

function getUserData(chatId) {
  return firebase.database().ref(`users/${chatId}`).once('value').then(snapshot => snapshot.val() || {});
}

function setUserData(chatId, data) {
  return firebase.database().ref(`users/${chatId}`).update(data);
}

module.exports = { initializeFirebase, getUserData, setUserData };
