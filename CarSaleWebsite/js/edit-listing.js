const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser) {
  alert("Please login first to edit a listing.");
  window.location.href = "login.html";
}

const editListingForm = document.getElementById("editListingForm");

const uploadPhotoBtn = document.getElementById("uploadPhotoBtn");
const addImageFieldBtn = document.getElementById("addImageField");
const imageInputsWrapper = document.getElementById("imageInputsWrapper");
const uploadedPhotos = document.getElementById("uploadedPhotos");

const params = new URLSearchParams(window.location.search);
const carId = Number(params.get("id"));

let currentImages = [];
let selectedCar = null;

function getStoredCars() {
  return JSON.parse(localStorage.getItem("userListings")) || [];
}

function saveStoredCars(cars) {
  localStorage.setItem("userListings", JSON.stringify(cars));
}

function fileToBase64(file) {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function () {
      resolve(reader.result);
    };

    reader.onerror = reject;
  });
}

function createHiddenFileInput() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/png, image/jpeg";
  input.className = "image-input";
  input.hidden = true;

  input.addEventListener("change", function () {
    const file = input.files[0];
    if (!file) return;

    renderNewPhotoPreview(file, input);
  });

  imageInputsWrapper.appendChild(input);
  return input;
}

function renderExistingPhoto(imageSrc, index) {
  const photoCard = document.createElement("div");
  photoCard.className = "photo-card";

  const img = document.createElement("img");
  img.src = imageSrc;
  img.alt = "Car photo";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "remove-photo-btn";
  removeBtn.textContent = "×";

  removeBtn.addEventListener("click", function () {
    currentImages.splice(index, 1);
    renderAllExistingPhotos();
  });

  photoCard.appendChild(img);
  photoCard.appendChild(removeBtn);
  uploadedPhotos.appendChild(photoCard);
}

function renderAllExistingPhotos() {
  uploadedPhotos.innerHTML = "";

  currentImages.forEach(function (image, index) {
    renderExistingPhoto(image, index);
  });
}

function renderNewPhotoPreview(file, inputElement) {
  const photoCard = document.createElement("div");
  photoCard.className = "photo-card";

  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  img.alt = "Uploaded photo";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "remove-photo-btn";
  removeBtn.textContent = "×";

  removeBtn.addEventListener("click", function () {
    inputElement.remove();
    photoCard.remove();
  });

  photoCard.appendChild(img);
  photoCard.appendChild(removeBtn);
  uploadedPhotos.appendChild(photoCard);
}

function triggerNewPhotoSelect() {
  const input = createHiddenFileInput();
  input.click();
}

if (uploadPhotoBtn) {
  uploadPhotoBtn.addEventListener("click", triggerNewPhotoSelect);
}

if (addImageFieldBtn) {
  addImageFieldBtn.addEventListener("click", triggerNewPhotoSelect);
}

function fillForm(car) {
  document.getElementById("brand").value = car.brand || "";
  document.getElementById("model").value = car.model || "";
  document.getElementById("type").value = car.type || "";
  document.getElementById("year").value = car.year || "";
  document.getElementById("price").value = car.price || "";
  document.getElementById("mileage").value = car.mileage || "";
  document.getElementById("fuel").value = car.fuel || "";
  document.getElementById("transmission").value = car.transmission || "";
  document.getElementById("color").value = car.color || "";
  document.getElementById("horsepower").value = car.horsepower || "";
  document.getElementById("engineSize").value = car.engineSize || "";
  document.getElementById("drive").value = car.drive || "";
  document.getElementById("consumption").value = car.consumption || "";
  document.getElementById("doors").value = car.doors || "";
  document.getElementById("seats").value = car.seats || "";
  document.getElementById("location").value = car.location || "";
  document.getElementById("description").value = car.description || "";
  document.getElementById("inspection").checked = Boolean(car.inspection);

  currentImages =
    car.images && car.images.length
      ? [...car.images]
      : car.image
        ? [car.image]
        : [];

  renderAllExistingPhotos();

  const carFeatures = car.features || [];

  document
    .querySelectorAll(".features-grid input[type='checkbox']")
    .forEach(function (checkbox) {
      checkbox.checked = carFeatures.some(function (feature) {
        return feature.toLowerCase() === checkbox.value.toLowerCase();
      });
    });
}

function loadEditableCar() {
  if (!carId) {
    alert("Invalid listing.");
    window.location.href = "my-listings.html";
    return;
  }

  const storedCars = getStoredCars();

  selectedCar = storedCars.find(function (car) {
    return Number(car.id) === Number(carId);
  });

  if (!selectedCar) {
    alert("Listing not found.");
    window.location.href = "my-listings.html";
    return;
  }

  if (Number(selectedCar.ownerId) !== Number(loggedInUser.id)) {
    alert("You are not allowed to edit this listing.");
    window.location.href = "my-listings.html";
    return;
  }

  fillForm(selectedCar);
}

if (editListingForm) {
  editListingForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const storedCars = getStoredCars();

    const imageInputs = Array.from(document.querySelectorAll(".image-input"));
    const newImages = [];

    for (const input of imageInputs) {
      if (input.files[0]) {
        const base64 = await fileToBase64(input.files[0]);
        newImages.push(base64);
      }
    }

    const finalImages = [...currentImages, ...newImages];

    const selectedFeatures = Array.from(
      document.querySelectorAll(".features-grid input[type='checkbox']:checked")
    ).map(function (checkbox) {
      return checkbox.value;
    });

    const updatedCar = {
      ...selectedCar,

      ownerId: loggedInUser.id,
      ownerEmail: loggedInUser.email,
      ownerName: loggedInUser.fullName,

      brand: document.getElementById("brand").value.trim(),
      model: document.getElementById("model").value.trim(),
      type: document.getElementById("type").value,
      year: Number(document.getElementById("year").value),
      price: Number(document.getElementById("price").value),
      mileage: Number(document.getElementById("mileage").value),
      fuel: document.getElementById("fuel").value,
      transmission: document.getElementById("transmission").value,
      color: document.getElementById("color").value.trim(),
      horsepower: Number(document.getElementById("horsepower").value) || 0,
      engineSize: Number(document.getElementById("engineSize").value) || 0,
      drive: document.getElementById("drive").value || "FWD",
      consumption: Number(document.getElementById("consumption").value) || 0,
      doors: Number(document.getElementById("doors").value) || 4,
      seats: Number(document.getElementById("seats").value) || 5,
      location: document.getElementById("location").value.trim(),
      inspection: document.getElementById("inspection").checked,
      images: finalImages.length ? finalImages : ["../assets/images/cars/bmw1.png"],
      image: finalImages[0] || "../assets/images/cars/bmw1.png",
      features: selectedFeatures,
      description:
        document.getElementById("description").value.trim() ||
        "User edited listing.",
      updatedAt: new Date().toISOString()
    };

    const updatedCars = storedCars.map(function (car) {
      if (Number(car.id) === Number(carId)) {
        return updatedCar;
      }

      return car;
    });

    saveStoredCars(updatedCars);

    alert("Listing updated successfully!");
    window.location.href = "my-listings.html";
  });
}

loadEditableCar();