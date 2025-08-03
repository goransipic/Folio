import app from "./firebaseConfig";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      document.getElementById("login-logout").innerHTML =
        `<a href="#" class="nav-link text-white text-primary-hover"><i class="far fa-user me-2"></i>Odjava</a>`;

      const logoutLink = document.querySelector("#login-logout a");

      logoutLink.addEventListener("click", async (e) => {
        e.preventDefault();

        try {
          await signOut(auth);
          console.log("🚪 User signed out.");
          window.location.href = "/";
        } catch (error) {
          console.error("Logout failed:", error.message);
          alert("Logout failed: " + error.message);
        }
      });
    } else {
      document.getElementById("login-logout").innerHTML = `<a href="#" class="nav-link text-white text-primary-hover" data-bs-toggle="modal" data-bs-target="#topbarlogin"><i
      class="far fa-user me-2"></i>Prijava</a>`
    }
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

      const url = new URL(window.location.href);
      const segments = url.pathname.split("/");

      segments[segments.length - 1] = "contact.html"; // change only the last part
      url.pathname = segments.join("/");

      window.location.href = url.toString();
    } catch (error) {
      console.error("Login failed:", error.message);
      alert("Login failed: " + error.message);
    }
  });
})
