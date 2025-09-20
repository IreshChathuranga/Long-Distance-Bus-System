// admin-navigation.js

document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav-link[data-section]");
    const sections = document.querySelectorAll(".content-section");

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            // Remove 'active' class from all nav links
            navLinks.forEach(link => link.classList.remove("active"));

            // Add 'active' to clicked nav link
            link.classList.add("active");

            const target = link.getAttribute("data-section") + "-section";

            // Hide all sections
            sections.forEach(section => section.classList.add("d-none"));

            // Show target section
            const sectionToShow = document.getElementById(target);
            if (sectionToShow) {
                sectionToShow.classList.remove("d-none");
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const dashDate = document.getElementById("dashDate");
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months start at 0
    const dd = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    dashDate.value = formattedDate;
});


document.addEventListener("DOMContentLoaded", function () {
    document.querySelector('[data-section="buses"]').addEventListener("click", function () {
        loadBuses();
    });

    document.querySelector('[data-bs-target="#addBusModal"]').addEventListener("click", () => {
        loadOperatorOptions("addOperatorId");
    });

    document.querySelector('[data-section="routes"]').addEventListener("click", function () {
        loadRoutes();
    });

    document.querySelector('[data-section="schedules"]').addEventListener("click", function () {
        loadSchedules();
    });

    document.querySelector('[data-bs-target="#addScheduleModal"]').addEventListener("click", () => {
        loadBusOptions();
        loadRouteOptions();
    });

    document.querySelector('[data-section="bookings"]').addEventListener("click", function () {
        loadBookings();
    });

    document.querySelector('[data-section="users"]').addEventListener("click", function () {
        loadAllUsers();
        showUserTable(document.getElementById("userTypeSelect").value);
    });

});

