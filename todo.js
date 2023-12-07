

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";


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
const ids = []

onAuthStateChanged(auth, (user) => {
    if (user) {
        const userUid = user.uid;
        localStorage.setItem("userUid", userUid);
    } else {
        localStorage.removeItem("userUid");
        location.href = "./index.html"
    }
});



const AddTodo = document.getElementById("AddTodo")
if (AddTodo) {

    AddTodo.addEventListener("click", async () => {

        // ======== TODO =========
        let Getinp = document.querySelector("#GetInp");
        const userUid = localStorage.getItem("userUid");
        const docRef = await addDoc(collection(db, userUid), {
            Task: Getinp.value,
            Time: new Date().toLocaleString(),
        });
        Getinp.value = '';
    })
}



function getData() {

    onAuthStateChanged(auth, (user) => {
        if (user) {
            let ul = document.querySelector("#getul");
            const userUid = localStorage.getItem("userUid");
            onSnapshot(collection(db, userUid), (data) => {
                data.docChanges().forEach((newData) => {

                    ids.push(newData.doc.id)

                    if (newData.type == 'removed') {

                        let del = document.getElementById(newData.doc.id);
                        if (del) {
                            del.remove()
                        }

                    }
                    else if (newData.type == 'added') {
                        ul.innerHTML += `
                <li id=${newData.doc.id}>${newData.doc.data().Task} <br> ${newData.doc.data().Time} <br><button onclick="delTodo('${newData.doc.id}')" >Delete</button> <button  onclick="editTodo(this,'${newData.doc.id}')" >Edit</button> <br><br> </li>
                `;

                    }


                })
            })

        }
    })
}

getData();

async function delTodo(id) {
    const userUid = localStorage.getItem("userUid")
    await deleteDoc(doc(db, userUid, id));
}


async function editTodo(e, id) {

    var editVal = prompt("Enter Edit Value");
    e.parentNode.firstChild.nodeValue = editVal;
    const userUid = localStorage.getItem("userUid")
    await updateDoc(doc(db, userUid, id), {
        Task: editVal,
        Time: new Date().toLocaleString(),

    });

}


async function DelAll() {

    var list = document.getElementById("getul");
    list.innerHTML = "";
    const userUid = localStorage.getItem("userUid")
    for (var i = 0; i < ids.length; i++) {
        await deleteDoc(doc(db, userUid, ids[i]));
    }



}

// =============== logout =================

let logoutbtn = document.querySelector("#LObtn")
logoutbtn.addEventListener("click", () => {
    auth.signOut().then(() => {

        localStorage.removeItem("userUid");
        location.href = "./index.html"
    })
})



// ========= WINDOW ===========

window.delTodo = delTodo
window.editTodo = editTodo
window.DelAll = DelAll