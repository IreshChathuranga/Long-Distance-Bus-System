
let selectedSeats = []
let currentRoute = null
let currentUser = null
let bookingData = {}

const sampleRoutes = [
    {
        id: 1,
        from: "Colombo",
        to: "Kandy",
        busNumber: "NB-1234",
        departure: "08:00 AM",
        arrival: "11:30 AM",
        fare: 450,
        availableSeats: 28,
        totalSeats: 45,
    },
    {
        id: 2,
        from: "Colombo",
        to: "Galle",
        busNumber: "NB-5678",
        departure: "09:15 AM",
        arrival: "12:00 PM",
        fare: 380,
        availableSeats: 15,
        totalSeats: 45,
    },
    {
        id: 3,
        from: "Kandy",
        to: "Jaffna",
        busNumber: "NB-9012",
        departure: "07:30 AM",
        arrival: "02:45 PM",
        fare: 850,
        availableSeats: 32,
        totalSeats: 45,
    },
]

const sampleBookedSeats = [1, 3, 7, 12, 15, 23, 28, 35, 41]

const $ = window.jQuery

$(document).ready(() => {
    initializeApp()
    setupEventListeners()
    setMinDate()
})

function initializeApp() {
    console.log("Bus Ticketing System Initialized")
    loadSchedules()
    generateSeatLayout()
}

function setupEventListeners() {
    // Navigation
    $(".nav-link").on("click", function (e) {
        if ($(this).attr("href").startsWith("#")) {
            e.preventDefault()
            const target = $(this).attr("href")
            showSection(target.substring(1))
        }
    })

    // Quick Search Form
    $("#quickSearchForm").on("submit", (e) => {
        e.preventDefault()
        performQuickSearch()
    })

    // Login Form
    $("#loginForm").on("submit", (e) => {
        e.preventDefault()
        handleLogin()
    })

    // Register Form
    $("#registerForm").on("submit", (e) => {
        e.preventDefault()
        handleRegister()
    })

    // OTP Verification
    $(".otp-input").on("input", function () {
        handleOTPInput(this)
    })

    $("#verifyOTP").on("click", () => {
        verifyOTP()
    })

    // Tracking Form
    $("#trackingForm").on("submit", (e) => {
        e.preventDefault()
        trackBus()
    })

    // Payment
    $("#proceedPayment").on("click", () => {
        showPaymentModal()
    })

    $("#confirmPayment").on("click", () => {
        processPayment()
    })

    // Seat Selection
    $(document).on("click", ".seat.available", function () {
        toggleSeatSelection(this)
    })
}

// Navigation Functions
function showSection(sectionId) {
    // Hide all sections
    $("section").addClass("d-none")
    $("#adminDashboard").addClass("d-none")

    // Show target section
    $(`#${sectionId}`).removeClass("d-none").addClass("fade-in")

    // Update active nav link
    $(".nav-link").removeClass("active")
    $(`.nav-link[href="#${sectionId}"]`).addClass("active")
}

function showLogin() {
    $("#loginModal").modal("show")
}

function showRegister() {
    $("#registerModal").modal("show")
}

function showBooking() {
    showSection("booking")
}

function showSchedules() {
    showSection("schedules")
}

// Search and Booking Functions
function performQuickSearch() {
    const fromCity = $("#fromCity").val()
    const toCity = $("#toCity").val()
    const travelDate = $("#travelDate").val()
    const passengers = $("#passengers").val()

    if (!fromCity || !toCity || !travelDate) {
        showNotification("Please fill in all required fields", "warning")
        return
    }

    if (fromCity === toCity) {
        showNotification("From and To cities cannot be the same", "error")
        return
    }

    // Filter routes based on search criteria
    const filteredRoutes = sampleRoutes.filter(
        (route) => route.from.toLowerCase() === fromCity.toLowerCase() && route.to.toLowerCase() === toCity.toLowerCase(),
    )

    if (filteredRoutes.length === 0) {
        showNotification("No routes found for selected cities", "info")
        return
    }

    // Store search data
    bookingData = {
        from: fromCity,
        to: toCity,
        date: travelDate,
        passengers: Number.parseInt(passengers),
        routes: filteredRoutes,
    }

    // Show schedules with filtered results
    loadSchedules(filteredRoutes)
    showSection("schedules")
    showNotification(`Found ${filteredRoutes.length} route(s)`, "success")
}