//for bus management
function loadBuses() {
    const token = localStorage.getItem("jwtToken"); // Replace "token" with your actual key name

    if (!token) {
        console.error("Token not found. Please login first.");
        alert("Session expired. Please login again.");
        return;
    }

    fetch("http://localhost:8080/api/v1/bus/get", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    })
        .then(response => {
            if (!response.ok) {
                if (response.status === 403) {
                    alert("Unauthorized access. Please login.");
                }
                throw new Error("Failed to fetch buses. Status: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.querySelector("#buses-section table tbody");
            tbody.innerHTML = "";

            data.data.forEach(bus => {
                const row = document.createElement("tr");
                row.setAttribute("data-bus-id", bus.busId);

                row.innerHTML = `
                    <td>${bus.busId}</td>
                    <td>${bus.plateNo}</td>
                    <td>${bus.busType}</td>
                    <td>${bus.amenities}</td>
                    <td>${bus.operatorId}</td>
                    <td>${bus.seatMapId}</td>
                    <td><span class="badge ${bus.active === 'Active' ? 'bg-success' : 'bg-secondary'}">${bus.active}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary me-1" onclick='editBus(${JSON.stringify(bus)})'>
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick='deleteBus(${bus.busId})'>
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });

        })
        .catch(error => {
            console.error("Error fetching bus data:", error);
        });
}
function loadOperatorOptions(selectId = "editOperatorId") {
    const token = localStorage.getItem("jwtToken");

    fetch("http://localhost:8080/api/v1/operator/get", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch operators");
            }
            return response.json();
        })
        .then(data => {
            const select = document.getElementById(selectId);
            if (!select) {
                console.warn(`Select element not found for ID: ${selectId}`);
                return;
            }

            select.innerHTML = '<option value="">Select Operator</option>';

            data.data.forEach(operator => {
                const option = document.createElement("option");
                option.value = operator.operatorId;
                option.textContent = `${operator.operatorId} - ${operator.name || "Unnamed Operator"}`;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error fetching operators:", error);
        });
}
function editBus(bus) {
    document.getElementById("editBusId").value = bus.busId;
    document.getElementById("editSeatMapId").value = bus.seatMapId;
    document.getElementById("editPlateNo").value = bus.plateNo;
    document.getElementById("editBusType").value = bus.busType;
    document.getElementById("editAmenities").value = bus.amenities;
    document.getElementById("editActive").value = bus.active;

    // Load operator options first, then select current operatorId
    loadOperatorOptions();

    // Wait for a short delay to ensure options are loaded (or use a callback if necessary)
    setTimeout(() => {
        document.getElementById("editOperatorId").value = bus.operatorId;
    }, 300);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById("editBusModal"));
    modal.show();
}
function submitEditBus() {
    const token = localStorage.getItem("jwtToken");

    const updatedBus = {
        busId: parseInt(document.getElementById("editBusId").value),
        operatorId: parseInt(document.getElementById("editOperatorId").value),
        seatMapId: parseInt(document.getElementById("editSeatMapId").value),
        plateNo: document.getElementById("editPlateNo").value.trim(),
        busType: document.getElementById("editBusType").value.trim(),
        amenities: document.getElementById("editAmenities").value.trim(),
        active: document.getElementById("editActive").value
    };

    fetch("http://localhost:8080/api/v1/bus/modify", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(updatedBus)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to update bus. Status: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            alert("Bus updated successfully!");
            const modal = bootstrap.Modal.getInstance(document.getElementById("editBusModal"));
            modal.hide();
            loadBuses(); // Refresh table
        })
        .catch(error => {
            console.error("Error updating bus:", error);
            alert("Error updating bus: " + error.message);
        });
}
function submitAddBus() {
    const token = localStorage.getItem("jwtToken");

    const newBus = {
        plateNo: document.getElementById("addPlateNo").value.trim(),
        busType: document.getElementById("addBusType").value.trim(),
        amenities: document.getElementById("addAmenities").value.trim(),
        operatorId: parseInt(document.getElementById("addOperatorId").value),
        seatMapId: parseInt(document.getElementById("addSeatMapId").value),
        active: document.getElementById("addActive").value
    };

    fetch("http://localhost:8080/api/v1/bus/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(newBus)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to add bus. Status: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            alert("Bus added successfully!");
            const modal = bootstrap.Modal.getInstance(document.getElementById("addBusModal"));
            modal.hide();
            loadBuses(); // Refresh table
            document.getElementById("addBusForm").reset(); // Optional: reset form
        })
        .catch(error => {
            console.error("Error adding bus:", error);
            alert("Error adding bus: " + error.message);
        });
}
function deleteBus(busId) {
    const token = localStorage.getItem("jwtToken");

    if (!confirm(`Are you sure you want to delete Bus ID ${busId}?`)) {
        return;
    }

    fetch(`http://localhost:8080/api/v1/bus/delete/${busId}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to delete bus. Status: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            alert("Bus deleted successfully!");
            loadBuses(); // Reload the bus list after deletion
        })
        .catch(error => {
            console.error("Error deleting bus:", error);
            alert("Error deleting bus: " + error.message);
        });
}

//for route management

function loadRoutes() {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
        alert("Session expired. Please log in again.");
        return;
    }

    fetch("http://localhost:8080/api/v1/route/get", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch routes. Status: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.querySelector("#routes-section table tbody");
            tbody.innerHTML = ""; // Clear previous data

            data.data.forEach(route => {
                const row = document.createElement("tr");

                row.innerHTML = `
                <td>${route.routeId}</td>
                <td>${route.code}</td>
                <td>${route.name}</td>
                <td>${route.originStopName || "N/A"}</td>
                <td>${route.destinationStopName || "N/A"}</td>
                <td>${route.distanceKm ?? "N/A"} km</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick='editRoute(${JSON.stringify(route)})'>
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick='deleteRoute(${route.routeId})'>
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;

                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error loading routes:", error);
            alert("Error loading routes: " + error.message);
        });
}


//for shedule managment

function loadSchedules() {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
        console.error("Token not found. Please login first.");
        alert("Session expired. Please login again.");
        return;
    }

    fetch("http://localhost:8080/api/v1/schedule/get", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    })
        .then(response => {
            if (!response.ok) {
                if (response.status === 403) {
                    alert("Unauthorized access. Please login.");
                }
                throw new Error("Failed to fetch schedules. Status: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.querySelector("#schedules-section table tbody");
            tbody.innerHTML = "";

            data.data.forEach(schedule => {
                const row = document.createElement("tr");
                row.setAttribute("data-schedule-id", schedule.scheduleId);

                row.innerHTML = `
                <td>${schedule.scheduleId}</td>
                <td>${schedule.busId}</td>
                <td>${schedule.routeId}</td>
                <td>${schedule.departTime}</td>
                <td>${schedule.daysOfWeek}</td>
                <td><span class="badge ${schedule.active === 'Active' ? 'bg-success' : 'bg-secondary'}">${schedule.active}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick='editSchedule(${JSON.stringify(schedule)})'>
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick='deleteSchedule(${schedule.scheduleId})'>
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
                tbody.appendChild(row);
            });

        })
        .catch(error => {
            console.error("Error fetching schedule data:", error);
        });
}
function loadBusOptions() {
    const token = localStorage.getItem("jwtToken");

    fetch("http://localhost:8080/api/v1/bus/get", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById("scheduleBus");
            select.innerHTML = `<option value="">Choose Bus...</option>`;

            data.data.forEach(bus => {
                const option = document.createElement("option");
                option.value = bus.busId;
                option.textContent = `${bus.plateNo} (${bus.busType})`;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error loading bus options:", error);
        });
}
function loadRouteOptions() {
    const token = localStorage.getItem("jwtToken");

    fetch("http://localhost:8080/api/v1/route/get", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById("scheduleRoute");
            select.innerHTML = `<option value="">Choose Route...</option>`;

            data.data.forEach(route => {
                const option = document.createElement("option");
                option.value = route.routeId;
                option.textContent = `${route.code} - ${route.name}`;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error loading route options:", error);
        });
}
document.getElementById("submitScheduleBtn").addEventListener("click", function () {
    const token = localStorage.getItem("jwtToken");

    const busId = document.getElementById("scheduleBus").value;
    const routeId = document.getElementById("scheduleRoute").value;
    const scheduleDate = document.getElementById("scheduleDate").value;
    const departureTime = document.getElementById("departureTime").value;
    const active = document.getElementById("scheduleActive").value;

    if (!busId || !routeId || !scheduleDate || !departureTime || !active) {
        alert("Please fill in all required fields.");
        return;
    }

    const daysOfWeek = new Date(scheduleDate).toLocaleString('en-US', { weekday: 'long' });

    const scheduleData = {
        busId: parseInt(busId),
        routeId: parseInt(routeId),
        departTime: `${scheduleDate}T${departureTime}`,
        daysOfWeek: daysOfWeek,
        active: active
    };

    fetch("http://localhost:8080/api/v1/schedule/save", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(scheduleData)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message || "Error occurred"); });
            }
            return response.json();
        })
        .then(data => {
            alert("Schedule added successfully.");
            document.getElementById("addScheduleForm").reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById("addScheduleModal"));
            modal.hide();
            loadSchedules(); // refresh table
        })
        .catch(error => {
            console.error("Error adding schedule:", error);
            alert("Failed to add schedule: " + error.message);
        });
});
function editSchedule(schedule) {
    // Load bus and route options before filling data
    loadBusOptionsForEdit(schedule.busId);
    loadRouteOptionsForEdit(schedule.routeId);

    document.getElementById("editScheduleId").value = schedule.scheduleId;
    document.getElementById("editScheduleBus").value = schedule.busId;
    document.getElementById("editScheduleRoute").value = schedule.routeId;

    // Extract date and time from ISO string
    const departDate = new Date(schedule.departTime);
    const formattedDate = departDate.toISOString().split("T")[0];
    const formattedTime = departDate.toTimeString().split(":").slice(0,2).join(":");

    document.getElementById("editScheduleDate").value = formattedDate;
    document.getElementById("editDepartureTime").value = formattedTime;
    document.getElementById("editScheduleActive").value = schedule.active;

    const modal = new bootstrap.Modal(document.getElementById("editScheduleModal"));
    modal.show();
}
document.getElementById("updateScheduleBtn").addEventListener("click", function () {
    const token = localStorage.getItem("jwtToken");

    const scheduleId = document.getElementById("editScheduleId").value;
    const busId = document.getElementById("editScheduleBus").value;
    const routeId = document.getElementById("editScheduleRoute").value;
    const scheduleDate = document.getElementById("editScheduleDate").value;
    const departureTime = document.getElementById("editDepartureTime").value;
    const active = document.getElementById("editScheduleActive").value;

    if (!scheduleId || !busId || !routeId || !scheduleDate || !departureTime || !active) {
        alert("Please fill in all required fields.");
        return;
    }

    const daysOfWeek = new Date(scheduleDate).toLocaleString('en-US', { weekday: 'long' });

    const updatedSchedule = {
        scheduleId: parseInt(scheduleId),
        busId: parseInt(busId),
        routeId: parseInt(routeId),
        departTime: `${scheduleDate}T${departureTime}`,
        daysOfWeek: daysOfWeek,
        active: active
    };

    fetch("http://localhost:8080/api/v1/schedule/modify", {
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedSchedule)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message || "Error occurred"); });
            }
            return response.json();
        })
        .then(data => {
            alert("Schedule updated successfully.");
            document.getElementById("editScheduleForm").reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById("editScheduleModal"));
            modal.hide();
            loadSchedules(); // refresh table
        })
        .catch(error => {
            console.error("Error updating schedule:", error);
            alert("Failed to update schedule: " + error.message);
        });
});
function loadBusOptionsForEdit(selectedBusId) {
    const token = localStorage.getItem("jwtToken");

    fetch("http://localhost:8080/api/v1/bus/get", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById("editScheduleBus");
            select.innerHTML = `<option value="">Choose Bus...</option>`;

            data.data.forEach(bus => {
                const option = document.createElement("option");
                option.value = bus.busId;
                option.textContent = `${bus.plateNo} (${bus.busType})`;
                if (bus.busId == selectedBusId) {
                    option.selected = true;
                }
                select.appendChild(option);
            });
        });
}
function loadRouteOptionsForEdit(selectedRouteId) {
    const token = localStorage.getItem("jwtToken");

    fetch("http://localhost:8080/api/v1/route/get", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById("editScheduleRoute");
            select.innerHTML = `<option value="">Choose Route...</option>`;

            data.data.forEach(route => {
                const option = document.createElement("option");
                option.value = route.routeId;
                option.textContent = `${route.code} - ${route.name}`;
                if (route.routeId == selectedRouteId) {
                    option.selected = true;
                }
                select.appendChild(option);
            });
        });
}
function deleteSchedule(scheduleId) {
    if (!confirm("Are you sure you want to delete this schedule?")) {
        return;
    }

    const token = localStorage.getItem("jwtToken");

    fetch(`http://localhost:8080/api/v1/schedule/delete/${scheduleId}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message || "Delete failed"); });
            }
            return response.json();
        })
        .then(data => {
            alert("Schedule deleted successfully.");
            loadSchedules(); // Refresh table after delete
        })
        .catch(error => {
            console.error("Error deleting schedule:", error);
            alert("Failed to delete schedule: " + error.message);
        });
}

//for booking management
function loadBookings() {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
        alert("Session expired. Please login again.");
        return;
    }

    fetch("http://localhost:8080/api/v1/booking/get", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) {
                if (response.status === 403) {
                    alert("Unauthorized access. Please login.");
                }
                throw new Error("Failed to fetch bookings. Status: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            allBookings = data.data;
            currentPage = 1; // Reset to page 1
            renderBookingsTable(allBookings);
        })
        .catch(error => {
            console.error("Error fetching booking data:", error);
            alert("Error loading bookings: " + error.message);
        });
}
function renderPaginationControls(totalItems) {
    const paginationContainerId = "bookingPagination";
    let container = document.getElementById(paginationContainerId);

    if (!container) {
        container = document.createElement("div");
        container.id = paginationContainerId;
        container.className = "mt-3 d-flex justify-content-center";
        document.querySelector("#bookings-section .card-body").appendChild(container);
    }

    container.innerHTML = "";
    const totalPages = Math.ceil(totalItems / rowsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.className = `btn btn-sm me-1 ${i === currentPage ? 'btn-primary' : 'btn-outline-primary'}`;
        btn.textContent = i;
        btn.addEventListener("click", () => {
            currentPage = i;
            renderBookingsTable(allBookings);
        });
        container.appendChild(btn);
    }
}


let allBookings = [];
let currentPage = 1;
const rowsPerPage = 5;

function renderBookingsTable(bookings) {
    const tbody = document.querySelector("#bookings-section table tbody");
    tbody.innerHTML = "";

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const pageBookings = bookings.slice(startIndex, endIndex);

    pageBookings.forEach(booking => {
        const row = document.createElement("tr");
        row.setAttribute("data-booking-id", booking.bookingId);

        row.innerHTML = `
            <td>${booking.bookingId}</td>
            <td>${booking.userId}</td>
            <td>${booking.tripId}</td>
            <td>${booking.bookingRef}</td>
            <td>${booking.seatNumber}</td>
            <td>${booking.totalAmount}</td>
            <td>${booking.currency}</td>
            <td>${booking.createdAt ? booking.createdAt.replace("T", " ").split(".")[0] : "-"}</td>
            <td>${booking.expiresAt ? booking.expiresAt.replace("T", " ").split(".")[0] : "-"}</td>
            <td><span class="badge ${booking.status?.toUpperCase() === 'BOOKED' ? 'bg-success' : 'bg-warning'}">${booking.status}</span></td>
            <td>
  <button class="btn btn-sm btn-outline-primary" onclick='editBooking(${JSON.stringify(booking)})'>
    <i class="fas fa-edit"></i>
  </button>
  <button class="btn btn-sm btn-outline-danger" onclick='deleteBooking(${booking.bookingId})'>
    <i class="fas fa-trash"></i>
  </button>
</td>
        `;
        tbody.appendChild(row);
    });

    renderPaginationControls(bookings.length);
}
function editBooking(booking) {
    document.getElementById("editBookingId").value = booking.bookingId;
    document.getElementById("editBookingRef").value = booking.bookingRef;
    document.getElementById("editSeatNumber").value = booking.seatNumber;
    document.getElementById("editTotalAmount").value = booking.totalAmount;
    document.getElementById("editCurrency").value = booking.currency;
    document.getElementById("editStatus").value = booking.status;

    // Load Trip and User dropdowns first, then set selected values
    loadTripOptions("editTripId", booking.tripId);
    loadUserOptions("editUserId", booking.userId);

    const modal = new bootstrap.Modal(document.getElementById("editBookingModal"));
    modal.show();
}
function loadTripOptions(selectId, selectedTripId = null) {
    const token = localStorage.getItem("jwtToken");

    fetch("http://localhost:8080/api/v1/trip/get", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    })
        .then(res => res.json())
        .then(data => {
            const select = document.getElementById(selectId);
            select.innerHTML = '<option value="">Select Trip</option>';

            data.data.forEach(trip => {
                const option = document.createElement("option");
                option.value = trip.tripId;
                option.textContent = `${trip.tripId}`;
                if (trip.tripId === selectedTripId) option.selected = true;
                select.appendChild(option);
            });
        });
}

function loadUserOptions(selectId, selectedUserId = null) {
    const token = localStorage.getItem("jwtToken");

    fetch("http://localhost:8080/api/v1/register/get", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    })
        .then(res => res.json())
        .then(data => {
            const select = document.getElementById(selectId);
            select.innerHTML = '<option value="">Select User</option>';

            data.data.forEach(user => {
                const option = document.createElement("option");
                option.value = user.userId;
                option.textContent = `${user.userId} - ${user.name}`;
                if (user.userId === selectedUserId) option.selected = true;
                select.appendChild(option);
            });
        });
}
document.getElementById("editBookingForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const token = localStorage.getItem("jwtToken");
    const bookingDTO = {
        bookingId: document.getElementById("editBookingId").value,
        userId: document.getElementById("editUserId").value,
        tripId: document.getElementById("editTripId").value,
        bookingRef: document.getElementById("editBookingRef").value,
        seatNumber: document.getElementById("editSeatNumber").value,
        totalAmount: document.getElementById("editTotalAmount").value,
        currency: document.getElementById("editCurrency").value,
        status: document.getElementById("editStatus").value
    };

    fetch("http://localhost:8080/api/v1/booking/modify", {
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(bookingDTO)
    })
        .then(response => response.json())
        .then(data => {
            alert("Booking updated successfully!");
            const modal = bootstrap.Modal.getInstance(document.getElementById("editBookingModal"));
            modal.hide();
            loadBookings(); // refresh table
        })
        .catch(error => {
            console.error("Update failed:", error);
            alert("Error updating booking.");
        });
});

function deleteBooking(bookingId) {
    if (!confirm("Are you sure you want to delete this booking?")) {
        return;
    }

    const token = localStorage.getItem("jwtToken");

    fetch(`http://localhost:8080/api/v1/booking/delete/${bookingId}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to delete booking. Status: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            alert("Booking deleted successfully!");
            loadBookings(); // Refresh the table
        })
        .catch(error => {
            console.error("Error deleting booking:", error);
            alert("Failed to delete booking.");
        });
}

