import { db } from "./firebaseConfig";
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect form data
    const name = document.getElementById("con-name").value.trim();
    const email = document.getElementById("con-email").value.trim();
    const subject = document.getElementById("con-subject").value.trim();
    const message = document.getElementById("con-message").value.trim();

    try {
      // Create a document reference with email as ID
      const docRef = doc(db, "contactMessages", email);

      // Set the document data
      await setDoc(docRef, {
        name,
        email,
        subject,
        message,
        createdAt: Timestamp.now()
      });

      //console.log("Message sent, document ID:", email);
      const foo = document.getElementById("container-feedback");
      foo.innerHTML = `<div>
            <h1 class="text-white-stroke">Hvala! Vaša poruka je poslana.</h1>
            <a class="btn btn-primary mt-4" href="/">Početna</a>
        </div>`;
      //alert("Hvala! Vaša poruka je poslana.");
      form.reset();
    } catch (err) {
      console.error("Error adding document:", err);
      alert("Došlo je do greške. Pokušajte ponovno.");
    }
  });
});
