console.log('auth.js loaded with backend support');

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const authUser = getLoggedInUser();

if (registerForm) {
  registerForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    if (!fullName || !email || !password || !confirmPassword) {
      alert('Please fill in all fields.');
      return;
    }

    if (password.length < 8) {
      alert('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ fullName, email, password })
      });
      alert('Registration successful! You can now login.');
      window.location.href = 'login.html';
    } catch (error) {
      alert(error.message);
    }
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value.trim();

    try {
      const result = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      setLoggedInUser(result.user);
      alert('Login successful!');
      window.location.href = 'index.html';
    } catch (error) {
      alert(error.message || 'Invalid email or password. Please register first.');
    }
  });
}

function updateNavbar() {
  const user = getLoggedInUser();
  const myListingsLinks = document.querySelectorAll('.my-listings-link');
  const dashboardLinks = document.querySelectorAll('.dashboard-link');
  const profileButtons = document.querySelectorAll('#profileBtn, #loginBtn, .profile-btn');

  if (user) {
    myListingsLinks.forEach(link => (link.style.display = 'block'));
    dashboardLinks.forEach(link => (link.style.display = 'block'));
    profileButtons.forEach(btn => {
      btn.textContent = 'Profile';
      btn.href = 'dashboard.html';
    });
  } else {
    myListingsLinks.forEach(link => (link.style.display = 'none'));
    dashboardLinks.forEach(link => (link.style.display = 'none'));
    profileButtons.forEach(btn => {
      btn.textContent = 'Login';
      btn.href = 'login.html';
    });
  }
}

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', function (e) {
    e.preventDefault();
    logoutUser();
    alert('Logged out successfully.');
    window.location.href = 'login.html';
  });
}

updateNavbar();
