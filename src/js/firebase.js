// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDQFtIyqIvPM5sNKRCfRjg4nfuEJdEXeAw",
  authDomain: "entrelacos-e80a5.firebaseapp.com",
  projectId: "entrelacos-e80a5",
  storageBucket: "entrelacos-e80a5.firebasestorage.app",
  messagingSenderId: "1069713412117",
  appId: "1:1069713412117:web:e40a2007086e11f2e67e1c",
  measurementId: "G-D4LP4H38F6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