function loadSchedules(routes = sampleRoutes) {
    const tbody = $("#schedulesBody")
    tbody.empty()

    routes.forEach((route) => {
        const row = `
            <tr>
                <td><strong>${route.from} → ${route.to}</strong></td>
                <td><span class="badge bg-primary">${route.busNumber}</span></td>
                <td><i class="fas fa-clock me-1"></i>${route.departure}</td>
                <td><i class="fas fa-clock me-1"></i>${route.arrival}</td>
                <td><strong>LKR ${route.fare}</strong></td>
                <td>
                    <span class="badge ${route.availableSeats > 10 ? "bg-success" : route.availableSeats > 5 ? "bg-warning" : "bg-danger"}">
                        ${route.availableSeats}/${route.totalSeats}
                    </span>
                </td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="selectRoute(${route.id})" 
                            ${route.availableSeats === 0 ? "disabled" : ""}>
                        <i class="fas fa-ticket-alt me-1"></i>
                        ${route.availableSeats === 0 ? "Full" : "Book"}
                    </button>
                </td>
            </tr>
        `
        tbody.append(row)
    })
}

function selectRoute(routeId) {
    currentRoute = sampleRoutes.find((route) => route.id === routeId)
    if (currentRoute) {
        generateSeatLayout()
        showSection("booking")
        showNotification(`Selected route: ${currentRoute.from} to ${currentRoute.to}`, "success")
    }
}

// Seat Selection Functions
function generateSeatLayout() {
    const seatLayout = $("#seatLayout")
    seatLayout.empty()

    if (!currentRoute) {
        seatLayout.html('<p class="text-muted">Please select a route first</p>')
        return
    }

    const busLayout = `
        <div class="bus-layout">
            <div class="driver-section">
                <i class="fas fa-steering-wheel"></i>
                <div>Driver</div>
            </div>
            <div class="seats-container">
                ${generateSeats()}
            </div>
        </div>
    `

    seatLayout.html(busLayout)
}

function generateSeats() {
    let seatsHtml = ""
    const totalSeats = 45
    const seatsPerRow = 4

    for (let i = 1; i <= totalSeats; i += seatsPerRow) {
        seatsHtml += '<div class="seat-row">'

        // Left side seats (2 seats)
        for (let j = 0; j < 2; j++) {
            const seatNumber = i + j
            if (seatNumber <= totalSeats) {
                const isBooked = sampleBookedSeats.includes(seatNumber)
                const seatClass = isBooked ? "booked" : "available"
                seatsHtml += `<div class="seat ${seatClass}" data-seat="${seatNumber}">${seatNumber}</div>`
            }
        }

        // Aisle
        seatsHtml += '<div class="aisle"></div>'

        // Right side seats (2 seats)
        for (let j = 2; j < 4; j++) {
            const seatNumber = i + j
            if (seatNumber <= totalSeats) {
                const isBooked = sampleBookedSeats.includes(seatNumber)
                const seatClass = isBooked ? "booked" : "available"
                seatsHtml += `<div class="seat ${seatClass}" data-seat="${seatNumber}">${seatNumber}</div>`
            }
        }

        seatsHtml += "</div>"
    }

    return seatsHtml
}

function toggleSeatSelection(seatElement) {
    const seat = $(seatElement)
    const seatNumber = Number.parseInt(seat.data("seat"))

    if (seat.hasClass("selected")) {
        // Deselect seat
        seat.removeClass("selected").addClass("available")
        selectedSeats = selectedSeats.filter((s) => s !== seatNumber)
    } else {
        // Check if max passengers reached
        if (selectedSeats.length >= (bookingData.passengers || 1)) {
            showNotification(`You can only select ${bookingData.passengers || 1} seat(s)`, "warning")
            return
        }

        // Select seat
        seat.removeClass("available").addClass("selected")
        selectedSeats.push(seatNumber)
    }

    updateBookingSummary()
}

