var firebase = require('firebase')
require("firebase/auth");
const firebaseConfig = {
	apiKey: "AIzaSyD8adTF-SWhIvmzCcFzwv3gEHe2CmOk3rg",
	authDomain: "remonet-f20c4.firebaseapp.com",
	databaseURL: "https://remonet-f20c4.firebaseio.com",
	projectId: "remonet-f20c4",
	storageBucket: "remonet-f20c4.appspot.com",
	messagingSenderId: "753129541418"
};

module.exports =  firebase.initializeApp(firebaseConfig);