//Users management
// Globals
const token = localStorage.getItem("jwtToken");

// On page load or whenever user clicks "User Management"
document.addEventListener("DOMContentLoaded", function () {
    // ... other sections listeners ...

    // If there's a section trigger for users:
    document.querySelector('[data-section="users"]').addEventListener("click", function () {
        loadAllUsers(); // load initial data (passengers, operators, admins)
        // Also ensure select is set
        document.getElementById("userTypeSelect").value = "passengers";
        showUserTable("passengers");
    });

    // When select changes
    document.getElementById("userTypeSelect").addEventListener("change", function () {
        const selected = this.value; // “passengers” or “operators” or “admins”
        showUserTable(selected);
    });
});

// Function to show only the selected table, hide others
function showUserTable(type) {
    const tables = {
        "passengers": document.getElementById("passengersTable"),
        "operators": document.getElementById("operatorsTable"),
        "admins": document.getElementById("adminsTable")
    };

    Object.keys(tables).forEach(key => {
        if (key === type) {
            tables[key].classList.remove("d-none");
        } else {
            tables[key].classList.add("d-none");
        }
    });
}

// Function to load data for all types
function loadAllUsers() {
    if (!token) {
        alert("Session expired. Please login again.");
        return;
    }

    // Fetch passengers/users
    fetch("http://localhost:8080/api/v1/register/get", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    })
        .then(resp => resp.json())
        .then(data => {
            const users = data.data; // Array of UserDTO
            populateUsersTable(users);
        })
        .catch(error => {
            console.error("Error loading users:", error);
            alert("Error loading users.");
        });

    // Fetch operators
    fetch("http://localhost:8080/api/v1/operator/get", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    })
        .then(resp => resp.json())
        .then(data => {
            const ops = data.data;
            populateOperatorsTable(ops);
        })
        .catch(error => {
            console.error("Error loading operators:", error);
            alert("Error loading operators.");
        });

    // Fetch admins
    fetch("http://localhost:8080/api/v1/admin/get", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    })
        .then(resp => resp.json())
        .then(data => {
            const admins = data.data;
            populateAdminsTable(admins);
        })
        .catch(error => {
            console.error("Error loading admins:", error);
            alert("Error loading admins.");
        });
}

