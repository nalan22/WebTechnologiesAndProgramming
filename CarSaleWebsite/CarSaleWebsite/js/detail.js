const carDetailContainer = document.getElementById('carDetail');
const params = new URLSearchParams(window.location.search);
const carId = Number(params.get('id'));
const loggedInUser = getLoggedInUser();

function getCarImages(car) {
  if (car.images && car.images.length > 0) return car.images;
  if (car.image) return [car.image];
  return ['../assets/images/cars/bmw1.png'];
}

function getCarFeatures(car) {
  if (car.features && car.features.length > 0) return car.features;
  return ['Air Conditioning', 'Power Windows', 'ABS'];
}

async function deleteCurrentListing(id) {
  if (!confirm('Are you sure you want to delete this listing?')) return;
  try {
    await apiRequest(`/cars/${id}`, { method: 'DELETE' });
    alert('Listing deleted successfully.');
    window.location.href = 'my-listings.html';
  } catch (error) {
    alert(error.message);
  }
}

async function renderCarDetail() {
  let selectedCar;
  try {
    selectedCar = await apiRequest(`/cars/${carId}`);
  } catch (error) {
    selectedCar = typeof cars !== 'undefined' ? cars.find(car => Number(car.id) === Number(carId)) : null;
  }

  if (!selectedCar) {
    carDetailContainer.innerHTML = `
      <div class="detail-not-found">
        <h2>Car not found</h2>
        <p>The vehicle you are looking for does not exist.</p>
        <a href="listings.html" class="btn primary">Back to Listings</a>
      </div>`;
    return;
  }

  const carImages = getCarImages(selectedCar);
  const carFeatures = getCarFeatures(selectedCar);
  const isOwner = loggedInUser && selectedCar.ownerId && Number(selectedCar.ownerId) === Number(loggedInUser.id);

  carDetailContainer.innerHTML = `
    <section class="detail-card">
      <div class="detail-image">
        <button class="slider-btn prev" id="prevBtn">&#10094;</button>
        <img id="mainCarImage" src="${carImages[0]}" alt="${selectedCar.brand} ${selectedCar.model}">
        <button class="slider-btn next" id="nextBtn">&#10095;</button>
        <div class="thumbnail-row">
          ${carImages.map((image, index) => `<img src="${image}" alt="${selectedCar.brand} ${selectedCar.model}" class="thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">`).join('')}
        </div>
      </div>
      <div class="detail-info">
        <h2>${selectedCar.brand} ${selectedCar.model}</h2>
        <p class="detail-price">$${Number(selectedCar.price).toLocaleString()}</p>
        <p class="detail-description">${selectedCar.description || 'No description available.'}</p>
        <div class="detail-specs">
          <div class="spec-item"><span>Year</span><strong>${selectedCar.year || '-'}</strong></div>
          <div class="spec-item"><span>Fuel</span><strong>${selectedCar.fuel || '-'}</strong></div>
          <div class="spec-item"><span>Transmission</span><strong>${selectedCar.transmission || '-'}</strong></div>
          <div class="spec-item"><span>Mileage</span><strong>${Number(selectedCar.mileage || 0).toLocaleString()} km</strong></div>
          <div class="spec-item"><span>Type</span><strong>${selectedCar.type || '-'}</strong></div>
          <div class="spec-item"><span>Color</span><strong>${selectedCar.color || '-'}</strong></div>
          <div class="spec-item"><span>Horsepower</span><strong>${selectedCar.horsepower || 0} HP</strong></div>
          <div class="spec-item"><span>Drive</span><strong>${selectedCar.drive || '-'}</strong></div>
          <div class="spec-item"><span>Consumption</span><strong>${selectedCar.consumption || 0} L / 100 km</strong></div>
          <div class="spec-item"><span>Engine Size</span><strong>${selectedCar.engineSize || 0} cc</strong></div>
          <div class="spec-item"><span>Doors</span><strong>${selectedCar.doors || '-'}</strong></div>
          <div class="spec-item"><span>Seats</span><strong>${selectedCar.seats || '-'}</strong></div>
        </div>
        <div class="detail-features">
          <h3>Features</h3>
          <div class="features-list">${carFeatures.map(feature => `<div class="feature-item">${feature}</div>`).join('')}</div>
        </div>
        <div class="detail-actions">
          <a href="listings.html" class="btn">Back to Listings</a>
          <a href="contact.html" class="btn primary">Contact Seller</a>
          ${isOwner ? `<a href="edit-listing.html?id=${selectedCar.id}" class="btn">Edit Listing</a><button class="btn danger-btn" onclick="deleteCurrentListing(${selectedCar.id})">Delete Listing</button>` : ''}
        </div>
      </div>
    </section>`;

  setupImageSlider(carImages);
}

function setupImageSlider(carImages) {
  let currentImageIndex = 0;
  const mainCarImage = document.getElementById('mainCarImage');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const thumbnails = document.querySelectorAll('.thumbnail');

  function updateMainImage(index) {
    currentImageIndex = index;
    mainCarImage.src = carImages[currentImageIndex];
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    thumbnails[currentImageIndex].classList.add('active');
  }

  if (prevBtn) prevBtn.addEventListener('click', () => updateMainImage(currentImageIndex === 0 ? carImages.length - 1 : currentImageIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => updateMainImage(currentImageIndex === carImages.length - 1 ? 0 : currentImageIndex + 1));
  thumbnails.forEach(thumbnail => thumbnail.addEventListener('click', () => updateMainImage(Number(thumbnail.dataset.index))));
}

renderCarDetail();
