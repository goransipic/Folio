import  app  from "./firebaseConfig";
import {addDoc, collection, getFirestore, Timestamp} from 'firebase/firestore';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// People need more than this to fill in four fields; bots submit instantly
const MIN_FILL_MS = 3000;

// Same ID as the pixel init in templates/partials/header.hbs
const META_PIXEL_ID = "27725301660487136";

// Meta wants trimmed, lowercased email as SHA-256 hex, so the raw address never leaves the browser
async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
}

const contact = {
  showPreloader: function () {
    const preloader = document.querySelector('.preloader')
    preloader.className = 'preloader';
    preloader.style.display = 'block';
  },
  hidePreloader: function () {
    const preloader = document.querySelector('.preloader')
    preloader.className += ' animate__animated animate__fadeOut';
    setTimeout(function () {
      preloader.style.display = 'none';
    }, 200);
  },
  showThanks: function () {
    const foo = document.getElementById("container-feedback");
    foo.innerHTML = `<div class="py-5 pe-0 pe-md-6">
        <h1 class="text-white-stroke">Hvala! Vaša poruka je poslana.</h1>
        <a class="btn btn-primary mt-4" href="index.html">Početna</a>
    </div>`;
  },
  handleForm: function () {
    const db = getFirestore(app);
    const form = document.getElementById("contact-form");
    const loadedAt = Date.now();

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      window.scrollTo(0, 0);

      // Likely bot: show the normal thanks so it doesn't retry, but save nothing
      const honeypot = document.getElementById("con-website").value;
      if (honeypot || Date.now() - loadedAt < MIN_FILL_MS) {
        this.showThanks();
        form.reset();
        return;
      }

      this.showPreloader();
      // Collect form data
      const name = document.getElementById("con-name").value.trim();
      const email = document.getElementById("con-email").value.trim();
      const subject = document.getElementById("con-subject").value.trim();
      const message = document.getElementById("con-message").value.trim();

      try {
        // Auto-generated ID so repeat messages from the same email are kept
        //await delay(2000)
        await addDoc(collection(db, "contactMessages"), {
          name,
          email,
          subject,
          message,
          createdAt: Timestamp.now()
        });

        // Meta Pixel lead; fbq is missing when an ad blocker stops the pixel
        if (typeof window.fbq === "function") {
          try {
            // Advanced Matching: re-init attaches the hashed email to this and later events
            window.fbq("init", META_PIXEL_ID, {em: await sha256Hex(email.toLowerCase())});
          } catch (err) {
            console.warn("Meta Pixel advanced matching skipped:", err);
          }
          window.fbq("track", "Lead");
        }

        this.hidePreloader();
        //console.log("Message sent, document ID:", email);
        this.showThanks();
        //alert("Hvala! Vaša poruka je poslana.");
        form.reset();
      } catch (err) {
        console.error("Error adding document:", err);
        alert("Došlo je do greške. Pokušajte ponovno.");
      }
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  contact.handleForm();
});

