const featuredContainer = document.getElementById("featuredCars");
const prevBtn = document.getElementById("featuredPrev");
const nextBtn = document.getElementById("featuredNext");

let currentIndex = 0;
let autoSlide;

/* ---------------- helpers ---------------- */

function getVisibleCount() {
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 1100) return 2;
  return 3;
}

function getCarImage(car) {
  const image = car.images?.[0] || car.image || car.img || "../assets/images/cars/bmw1.png";
  return image;
}

function getMileage(car) {
  return Number(car.mileage ?? car.km ?? 0);
}

function getBrand(car) {
  return car.brand || car.make || "";
}

function getPrice(car) {
  return Number(car.price) || 0;
}

function getBadge(car) {
  const currentYear = new Date().getFullYear();
  const carAge = currentYear - Number(car.year || currentYear);
  const carMileage = getMileage(car);

  if (carMileage < 10000 && carAge < 3) {
    return `<span class="badge new">NEW</span>`;
  } else if (carAge > 0 && carMileage < carAge * 10000) {
    return `<span class="badge low">LOW KM</span>`;
  }

  return "";
}

function getFeaturedCars() {
  return cars.slice(0, 8);
}

/* ---------------- render ---------------- */

function renderFeaturedCars() {
  if (!featuredContainer) return;

  const featuredCars = getFeaturedCars();

  featuredContainer.innerHTML = featuredCars
    .map((car) => {
      const carImage = getCarImage(car);
      const badge = getBadge(car);
      const brand = getBrand(car);
      const mileage = getMileage(car);
      const price = getPrice(car);

      return `
        <div class="featured-slide">
          <div class="car-card" data-id="${car.id}">
            <div class="car-image">
              ${badge}
              <img src="${carImage}" alt="${brand} ${car.model}">
            </div>

            <div class="car-info">
              <h3>${brand} ${car.model}</h3>

              <p class="car-meta">
                ${car.year} • ${car.fuel} • ${car.transmission} • ${mileage.toLocaleString()} km
              </p>

              <div class="car-bottom">
                <span class="car-price">${price.toLocaleString()} ₺</span>
                <a href="car-detail.html?id=${car.id}" class="btn">View Details</a>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  document.querySelectorAll(".featured .car-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".btn")) return;
      const carId = card.dataset.id;
      window.location.href = `car-detail.html?id=${carId}`;
    });
  });

  updateSlider();
}

/* ---------------- slider ---------------- */

function updateSlider() {
  if (!featuredContainer) return;

  const visibleCount = getVisibleCount();
  const totalSlides = featuredContainer.querySelectorAll(".featured-slide").length;
  const maxIndex = Math.max(totalSlides - visibleCount, 0);

  if (currentIndex > maxIndex) {
    currentIndex = 0;
  }

  const slideWidth = 100 / visibleCount;

  document.querySelectorAll(".featured-slide").forEach((slide) => {
    slide.style.minWidth = `${slideWidth}%`;
    slide.style.maxWidth = `${slideWidth}%`;
    slide.style.flex = `0 0 ${slideWidth}%`;
  });

  featuredContainer.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
}

function nextSlide() {
  if (!featuredContainer) return;

  const visibleCount = getVisibleCount();
  const totalSlides = featuredContainer.querySelectorAll(".featured-slide").length;
  const maxIndex = Math.max(totalSlides - visibleCount, 0);

  if (currentIndex >= maxIndex) {
    currentIndex = 0;
  } else {
    currentIndex++;
  }

  updateSlider();
}

function prevSlide() {
  if (!featuredContainer) return;

  const visibleCount = getVisibleCount();
  const totalSlides = featuredContainer.querySelectorAll(".featured-slide").length;
  const maxIndex = Math.max(totalSlides - visibleCount, 0);

  if (currentIndex <= 0) {
    currentIndex = maxIndex;
  } else {
    currentIndex--;
  }

  updateSlider();
}

/* ---------------- auto slide ---------------- */

function startAutoSlide() {
  stopAutoSlide();
  autoSlide = setInterval(nextSlide, 3000);
}

function stopAutoSlide() {
  clearInterval(autoSlide);
}

/* ---------------- init ---------------- */

function initFeaturedSlider() {
  if (!featuredContainer) return;

  renderFeaturedCars();
  startAutoSlide();

  if (nextBtn) {
    nextBtn.addEventListener("click", nextSlide);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", prevSlide);
  }

  const sliderWindow = document.querySelector(".featured-slider-window");

  if (sliderWindow) {
    sliderWindow.addEventListener("mouseenter", stopAutoSlide);
    sliderWindow.addEventListener("mouseleave", startAutoSlide);
  }

  window.addEventListener("resize", updateSlider);
}

initFeaturedSlider();