// Functions to populate each table

function populateUsersTable(users) {
    const tbody = document.querySelector("#passengersTable tbody");
    tbody.innerHTML = "";
    users.forEach(user => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${user.userId}</td>
      <td>${user.firstName}</td>
      <td>${user.lastName}</td>
      <td>${user.email}</td>
      <td>${user.phone}</td>
      <td>${user.nic}</td>
      <td>******</td>  <!-- hide real password / show placeholder -->
      <td><span class="badge ${getRoleBadgeClass(user.role)}">${user.role}</span></td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1" onclick='editUser(${JSON.stringify(user)})'>
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick='deleteUser(${user.userId})'>
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
        tbody.appendChild(tr);
    });
}

function populateOperatorsTable(ops) {
    const tbody = document.querySelector("#operatorsTable tbody");
    tbody.innerHTML = "";
    ops.forEach(op => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${op.operatorId}</td>
      <td>${op.name}</td>
      <td>${op.address}</td>
      <td>${op.email}</td>
      <td>${op.hotline}</td>
      <td><span class="badge ${getStatusBadgeClass(op.status)}">${op.status}</span></td>
      <td><span class="badge ${getRoleBadgeClass(op.role || "OPERATOR")}">${op.role || "OPERATOR"}</span></td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1" onclick='editOperator(${JSON.stringify(op)})'>
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick='deleteOperator(${op.operatorId})'>
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
        tbody.appendChild(tr);
    });
}

