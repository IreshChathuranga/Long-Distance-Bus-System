document.addEventListener("DOMContentLoaded", async () => {
    const seatsContainer = document.querySelector(".seats-container");
    const selectedBus = JSON.parse(localStorage.getItem("selectedBus"));
    const token = localStorage.getItem("jwtToken") || localStorage.getItem("token") || "";

    const busInfoCard = document.querySelector(".bus-info");
    const titleElem = busInfoCard.querySelector(".card-title");
    const routeElem = busInfoCard.querySelector(".route-info");
    const fareElem = busInfoCard.querySelector(".fare");

    if (!selectedBus?.tripId) {
        const infoRow = document.querySelector(".card.mb-4 .card-body .row");
        if (infoRow)
            infoRow.innerHTML = `<p class="text-danger">No bus selected or trip ID missing!</p>`;
        return;
    }

    if (selectedBus) {
        titleElem.textContent = `${selectedBus.plateNo || "--"} (${selectedBus.busType || "--"})`;
        routeElem.textContent = selectedBus.routeName || "--";
        fareElem.textContent = `Base Fare: Rs. ${selectedBus.baseFare || "--"}`;
    }

    let seats = [];
    try {
        const resSeats = await fetch(`http://localhost:8080/api/v1/tripseat/${selectedBus.tripId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });
        if (!resSeats.ok) throw new Error(`HTTP error: ${resSeats.status}`);
        seats = await resSeats.json();
    } catch (err) {
        console.error("Seat load failed:", err);
        const infoRow = document.querySelector(".card.mb-4 .card-body .row");
        if (infoRow)
            infoRow.innerHTML = `<p class="text-danger">Failed to load seats!</p>`;
        return;
    }

    seatsContainer.innerHTML = "";
    const rows = 12;
    const cols = 4;
    let seatIndex = 0;
    let seatNumber = 1;

    for (let r = 0; r < rows; r++) {
        const rowDiv = document.createElement("div");
        rowDiv.className = "seat-row";

        for (let c = 0; c < cols; c++) {
            if (seatIndex < seats.length) {
                const { status, seatId, seatNumber } = seats[seatIndex]; // <-- API data
                const seatDiv = document.createElement("div");
                seatDiv.className = `seat ${status.toLowerCase()}`;
                seatDiv.dataset.seatId = seatId;
                seatDiv.dataset.seatNumber = seatNumber;
                seatDiv.textContent = seatNumber;
                rowDiv.appendChild(seatDiv);
                seatIndex++;
            }
        }

        seatsContainer.appendChild(rowDiv);
    }

    const availableSeatsCountElem = document.querySelector(".available-seats-count");
    const availableSeats = seats.filter(seat => seat.status.toLowerCase() === "available").length;
    if (availableSeatsCountElem) {
        availableSeatsCountElem.textContent = `${availableSeats} seats available`;
    }
    

    let totalBaseFare = 0;
    let totalService = 0;
    let totalTaxes = 0;

    let selectedSeats = [];          // stores seatId
    let selectedSeatNumbers = [];    // stores seat number (string)

// Update selected seats & fare
    function updateSelectedSeats(seatId, seatNumber, isSelected) {
        const selectedSeatsList = document.getElementById("selectedSeatsList");
        const busType = selectedBus.busType || "Standard";
        const baseFare = selectedBus.baseFare || 0;
        let serviceChargePercent = 0;
        let tax = 0;

        switch(busType) {
            case "Luxury": serviceChargePercent = 0.02; tax = 4; break;
            case "Semi-Luxury": serviceChargePercent = 0.01; tax = 3; break;
            case "Standard": default: serviceChargePercent = 0.005; tax = 2; break;
        }

        const seatServiceCharge = baseFare * serviceChargePercent;

        if (isSelected) {
            selectedSeats.push(seatId);
            selectedSeatNumbers.push(seatNumber);
            const seatBadge = document.createElement("span");
            seatBadge.className = "badge bg-primary me-1";
            seatBadge.textContent = `B${seatNumber}`;
            seatBadge.dataset.seatId = seatId;
            selectedSeatsList.appendChild(seatBadge);

            totalBaseFare += baseFare;
            totalService += seatServiceCharge;
            totalTaxes += tax;
        } else {
            selectedSeats = selectedSeats.filter(id => id !== seatId);
            selectedSeatNumbers = selectedSeatNumbers.filter(num => num !== seatNumber); // <--- remove seat number
            const badgeToRemove = selectedSeatsList.querySelector(`[data-seat-id="${seatId}"]`);
            if (badgeToRemove) badgeToRemove.remove();

            totalBaseFare -= baseFare;
            totalService -= seatServiceCharge;
            totalTaxes -= tax;
        }

        const fareBreakdown = document.querySelector(".fare-breakdown");
        fareBreakdown.children[0].children[1].textContent = `Rs. ${totalBaseFare.toFixed(2)}`;
        fareBreakdown.children[1].children[1].textContent = `Rs. ${totalService.toFixed(2)}`;
        fareBreakdown.children[2].children[1].textContent = `Rs. ${totalTaxes.toFixed(2)}`;
        fareBreakdown.children[4].children[1].textContent = `Rs. ${(totalBaseFare + totalService + totalTaxes).toFixed(2)}`;
    }

    seatsContainer.addEventListener("click", (e) => {
        const seatDiv = e.target.closest(".seat");
        if (!seatDiv || !seatDiv.classList.contains("available")) return;
        const seatId = seatDiv.dataset.seatId;
        const seatNumber = seatDiv.dataset.seatNumber;
        seatDiv.classList.toggle("selected");
        updateSelectedSeats(seatId, seatNumber, seatDiv.classList.contains("selected"));
    });

    const proceedBtn = document.getElementById("proceedToPayment");
    proceedBtn.addEventListener("click", async () => {
        if (!token) {
            alert("Please login before booking!");
            return;
        }

        const passengerName = document.getElementById("passengerName").value.trim();
        const passengerNic = document.getElementById("passengerNic").value.trim();
        const passengerPhone = document.getElementById("passengerPhone").value.trim();

        if (!passengerName || !passengerNic || !passengerPhone) {
            alert("Please fill all passenger details before proceeding.");
            return;
        }


        try {
            const resUser = await fetch(`http://localhost:8080/api/v1/register/nic/${passengerNic}`, {
                headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
            });
            if (!resUser.ok) {
                alert("Passenger NIC not registered! Please register first.");
                return;
            }
            const user = await resUser.json();
            const bookingRefs = `BK-${Date.now()}`;
            localStorage.setItem("bookingRefs", bookingRefs);

            const bookingSummary = {
                bookingRef: bookingRefs,
                tripId: selectedBus.tripId,
                seatIds: selectedSeats.join(","),
                company: `${selectedBus.plateNo} (${selectedBus.busType})`,
                route: selectedBus.routeName,
                departure: selectedBus.departureTime,
                seats: selectedSeatNumbers.join(", "),
                passenger: passengerName,
                baseFare: totalBaseFare,
                serviceCharge: totalService,
                taxes: totalTaxes,
                totalAmount: totalBaseFare + totalService + totalTaxes
            };
            localStorage.setItem("bookingSummary", JSON.stringify(bookingSummary));
            

            const bookingDTO = {
                userId: user.userId,
                tripId: selectedBus.tripId,
                bookingRef:bookingRefs,
                seatNumber: selectedSeatNumbers.join(","),
                status: "HELD",
                totalAmount: totalBaseFare + totalService + totalTaxes,
                currency: "LKR",
                qrCodeData: ""
            };

            const bookingRes = await fetch("http://localhost:8080/api/v1/booking/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(bookingDTO)
            });

            if (!bookingRes.ok) {
                const errText = await bookingRes.text();
                throw new Error(`Server Error: ${bookingRes.status} ${errText}`);
            }

            alert("Booking saved successfully!");
            window.location.href = "payment-gateway.html";

        } catch (err) {
            console.error("Booking failed:", err);
            alert("Booking failed. Check console for details.");
        }
    });
});
