// Library Imports
import { initializeApp } from "firebase/app";

// Function to initialize and configure Firebase
export const getFirebase = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyCZbpkBaVnCdOAU6QgyUXJ7Qr0klV6WR2E",
    authDomain: "umessage-4ac9d.firebaseapp.com",
    projectId: "umessage-4ac9d",
    storageBucket: "umessage-4ac9d.appspot.com",
    messagingSenderId: "424792951066",
    appId: "1:424792951066:web:9b0cf7924860396e8244a3",
    measurementId: "G-T2E38CRCTY",
    databaseURL: "https://umessage-4ac9d-default-rtdb.europe-west1.firebasedatabase.app/"
  };

  // Initialize Firebase
  return initializeApp(firebaseConfig);
}