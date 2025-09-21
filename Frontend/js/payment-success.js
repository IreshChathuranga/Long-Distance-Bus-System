document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const bookingRef = params.get("order_id");
    const bookingSummary = JSON.parse(localStorage.getItem("bookingSummary"));
    const selectedBus = JSON.parse(localStorage.getItem("selectedBus"));

    if (!bookingRef || !bookingSummary || !selectedBus) {
        alert("Missing booking data. Please try again.");
        return;
    }

    document.getElementById("ref").textContent = bookingSummary.bookingRef || "N/A";
    document.getElementById("route").textContent = bookingSummary.route || "N/A";
    document.getElementById("date").textContent = selectedBus.departDateTime || "N/A";
    document.getElementById("seat").textContent = bookingSummary.seats || "N/A";
    document.getElementById("passenger").textContent = bookingSummary.passenger || "N/A";
    document.getElementById("bus").textContent = bookingSummary.company || "N/A";
    document.getElementById("amount").textContent = Number(bookingSummary.totalAmount || 0).toFixed(2);
    document.getElementById("payment").textContent = "Debit Card";

    const cleanUrl = window.location.origin + window.location.pathname + "#success";
    window.history.replaceState({}, document.title, cleanUrl);

    const token = localStorage.getItem("jwtToken") || localStorage.getItem("token");
    if (!token) {
        alert("Please login again to see booking details.");
        return;
    }

    const qrContainer = document.getElementById("qrcode");
    qrContainer.innerHTML = ""; // clear placeholder

    const qrContent = JSON.stringify({
        bookingRef: bookingSummary.bookingRef,
        passenger: bookingSummary.passenger,
        route: bookingSummary.route,
        date: selectedBus.departDateTime,
        seat: bookingSummary.seats
    });

    const qrCode = new QRCode(qrContainer, {
        text: qrContent,
        width: 150,
        height: 150,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    window.downloadTicket = async function () {
        const ticketElement = document.getElementById("ticket-content");

        if (!ticketElement) {
            alert("Ticket content not found.");
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 1000));

        const canvas = await html2canvas(ticketElement, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: true
        });

        const imgData = canvas.toDataURL("image/png");

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
        pdf.save("e-ticket.pdf");
    };

    window.sendEmail = async function () {
        const token = localStorage.getItem("jwtToken") || localStorage.getItem("token") || "";
        const qrCanvas = document.querySelector("#qrcode canvas");
        if (!qrCanvas) {
            alert("QR Code not found.");
            return;
        }

        const qrDataUrl = qrCanvas.toDataURL("image/png");

        const bookingSummary = JSON.parse(localStorage.getItem("bookingSummary"));
        const user = JSON.parse(localStorage.getItem("user"));
        const selectedBus = JSON.parse(localStorage.getItem("selectedBus"));

        if (!user) {
            alert("User email not found.");
            return;
        }

        const payload = {
            email: user.email,
            qrCodeBase64: qrDataUrl,

            bookingRef: bookingSummary.bookingRef,
            passengerName: user.firstName + " " + user.lastName,
            nic: user.nic,
            route: bookingSummary.route,
            seat: bookingSummary.seats,
            date: selectedBus.departDateTime,
            amount: bookingSummary.totalAmount,
            company: bookingSummary.company || "GAMANA Travel"
        };

        try {
            const response = await fetch("http://localhost:8080/api/v1/email/send-ticket", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert("Ticket email sent successfully!");
            } else {
                alert("Failed to send email.");
            }
        } catch (error) {
            console.error(error);
            alert("Error sending email.");
        }
    };
});
