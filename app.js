/* ─── DATA ─── */
const places = [
  {
    id: 1,
    name: "Powell's City of Books",
    type: "Librería",
    addr: "1005 W Burnside St, Portland, OR",
    desc: "World-famous independent bookstore with a vast selection of new and used books in the heart of Portland.",
    emoji: "📚",
    lat: 45.5231,
    lng: -122.6818
  },
  {
    id: 2,
    name: "Central Library",
    type: "Biblioteca",
    addr: "801 SW 10th Ave, Portland, OR",
    desc: "Portland's main public library — a stunning 1913 building offering books, programs, and community events.",
    emoji: "🏛️",
    lat: 45.5185,
    lng: -122.6835
  },
  {
    id: 3,
    name: "Broadway Books",
    type: "Librería",
    addr: "1714 NE Broadway, Portland, OR",
    desc: "A beloved neighborhood bookstore on NE Broadway, focusing on community connection and local authors.",
    emoji: "📖",
    lat: 45.5348,
    lng: -122.6484
  },
  {
    id: 4,
    name: "Annie Bloom's Books",
    type: "Librería",
    addr: "7834 SW Capitol Hwy, Portland, OR",
    desc: "Cozy independent bookstore in Multnomah Village with a carefully curated collection and warm community feel.",
    emoji: "🌿",
    lat: 45.4857,
    lng: -122.7082
  }
];

const rutas = [
  { icon: "🗺️", name: "Ruta del Centro",      desc: "Recorre las librerías del centro de Portland en un agradable paseo a pie.", tag: "3.2 km · A pie" },
  { icon: "🌲", name: "Sendero del Bosque",    desc: "Explora la naturaleza del Forest Park y sus puntos de lectura al aire libre.", tag: "6.5 km · Bici" },
  { icon: "🌸", name: "Ruta de los Jardines",  desc: "Visita el jardín japonés y bibliotecas cercanas en el barrio de Washington Park.", tag: "4.1 km · A pie" },
  { icon: "🏙️", name: "Tour NE Portland",      desc: "Descubre las librerías independientes del vibrante barrio noreste de la ciudad.", tag: "5.0 km · Bici" },
];

/* ─── STATE ─── */
let activeId   = null;
let activeView = 'mapas';
let leafMap    = null;
let markers    = {};

/* ─── LEAF MARKER ICON ─── */
function leafIcon(color = '#4a7c59') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="38" viewBox="0 0 32 38">
    <path d="M4 19 C6 10 4 3 16 1 C28 3 26 10 28 19 C24 27 22 32 16 37 C10 32 8 27 4 19Z"
          fill="${color}" stroke="white" stroke-width="1.5"/>
    <text x="16" y="23" text-anchor="middle" font-size="13" fill="white" font-family="serif">📚</text>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: 'leaf-marker',
    iconSize: [32, 38],
    iconAnchor: [16, 37],
    popupAnchor: [0, -40]
  });
}

/* ─── MAP INIT ─── */
function initMap() {
  leafMap = L.map('map', {
    center: [45.518, -122.676],
    zoom: 13,
    zoomControl: true
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(leafMap);

  // Style the tiles with a green-ish overlay using an SVG filter on the container
  document.getElementById('map').style.filter = 'sepia(20%) saturate(110%) hue-rotate(40deg)';

  places.forEach(p => {
    const m = L.marker([p.lat, p.lng], { icon: leafIcon() })
      .addTo(leafMap)
      .on('click', () => selectPlace(p.id));
    markers[p.id] = m;
  });
}

/* ─── PLACE SELECTION ─── */
function selectPlace(id) {
  activeId = id;
  const p = places.find(x => x.id === id);

  // Update sidebar highlight
  renderSidebar(document.getElementById('searchInput').value);

  // Update markers
  Object.entries(markers).forEach(([pid, m]) => {
    m.setIcon(leafIcon(parseInt(pid) === id ? '#c9a96e' : '#4a7c59'));
  });

  // Pan map
  leafMap.panTo([p.lat, p.lng], { animate: true, duration: 0.6 });

  // Fill popup
  document.getElementById('popupEmoji').textContent = p.emoji;
  document.getElementById('popupName').textContent  = p.name;
  document.getElementById('popupType').textContent  = p.type;
  document.getElementById('popupAddr').textContent  = p.addr;
  document.getElementById('popupDesc').textContent  = p.desc;

  document.getElementById('popupMapBtn').onclick = () => {
    leafMap.flyTo([p.lat, p.lng], 16, { animate: true, duration: 1.2 });
  };

  const card = document.getElementById('popupCard');
  card.style.display = 'block';
  // Re-trigger animation
  card.style.animation = 'none';
  card.offsetHeight; // reflow
  card.style.animation = '';
}

function closePopup() {
  document.getElementById('popupCard').style.display = 'none';
  activeId = null;
  Object.values(markers).forEach(m => m.setIcon(leafIcon('#4a7c59')));
  renderSidebar('');
  document.getElementById('searchInput').value = '';
}

/* ─── SIDEBAR ─── */
function renderSidebar(query = '') {
  const list   = document.getElementById('placesList');
  const filtered = places.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.type.toLowerCase().includes(query.toLowerCase())
  );

  if (!filtered.length) {
    list.innerHTML = `<p class="empty-msg">No se encontraron resultados.</p>`;
    return;
  }

  list.innerHTML = filtered.map(p => `
    <div class="place-item${activeId === p.id ? ' active' : ''}" data-id="${p.id}">
      <div class="place-info">
        <h3>${p.name}</h3>
        <p>${p.emoji} ${p.type}</p>
      </div>
      <span class="place-badge ${p.type === 'Librería' ? 'badge-libreria' : 'badge-biblioteca'}">${p.type}</span>
    </div>
  `).join('');

  list.querySelectorAll('.place-item').forEach(el => {
    el.addEventListener('click', () => selectPlace(parseInt(el.dataset.id)));
  });
}

/* ─── RUTAS ─── */
function renderRutas() {
  document.getElementById('rutasGrid').innerHTML = rutas.map(r => `
    <div class="ruta-card">
      <div class="ruta-icon">${r.icon}</div>
      <h3>${r.name}</h3>
      <p>${r.desc}</p>
      <span class="ruta-tag">${r.tag}</span>
    </div>
  `).join('');
}

/* ─── VIEW SWITCHING ─── */
function setView(view) {
  activeView = view;

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });

  document.getElementById('aboutPanel').classList.toggle('visible', view === 'about');
  document.getElementById('rutasPanel').classList.toggle('visible', view === 'rutas');

  if (view !== 'mapas') {
    document.getElementById('popupCard').style.display = 'none';
  }

  // Invalidate map size after panel hides/shows
  setTimeout(() => { if (leafMap) leafMap.invalidateSize(); }, 50);
}

/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded', () => {
  initMap();
  renderSidebar();
  renderRutas();

  // Nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => setView(btn.dataset.view));
  });

  // Search
  document.getElementById('searchInput').addEventListener('input', e => {
    renderSidebar(e.target.value);
  });

  // Close popup
  document.getElementById('popupClose').addEventListener('click', closePopup);

  // Open first place by default
  setTimeout(() => selectPlace(1), 400);
});
