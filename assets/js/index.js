import app from "./firebaseConfig";
import {getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut} from "firebase/auth";

const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, (user) => {
    const currentUser = user;
    const logoutLink = document.querySelector("#login-logout a");
    logoutLink.addEventListener("click", async (e) => {
      e.preventDefault();
      if (currentUser) {
        // Show the modal
        window.location.href = "admin.html";
      } else {
        const modal = new bootstrap.Modal(document.getElementById('topbarlogin'));
        modal.show();
      }
    });
  });
  // Handle form submission
  const form = document.getElementById("login-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("exampleInputEmail1").value;
    const password = document.getElementById("exampleInputPassword1").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Logged in:", user.email);

      window.location.href = "admin.html";
    } catch (error) {
      console.error("Login failed:", error.message);
      alert("Login failed: " + error.message);
    }
  });
})
