// background-slideshow.js

// Background images list
const bgImages = [
    "../image/img4.jpg",  // fixed extension
    "../image/img5.jpg",
    "../image/img3.jpg"
];

let currentIndex = 0;
const heroSection = document.querySelector(".hero-section");

function changeBackground() {
    if (heroSection) {
        heroSection.style.backgroundImage = `url('${bgImages[currentIndex]}')`;
        currentIndex = (currentIndex + 1) % bgImages.length;
    }
}

// Load first image immediately
changeBackground();

// Change every 40s
setInterval(changeBackground, 40000);

window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {   // 50px scroll
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

// Lanka Express Bus Ticketing System - JavaScript

// Import Bootstrap
const bootstrap = window.bootstrap

document.addEventListener("DOMContentLoaded", () => {
    // Initialize all components
    initializeSeatSelection()
    initializeFormValidation()
    initializeNotifications()
    initializeLiveTracking()
    initializePaymentGateway()
    initializeSearch()
    checkUserRole()

    console.log("Lanka Express System Initialized")
})

// Seat Selection Functionality
function initializeSeatSelection() {
    const seats = document.querySelectorAll(".seat.available")
    let selectedSeat = null

    seats.forEach((seat) => {
        seat.addEventListener("click", function () {
            // Remove previous selection
            if (selectedSeat) {
                selectedSeat.classList.remove("selected")
                selectedSeat.classList.add("available")
            }

            // Select new seat
            this.classList.remove("available")
            this.classList.add("selected")
            selectedSeat = this

            // Update booking summary
            updateBookingSummary(this.dataset.seat)
        })
    })
}

function updateBookingSummary(seatNumber) {
    const summaryElement = document.querySelector(".summary-item:nth-child(4) span:last-child")
    if (summaryElement) {
        summaryElement.textContent = seatNumber
        summaryElement.classList.add("fw-bold")
    }
}

// Form Validation
function initializeFormValidation() {
    // Login Form Validation
    const loginForm = document.querySelector("#loginModal form")
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault()
            validateLoginForm()
        })
    }

    // Registration Form Validation
    const registerForm = document.querySelector("#registerModal form")
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault()
            validateRegistrationForm()
        })
    }

    // OTP Form Validation
    const otpForm = document.querySelector("#otpModal form")
    if (otpForm) {
        otpForm.addEventListener("submit", (e) => {
            e.preventDefault()
            validateOTPForm()
        })
    }
}

function validateLoginForm() {
    const email = document.querySelector('#loginModal input[type="email"]').value
    const password = document.querySelector('#loginModal input[type="password"]').value

    if (!email || !password) {
        showNotification("Please fill in all fields", "error")
        return
    }

    if (!isValidEmail(email)) {
        showNotification("Please enter a valid email address", "error")
        return
    }

    // Simulate login process
    showNotification("Logging in...", "info")

    setTimeout(() => {
        // Close login modal and show OTP modal
        const loginModal = bootstrap.Modal.getInstance(document.getElementById("loginModal"))
        loginModal.hide()

        const otpModal = new bootstrap.Modal(document.getElementById("otpModal"))
        otpModal.show()

        showNotification("OTP sent to your email", "success")
    }, 1500)
}

