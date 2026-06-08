const featuredContainer = document.getElementById('featuredCars');
const prevBtn = document.getElementById('featuredPrev');
const nextBtn = document.getElementById('featuredNext');
let currentIndex = 0;
let autoSlide;
let featuredData = [];

function getVisibleCount() {
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 1100) return 2;
  return 3;
}

function getMileageValue(car) { return Number(car.mileage ?? car.km ?? 0); }
function getBrand(car) { return car.brand || car.make || ''; }
function getPriceValue(car) { return Number(car.price) || 0; }

function getBadge(car) {
  const currentYear = new Date().getFullYear();
  const carAge = currentYear - Number(car.year || currentYear);
  const mileage = getMileageValue(car);
  if (mileage < 10000 && carAge < 3) return '<span class="badge new">NEW</span>';
  if (carAge > 0 && mileage < carAge * 10000) return '<span class="badge low">LOW KM</span>';
  return '';
}

function renderFeaturedCars() {
  if (!featuredContainer) return;
  const featuredCars = featuredData.slice(0, 8);
  featuredContainer.innerHTML = featuredCars.map((car) => `
    <div class="featured-slide">
      <div class="car-card" data-id="${car.id}">
        <div class="car-image">
          ${getBadge(car)}
          <img src="${getCarImage(car)}" alt="${getBrand(car)} ${car.model}">
        </div>
        <div class="car-info">
          <h3>${getBrand(car)} ${car.model}</h3>
          <p class="car-meta">${car.year} • ${car.fuel} • ${car.transmission} • ${getMileageValue(car).toLocaleString()} km</p>
          <div class="car-bottom">
            <span class="car-price">${getPriceValue(car).toLocaleString()} ₺</span>
            <a href="car-detail.html?id=${car.id}" class="btn">View Details</a>
          </div>
        </div>
      </div>
    </div>`).join('');

  document.querySelectorAll('.featured .car-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn')) return;
      window.location.href = `car-detail.html?id=${card.dataset.id}`;
    });
  });
  updateSlider();
}

function updateSlider() {
  if (!featuredContainer) return;
  const visibleCount = getVisibleCount();
  const totalSlides = featuredContainer.querySelectorAll('.featured-slide').length;
  const maxIndex = Math.max(totalSlides - visibleCount, 0);
  if (currentIndex > maxIndex) currentIndex = 0;
  const slideWidth = 100 / visibleCount;
  document.querySelectorAll('.featured-slide').forEach((slide) => {
    slide.style.minWidth = `${slideWidth}%`;
    slide.style.maxWidth = `${slideWidth}%`;
    slide.style.flex = `0 0 ${slideWidth}%`;
  });
  featuredContainer.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
}

function nextSlide() {
  const visibleCount = getVisibleCount();
  const totalSlides = featuredContainer.querySelectorAll('.featured-slide').length;
  const maxIndex = Math.max(totalSlides - visibleCount, 0);
  currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
  updateSlider();
}

function prevSlide() {
  const visibleCount = getVisibleCount();
  const totalSlides = featuredContainer.querySelectorAll('.featured-slide').length;
  const maxIndex = Math.max(totalSlides - visibleCount, 0);
  currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
  updateSlider();
}

function startAutoSlide() { stopAutoSlide(); autoSlide = setInterval(nextSlide, 3000); }
function stopAutoSlide() { clearInterval(autoSlide); }

async function initFeaturedSlider() {
  if (!featuredContainer) return;
  try {
    featuredData = await apiRequest('/cars');
  } catch (error) {
    featuredData = typeof cars !== 'undefined' ? cars : [];
  }
  renderFeaturedCars();
  startAutoSlide();
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  const sliderWindow = document.querySelector('.featured-slider-window');
  if (sliderWindow) {
    sliderWindow.addEventListener('mouseenter', stopAutoSlide);
    sliderWindow.addEventListener('mouseleave', startAutoSlide);
  }
  window.addEventListener('resize', updateSlider);
}

initFeaturedSlider();