function updateBookingSummary() {
    const summaryDiv = $("#bookingSummary")
    const proceedBtn = $("#proceedPayment")

    if (selectedSeats.length === 0) {
        summaryDiv.html('<p class="text-muted">Select seats to see booking details</p>')
        proceedBtn.prop("disabled", true)
        return
    }

    const fare = currentRoute ? currentRoute.fare : 0
    const subtotal = selectedSeats.length * fare
    const serviceFee = Math.round(subtotal * 0.05) // 5% service fee
    const total = subtotal + serviceFee

    const summaryHtml = `
        <div class="booking-item">
            <span>Route:</span>
            <span>${currentRoute ? `${currentRoute.from} → ${currentRoute.to}` : "N/A"}</span>
        </div>
        <div class="booking-item">
            <span>Bus:</span>
            <span>${currentRoute ? currentRoute.busNumber : "N/A"}</span>
        </div>
        <div class="booking-item">
            <span>Departure:</span>
            <span>${currentRoute ? currentRoute.departure : "N/A"}</span>
        </div>
        <div class="booking-item">
            <span>Selected Seats:</span>
            <span>${selectedSeats.join(", ")}</span>
        </div>
        <div class="booking-item">
            <span>Fare (${selectedSeats.length} × LKR ${fare}):</span>
            <span>LKR ${subtotal}</span>
        </div>
        <div class="booking-item">
            <span>Service Fee:</span>
            <span>LKR ${serviceFee}</span>
        </div>
        <div class="booking-total">
            <span>Total:</span>
            <span>LKR ${total}</span>
        </div>
    `

    summaryDiv.html(summaryHtml)
    proceedBtn.prop("disabled", false)

    // Store booking summary for payment
    bookingData.selectedSeats = selectedSeats
    bookingData.subtotal = subtotal
    bookingData.serviceFee = serviceFee
    bookingData.total = total
}

// Authentication Functions
function handleLogin() {
    const email = $("#loginEmail").val()
    const password = $("#loginPassword").val()

    if (!email || !password) {
        showNotification("Please fill in all fields", "error")
        return
    }

    // Simulate login process
    showLoading('#loginForm button[type="submit"]')

    setTimeout(() => {
        // Simulate successful login
        currentUser = {
            email: email,
            name: "John Doe",
            role: email.includes("admin") ? "admin" : "passenger",
        }

        hideLoading('#loginForm button[type="submit"]', "Login")
        $("#loginModal").modal("hide")

        if (currentUser.role === "admin") {
            showAdminDashboard()
        } else {
            updateNavForLoggedInUser()
        }

        showNotification(`Welcome back, ${currentUser.name}!`, "success")
    }, 2000)
}

function handleRegister() {
    const firstName = $("#firstName").val()
    const lastName = $("#lastName").val()
    const email = $("#registerEmail").val()
    const phone = $("#registerPhone").val()
    const password = $("#registerPassword").val()
    const confirmPassword = $("#confirmPassword").val()
    const userType = $("#userType").val()
    const agreeTerms = $("#agreeTerms").is(":checked")

    // Validation
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword || !userType) {
        showNotification("Please fill in all fields", "error")
        return
    }

    if (password !== confirmPassword) {
        showNotification("Passwords do not match", "error")
        return
    }

    if (!agreeTerms) {
        showNotification("Please agree to the terms and conditions", "error")
        return
    }

    // Simulate registration process
    showLoading('#registerForm button[type="submit"]')

    setTimeout(() => {
        hideLoading('#registerForm button[type="submit"]', "Register")
        $("#registerModal").modal("hide")

        // Show OTP modal
        $("#otpModal").modal("show")
        showNotification("Registration successful! Please verify your email.", "success")
    }, 2000)
}

function handleOTPInput(input) {
    const value = input.value
    if (value && value.length === 1) {
        const nextInput = $(input).next(".otp-input")
        if (nextInput.length) {
            nextInput.focus()
        }
    }
}

function verifyOTP() {
    const otpInputs = $(".otp-input")
    let otp = ""

    otpInputs.each(function () {
        otp += $(this).val()
    })

    if (otp.length !== 6) {
        showNotification("Please enter complete OTP", "error")
        return
    }

    // Simulate OTP verification
    showLoading("#verifyOTP")

    setTimeout(() => {
        hideLoading("#verifyOTP", "Verify")
        $("#otpModal").modal("hide")
        showNotification("Email verified successfully! You can now login.", "success")
    }, 1500)
}

function resendOTP() {
    showNotification("OTP resent to your email", "info")
}

