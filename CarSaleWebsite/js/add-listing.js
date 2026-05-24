const addListingForm = document.getElementById("addListingForm");

const uploadPhotoBtn = document.getElementById("uploadPhotoBtn");
const addImageFieldBtn = document.getElementById("addImageField");
const imageInputsWrapper = document.getElementById("imageInputsWrapper");
const uploadedPhotos = document.getElementById("uploadedPhotos");
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser) {
  alert("Please login first to add a listing.");
  window.location.href = "login.html";
}

/* ---------- STORAGE ---------- */

function getStoredCars() {
  return JSON.parse(localStorage.getItem("userListings")) || [];
}

function saveStoredCars(cars) {
  localStorage.setItem("userListings", JSON.stringify(cars));
}

function generateId() {
  return Date.now();
}

/* ---------- FILE TO BASE64 ---------- */

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}

/* ---------- CREATE HIDDEN FILE INPUT ---------- */

function createHiddenFileInput() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/png, image/jpeg";
  input.className = "image-input";
  input.hidden = true;

  input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;

    renderPhotoPreview(file, input);
  });

  imageInputsWrapper.appendChild(input);
  return input;
}

/* ---------- RENDER PREVIEW ---------- */

function renderPhotoPreview(file, inputElement) {
  const photoCard = document.createElement("div");
  photoCard.className = "photo-card";

  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  img.alt = "Uploaded photo";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "remove-photo-btn";
  removeBtn.textContent = "×";

  removeBtn.addEventListener("click", () => {
    const inputIndex = Array.from(imageInputsWrapper.children).indexOf(inputElement);
    if (inputIndex > -1) {
      imageInputsWrapper.children[inputIndex].remove();
    }
    photoCard.remove();
  });

  photoCard.appendChild(img);
  photoCard.appendChild(removeBtn);
  uploadedPhotos.appendChild(photoCard);
}

/* ---------- UPLOAD BUTTONS ---------- */

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

/* ---------- SUBMIT ---------- */

addListingForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const imageInputs = [...document.querySelectorAll(".image-input")];
  const images = [];

  for (const input of imageInputs) {
    if (input.files[0]) {
      const base64 = await fileToBase64(input.files[0]);
      images.push(base64);
    }
  }

  const selectedFeatures = [
    ...document.querySelectorAll(".features-grid input[type='checkbox']:checked")
  ].map((checkbox) => checkbox.value);

  const newCar = {
    id: generateId(),
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
    inspection: document.getElementById("inspection").checked,
    image: images[0] || "../assets/images/cars/bmw1.png",
    images: images.length ? images : ["../assets/images/cars/bmw1.png"],
    features: selectedFeatures,
    description:
      document.getElementById("description").value.trim() ||
      "User added listing."
  };

  const storedCars = getStoredCars();
  storedCars.unshift(newCar);
  saveStoredCars(storedCars);

  alert("Listing added successfully!");
  window.location.href = "my-listings.html";
});