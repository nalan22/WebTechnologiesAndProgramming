const carList = document.getElementById('carList');
const makeFilter = document.getElementById('makeFilter');
const modelFilter = document.getElementById('modelFilter');
const typeFilter = document.getElementById('typeFilter');
const filterSearchInput = document.getElementById('filterSearchInput');
const searchInput = document.getElementById('searchInput');
const priceFrom = document.getElementById('priceFrom');
const priceTo = document.getElementById('priceTo');
const kmFrom = document.getElementById('kmFrom');
const kmTo = document.getElementById('kmTo');
const yearFrom = document.getElementById('yearFrom');
const yearTo = document.getElementById('yearTo');
const inspectionFilter = document.getElementById('inspectionFilter');
const transmissionFilter = document.getElementById('transmissionFilter');
const fuelFilter = document.getElementById('fuelFilter');
const bodyTypeFilter = document.getElementById('bodyTypeFilter');
const colorFilter = document.getElementById('colorFilter');
const driveFilter = document.getElementById('driveFilter');
const sortSelect = document.getElementById('sortSelect');
const resultsCount = document.getElementById('resultsCount');
const resetBtn = document.getElementById('resetFilters');

let allCars = [];

function getPrice(car) { return Number(car.price) || 0; }
function getYear(car) { return Number(car.year) || 0; }
function getMileage(car) { return Number(car.mileage ?? car.km ?? 0); }
function getMake(car) { return (car.brand || car.make || '').toLowerCase(); }
function getModel(car) { return (car.model || '').toLowerCase(); }
function getType(car) { return (car.type || car.bodyType || '').toLowerCase(); }
function getFuel(car) { return (car.fuel || '').toLowerCase(); }
function getTransmission(car) { return (car.transmission || '').toLowerCase(); }
function getColor(car) { return (car.color || car.colour || '').toLowerCase(); }
function getDrive(car) { return (car.drive || '').toLowerCase(); }
function hasInspection(car) { return Boolean(car.inspectionCompleted ?? car.vehicleInspectionCompleted ?? car.inspection); }

function createCarCard(car) {
  const image = getCarImage(car);
  const mileage = getMileage(car);
  return `
    <div class="car-card" data-id="${car.id}">
      <div class="car-image"><img src="${image}" alt="${car.brand} ${car.model}"></div>
      <div class="car-info">
        <h3>${car.brand} ${car.model}</h3>
        <p>${car.year} • ${car.fuel} • ${car.transmission} • ${mileage.toLocaleString()} km</p>
        <div class="car-bottom">
          <div class="car-price">${getPrice(car).toLocaleString()} ₺</div>
          <a href="car-detail.html?id=${car.id}" class="btn">View Details</a>
        </div>
      </div>
    </div>`;
}

function renderCars(carsToRender) {
  carList.innerHTML = carsToRender.map(createCarCard).join('');
  document.querySelectorAll('.car-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn')) return;
      window.location.href = `car-detail.html?id=${card.dataset.id}`;
    });
  });
}

function applyFilters(carArray) {
  return carArray.filter((car) => {
    const makeValue = makeFilter.value.toLowerCase();
    const modelValue = modelFilter.value.toLowerCase();
    const typeValue = typeFilter.value.toLowerCase();
    const searchValue = (searchInput?.value || filterSearchInput?.value || '').trim().toLowerCase();
    const fullText = `${car.brand || ''} ${car.model || ''} ${car.type || ''} ${car.fuel || ''} ${car.transmission || ''} ${car.color || ''}`.toLowerCase();

    return (!makeValue || getMake(car) === makeValue) &&
      (!modelValue || getModel(car) === modelValue) &&
      (!typeValue || getType(car) === typeValue) &&
      (!searchValue || fullText.includes(searchValue)) &&
      getPrice(car) >= (Number(priceFrom.value) || 0) &&
      getPrice(car) <= (Number(priceTo.value) || Infinity) &&
      getMileage(car) >= (Number(kmFrom.value) || 0) &&
      getMileage(car) <= (Number(kmTo.value) || Infinity) &&
      getYear(car) >= (Number(yearFrom.value) || 0) &&
      getYear(car) <= (Number(yearTo.value) || Infinity) &&
      (!inspectionFilter.checked || hasInspection(car)) &&
      (!transmissionFilter.value || getTransmission(car) === transmissionFilter.value.toLowerCase()) &&
      (!fuelFilter.value || getFuel(car) === fuelFilter.value.toLowerCase()) &&
      (!bodyTypeFilter.value || getType(car) === bodyTypeFilter.value.toLowerCase()) &&
      (!colorFilter.value || getColor(car) === colorFilter.value.toLowerCase()) &&
      (!driveFilter.value || getDrive(car) === driveFilter.value.toLowerCase());
  });
}

function sortCars(carArray) {
  const sorted = [...carArray];
  if (sortSelect.value === 'price-low') sorted.sort((a, b) => getPrice(a) - getPrice(b));
  if (sortSelect.value === 'price-high') sorted.sort((a, b) => getPrice(b) - getPrice(a));
  if (sortSelect.value === 'newest') sorted.sort((a, b) => getYear(b) - getYear(a));
  if (sortSelect.value === 'mileage-low') sorted.sort((a, b) => getMileage(a) - getMileage(b));
  return sorted;
}

function applyFiltersAndRender() {
  const filteredCars = sortCars(applyFilters(allCars));
  renderCars(filteredCars);
  if (resultsCount) resultsCount.textContent = `${filteredCars.length} cars found`;
}

function resetAllFilters() {
  [makeFilter, modelFilter, typeFilter, searchInput, filterSearchInput, priceFrom, priceTo, kmFrom, kmTo, yearFrom, yearTo].forEach(el => { if (el) el.value = ''; });
  inspectionFilter.checked = false;
  [transmissionFilter, fuelFilter, bodyTypeFilter, colorFilter, driveFilter, sortSelect].forEach(el => { if (el) el.value = ''; });
  applyFiltersAndRender();
}

async function initListings() {
  try {
    allCars = await apiRequest('/cars');
  } catch (error) {
    allCars = typeof cars !== 'undefined' ? cars : [];
    console.warn('Backend not reachable, using local demo data.', error.message);
  }

  [makeFilter, modelFilter, typeFilter, searchInput, filterSearchInput, priceFrom, priceTo, kmFrom, kmTo, yearFrom, yearTo, inspectionFilter, transmissionFilter, fuelFilter, bodyTypeFilter, colorFilter, driveFilter, sortSelect].forEach((el) => {
    if (!el) return;
    const eventType = el.tagName === 'SELECT' || el.type === 'checkbox' ? 'change' : 'input';
    el.addEventListener(eventType, applyFiltersAndRender);
  });

  if (resetBtn) resetBtn.addEventListener('click', resetAllFilters);
  applyFiltersAndRender();
}

initListings();
