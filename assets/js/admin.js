import app from "./firebaseConfig";
import {getFirestore, collection, getDocs, query, orderBy} from "firebase/firestore";
import {getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut} from "firebase/auth";

const db = getFirestore(app)
const auth = getAuth(app);

async function loadMessages() {
  const q = query(
    collection(db, "contactMessages"),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);

  document.getElementById("table-folio").innerHTML = `<h3 class="text-light py-4">Contact Messages</h3>
        <table class="table table-dark table-striped table-hover">
          <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Message</th>
            <th>Created At</th>
          </tr>
          </thead>
          <tbody id="messagesTableBody">
          <!-- Data will be injected here by JS -->
          </tbody>
        </table>`

  const tableBody = document.getElementById("messagesTableBody");

  tableBody.innerHTML = ""; // clear previous data
  let rows = 0;
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    rows++;
    const row = `
      <tr>
        <th scope="row">${rows}</th>
        <td>${data.name}</td>
        <td>${data.email}</td>
        <td>${data.subject}</td>
        <td>${data.message}</td>
        <td>${data.createdAt.toDate().toLocaleString()}</td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}


document.addEventListener("DOMContentLoaded", async () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      document.getElementById("table-folio").innerHTML = `<!-- Pre loader -->
                            <div class="d-flex justify-content-center align-items-center" style="height: 100vh;">
                              <div class="spinner-border me-2" role="status">
                                  <span class="visually-hidden">Loading...</span>
                              </div>
                              <span class="fs-4">Učitavanje...</span>
                          </div>`
      await loadMessages();
    } else {
      document.getElementById("table-folio").innerHTML = `<div class="py-5 pe-0 pe-md-6">
            <h1 class="text-white-stroke">Niste obavili login.</h1>
            <a class="btn btn-primary mt-4" href="index.html">Početna</a>
        </div>`;
    }
  })
})
