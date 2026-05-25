const myListingsContainer = document.getElementById('myListingsContainer');
const emptyMessage = document.getElementById('emptyMessage');
const loggedInUser = getLoggedInUser();

if (!loggedInUser) {
  alert('Please login to view your listings.');
  window.location.href = 'login.html';
}

async function displayMyListings() {
  try {
    const myListings = await apiRequest(`/cars?ownerId=${loggedInUser.id}`);
    myListingsContainer.innerHTML = '';

    if (myListings.length === 0) {
      emptyMessage.style.display = 'block';
      return;
    }

    emptyMessage.style.display = 'none';
    myListings.forEach(function (car) {
      const card = document.createElement('div');
      card.className = 'car-card';
      card.innerHTML = `
        <img src="${getCarImage(car)}" alt="${car.brand} ${car.model}">
        <div class="car-info">
          <h3>${car.brand} ${car.model}</h3>
          <p class="car-price">$${Number(car.price).toLocaleString()}</p>
          <div class="car-meta">
            <span>${car.year}</span><span>${car.mileage} km</span><span>${car.fuel}</span>
          </div>
          <div class="my-card-actions">
            <a href="car-detail.html?id=${car.id}" class="view-btn">View</a>
            <a href="edit-listing.html?id=${car.id}" class="edit-btn">Edit</a>
            <button class="delete-btn" onclick="deleteListing(${car.id})">Delete</button>
          </div>
        </div>`;
      myListingsContainer.appendChild(card);
    });
  } catch (error) {
    alert(error.message);
  }
}

async function deleteListing(id) {
  if (!confirm('Are you sure you want to delete this listing?')) return;
  try {
    await apiRequest(`/cars/${id}`, { method: 'DELETE' });
    displayMyListings();
  } catch (error) {
    alert(error.message);
  }
}

displayMyListings();
