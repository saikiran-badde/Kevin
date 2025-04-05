const firebaseConfig = {
  apiKey: "AIzaSyBEP1-Kxz10v6MuMzVMi-AaLs3gNZNfdaI",
  authDomain: "kevin-267bc.firebaseapp.com",
  projectId: "kevin-267bc",
  storageBucket: "kevin-267bc.firebasestorage.app",
  messagingSenderId: "302532711334",
  appId: "1:302532711334:web:7edf7e82176e4466f0f567",
  measurementId: "G-XSCMPQ3DWK"
};
firebase.initializeApp(firebaseConfig);
emailjs.init("asApBLVCT-CCvMpnV");

function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(user => {
      localStorage.setItem("username", email.split('@')[0]);
      window.location.href = "dashboard.html";
    })
    .catch(error => alert(error.message));
}

function logout() {
  firebase.auth().signOut().then(() => {
    localStorage.clear();
    window.location.href = "index.html";
  });
}

function startSignup() {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("confirmPassword").value;
  if (password !== confirm) return alert("Passwords do not match.");

  const otp = Math.floor(100000 + Math.random() * 900000);
  sessionStorage.setItem("otp", otp);
  const params = { to_email: email, otp };

  emailjs.send("service_kfw7h1r", "template_kz0g69a", params)
    .then(() => {
      document.getElementById("otpSection").style.display = "block";
    })
    .catch(err => alert("OTP Error: " + err));
}

function verifyAndSignup() {
  const enteredOtp = document.getElementById("otpInput").value;
  const originalOtp = sessionStorage.getItem("otp");
  if (enteredOtp !== originalOtp) return alert("Incorrect OTP");

  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(user => {
      alert("Account created successfully!");
      localStorage.setItem("username", email.split('@')[0]);
      window.location.href = "dashboard.html";
    })
    .catch(error => alert("Signup error: " + error.message));
}

// Dashboard logic
if (window.location.pathname.includes("dashboard")) {
  const name = localStorage.getItem("username");
  if (name) {
    document.getElementById("welcomeMessage").innerText = `Welcome, ${name}!`;
    document.getElementById("userDropdown").innerText = name;
  }
}