// Payment Functions
function showPaymentModal() {
    if (!bookingData.total) {
        showNotification("No booking data found", "error")
        return
    }

    // Populate payment summary
    const paymentSummary = `
        <div class="mb-2"><strong>Route:</strong> ${currentRoute.from} → ${currentRoute.to}</div>
        <div class="mb-2"><strong>Seats:</strong> ${selectedSeats.join(", ")}</div>
        <div class="mb-2"><strong>Passengers:</strong> ${selectedSeats.length}</div>
        <hr>
        <div class="mb-2">Subtotal: LKR ${bookingData.subtotal}</div>
        <div class="mb-2">Service Fee: LKR ${bookingData.serviceFee}</div>
        <div class="fw-bold text-primary">Total: LKR ${bookingData.total}</div>
    `

    $("#paymentSummaryDetails").html(paymentSummary)
    $("#paymentModal").modal("show")
}

function processPayment() {
    const paymentMethod = $('input[name="paymentMethod"]:checked').val()

    if (!paymentMethod) {
        showNotification("Please select a payment method", "error")
        return
    }

    // Simulate payment processing
    showLoading("#confirmPayment")

    setTimeout(() => {
        hideLoading("#confirmPayment", "Pay Securely")
        $("#paymentModal").modal("hide")

        // Generate ticket
        const ticketNumber = generateTicketNumber()
        showBookingConfirmation(ticketNumber)

        // Reset booking data
        selectedSeats = []
        currentRoute = null
        updateBookingSummary()
        generateSeatLayout()

        showNotification("Payment successful! Your ticket has been booked.", "success")
    }, 3000)
}

function generateTicketNumber() {
    return "TKT" + Date.now().toString().slice(-8)
}

function showBookingConfirmation(ticketNumber) {
    const confirmationHtml = `
        <div class="modal fade" id="confirmationModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title"><i class="fas fa-check-circle me-2"></i>Booking Confirmed</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <div class="mb-4">
                            <i class="fas fa-ticket-alt text-success" style="font-size: 4rem;"></i>
                        </div>
                        <h4>Ticket Number: ${ticketNumber}</h4>
                        <p class="text-muted">Your e-ticket has been sent to your email address.</p>
                        <div class="qr-code-placeholder bg-light p-4 rounded">
                            <i class="fas fa-qrcode" style="font-size: 3rem;"></i>
                            <p class="mt-2 mb-0">QR Code</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" onclick="downloadTicket('${ticketNumber}')">
                            <i class="fas fa-download me-2"></i>Download Ticket
                        </button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `

    $("body").append(confirmationHtml)
    $("#confirmationModal").modal("show")

    // Remove modal after closing
    $("#confirmationModal").on("hidden.bs.modal", function () {
        $(this).remove()
    })
}

function downloadTicket(ticketNumber) {
    showNotification("Ticket download started", "info")
    // In real implementation, this would generate and download a PDF ticket
}

// Bus Tracking Functions
function trackBus() {
    const ticketNumber = $("#ticketNumber").val()
    const phoneNumber = $("#phoneNumber").val()

    if (!ticketNumber || !phoneNumber) {
        showNotification("Please enter both ticket number and phone number", "error")
        return
    }

    // Simulate bus tracking
    showLoading('#trackingForm button[type="submit"]')

    setTimeout(() => {
        hideLoading('#trackingForm button[type="submit"]', "Track Bus")

        // Show mock location data
        const mapContainer = $("#mapContainer")
        mapContainer.html(`
            <div class="text-center">
                <div class="mb-3">
                    <i class="fas fa-map-marker-alt text-primary" style="font-size: 3rem;"></i>
                </div>
                <h5>Bus Location Found</h5>
                <p><strong>Bus:</strong> NB-1234</p>
                <p><strong>Current Location:</strong> Kegalle</p>
                <p><strong>Next Stop:</strong> Kandy</p>
                <p><strong>ETA:</strong> 45 minutes</p>
                <div class="progress mt-3">
                    <div class="progress-bar bg-primary" style="width: 65%"></div>
                </div>
                <small class="text-muted">Journey 65% complete</small>
            </div>
        `)

        showNotification("Bus location updated", "success")
    }, 2000)
}

// Admin Functions
function showAdminDashboard() {
    $("#adminDashboard").removeClass("d-none")
    $("main").addClass("d-none")
    showAdminSection("dashboard")
}

