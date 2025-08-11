import app from "./firebaseConfig";
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore";

const db = getFirestore(app)

async function loadMessages() {
  const q = query(
    collection(db, "contactMessages"),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);
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
  await loadMessages();
})
