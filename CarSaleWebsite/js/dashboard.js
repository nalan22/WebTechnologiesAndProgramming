const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

const userName = document.getElementById("userName");
const totalListings = document.getElementById("totalListings");
const totalValue = document.getElementById("totalValue");
const latestCar = document.getElementById("latestCar");
const averagePrice = document.getElementById("averagePrice");
const recentListings = document.getElementById("recentListings");
const noRecentListings = document.getElementById("noRecentListings");
const logoutBtn = document.getElementById("logoutBtn");

if (!loggedInUser) {
  alert("Please login to access your profile.");
  window.location.href = "login.html";
}

function getUserListings() {
  return JSON.parse(localStorage.getItem("userListings")) || [];
}

function getCarImage(car) {
  if (car.images && car.images.length > 0) {
    return car.images[0];
  }

  if (car.image) {
    return car.image;
  }

  return "../assets/images/cars/bmw1.png";
}

function getMyListings() {
  const allListings = getUserListings();

  return allListings.filter(function (car) {
    return Number(car.ownerId) === Number(loggedInUser.id);
  });
}

function displayDashboard() {
  const myListings = getMyListings();

  userName.textContent =
    loggedInUser.fullName ||
    loggedInUser.name ||
    loggedInUser.email ||
    "User";

  totalListings.textContent = myListings.length;

  const value = myListings.reduce(function (sum, car) {
    return sum + Number(car.price || 0);
  }, 0);

  totalValue.textContent = "$" + value.toLocaleString();

  if (myListings.length > 0) {
    const latest = myListings[0];

    latestCar.textContent = latest.brand + " " + latest.model;

    const avg = value / myListings.length;
    averagePrice.textContent = "$" + Math.round(avg).toLocaleString();
  } else {
    latestCar.textContent = "None";
    averagePrice.textContent = "$0";
  }

  displayRecentListings(myListings);
}

function displayRecentListings(myListings) {
  recentListings.innerHTML = "";

  if (myListings.length === 0) {
    noRecentListings.style.display = "block";
    return;
  }

  noRecentListings.style.display = "none";

  const recent = myListings.slice(0, 3);

  recent.forEach(function (car) {
    const item = document.createElement("div");
    item.className = "recent-listing-item";

    item.innerHTML = `
      <img src="${getCarImage(car)}" alt="${car.brand} ${car.model}">

      <div class="recent-info">
        <h4>${car.brand} ${car.model}</h4>
        <p>$${Number(car.price).toLocaleString()} • ${car.year} • ${car.mileage} km</p>
      </div>

      <div class="recent-actions">
        <a href="car-detail.html?id=${car.id}" class="view-small-btn">View</a>
        <a href="edit-listing.html?id=${car.id}" class="edit-small-btn">Edit</a>
      </div>
    `;

    recentListings.appendChild(item);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", function (e) {
    e.preventDefault();

    localStorage.removeItem("loggedInUser");

    alert("Logged out successfully.");
    window.location.href = "login.html";
  });
}

displayDashboard();