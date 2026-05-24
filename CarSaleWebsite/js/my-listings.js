const myListingsContainer = document.getElementById("myListingsContainer");
const emptyMessage = document.getElementById("emptyMessage");

const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser) {
  alert("Please login to view your listings.");
  window.location.href = "login.html";
}

function getUserListings() {
  return JSON.parse(localStorage.getItem("userListings")) || [];
}

function saveUserListings(listings) {
  localStorage.setItem("userListings", JSON.stringify(listings));
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

function displayMyListings() {
  const allListings = getUserListings();

  const myListings = allListings.filter(function (car) {
    return Number(car.ownerId) === Number(loggedInUser.id);
  });

  myListingsContainer.innerHTML = "";

  if (myListings.length === 0) {
    emptyMessage.style.display = "block";
    return;
  }

  emptyMessage.style.display = "none";

  myListings.forEach(function (car) {
    const card = document.createElement("div");
    card.className = "car-card";

    card.innerHTML = `
      <img src="${getCarImage(car)}" alt="${car.brand} ${car.model}">

      <div class="car-info">
        <h3>${car.brand} ${car.model}</h3>

        <p class="car-price">$${Number(car.price).toLocaleString()}</p>

        <div class="car-meta">
          <span>${car.year}</span>
          <span>${car.mileage} km</span>
          <span>${car.fuel}</span>
        </div>

        <div class="my-card-actions">
          <a href="car-detail.html?id=${car.id}" class="view-btn">View</a>
          <a href="edit-listing.html?id=${car.id}" class="edit-btn">Edit</a>
          <button class="delete-btn" onclick="deleteListing(${car.id})">Delete</button>
        </div>
      </div>
    `;

    myListingsContainer.appendChild(card);
  });
}

function deleteListing(id) {
  const confirmDelete = confirm("Are you sure you want to delete this listing?");

  if (!confirmDelete) {
    return;
  }

  const allListings = getUserListings();

  const updatedListings = allListings.filter(function (car) {
    return Number(car.id) !== Number(id);
  });

  saveUserListings(updatedListings);

  displayMyListings();
}

displayMyListings();