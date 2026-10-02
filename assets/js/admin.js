import app from "./firebaseConfig";
import {getFirestore, collection, getDocs, query, orderBy} from "firebase/firestore";
import {getAuth, onAuthStateChanged, signOut} from "firebase/auth";

const db = getFirestore(app)
const auth = getAuth(app);

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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
            <th>Datum</th>
            <th>Name</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Message</th>
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
        <td class="text-nowrap">${data.createdAt.toDate().toLocaleString("hr-HR", {dateStyle: "short", timeStyle: "short"})}</td>
        <td>${escapeHtml(data.name)}</td>
        <td>${escapeHtml(data.email)}</td>
        <td>${escapeHtml(data.subject)}</td>
        <td style="white-space: pre-wrap; word-break: break-word; min-width: 250px;">${escapeHtml(data.message)}</td>
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
      try {
        await loadMessages();
      } catch (err) {
        console.error("Error loading messages:", err);
        document.getElementById("table-folio").innerHTML = `<div class="py-5 pe-0 pe-md-6">
            <h1 class="text-white-stroke">Nemate pristup.</h1>
            <p class="text-light mt-3">Prijavljeni ste kao ${escapeHtml(user.email)}.</p>
            <button id="admin-logout" class="btn btn-primary mt-4">Odjava</button>
        </div>`;
        document.getElementById("admin-logout").addEventListener("click", async () => {
          await signOut(auth);
          window.location.href = "index.html";
        });
      }
    } else {
      document.getElementById("table-folio").innerHTML = `<div class="py-5 pe-0 pe-md-6">
            <h1 class="text-white-stroke">Niste obavili login.</h1>
            <a class="btn btn-primary mt-4" href="index.html">Početna</a>
        </div>`;
    }
  })
})