function validateRegistrationForm() {
    const formData = {
        userType: document.querySelector("#registerModal select").value,
        firstName: document.querySelector('#registerModal input[placeholder="First name"]').value,
        lastName: document.querySelector('#registerModal input[placeholder="Last name"]').value,
        email: document.querySelector('#registerModal input[type="email"]').value,
        phone: document.querySelector('#registerModal input[type="tel"]').value,
        password: document.querySelector('#registerModal input[placeholder="Create password"]').value,
        confirmPassword: document.querySelector('#registerModal input[placeholder="Confirm password"]').value,
        agreeTerms: document.querySelector("#agreeTerms").checked,
    }

    // Validation checks
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
        showNotification("Please fill in all required fields", "error")
        return
    }

    if (!isValidEmail(formData.email)) {
        showNotification("Please enter a valid email address", "error")
        return
    }

    if (formData.password !== formData.confirmPassword) {
        showNotification("Passwords do not match", "error")
        return
    }

    if (formData.password.length < 6) {
        showNotification("Password must be at least 6 characters long", "error")
        return
    }

    if (!formData.agreeTerms) {
        showNotification("Please agree to the Terms & Conditions", "error")
        return
    }

    // Simulate registration process
    showNotification("Creating account...", "info")

    setTimeout(() => {
        const registerModal = bootstrap.Modal.getInstance(document.getElementById("registerModal"))
        registerModal.hide()

        const otpModal = new bootstrap.Modal(document.getElementById("otpModal"))
        otpModal.show()

        showNotification("Account created! Please verify your email", "success")
    }, 2000)
}

function validateOTPForm() {
    const otpValue = document.querySelector('#otpModal input[type="text"]').value

    if (!otpValue || otpValue.length !== 6) {
        showNotification("Please enter a valid 6-digit OTP", "error")
        return
    }

    // Simulate OTP verification
    showNotification("Verifying OTP...", "info")

    setTimeout(() => {
        const otpModal = bootstrap.Modal.getInstance(document.getElementById("otpModal"))
        otpModal.hide()

        showNotification("Login successful! Welcome to Lanka Express", "success")
        updateUIForLoggedInUser()
    }, 1500)
}

function updateUIForLoggedInUser() {
    // Update navigation to show user menu
    const accountDropdown = document.querySelector(".navbar-nav .dropdown-toggle")
    if (accountDropdown) {
        accountDropdown.innerHTML = '<i class="fas fa-user-circle me-1"></i> John Doe'
    }
}

// Notification System
function initializeNotifications() {
    // Create notification container if it doesn't exist
    if (!document.querySelector(".notification-container")) {
        const container = document.createElement("div")
        container.className = "notification-container"
        container.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
        `
        document.body.appendChild(container)
    }
}

function showNotification(message, type = "info") {
    const container = document.querySelector(".notification-container")
    const notification = document.createElement("div")

    const typeClasses = {
        success: "alert-success",
        error: "alert-danger",
        warning: "alert-warning",
        info: "alert-info",
    }

    const typeIcons = {
        success: "fas fa-check-circle",
        error: "fas fa-exclamation-circle",
        warning: "fas fa-exclamation-triangle",
        info: "fas fa-info-circle",
    }

    notification.className = `alert ${typeClasses[type]} alert-dismissible fade show`
    notification.style.cssText = `
        margin-bottom: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        border: none;
        border-radius: 10px;
    `

    notification.innerHTML = `
        <i class="${typeIcons[type]} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `

    container.appendChild(notification)

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove()
        }
    }, 5000)
}

// Live Tracking Functionality
function initializeLiveTracking() {
    // Simulate real-time bus tracking updates
    setInterval(updateBusLocation, 30000) // Update every 30 seconds
}

function updateBusLocation() {
    const locations = ["Colombo", "Kegalle", "Mawanella", "Kandy"]
    const speeds = ["45 km/h", "65 km/h", "55 km/h", "70 km/h"]
    const etas = ["11:15 AM", "11:10 AM", "11:20 AM", "11:05 AM"]

    const randomIndex = Math.floor(Math.random() * locations.length)

    // Update tracking display
    const locationElement = document.querySelector(".tracking-info .fw-bold")
    const speedElement = document.querySelectorAll(".tracking-info .fw-bold")[1]
    const etaElement = document.querySelectorAll(".tracking-info .fw-bold")[3]

    if (locationElement) locationElement.textContent = locations[randomIndex]
    if (speedElement) speedElement.textContent = speeds[randomIndex]
    if (etaElement) etaElement.textContent = etas[randomIndex]
}

// Payment Gateway Integration
function initializePaymentGateway() {
    const paymentForm = document.querySelector("#paymentModal form")
    if (paymentForm) {
        paymentForm.addEventListener("submit", (e) => {
            e.preventDefault()
            processPayment()
        })
    }
}

