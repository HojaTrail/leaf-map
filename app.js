const places = [
  {
    id: 1,
    name: "Powell's City of Books",
    type: "Librería",
    addr: "1005 W Burnside St, Portland, OR",
    desc: "World-famous bookstore in Portland.",
    lat: 45.5231,
    lng: -122.6818
  },
  {
    id: 2,
    name: "Central Library",
    type: "Biblioteca",
    addr: "801 SW 10th Ave, Portland, OR",
    desc: "Main public library in Portland.",
    lat: 45.5185,
    lng: -122.6835
  }
];

const rutas = [
  { name: "Ruta Centro", desc: "Walk downtown bookstores" },
  { name: "Ruta Naturaleza", desc: "Green reading spots" }
];

let map;
let markers = {};

/* MAP */
function initMap() {
  map = L.map("map").setView([45.518, -122.676], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map);

  places.forEach(p => {
    const marker = L.marker([p.lat, p.lng])
      .addTo(map)
      .on("click", () => selectPlace(p.id));

    markers[p.id] = marker;
  });
}

/* SELECT PLACE */
function selectPlace(id) {
  const p = places.find(x => x.id === id);

  document.getElementById("popupCard").style.display = "block";
  document.getElementById("popupName").textContent = p.name;
  document.getElementById("popupType").textContent = p.type;
  document.getElementById("popupAddr").textContent = p.addr;
  document.getElementById("popupDesc").textContent = p.desc;

  map.setView([p.lat, p.lng], 15);
}

/* SIDEBAR */
function renderPlaces() {
  const list = document.getElementById("placesList");

  list.innerHTML = places.map(p => `
    <div class="place-item" onclick="selectPlace(${p.id})">
      ${p.name}
    </div>
  `).join("");
}

/* INIT */
document.addEventListener("DOMContentLoaded", () => {
  initMap();
  renderPlaces();

  document.getElementById("popupClose").onclick = () => {
    document.getElementById("popupCard").style.display = "none";
  };
});
