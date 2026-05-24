console.log("auth.js loaded");

// ================= REGISTER =================
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (fullName === "" || email === "" || password === "" || confirmPassword === "") {
      alert("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find(function (user) {
      return user.email === email;
    });

    if (existingUser) {
      alert("This email is already registered. Please login.");
      return;
    }

    const newUser = {
      id: Date.now(),
      fullName: fullName,
      email: email,
      password: password
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful! You can now login.");
    window.location.href = "login.html";
  });
}


// ================= LOGIN =================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim().toLowerCase();
    const password = document.getElementById("login-password").value.trim();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find(function (user) {
      return user.email === email && user.password === password;
    });

    if (!foundUser) {
      alert("Invalid email or password. Please register first.");
      return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(foundUser));

    alert("Login successful!");
    window.location.href = "index.html";
  });
}


// ================= NAVBAR LOGIN STATUS =================
const authUser = JSON.parse(localStorage.getItem("loggedInUser"));

const myListingsLinks = document.querySelectorAll(".my-listings-link");
const dashboardLinks = document.querySelectorAll(".dashboard-link");
const profileButtons = document.querySelectorAll("#profileBtn, #loginBtn, .profile-btn");

if (authUser) {
  myListingsLinks.forEach(function (link) {
    link.style.display = "block";
  });

  dashboardLinks.forEach(function (link) {
    link.style.display = "block";
  });

  profileButtons.forEach(function (btn) {
    btn.textContent = "Profile";
    btn.href = "dashboard.html";
  });
} else {
  myListingsLinks.forEach(function (link) {
    link.style.display = "none";
  });

  dashboardLinks.forEach(function (link) {
    link.style.display = "none";
  });

  profileButtons.forEach(function (btn) {
    btn.textContent = "Login";
    btn.href = "login.html";
  });
}


// ================= LOGOUT BUTTON =================
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", function (e) {
    e.preventDefault();

    localStorage.removeItem("loggedInUser");
    alert("Logged out successfully.");
    window.location.href = "login.html";
  });
}