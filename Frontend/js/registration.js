
const words = ["COLOMBO", "ANURADHAPURA", "TRINKOMALIEE", "GALLE"];
let index = 0;
const animatedSpan = document.getElementById("animatedWords");

function changeWord() {
    animatedSpan.innerHTML = "";
    const wordSpan = document.createElement("span");
    wordSpan.classList.add("word-spin");
    wordSpan.textContent = words[index];
    animatedSpan.appendChild(wordSpan);
    index = (index + 1) % words.length;
}

changeWord();
setInterval(changeWord, 2000);

const togglePasswordBtn = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

togglePasswordBtn.addEventListener("click", () => {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    togglePasswordBtn.querySelector("i").classList.toggle("fa-eye-slash");
});

const registrationForm = document.getElementById("registrationForm");

registrationForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const userData = {
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        nic: document.getElementById("nic").value.trim(),
        passwordHash: password
    };

    try {
        const response = await fetch("http://localhost:8080/api/v1/register/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        let resultText = await response.text();

        let result = {};
        try {
            result = JSON.parse(resultText);
        } catch (e) {
        }

        if (response.ok) {
            alert(result.message || "User registered successfully!");
            registrationForm.reset();
            window.location.href = "user-login.html";
        } else {
            alert(result.message || `Registration failed. Server responded with status ${response.status}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while registering. Check console for details.");
    }
});
