import  app  from "./firebaseConfig";
import {addDoc, collection, getFirestore, Timestamp} from 'firebase/firestore';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
  handleForm: function () {
    const db = getFirestore(app);
    const form = document.getElementById("contact-form");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      this.showPreloader();
      window.scrollTo(0, 0);
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
          window.fbq("track", "Lead");
        }

        this.hidePreloader();
        //console.log("Message sent, document ID:", email);
        const foo = document.getElementById("container-feedback");
        foo.innerHTML = `<div class="py-5 pe-0 pe-md-6">
            <h1 class="text-white-stroke">Hvala! Vaša poruka je poslana.</h1>
            <a class="btn btn-primary mt-4" href="index.html">Početna</a>
        </div>`;
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

