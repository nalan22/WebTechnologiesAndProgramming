const container = document.getElementById("featuredCars");

function displayCars() {
  container.innerHTML = "";

  cars.forEach(car => {
    container.innerHTML += `
      <div class="car-card">
        <img src="${car.image}" alt="${car.brand}">
        <h3>${car.brand} ${car.model}</h3>
        <p>${car.year} • ${car.fuel}</p>
        <span class="price">${car.price} ₺</span>
      </div>
    `;
  });
}

displayCars();