/**
 * Firebase client - preparado para ligação ao Firebase.
 * Por agora usa localStorage para persistência local.
 * Quando configurares o Firebase, basta descomentar e adicionar as credenciais.
 */

// import { initializeApp } from "firebase/app";
// import { getDatabase } from "firebase/database";

// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_PROJECT.firebaseapp.com",
//   databaseURL: "https://YOUR_PROJECT-default-rtdb.europe-west1.firebasedatabase.app",
//   projectId: "YOUR_PROJECT",
//   storageBucket: "YOUR_PROJECT.appspot.com",
//   messagingSenderId: "YOUR_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };

// const app = initializeApp(firebaseConfig);
// export const db = getDatabase(app);

// Placeholder - sem Firebase, usa localStorage
export const db = null;
