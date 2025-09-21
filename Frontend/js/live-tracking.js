let map;
let marker;

function initMap() {
    const defaultLocation = [7.2510, 80.3464];

    map = L.map("mapContainer").setView(defaultLocation, 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(map);

    marker = L.marker(defaultLocation).addTo(map)
        .bindPopup("Bus Location")
        .openPopup();
}

document.getElementById("loadMap").addEventListener("click", () => {
    const tripData = JSON.parse(localStorage.getItem("selectedTrip")) || { tripId: 1 };
    fetchBusLocation(tripData.tripId);
});

function fetchBusLocation(tripId) {
    fetch(`http://localhost:8080/api/v1/tracking/location/${tripId}`)
        .then((res) => res.json())
        .then((data) => {
            updateMap(data);
            updateTripUI(data);
        })
        .catch((err) => console.error("Error fetching location:", err));
}

function updateMap(data) {
    const { latitude, longitude } = data;
    const pos = [latitude, longitude];

    map.setView(pos, 13);
    marker.setLatLng(pos)
        .setPopupContent("Bus Location")
        .openPopup();
}

function updateTripUI(data) {
    document.querySelector(".status-indicator h6").innerText =
        data.status === "Moving" ? "Bus is Moving" : "Bus is Stopped";

    document.querySelector(".current-location p.text-muted").innerText = data.locationText;

    document.querySelector(".speed-info .col-6:nth-child(1) h4").innerText = data.speed;
    document.querySelector(".speed-info .col-6:nth-child(2) h4").innerText = data.remainingKm;

    document.querySelector(".eta-info .alert").innerHTML =
        `<i class="fas fa-clock me-2"></i><strong>ETA:</strong> ${
            new Date(data.eta).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }`;
}

window.addEventListener("DOMContentLoaded", () => {
    initMap();
    const tripData = JSON.parse(localStorage.getItem("selectedTrip"));
    if (tripData) {
        fetchBusLocation(tripData.tripId);
    }
});
