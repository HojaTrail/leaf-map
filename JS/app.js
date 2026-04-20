const locations = [
  // 📚 BOOKS
  { name: "Powell's City of Books", type: "books", coords: [45.5231, -122.6819], description: "Famous bookstore" },
  { name: "Central Library", type: "books", coords: [45.5190, -122.6810], description: "Public library" },
  { name: "Broadway Books", type: "books", coords: [45.5350, -122.6430], description: "Local bookstore" },

  // 🌲 NATURE
  { name: "Forest Park", type: "nature", coords: [45.5723, -122.7260], description: "Forest trails" },
  { name: "Washington Park", type: "nature", coords: [45.5186, -122.7080], description: "Scenic park" },
  { name: "Sellwood Park", type: "nature", coords: [45.4630, -122.6610], description: "Riverfront views" }
];

const bookIcon = L.icon({
  iconUrl: 'img/leaf-brown.png',
  iconSize: [40, 40]
});

const natureIcon = L.icon({
  iconUrl: 'img/leaf-green.png',
  iconSize: [40, 40]
});

let markers = [];

function setView(type) {
  clearMarkers();

  const filtered = locations.filter(loc => loc.type === type);
  renderLocations(filtered);
}

function clearMarkers() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];
}

function renderLocations(data) {
  const list = document.getElementById('location-list');
  list.innerHTML = "";

  data.forEach(place => {

    const icon = place.type === "books" ? bookIcon : natureIcon;

    const marker = L.marker(place.coords, { icon }).addTo(map);

    marker.bindPopup(`
      <h3>${place.name}</h3>
      <p>${place.description}</p>
      <button onclick="viewDetails('${place.name}')">View</button>
    `);

    markers.push(marker);

    const li = document.createElement('li');
    li.textContent = place.name;

    li.onclick = () => {
      map.setView(place.coords, 15);
      marker.openPopup();
    };

    list.appendChild(li);
  });
}

function viewDetails(name) {
  const selected = locations.find(loc => loc.name === name);
  localStorage.setItem("selectedPlace", JSON.stringify(selected));
  window.location.href = "store.html";
}

// 🔍 SEARCH FILTER
document.getElementById("search").addEventListener("input", function () {
  const value = this.value.toLowerCase();

  const filtered = locations.filter(loc =>
    loc.name.toLowerCase().includes(value)
  );

  clearMarkers();
  renderLocations(filtered);
});

// default load
window.onload = () => setView('books');