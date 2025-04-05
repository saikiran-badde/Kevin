function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      const username = localStorage.getItem("username"); // Already saved during signup
      window.location.href = "dashboard.html";
    })
    .catch(error => alert(error.message));
}

function startSignup() {
  const username = document.getElementById("signupUsername").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("confirmPassword").value;

  if (password !== confirm) return alert("Passwords do not match.");

  const otp = Math.floor(100000 + Math.random() * 900000);
  sessionStorage.setItem("otp", otp);
  sessionStorage.setItem("signupEmail", email);
  sessionStorage.setItem("signupPassword", password);
  sessionStorage.setItem("signupUsername", username);

  emailjs.send("service_kfw7h1r", "template_kz0g69a", { to_email: email, otp })
    .then(() => document.getElementById("otpSection").style.display = "block")
    .catch(err => alert("OTP error: " + err));
}

function verifyAndSignup() {
  const enteredOtp = document.getElementById("otpInput").value;
  const storedOtp = sessionStorage.getItem("otp");

  if (enteredOtp !== storedOtp) return alert("Incorrect OTP");

  const email = sessionStorage.getItem("signupEmail");
  const password = sessionStorage.getItem("signupPassword");
  const username = sessionStorage.getItem("signupUsername");

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
      localStorage.setItem("username", username);
      alert("Account created successfully!");
      window.location.href = "dashboard.html";
    })
    .catch(error => alert("Signup error: " + error.message));
}

function logout() {
  firebase.auth().signOut().then(() => {
    localStorage.clear();
    window.location.href = "index.html";
  });
}