function processPayment() {
    const paymentData = {
        cardNumber: document.querySelector('#paymentModal input[placeholder*="1234"]').value,
        expiryDate: document.querySelector('#paymentModal input[placeholder="MM/YY"]').value,
        cvv: document.querySelector('#paymentModal input[placeholder="123"]').value,
        cardholderName: document.querySelector('#paymentModal input[placeholder="John Doe"]').value,
    }

    // Basic validation
    if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardholderName) {
        showNotification("Please fill in all payment details", "error")
        return
    }

    // Simulate payment processing
    showNotification("Processing payment...", "info")

    setTimeout(() => {
        const paymentModal = bootstrap.Modal.getInstance(document.getElementById("paymentModal"))
        paymentModal.hide()

        // Show confirmation modal
        const confirmationModal = new bootstrap.Modal(document.getElementById("confirmationModal"))
        confirmationModal.show()

        showNotification("Payment successful! Booking confirmed", "success")

        // Send confirmation email/SMS (simulated)
        sendBookingConfirmation()
    }, 3000)
}

function sendBookingConfirmation() {
    // Simulate sending email and SMS notifications
    setTimeout(() => {
        showNotification("Confirmation email sent", "success")
    }, 1000)

    setTimeout(() => {
        showNotification("SMS confirmation sent", "success")
    }, 2000)
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

function formatCurrency(amount) {
    return `Rs. ${amount.toFixed(2)}`
}

function generateBookingID() {
    const prefix = "LK"
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0")
    return `${prefix}${year}${random}`
}

// Search and Filter Functionality
function initializeSearch() {
    const searchForm = document.querySelector(".search-card form")
    if (searchForm) {
        searchForm.addEventListener("submit", (e) => {
            e.preventDefault()
            performBusSearch()
        })
    }
}

function performBusSearch() {
    const searchData = {
        from: document.querySelector(".search-card select:first-of-type").value,
        to: document.querySelector(".search-card select:nth-of-type(2)").value,
        date: document.querySelector('.search-card input[type="date"]').value,
    }

    showNotification("Searching for available buses...", "info")

    // Simulate search results
    setTimeout(() => {
        showNotification(`Found 5 buses for ${searchData.from} to ${searchData.to}`, "success")
        // Scroll to schedules section
        document.getElementById("schedules").scrollIntoView({ behavior: "smooth" })
    }, 1500)
}

// Role-based Access Control
function checkUserRole() {
    // This would typically check with the server
    const userRole = localStorage.getItem("userRole") || "passenger"

    if (userRole === "admin") {
        showAdminFeatures()
    } else if (userRole === "conductor") {
        showConductorFeatures()
    }
}

function showAdminFeatures() {
    // Show admin-specific UI elements
    const adminSection = document.querySelector(".admin-section")
    if (adminSection) {
        adminSection.style.display = "block"
    }
}

function showConductorFeatures() {
    // Show conductor-specific UI elements
    console.log("Conductor features enabled")
}

// QR Code Generation (simulated)
function generateQRCode(bookingData) {
    // In a real application, this would generate an actual QR code
    const qrData = {
        bookingId: bookingData.bookingId,
        route: bookingData.route,
        seat: bookingData.seat,
        date: bookingData.date,
        time: bookingData.time,
    }

    console.log("QR Code generated for:", qrData)
    return qrData
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault()
        const target = document.querySelector(this.getAttribute("href"))
        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start",
            })
        }
    })
})

// Auto-hide notifications on scroll
let lastScrollTop = 0
window.addEventListener("scroll", () => {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop
    const notificationContainer = document.querySelector(".notification-container")

    if (notificationContainer) {
        if (currentScrollTop > lastScrollTop) {
            // Scrolling down
            notificationContainer.style.transform = "translateX(100%)"
        } else {
            // Scrolling up
            notificationContainer.style.transform = "translateX(0)"
        }
    }

    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop
})
