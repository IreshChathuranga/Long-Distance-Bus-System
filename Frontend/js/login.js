document.addEventListener("DOMContentLoaded", () => {
    const ORIGIN = window.location.origin;
    console.log("Current Origin:", ORIGIN);

    const words = ["COLOMBO", "ANURADHAPURA", "TRINKOMALIEE", "GALLE"];
    let index = 0;
    const animatedSpan = document.getElementById("animatedWords");

    function changeWord() {
        if (!animatedSpan) return;
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
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener("click", () => {
            const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
            passwordInput.setAttribute("type", type);
            togglePasswordBtn.querySelector("i")?.classList.toggle("fa-eye-slash");
        });
    }


    const loginForm = document.getElementById("loginForm");
    if (!loginForm) {
        console.error("loginForm element not found!");
        return;
    }

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email")?.value.trim();
        const password = document.getElementById("password")?.value;

        if (!email || !password) {
            alert("Please enter email and password");
            return;
        }

        const payload = { email, password };

        try {
            const res = await fetch("http://localhost:8080/api/v1/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Login failed");
                return;
            }

            const token = data?.data?.token;
            const userOrAdmin = data?.data?.user;

            if (!token || !userOrAdmin) {
                alert("Login successful, but missing user data or token.");
                return;
            }

            localStorage.setItem("jwtToken", token);

            if (userOrAdmin.role === "ADMIN" || userOrAdmin.adminId) {
                localStorage.setItem("admin", JSON.stringify(userOrAdmin));
                alert("Admin login successful!");
                window.location.href = "../html/admin-dashboard.html";
            } else {
                localStorage.setItem("user", JSON.stringify(userOrAdmin));
                alert("User login successful!");
                window.location.href = "../html/user-profile.html";
            }

        } catch (err) {
            console.error("Login error:", err);
            alert("Server error");
        }
    });


    google.accounts.id.initialize({
        client_id: "948863779289-371gubqgtieojjvm7onlqm6qc8gi8i2r.apps.googleusercontent.com",
        callback: handleCredentialResponse,
        ux_mode: "popup"
    });

    google.accounts.id.renderButton(
        document.getElementById("customGoogleBtn"),
        {
            theme: "outline",
            size: "large",
            type: "standard",
            shape: "pill",
            logo_alignment: "center"
        }
    );

    setTimeout(() => {
        const googleBtnText = document.querySelector('#customGoogleBtn span');
        if (googleBtnText) {
            googleBtnText.innerText = "Continue with Google";
        }
    }, 100);

    function handleCredentialResponse(response) {
        const idToken = response.credential;
        console.log("Google ID Token: ", idToken);

        fetch("http://localhost:8080/api/v1/auth/google-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken })
        })
            .then(res => res.json())
            .then(data => {
                const token = data?.data?.token;
                const user = data?.data?.user;

                if (token && user) {
                    localStorage.setItem("jwtToken", token);
                    localStorage.setItem("user", JSON.stringify(user));
                    alert("Google login successful!");
                    window.location.href = "../html/user-profile.html";
                } else {
                    alert(data?.message || "Login failed");
                }
            })
            .catch(err => {
                console.error("Error during Google login:", err);
                alert("Server error");
            });
    }
});
