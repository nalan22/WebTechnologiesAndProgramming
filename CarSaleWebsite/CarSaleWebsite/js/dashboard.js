const loggedInUser = getLoggedInUser();
const userName = document.getElementById('userName');
const totalListings = document.getElementById('totalListings');
const totalValue = document.getElementById('totalValue');
const latestCar = document.getElementById('latestCar');
const averagePrice = document.getElementById('averagePrice');
const recentListings = document.getElementById('recentListings');
const noRecentListings = document.getElementById('noRecentListings');

if (!loggedInUser) {
  alert('Please login to access your profile.');
  window.location.href = 'login.html';
}

function renderRecentListings(listings) {
  recentListings.innerHTML = '';
  if (!listings || listings.length === 0) {
    noRecentListings.style.display = 'block';
    return;
  }
  noRecentListings.style.display = 'none';
  listings.forEach((car) => {
    const item = document.createElement('div');
    item.className = 'recent-listing-item';
    item.innerHTML = `
      <img src="${getCarImage(car)}" alt="${car.brand} ${car.model}">
      <div class="recent-info">
        <h4>${car.brand} ${car.model}</h4>
        <p>$${Number(car.price).toLocaleString()} • ${car.year} • ${car.mileage} km</p>
      </div>
      <div class="recent-actions">
        <a href="car-detail.html?id=${car.id}" class="view-small-btn">View</a>
        <a href="edit-listing.html?id=${car.id}" class="edit-small-btn">Edit</a>
      </div>`;
    recentListings.appendChild(item);
  });
}

async function displayDashboard() {
  userName.textContent = loggedInUser.fullName || loggedInUser.email || 'User';
  try {
    const stats = await apiRequest(`/dashboard/${loggedInUser.id}`);
    totalListings.textContent = stats.totalListings;
    totalValue.textContent = '$' + Number(stats.totalValue).toLocaleString();
    latestCar.textContent = stats.latestCar ? `${stats.latestCar.brand} ${stats.latestCar.model}` : 'None';
    averagePrice.textContent = '$' + Number(stats.averagePrice).toLocaleString();
    renderRecentListings(stats.recentListings);
  } catch (error) {
    alert(error.message);
  }
}

displayDashboard();
