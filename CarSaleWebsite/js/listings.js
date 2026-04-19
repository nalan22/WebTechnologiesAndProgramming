const carList = document.getElementById("carList");

const makeFilter = document.getElementById("makeFilter");
const modelFilter = document.getElementById("modelFilter");
const typeFilter = document.getElementById("typeFilter");
const filterSearchInput = document.getElementById("filterSearchInput");
const searchInput = document.getElementById("searchInput");
const priceFrom = document.getElementById("priceFrom");
const priceTo = document.getElementById("priceTo");
const kmFrom = document.getElementById("kmFrom");
const kmTo = document.getElementById("kmTo");
const yearFrom = document.getElementById("yearFrom");
const yearTo = document.getElementById("yearTo");

const inspectionFilter = document.getElementById("inspectionFilter");
const transmissionFilter = document.getElementById("transmissionFilter");
const fuelFilter = document.getElementById("fuelFilter");
const bodyTypeFilter = document.getElementById("bodyTypeFilter");
const colorFilter = document.getElementById("colorFilter");
const driveFilter = document.getElementById("driveFilter");

const sortSelect = document.getElementById("sortSelect");
const resultsCount = document.getElementById("resultsCount");
const resetBtn = document.getElementById("resetFilters");

/* ---------- helpers ---------- */

function getStoredCars() {
  return JSON.parse(localStorage.getItem("userListings")) || [];
}

function getPrice(car) {
  return Number(car.price) || 0;
}

function getYear(car) {
  return Number(car.year) || 0;
}

function getMileage(car) {
  return Number(car.mileage ?? car.km ?? 0);
}

function getMake(car) {
  return (car.brand || car.make || "").toLowerCase();
}

function getModel(car) {
  return (car.model || "").toLowerCase();
}

function getType(car) {
  return (car.type || car.bodyType || "").toLowerCase();
}

function getFuel(car) {
  return (car.fuel || "").toLowerCase();
}

function getTransmission(car) {
  return (car.transmission || "").toLowerCase();
}

function getColor(car) {
  return (car.color || car.colour || "").toLowerCase();
}

function getDrive(car) {
  return (car.drive || "").toLowerCase();
}

function hasInspection(car) {
  return Boolean(
    car.inspectionCompleted ??
    car.vehicleInspectionCompleted ??
    car.inspection
  );
}

/* ---------- render ---------- */

function createCarCard(car) {
  const image = car.images?.[0] || "assets/images/default.jpg";
  const mileage = getMileage(car);

  return `
    <div class="car-card" data-id="${car.id}">
      <div class="car-image">
        <img src="${image}" alt="${car.brand} ${car.model}">
      </div>

      <div class="car-info">
        <h3>${car.brand} ${car.model}</h3>
        <p>${car.year} • ${car.fuel} • ${car.transmission} • ${mileage.toLocaleString()} km</p>

        <div class="car-bottom">
          <div class="car-price">${getPrice(car).toLocaleString()} ₺</div>
          <a href="car-detail.html?id=${car.id}" class="btn">View Details</a>
        </div>
      </div>
    </div>
  `;
}

function renderCars(carsToRender) {
  carList.innerHTML = "";

  carsToRender.forEach((car) => {
    carList.innerHTML += createCarCard(car);
  });

  // 🔥 BURASI YENİ EKLENEN KISIM
  document.querySelectorAll(".car-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".btn")) return;

      const carId = card.dataset.id;
      window.location.href = `car-detail.html?id=${carId}`;
    });
  });
}

/* ---------- filters ---------- */

