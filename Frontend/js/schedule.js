document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".quick-search-section form");
    const cardsContainer = document.getElementById("busScheduleCards");
    const fromSelect = document.getElementById("fromStop");
    const toSelect = document.getElementById("toStop");
    const lastUpdated = document.getElementById("lastUpdated");

    async function loadStops() {
        try {
            const res = await fetch("http://localhost:8080/api/v1/stop/get");
            const result = await res.json();

            fromSelect.innerHTML = "";
            toSelect.innerHTML = "";

            if (!result.data || !result.data.length) {
                fromSelect.innerHTML = `<option>No stops found</option>`;
                toSelect.innerHTML = `<option>No stops found</option>`;
                return;
            }

            result.data.forEach(stop => {
                fromSelect.innerHTML += `<option value="${stop.name}">${stop.name}</option>`;
                toSelect.innerHTML += `<option value="${stop.name}">${stop.name}</option>`;
            });
        } catch (err) {
            console.error("Stops load error:", err);
            fromSelect.innerHTML = `<option>Error loading stops</option>`;
            toSelect.innerHTML = `<option>Error loading stops</option>`;
        }
    }

    loadStops();

    async function fetchSchedules() {
        const from = fromSelect.value;
        const to = toSelect.value;
        const date = form.querySelector("input[type='date']").value;

        if (!from || !to || !date) {
            alert("Please select From, To and Date.");
            return;
        }

        cardsContainer.innerHTML = `<div class="col-12 text-center"><p>Loading...</p></div>`;

        try {
            const token = localStorage.getItem("jwtToken") || "";
            const res = await fetch(
                `http://localhost:8080/api/v1/schedule/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/json"
                    }
                }
            );

            console.log("HTTP Status:", res.status);

            if (res.status === 404) {
                cardsContainer.innerHTML = `<div class="col-12 text-center"><p>No buses found.</p></div>`;
                return;
            }

            if (!res.ok) {
                cardsContainer.innerHTML = `<div class="col-12 text-center"><p>Error: ${res.status}</p></div>`;
                return;
            }

            const data = await res.json();
            console.log("Parsed JSON:", data);

            const schedules = Array.isArray(data.data) ? data.data : [];

            schedules.forEach(s => {
                if (!s.tripId && s.tripId !== 0) {
                    s.tripId = null;
                }
            });

            localStorage.setItem("busSchedules", JSON.stringify(schedules));

            if (!schedules.length) {
                cardsContainer.innerHTML = `<div class="col-12 text-center"><p>No buses found.</p></div>`;
                return;
            }

            cardsContainer.innerHTML = "";
            schedules.forEach(s => {
                cardsContainer.innerHTML += `
                    <div class="col-md-6 mb-3">
                        <div class="card shadow-lg h-100 border-0" style="border-radius: 15px;">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title text-primary fw-bold">
                                    ${s.plateNo || "--"} <span class="text-dark">(${s.busType || "--"})</span>
                                </h5>
                                <p class="text-info fw-semibold mb-3">
                                    <i class="fas fa-route me-2"></i>${s.routeName || "--"}
                                </p>
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="text-muted"><strong>Departure:</strong> ${s.departDateTime || "--:--"}</span>
                                    <span class="text-muted"><strong>Arrival:</strong> ${s.arrivalEta || "--:--"}</span>
                                </div>
                                <div class="d-flex justify-content-between mb-3">
                                    <span class="fw-bold text-success">
                                        <i class="fas fa-coins me-1"></i>${s.baseFare || "--"} LKR
                                    </span>
                                </div>
                                <div class="mt-auto">
                                    <button class="btn btn-gradient w-100 book-btn fw-bold py-2" data-id="${s.scheduleId}">
                                        <i class="fas fa-chair me-2"></i>Select Seat
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });

            lastUpdated.textContent = new Date().toLocaleTimeString();
        } catch (err) {
            console.error("Fetch error:", err);
            cardsContainer.innerHTML = `<div class="col-12 text-center"><p>Error fetching data</p></div>`;
        }
    }

    form.addEventListener("submit", e => {
        e.preventDefault();
        fetchSchedules();
    });

    cardsContainer.addEventListener("click", e => {
        if (e.target.classList.contains("book-btn")) {
            const scheduleId = e.target.dataset.id;
            const schedules = JSON.parse(localStorage.getItem("busSchedules")) || [];
            const selectedSchedule = schedules.find(s => s.scheduleId == scheduleId);

            if (selectedSchedule) {
                if (!selectedSchedule.tripId) {
                    console.error("Selected schedule has no tripId!", selectedSchedule);
                    alert("Cannot select seats for this bus. Trip ID missing.");
                    return;
                }

                localStorage.setItem("selectedBus", JSON.stringify(selectedSchedule));
                window.location.href = "seat-selection.html"; // Navigate
            } else {
                alert("Schedule not found!");
            }
        }
    });
});