function populateAdminsTable(admins) {
    const tbody = document.querySelector("#adminsTable tbody");
    tbody.innerHTML = "";
    admins.forEach(adm => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${adm.adminId}</td>
      <td>${adm.name}</td>
      <td>${adm.address}</td>
      <td>${adm.email}</td>
      <td>${adm.phone}</td>
      <td>${adm.nic}</td>
      <td>******</td>
      <td><span class="badge ${getRoleBadgeClass(adm.role || "ADMIN")}">${adm.role || "ADMIN"}</span></td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1" onclick='editAdmin(${JSON.stringify(adm)})'>
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick='deleteAdmin(${adm.adminId})'>
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
        tbody.appendChild(tr);
    });
}

// Helper for badge class based on role
function getRoleBadgeClass(role) {
    switch ((role || "").toUpperCase()) {
        case "ADMIN":
            return "bg-danger";
        case "OPERATOR":
            return "bg-info";
        case "USER":
        case "PASSENGER":
            return "bg-success";
        default:
            return "bg-secondary";
    }
}

// Helper for operator status badge (if any)
function getStatusBadgeClass(status) {
    // You can set mapping of statuses
    if (!status) return "bg-secondary";
    if (status.toUpperCase() === "ACTIVE") return "bg-success";
    if (status.toUpperCase() === "INACTIVE") return "bg-secondary";
    return "bg-warning";
}
// ===== USERS =====
function editUser(user) {
    document.getElementById("updateUserId").value = user.userId;
    document.getElementById("updateFirstName").value = user.firstName;
    document.getElementById("updateLastName").value = user.lastName;
    document.getElementById("updateEmail").value = user.email;
    document.getElementById("updatePhone").value = user.phone;
    document.getElementById("updateNic").value = user.nic;

    new bootstrap.Modal(document.getElementById("updateUserModal")).show();
}

