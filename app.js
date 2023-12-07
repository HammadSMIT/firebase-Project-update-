import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyBVYYv_rwXY_LnQROK7WMZ-T53VM1KdopI",
    authDomain: "project-2-4c60f.firebaseapp.com",
    projectId: "project-2-4c60f",
    storageBucket: "project-2-4c60f.appspot.com",
    messagingSenderId: "262871930056",
    appId: "1:262871930056:web:1a995e7f96fc0bef4bc1fd",
    measurementId: "G-B8N6BFQB0M"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, (user) => {
    if (user) {
        const userUid = user.uid;
        localStorage.setItem("userUid", userUid);
    } else {
        localStorage.removeItem("userUid");
    }
});

// ====== Authentication ======

let btn = document.querySelector("#Sbtn")

btn.addEventListener("click", () => {

    let getemail = document.querySelector("#Semail")
    let getpass = document.querySelector("#Spass")

    let userData = {
        semail: getemail.value,
        spassword: getpass.value,
    };
    // creating user with eamil and password
    createUserWithEmailAndPassword(auth, userData.semail, userData.spassword)
        // email value  , password value
        .then(async (userCredential) => {
            const user = userCredential.user; // getting user from firebase
            await setDoc(doc(db, "users", user.uid), {
                // collection name,   unique id of user
                ...userData, // setting array in a database
                userid: user.uid, // also user id in the database
            });
            location.href = "./signin.html"
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(error)
        });

})
