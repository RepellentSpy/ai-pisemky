console.log("[THIS IS AN EXPERIMENTAL VERSION]");
console.log("Firebase.js loaded");

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, doc, getDoc, getDocs, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB9XyDDJv0_ALJ_wS7vG8JwHvOMAb4QmSQ",
    authDomain: "hz-labs.firebaseapp.com",
    databaseURL: "https://hz-labs-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "hz-labs",
    storageBucket: "hz-labs.appspot.com",
    messagingSenderId: "967010072425",
    appId: "1:967010072425:web:40e87c5ef8f31707e62ff8",
    measurementId: "G-N3FQWW1NEN"
};

// Začít Firebase
initializeApp(firebaseConfig)

// Začít Firebase služby
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// collection reference => colRef 
const colRef = collection(db, "books");
if (colRef) {
    console.log("🟢 Succesfully connected to Firestore database");
} else {
    console.log("🔴 Failed to connect to Firestore database");
}

getDocs(colRef)
    .then((snapshot) => {
        let books = [] // prázdné pole
        snapshot.docs.forEach((doc) => {
            books.push({ ...doc.data(), id: doc.id })
        })
        console.log(books)
        //document.getElementById("title_link").innerHTML = books[0].title;
    })
    .catch(err => { // V případě erroru do konzole napíše errorovou zprávu
        console.log(err.message)
    })