const carDetailContainer = document.getElementById("carDetail");

const params = new URLSearchParams(window.location.search);
const carId = Number(params.get("id"));

function getStoredCars() {
  return JSON.parse(localStorage.getItem("userListings")) || [];
}

const allCars = [...getStoredCars(), ...cars];
const selectedCar = allCars.find((car) => Number(car.id) === carId);

if (!selectedCar) {
  carDetailContainer.innerHTML = `
    <div class="detail-not-found">
      <h2>Car not found</h2>
      <p>The vehicle you are looking for does not exist.</p>
      <a href="listings.html" class="btn primary">Back to Listings</a>
    </div>
  `;
} else {
  const carImages =
    selectedCar.images && selectedCar.images.length
      ? selectedCar.images
      : [selectedCar.image];

  const carFeatures =
  selectedCar.features && selectedCar.features.length
    ? selectedCar.features
    : ["Air Conditioning", "Power Windows", "ABS"];


  carDetailContainer.innerHTML = `
    <section class="detail-card">
      <div class="detail-image">
        <button class="slider-btn prev" id="prevBtn">&#10094;</button>

        <img
          id="mainCarImage"
          src="${carImages[0]}"
          alt="${selectedCar.brand} ${selectedCar.model}"
        >

        <button class="slider-btn next" id="nextBtn">&#10095;</button>

        <div class="thumbnail-row">
          ${carImages
            .map(
              (image, index) => `
                <img
                  src="${image}"
                  alt="${selectedCar.brand} ${selectedCar.model}"
                  class="thumbnail ${index === 0 ? "active" : ""}"
                  data-index="${index}"
                >
              `
            )
            .join("")}
        </div>
      </div>

      <div class="detail-info">
        <h2>${selectedCar.brand} ${selectedCar.model}</h2>
        <p class="detail-price">$${selectedCar.price.toLocaleString()}</p>
        <p class="detail-description">${selectedCar.description}</p>

<div class="detail-specs">
  <div class="spec-item"><span>Year</span><strong>${selectedCar.year}</strong></div>
  <div class="spec-item"><span>Fuel</span><strong>${selectedCar.fuel}</strong></div>
  <div class="spec-item"><span>Transmission</span><strong>${selectedCar.transmission}</strong></div>
  <div class="spec-item"><span>Mileage</span><strong>${selectedCar.mileage.toLocaleString()} km</strong></div>
  <div class="spec-item"><span>Type</span><strong>${selectedCar.type}</strong></div>
  <div class="spec-item"><span>Color</span><strong>${selectedCar.color}</strong></div>
  <div class="spec-item"><span>Horsepower</span><strong>${selectedCar.horsepower} HP</strong></div>
  <div class="spec-item"><span>Drive</span><strong>${selectedCar.drive}</strong></div>
  <div class="spec-item"><span>Consumption</span><strong>${selectedCar.consumption} L / 100 km</strong></div>
  <div class="spec-item"><span>Engine Size</span><strong>${selectedCar.engineSize} cc</strong></div>
  <div class="spec-item"><span>Doors</span><strong>${selectedCar.doors}</strong></div>
  <div class="spec-item"><span>Seats</span><strong>${selectedCar.seats}</strong></div>
</div>

<div class="detail-features">
  <h3>Features</h3>
  <div class="features-list">
    ${carFeatures
      .map(
        (feature) => `
          <div class="feature-item">${feature}</div>
        `
      )
      .join("")}
  </div>
</div>

        <div class="detail-actions">
          <a href="listings.html" class="btn">Back to Listings</a>
          <a href="#" class="btn primary">Contact Seller</a>
        </div>
      </div>
    </section>
  `;

  let currentImageIndex = 0;

  const mainCarImage = document.getElementById("mainCarImage");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const thumbnails = document.querySelectorAll(".thumbnail");

  function updateMainImage(index) {
    currentImageIndex = index;
    mainCarImage.src = carImages[currentImageIndex];

    thumbnails.forEach((thumb) => thumb.classList.remove("active"));
    thumbnails[currentImageIndex].classList.add("active");
  }

  prevBtn.addEventListener("click", () => {
    currentImageIndex =
      currentImageIndex === 0
        ? carImages.length - 1
        : currentImageIndex - 1;

    updateMainImage(currentImageIndex);
  });

  nextBtn.addEventListener("click", () => {
    currentImageIndex =
      currentImageIndex === carImages.length - 1
        ? 0
        : currentImageIndex + 1;

    updateMainImage(currentImageIndex);
  });

  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      updateMainImage(Number(thumbnail.dataset.index));
    });
  });


}