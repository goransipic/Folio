// src/firebase.js
import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
// example for Firestore

// reCAPTCHA Enterprise site key (public, safe to ship); registered for folio-dizajn.hr
const RECAPTCHA_SITE_KEY = "6LccPNstAAAAAGSfz_eYqRr8THK61F4PEek5ftUA";

const firebaseConfig = {
  apiKey: "AIzaSyDUqIlHcBSbD0I9NjDKfaDMdTkMfxmXk3s",
  authDomain: "folio-af776.firebaseapp.com",
  projectId: "folio-af776",
  storageBucket: "folio-af776.firebasestorage.app",
  messagingSenderId: "394494170771",
  appId: "1:394494170771:web:5eb7622ff17c2879ef5f66",
  measurementId: "G-MHVR9GDG3N"
};

const app = initializeApp(firebaseConfig);

// Local dev can't pass reCAPTCHA; this prints a debug token to the console
// that has to be registered in Firebase console > App Check > Manage debug tokens.
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

// App Check proves Firestore requests come from this site, so bots
// writing straight to the database are rejected once enforcement is on.
initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider(RECAPTCHA_SITE_KEY),
  isTokenAutoRefreshEnabled: true
});

export default app ;
