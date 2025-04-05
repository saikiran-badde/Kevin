
// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBEP1-Kxz10v6MuMzVMi-AaLs3gNZNfdaI",
  authDomain: "kevin-267bc.firebaseapp.com",
  projectId: "kevin-267bc",
  storageBucket: "kevin-267bc.firebasestorage.app",
  messagingSenderId: "302532711334",
  appId: "1:302532711334:web:7edf7e82176e4466f0f567",
  measurementId: "G-XSCMPQ3DWK"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ---------- LOGIN ----------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    auth.signInWithEmailAndPassword(email, password)
      .then(() => window.location.href = "dashboard.html")
      .catch((error) => alert("Login failed: " + error.message));
  });
}

// ---------- SIGNUP ----------
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("signupUsername").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    sessionStorage.setItem("otp", otp);
    sessionStorage.setItem("signupData", JSON.stringify({ username, email, password }));

    emailjs.send("default_service", "template_otp", {
      to_email: email,
      otp: otp
    }).then(() => {
      const userOTP = prompt("Enter the OTP sent to your email:");
      if (userOTP == otp) {
        auth.createUserWithEmailAndPassword(email, password)
          .then((cred) => {
            return db.collection("users").doc(cred.user.uid).set({
              username: username,
              email: email
            });
          })
          .then(() => {
            alert("Account created successfully!");
            window.location.href = "dashboard.html";
          })
          .catch((err) => alert("Signup error: " + err.message));
      } else {
        alert("Invalid OTP");
      }
    }).catch((err) => {
      alert("Failed to send OTP: " + err.message);
    });
  });
}

// ---------- DASHBOARD ----------
if (window.location.pathname.includes("dashboard.html")) {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const doc = await db.collection("users").doc(user.uid).get();
      const username = doc.data().username;
      document.getElementById("welcomeMsg").textContent = "Welcome, " + username + "!";
      document.getElementById("userDropdown").textContent = username;
    } else {
      window.location.href = "index.html";
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    auth.signOut().then(() => window.location.href = "index.html");
  });

  document.getElementById("getAccessBtn").addEventListener("click", () => {
    document.getElementById("qrSection").style.display = "block";
  });
}
