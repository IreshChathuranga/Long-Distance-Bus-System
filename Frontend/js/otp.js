document.addEventListener("DOMContentLoaded", () => {
    const otpInputs = document.querySelectorAll(".otp-input")
    const otpForm = document.getElementById("otpForm")
    const resendBtn = document.getElementById("resendOtp")
    const timerElement = document.getElementById("timer")

    let timeLeft = 300 // 5 minutes in seconds
    let timerInterval

    // Initialize timer
    startTimer()

    // OTP input handling
    otpInputs.forEach((input, index) => {
        input.addEventListener("input", (e) => {
            const value = e.target.value

            // Only allow numbers
            if (!/^\d$/.test(value)) {
                e.target.value = ""
                return
            }

            // Add filled class
            if (value) {
                e.target.classList.add("filled")
            } else {
                e.target.classList.remove("filled")
            }

            // Move to next input
            if (value && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus()
            }

            // Check if all inputs are filled
            checkOTPComplete()
        })

        input.addEventListener("keydown", (e) => {
            // Handle backspace
            if (e.key === "Backspace" && !e.target.value && index > 0) {
                otpInputs[index - 1].focus()
            }
        })

        input.addEventListener("paste", (e) => {
            e.preventDefault()
            const pastedData = e.clipboardData.getData("text")
            const digits = pastedData.replace(/\D/g, "").slice(0, 6)

            digits.split("").forEach((digit, i) => {
                if (otpInputs[i]) {
                    otpInputs[i].value = digit
                    otpInputs[i].classList.add("filled")
                }
            })

            checkOTPComplete()
        })
    })

    // Form submission
    otpForm.addEventListener("submit", function (e) {
        e.preventDefault()

        const otp = Array.from(otpInputs)
            .map((input) => input.value)
            .join("")

        if (otp.length !== 6) {
            showAlert("Please enter the complete 6-digit OTP", "danger")
            return
        }

        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]')
        const originalText = submitBtn.innerHTML
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Verifying...'
        submitBtn.disabled = true

        // Simulate API call
        setTimeout(() => {
            if (otp === "123456") {
                // Demo OTP
                showAlert("OTP verified successfully!", "success")
                setTimeout(() => {
                    window.location.href = "03-login.html"
                }, 1500)
            } else {
                showAlert("Invalid OTP. Please try again.", "danger")
                submitBtn.innerHTML = originalText
                submitBtn.disabled = false
                clearOTP()
            }
        }, 2000)
    })

    // Resend OTP
    resendBtn.addEventListener("click", function () {
        this.disabled = true
        this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...'

        setTimeout(() => {
            showAlert("New OTP sent to your email", "success")
            this.innerHTML = '<i class="fas fa-redo me-2"></i>Resend OTP'
            this.disabled = false

            // Reset timer
            timeLeft = 300
            startTimer()
            clearOTP()
        }, 2000)
    })

    function startTimer() {
        clearInterval(timerInterval)
        timerInterval = setInterval(() => {
            timeLeft--
            updateTimerDisplay()

            if (timeLeft <= 0) {
                clearInterval(timerInterval)
                showAlert("OTP expired. Please request a new one.", "warning")
                resendBtn.disabled = false
            }
        }, 1000)
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60)
        const seconds = timeLeft % 60
        timerElement.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }

    function checkOTPComplete() {
        const otp = Array.from(otpInputs)
            .map((input) => input.value)
            .join("")
        const submitBtn = otpForm.querySelector('button[type="submit"]')

        if (otp.length === 6) {
            submitBtn.disabled = false
            submitBtn.classList.remove("btn-outline-success")
            submitBtn.classList.add("btn-success")
        } else {
            submitBtn.disabled = true
            submitBtn.classList.remove("btn-success")
            submitBtn.classList.add("btn-outline-success")
        }
    }

    function clearOTP() {
        otpInputs.forEach((input) => {
            input.value = ""
            input.classList.remove("filled")
        })
        otpInputs[0].focus()
        checkOTPComplete()
    }

    function showAlert(message, type) {
        const alertDiv = document.createElement("div")
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `

        const container = document.querySelector(".container-fluid")
        container.insertBefore(alertDiv, container.firstChild)

        setTimeout(() => {
            alertDiv.remove()
        }, 5000)
    }
})