function showAdminSection(section) {
    const content = $("#adminContent")

    switch (section) {
        case "dashboard":
            content.html(getAdminDashboardContent())
            break
        case "routes":
            content.html(getRouteManagementContent())
            break
        case "buses":
            content.html(getBusManagementContent())
            break
        case "bookings":
            content.html(getBookingManagementContent())
            break
        case "users":
            content.html(getUserManagementContent())
            break
    }

    // Update active sidebar link
    $(".admin-sidebar .nav-link").removeClass("active")
    $(`.admin-sidebar .nav-link[onclick="showAdminSection('${section}')"]`).addClass("active")
}

function getAdminDashboardContent() {
    return `
        <div class="row">
            <div class="col-md-3">
                <div class="card bg-primary text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h4>1,234</h4>
                                <p>Total Bookings</p>
                            </div>
                            <i class="fas fa-ticket-alt fa-2x"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-success text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h4>45</h4>
                                <p>Active Buses</p>
                            </div>
                            <i class="fas fa-bus fa-2x"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-warning text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h4>23</h4>
                                <p>Routes</p>
                            </div>
                            <i class="fas fa-route fa-2x"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-info text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h4>567</h4>
                                <p>Users</p>
                            </div>
                            <i class="fas fa-users fa-2x"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">
                        <h5>Recent Bookings</h5>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Ticket #</th>
                                        <th>Route</th>
                                        <th>Passenger</th>
                                        <th>Status</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>TKT12345678</td>
                                        <td>Colombo → Kandy</td>
                                        <td>John Doe</td>
                                        <td><span class="status-badge status-active">Confirmed</span></td>
                                        <td>LKR 450</td>
                                    </tr>
                                    <tr>
                                        <td>TKT12345679</td>
                                        <td>Galle → Colombo</td>
                                        <td>Jane Smith</td>
                                        <td><span class="status-badge status-pending">Pending</span></td>
                                        <td>LKR 380</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <h5>Quick Actions</h5>
                    </div>
                    <div class="card-body">
                        <div class="d-grid gap-2">
                            <button class="btn btn-primary" onclick="showAdminSection('routes')">
                                <i class="fas fa-plus me-2"></i>Add Route
                            </button>
                            <button class="btn btn-success" onclick="showAdminSection('buses')">
                                <i class="fas fa-plus me-2"></i>Add Bus
                            </button>
                            <button class="btn btn-info" onclick="showAdminSection('users')">
                                <i class="fas fa-users me-2"></i>Manage Users
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}

function getRouteManagementContent() {
    return `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3>Route Management</h3>
            <button class="btn btn-primary" onclick="showAddRouteModal()">
                <i class="fas fa-plus me-2"></i>Add New Route
            </button>
        </div>
        <div class="card">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead class="table-dark">
                            <tr>
                                <th>Route ID</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Distance</th>
                                <th>Duration</th>
                                <th>Fare</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>RT001</td>
                                <td>Colombo</td>
                                <td>Kandy</td>
                                <td>115 km</td>
                                <td>3h 30m</td>
                                <td>LKR 450</td>
                                <td><span class="status-badge status-active">Active</span></td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary me-1">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>RT002</td>
                                <td>Colombo</td>
                                <td>Galle</td>
                                <td>119 km</td>
                                <td>2h 45m</td>
                                <td>LKR 380</td>
                                <td><span class="status-badge status-active">Active</span></td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary me-1">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
}

