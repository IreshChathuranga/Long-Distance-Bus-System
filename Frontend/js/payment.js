document.addEventListener("DOMContentLoaded", () => {
    const bookingSummary = JSON.parse(localStorage.getItem("bookingSummary"));
    if (!bookingSummary) {
        console.warn("No bookingSummary in localStorage");
        return;
    }

    document.querySelector("#orderCompany").textContent = bookingSummary.company || "";
    document.querySelector("#orderRoute").textContent = bookingSummary.route || "";
    document.querySelector("#orderSeats").textContent = bookingSummary.seats || "";
    document.querySelector("#orderPassenger").textContent = bookingSummary.passenger || "";
    document.querySelector("#orderFare").textContent = `Rs. ${Number(bookingSummary.baseFare || 0).toFixed(2)}`;
    document.querySelector("#orderService").textContent = `Rs. ${Number(bookingSummary.serviceCharge || 0).toFixed(2)}`;
    document.querySelector("#orderTaxes").textContent = `Rs. ${Number(bookingSummary.taxes || 0).toFixed(2)}`;
    document.querySelector("#orderTotal").textContent = `Rs. ${Number(bookingSummary.totalAmount || 0).toFixed(2)}`;

    const payBtn = document.getElementById("payNowBtn");
    if (!payBtn) { console.error("payNowBtn not found"); return; }

    payBtn.innerHTML = `<i class="fas fa-lock me-2"></i>Pay Now Rs.${Number(bookingSummary.totalAmount || 0).toFixed(2)}`;

    payBtn.addEventListener("click", async (ev) => {
        ev.preventDefault();
        console.log("Pay Now clicked");

        const token = localStorage.getItem("jwtToken") || localStorage.getItem("token") || "";
        console.log("JWT token:", token);

        const url = "http://localhost:8080/api/v1/payhere/initiate";
        const payload = {
            bookingRef: bookingSummary.bookingRef,
            
            amount: Number(bookingSummary.totalAmount || 0).toFixed(2),
            firstName: (bookingSummary.passenger || "Passenger").split(" ")[0] || "Passenger",
            lastName: (bookingSummary.passenger || "").split(" ")[1] || "",
            email: "youremail@example.com",
            phone: "0758563998",
            items: `Bus Ticket - ${bookingSummary.route}`,
            address: bookingSummary.address || "Default Address",
            city: bookingSummary.city || "Colombo",
            country: bookingSummary.country || "Sri Lanka"
        };

        console.log("Will POST to:", url);
        console.log("Payload:", payload);

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            console.log("fetch returned, ok:", res.ok, "status:", res.status);

            const text = await res.text();
            console.log("Response body:", text);

            if (!res.ok) throw new Error(`Payment initiation failed (status ${res.status})`);

            document.open();
            document.write(text);
            document.close();
        } catch (err) {
            console.error("Error initiating payment:", err);
            alert("Payment could not be started. Check console for details.\nCommon causes: backend not running, CORS blocked, wrong port.");
        }
    });

});