document.getElementById("updateUserForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const payload = {
        userId: document.getElementById("updateUserId").value,
        firstName: document.getElementById("updateFirstName").value,
        lastName: document.getElementById("updateLastName").value,
        email: document.getElementById("updateEmail").value,
        phone: document.getElementById("updatePhone").value,
        nic: document.getElementById("updateNic").value,
    };

    fetch("http://localhost:8080/api/v1/register/modify", {
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    }).then(resp => resp.json())
        .then(() => {
            alert("User updated successfully!");
            loadAllUsers();
            bootstrap.Modal.getInstance(document.getElementById("updateUserModal")).hide();
        });
});

function deleteUser(id) {
    if (!confirm("Are you sure to delete this user?")) return;

    fetch(`http://localhost:8080/api/v1/register/delete/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    }).then(resp => resp.json())
        .then(() => {
            alert("User deleted!");
            loadAllUsers();
        });
}

// ===== OPERATORS =====
function editOperator(op) {
    document.getElementById("updateOperatorId").value = op.operatorId;
    document.getElementById("updateOperatorName").value = op.name;
    document.getElementById("updateOperatorAddress").value = op.address;
    document.getElementById("updateOperatorEmail").value = op.email;
    document.getElementById("updateOperatorHotline").value = op.hotline;
    document.getElementById("updateOperatorStatus").value = op.status;

    new bootstrap.Modal(document.getElementById("updateOperatorModal")).show();
}

document.getElementById("updateOperatorForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const payload = {
        operatorId: document.getElementById("updateOperatorId").value,
        name: document.getElementById("updateOperatorName").value,
        address: document.getElementById("updateOperatorAddress").value,
        email: document.getElementById("updateOperatorEmail").value,
        hotline: document.getElementById("updateOperatorHotline").value,
        status: document.getElementById("updateOperatorStatus").value,
    };

    fetch("http://localhost:8080/api/v1/operator/modify", {
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    }).then(resp => resp.json())
        .then(() => {
            alert("Operator updated successfully!");
            loadAllUsers();
            bootstrap.Modal.getInstance(document.getElementById("updateOperatorModal")).hide();
        });
});

function deleteOperator(id) {
    if (!confirm("Are you sure to delete this operator?")) return;

    fetch(`http://localhost:8080/api/v1/operator/delete/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    }).then(resp => resp.json())
        .then(() => {
            alert("Operator deleted!");
            loadAllUsers();
        });
}

// ===== ADMINS =====
function editAdmin(adm) {
    document.getElementById("updateAdminId").value = adm.adminId;
    document.getElementById("updateAdminName").value = adm.name;
    document.getElementById("updateAdminAddress").value = adm.address;
    document.getElementById("updateAdminEmail").value = adm.email;
    document.getElementById("updateAdminPhone").value = adm.phone;
    document.getElementById("updateAdminNic").value = adm.nic;

    new bootstrap.Modal(document.getElementById("updateAdminModal")).show();
}

document.getElementById("updateAdminForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const payload = {
        adminId: document.getElementById("updateAdminId").value,
        name: document.getElementById("updateAdminName").value,
        address: document.getElementById("updateAdminAddress").value,
        email: document.getElementById("updateAdminEmail").value,
        phone: document.getElementById("updateAdminPhone").value,
        nic: document.getElementById("updateAdminNic").value,
    };

    fetch("http://localhost:8080/api/v1/admin/modify", {
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    }).then(resp => resp.json())
        .then(() => {
            alert("Admin updated successfully!");
            loadAllUsers();
            bootstrap.Modal.getInstance(document.getElementById("updateAdminModal")).hide();
        });
});