function getBusManagementContent() {
    return `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3>Bus Management</h3>
            <button class="btn btn-primary" onclick="showAddBusModal()">
                <i class="fas fa-plus me-2"></i>Add New Bus
            </button>
        </div>
        <div class="card">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead class="table-dark">
                            <tr>
                                <th>Bus Number</th>
                                <th>Model</th>
                                <th>Capacity</th>
                                <th>Route</th>
                                <th>Driver</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>NB-1234</td>
                                <td>Ashok Leyland</td>
                                <td>45 seats</td>
                                <td>Colombo - Kandy</td>
                                <td>Sunil Perera</td>
                                <td><span class="status-badge status-active">Active</span></td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary me-1">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-info me-1">
                                        <i class="fas fa-map-marker-alt"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>NB-5678</td>
                                <td>Tata Motors</td>
                                <td>45 seats</td>
                                <td>Colombo - Galle</td>
                                <td>Kamal Silva</td>
                                <td><span class="status-badge status-active">Active</span></td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary me-1">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-info me-1">
                                        <i class="fas fa-map-marker-alt"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
}

function getBookingManagementContent() {
    return `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3>Booking Management</h3>
            <div>
                <button class="btn btn-outline-primary me-2">
                    <i class="fas fa-filter me-1"></i>Filter
                </button>
                <button class="btn btn-success">
                    <i class="fas fa-download me-1"></i>Export
                </button>
            </div>
        </div>
        <div class="card">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead class="table-dark">
                            <tr>
                                <th>Ticket #</th>
                                <th>Passenger</th>
                                <th>Route</th>
                                <th>Bus</th>
                                <th>Seats</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>TKT12345678</td>
                                <td>John Doe<br><small class="text-muted">john@email.com</small></td>
                                <td>Colombo → Kandy</td>
                                <td>NB-1234</td>
                                <td>12, 13</td>
                                <td>LKR 900</td>
                                <td><span class="status-badge status-active">Confirmed</span></td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary me-1">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>TKT12345679</td>
                                <td>Jane Smith<br><small class="text-muted">jane@email.com</small></td>
                                <td>Galle → Colombo</td>
                                <td>NB-5678</td>
                                <td>25</td>
                                <td>LKR 380</td>
                                <td><span class="status-badge status-pending">Pending</span></td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary me-1">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
}

function getUserManagementContent() {
    return `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3>User Management</h3>
            <button class="btn btn-primary" onclick="showAddUserModal()">
                <i class="fas fa-plus me-2"></i>Add New User
            </button>
        </div>
        <div class="card">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead class="table-dark">
                            <tr>
                                <th>User ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>USR001</td>
                                <td>John Doe</td>
                                <td>john@email.com</td>
                                <td>+94 77 123 4567</td>
                                <td><span class="badge bg-primary">Passenger</span></td>
                                <td><span class="status-badge status-active">Active</span></td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary me-1">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-warning me-1">
                                        <i class="fas fa-ban"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>USR002</td>
                                <td>Sunil Perera</td>
                                <td>sunil@email.com</td>
                                <td>+94 71 987 6543</td>
                                <td><span class="badge bg-success">Conductor</span></td>
                                <td><span class="status-badge status-active">Active</span></td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary me-1">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-warning me-1">
                                        <i class="fas fa-ban"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
}

// Utility Functions
function setMinDate() {
    const today = new Date().toISOString().split("T")[0]
    $("#travelDate").attr("min", today)
}

function updateNavForLoggedInUser() {
    // Update navigation for logged in user
    const navItems = `
        <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <i class="fas fa-user me-1"></i>${currentUser.name}
            </a>
            <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#"><i class="fas fa-user me-2"></i>Profile</a></li>
                <li><a class="dropdown-item" href="#"><i class="fas fa-history me-2"></i>Booking History</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" onclick="logout()"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
            </ul>
        </li>
    `

    $(".navbar-nav:last").html(navItems)
}

function logout() {
    currentUser = null
    location.reload()
}

function showLoading(selector) {
    const button = $(selector)
    const originalText = button.text()
    button.data("original-text", originalText)
    button.html('<span class="loading-spinner me-2"></span>Loading...')
    button.prop("disabled", true)
}

function hideLoading(selector, text = null) {
    const button = $(selector)
    const originalText = text || button.data("original-text")
    button.html(originalText)
    button.prop("disabled", false)
}

function showNotification(message, type = "info") {
    const alertClass = {
        success: "alert-success",
        error: "alert-danger",
        warning: "alert-warning",
        info: "alert-info",
    }

    const notification = $(`
        <div class="alert ${alertClass[type]} alert-dismissible fade show notification" role="alert">
            <i class="fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : type === "warning" ? "exclamation-triangle" : "info-circle"} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `)

    $("body").append(notification)

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.alert("close")
    }, 5000)
}

// Mock Functions for Admin Modals
function showAddRouteModal() {
    showNotification("Add Route modal would open here", "info")
}

function showAddBusModal() {
    showNotification("Add Bus modal would open here", "info")
}

function showAddUserModal() {
    showNotification("Add User modal would open here", "info")
}

function showForgotPassword() {
    showNotification("Forgot Password modal would open here", "info")
}
