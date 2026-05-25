const API_BASE_URL = window.location.origin.includes('localhost')
  ? `${window.location.origin}/api`
  : 'http://localhost:3000/api';

function getLoggedInUser() {
  return JSON.parse(localStorage.getItem('loggedInUser') || 'null');
}

function setLoggedInUser(user) {
  localStorage.setItem('loggedInUser', JSON.stringify(user));
}

function logoutUser() {
  localStorage.removeItem('loggedInUser');
}

async function apiRequest(path, options = {}) {
  const user = getLoggedInUser();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (user && user.id) {
    headers['x-user-id'] = user.id;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed.');
  }

  return data;
}

function getCarImage(car) {
  if (car.images && car.images.length > 0) return car.images[0];
  if (car.image) return car.image;
  return '../assets/images/cars/bmw1.png';
}