function deleteAdmin(id) {
    if (!confirm("Are you sure to delete this admin?")) return;

    fetch(`http://localhost:8080/api/v1/admin/delete/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    }).then(resp => resp.json())
        .then(() => {
            alert("Admin deleted!");
            loadAllUsers();
        });
}

const addUserBtn = document.querySelector('[data-bs-target="#addUserModal"]');
const userTypeSelect = document.getElementById("userTypeSelect");

// Disable Add User for Passengers + Show/Hide Fields
userTypeSelect.addEventListener("change", function () {
    const type = this.value;

    // hide all conditional fields first
    document.querySelectorAll(".operator-field, .admin-field").forEach(el => el.classList.add("d-none"));

    // by default phone hide karanna
    document.getElementById("userPhone").closest(".mb-3").classList.add("d-none");

    if (type === "passengers") {
        addUserBtn.disabled = true;
    } else {
        addUserBtn.disabled = false;

        if (type === "operators") {
            // show only operator fields
            document.querySelectorAll(".operator-field").forEach(el => el.classList.remove("d-none"));
            // Phone number not required for operator
            document.getElementById("userPhone").removeAttribute("required");

        } else if (type === "admins") {
            // show admin fields
            document.querySelectorAll(".admin-field").forEach(el => el.classList.remove("d-none"));
            // show phone field for admin
            document.getElementById("userPhone").closest(".mb-3").classList.remove("d-none");
            document.getElementById("userPhone").setAttribute("required", "true");
        }
    }
});

// Default load
if (userTypeSelect.value === "passengers") {
    addUserBtn.disabled = true;
}


// Handle Add User Submit
document.getElementById("addUserForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const type = userTypeSelect.value;
    let payload = {};

    if (type === "operators") {
        payload = {
            name: document.getElementById("userName").value,
            address: document.getElementById("operatorAddress").value,
            email: document.getElementById("userEmail").value,
            hotline: document.getElementById("operatorHotline").value,
            status: "ACTIVE",
        };

        fetch("http://localhost:8080/api/v1/operator/save", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        }).then(resp => resp.json())
            .then(() => {
                alert("Operator saved!");
                loadAllUsers();
                bootstrap.Modal.getInstance(document.getElementById("addUserModal")).hide();
                document.getElementById("addUserForm").reset();
            });

    } else if (type === "admins") {
        payload = {
            name: document.getElementById("userName").value,
            address: document.getElementById("adminAddress").value,
            email: document.getElementById("userEmail").value,
            phone: document.getElementById("userPhone").value,
            nic: document.getElementById("adminNic").value,
            password: document.getElementById("adminPassword").value,
        };

        fetch("http://localhost:8080/api/v1/admin/save", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        }).then(resp => resp.json())
            .then(() => {
                alert("Admin saved!");
                loadAllUsers();
                bootstrap.Modal.getInstance(document.getElementById("addUserModal")).hide();
                document.getElementById("addUserForm").reset();
            });
    }
});