function applyFilters(carArray) {
  return carArray.filter((car) => {
    const makeValue = makeFilter.value.toLowerCase();
    const modelValue = modelFilter.value.toLowerCase();
    const typeValue = typeFilter.value.toLowerCase();
    const headerSearchValue = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const filterSearchValue = filterSearchInput ? filterSearchInput.value.trim().toLowerCase() : "";
    const searchValue = headerSearchValue || filterSearchValue;

    const priceFromValue = Number(priceFrom.value) || 0;
    const priceToValue = Number(priceTo.value) || Infinity;

    const kmFromValue = Number(kmFrom.value) || 0;
    const kmToValue = Number(kmTo.value) || Infinity;

    const yearFromValue = Number(yearFrom.value) || 0;
    const yearToValue = Number(yearTo.value) || Infinity;

    const transmissionValue = transmissionFilter.value.toLowerCase();
    const fuelValue = fuelFilter.value.toLowerCase();
    const bodyTypeValue = bodyTypeFilter.value.toLowerCase();
    const colorValue = colorFilter.value.toLowerCase();
    const driveValue = driveFilter.value.toLowerCase();

const fullText = `${car.brand || car.make || ""} ${car.model || ""} ${car.type || ""} ${car.bodyType || ""} ${car.fuel || ""} ${car.transmission || ""} ${car.color || car.colour || ""}`.toLowerCase();

    const matchesMake = !makeValue || getMake(car) === makeValue;
    const matchesModel = !modelValue || getModel(car) === modelValue;
    const matchesType = !typeValue || getType(car) === typeValue;
    const matchesSearch = !searchValue || fullText.includes(searchValue);

    const matchesPrice =
      getPrice(car) >= priceFromValue && getPrice(car) <= priceToValue;

    const matchesMileage =
      getMileage(car) >= kmFromValue && getMileage(car) <= kmToValue;

    const matchesYear =
      getYear(car) >= yearFromValue && getYear(car) <= yearToValue;

    const matchesInspection =
      !inspectionFilter.checked || hasInspection(car);

    const matchesTransmission =
      !transmissionValue || getTransmission(car) === transmissionValue;

    const matchesFuel =
      !fuelValue || getFuel(car) === fuelValue;

    const matchesBodyType =
      !bodyTypeValue || getType(car) === bodyTypeValue;

    const matchesColor =
      !colorValue || getColor(car) === colorValue;

    const matchesDrive =
      !driveValue || getDrive(car) === driveValue;

    return (
      matchesMake &&
      matchesModel &&
      matchesType &&
      matchesSearch &&
      matchesPrice &&
      matchesMileage &&
      matchesYear &&
      matchesInspection &&
      matchesTransmission &&
      matchesFuel &&
      matchesBodyType &&
      matchesColor &&
      matchesDrive
    );
  });
}

/* ---------- sorting ---------- */

function sortCars(carArray) {
  const sorted = [...carArray];
  const sortValue = sortSelect.value;

  if (sortValue === "price-low") {
    sorted.sort((a, b) => getPrice(a) - getPrice(b));
  } else if (sortValue === "price-high") {
    sorted.sort((a, b) => getPrice(b) - getPrice(a));
  } else if (sortValue === "newest") {
    sorted.sort((a, b) => getYear(b) - getYear(a));
  } else if (sortValue === "mileage-low") {
    sorted.sort((a, b) => getMileage(a) - getMileage(b));
  }

  return sorted;
}

/* ---------- main ---------- */

function applyFiltersAndRender() {
  const allCars = [...getStoredCars(), ...cars];
  let filteredCars = applyFilters(allCars);
  filteredCars = sortCars(filteredCars);
  renderCars(filteredCars);

  if (resultsCount) {
    resultsCount.textContent = `${filteredCars.length} cars found`;
  }
}

/* ---------- reset ---------- */

function resetAllFilters() {
  makeFilter.value = "";
  modelFilter.value = "";
  typeFilter.value = "";
  searchInput.value = "";
  filterSearchInput.value = "";

  priceFrom.value = "";
  priceTo.value = "";
  kmFrom.value = "";
  kmTo.value = "";
  yearFrom.value = "";
  yearTo.value = "";

  inspectionFilter.checked = false;
  transmissionFilter.value = "";
  fuelFilter.value = "";
  bodyTypeFilter.value = "";
  colorFilter.value = "";
  driveFilter.value = "";

  sortSelect.value = "";

  applyFiltersAndRender();
}

/* ---------- events ---------- */

[
  makeFilter,
  modelFilter,
  typeFilter,
  searchInput,
  filterSearchInput,
  priceFrom,
  priceTo,
  kmFrom,
  kmTo,
  yearFrom,
  yearTo,
  inspectionFilter,
  transmissionFilter,
  fuelFilter,
  bodyTypeFilter,
  colorFilter,
  driveFilter,
  sortSelect
].forEach((el) => {
  if (!el) return;

  const eventType =
    el.tagName === "SELECT" || el.type === "checkbox" ? "change" : "input";

  el.addEventListener(eventType, applyFiltersAndRender);
});

resetBtn.addEventListener("click", resetAllFilters);

/* ---------- first load ---------- */

applyFiltersAndRender();