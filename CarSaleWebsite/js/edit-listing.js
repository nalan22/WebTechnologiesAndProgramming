const loggedInUser = getLoggedInUser();
if (!loggedInUser) {
  alert('Please login first to edit a listing.');
  window.location.href = 'login.html';
}

const editListingForm = document.getElementById('editListingForm');
const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
const addImageFieldBtn = document.getElementById('addImageField');
const imageInputsWrapper = document.getElementById('imageInputsWrapper');
const uploadedPhotos = document.getElementById('uploadedPhotos');
const params = new URLSearchParams(window.location.search);
const carId = Number(params.get('id'));
let currentImages = [];
let selectedCar = null;

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}

function createHiddenFileInput() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/png, image/jpeg';
  input.className = 'image-input';
  input.hidden = true;
  input.addEventListener('change', () => {
    const file = input.files[0];
    if (file) renderNewPhotoPreview(file, input);
  });
  imageInputsWrapper.appendChild(input);
  return input;
}

function renderExistingPhoto(imageSrc, index) {
  const photoCard = document.createElement('div');
  photoCard.className = 'photo-card';
  photoCard.innerHTML = `<img src="${imageSrc}" alt="Car photo"><button type="button" class="remove-photo-btn">×</button>`;
  photoCard.querySelector('button').addEventListener('click', () => {
    currentImages.splice(index, 1);
    renderAllExistingPhotos();
  });
  uploadedPhotos.appendChild(photoCard);
}

function renderAllExistingPhotos() {
  uploadedPhotos.innerHTML = '';
  currentImages.forEach((image, index) => renderExistingPhoto(image, index));
}

function renderNewPhotoPreview(file, inputElement) {
  const photoCard = document.createElement('div');
  photoCard.className = 'photo-card';
  photoCard.innerHTML = `<img src="${URL.createObjectURL(file)}" alt="Uploaded photo"><button type="button" class="remove-photo-btn">×</button>`;
  photoCard.querySelector('button').addEventListener('click', () => {
    inputElement.remove();
    photoCard.remove();
  });
  uploadedPhotos.appendChild(photoCard);
}

function triggerNewPhotoSelect() {
  const input = createHiddenFileInput();
  input.click();
}

if (uploadPhotoBtn) uploadPhotoBtn.addEventListener('click', triggerNewPhotoSelect);
if (addImageFieldBtn) addImageFieldBtn.addEventListener('click', triggerNewPhotoSelect);

function fillForm(car) {
  document.getElementById('brand').value = car.brand || '';
  document.getElementById('model').value = car.model || '';
  document.getElementById('type').value = car.type || '';
  document.getElementById('year').value = car.year || '';
  document.getElementById('price').value = car.price || '';
  document.getElementById('mileage').value = car.mileage || '';
  document.getElementById('fuel').value = car.fuel || '';
  document.getElementById('transmission').value = car.transmission || '';
  document.getElementById('color').value = car.color || '';
  document.getElementById('horsepower').value = car.horsepower || '';
  document.getElementById('engineSize').value = car.engineSize || '';
  document.getElementById('drive').value = car.drive || '';
  document.getElementById('consumption').value = car.consumption || '';
  document.getElementById('doors').value = car.doors || '';
  document.getElementById('seats').value = car.seats || '';
  document.getElementById('location').value = car.location || '';
  document.getElementById('description').value = car.description || '';
  document.getElementById('inspection').checked = Boolean(car.inspection);
  currentImages = car.images?.length ? [...car.images] : car.image ? [car.image] : [];
  renderAllExistingPhotos();
  const carFeatures = car.features || [];
  document.querySelectorAll(".features-grid input[type='checkbox']").forEach((checkbox) => {
    checkbox.checked = carFeatures.some(feature => feature.toLowerCase() === checkbox.value.toLowerCase());
  });
}

async function loadEditableCar() {
  if (!carId) {
    alert('Invalid listing.');
    window.location.href = 'my-listings.html';
    return;
  }

  try {
    selectedCar = await apiRequest(`/cars/${carId}`);
    if (Number(selectedCar.ownerId) !== Number(loggedInUser.id)) {
      alert('You are not allowed to edit this listing.');
      window.location.href = 'my-listings.html';
      return;
    }
    fillForm(selectedCar);
  } catch (error) {
    alert(error.message);
    window.location.href = 'my-listings.html';
  }
}

if (editListingForm) {
  editListingForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const newImages = [];
    for (const input of Array.from(document.querySelectorAll('.image-input'))) {
      if (input.files[0]) newImages.push(await fileToBase64(input.files[0]));
    }
    const finalImages = [...currentImages, ...newImages];
    const selectedFeatures = Array.from(document.querySelectorAll(".features-grid input[type='checkbox']:checked")).map(checkbox => checkbox.value);

    const updatedCar = {
      brand: document.getElementById('brand').value.trim(),
      model: document.getElementById('model').value.trim(),
      type: document.getElementById('type').value,
      year: Number(document.getElementById('year').value),
      price: Number(document.getElementById('price').value),
      mileage: Number(document.getElementById('mileage').value),
      fuel: document.getElementById('fuel').value,
      transmission: document.getElementById('transmission').value,
      color: document.getElementById('color').value.trim(),
      horsepower: Number(document.getElementById('horsepower').value) || 0,
      engineSize: Number(document.getElementById('engineSize').value) || 0,
      drive: document.getElementById('drive').value || 'FWD',
      consumption: Number(document.getElementById('consumption').value) || 0,
      doors: Number(document.getElementById('doors').value) || 4,
      seats: Number(document.getElementById('seats').value) || 5,
      location: document.getElementById('location').value.trim(),
      inspection: document.getElementById('inspection').checked,
      images: finalImages.length ? finalImages : ['../assets/images/cars/bmw1.png'],
      image: finalImages[0] || '../assets/images/cars/bmw1.png',
      features: selectedFeatures,
      description: document.getElementById('description').value.trim() || 'User edited listing.'
    };

    try {
      await apiRequest(`/cars/${carId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedCar)
      });
      alert('Listing updated successfully!');
      window.location.href = 'my-listings.html';
    } catch (error) {
      alert(error.message);
    }
  });
}

loadEditableCar();
