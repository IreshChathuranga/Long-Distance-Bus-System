package org.example.backend.service.impl;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendLoginNotification(String toEmail, String ipAddress) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setFrom("ireshchathuranga63309@gmail.com");
            message.setTo(toEmail);
            message.setSubject("Login Notification - Bus Ticketing System");

            String formattedDateTime = LocalDateTime.now()
                    .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

            String text = String.format(
                    "Hello,\n\nWe detected a login to your account on %s.\nIP: %s\n\n" +
                            "If this was you, no action is required.\n" +
                            "If you did not login, please change your password immediately.",
                    formattedDateTime, ipAddress == null ? "Unknown" : ipAddress
            );

            message.setText(text);
            mailSender.send(message);
            log.info("Login notification email sent to {}", toEmail);

        } catch (Exception e) {
            log.error("Failed to send login notification to {}: {}", toEmail, e.getMessage(), e);
        }
    }

    /**
     *  2. Send E-Ticket with Embedded QR Code (Base64 image)
     */
    public void sendETicketWithQR(String toEmail, String qrCodeBase64, String bookingRef, String passengerName, String nic, String route,
            String seat, String date, String amount, String company) {
        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject("Your E-Ticket - " + bookingRef + " (" + company + ")");
            helper.setFrom(new InternetAddress("your-email@gmail.com", company + " Tickets"));

            // Base64 decode QR code
            String base64Image = qrCodeBase64.split(",")[1]; // remove "data:image/png;base64,"
            byte[] imageBytes = Base64.getDecoder().decode(base64Image);

            // Email body with inline QR image (cid:qrCodeImage)
            String htmlContent = "<div style='font-family: Arial, sans-serif;'>"
                    + "<h2 style='color: #007bff;'>" + company + " - E-Ticket</h2>"
                    + "<p>Dear " + passengerName + ",</p>"
                    + "<p>Thank you for booking with <strong>" + company + "</strong>.</p>"
                    + "<p>Below are your ticket details:</p>"
                    + "<table style='border-collapse: collapse; width: 100%;'>"
                    + "<tr><td><strong>Booking Ref:</strong></td><td>" + bookingRef + "</td></tr>"
                    + "<tr><td><strong>NIC:</strong></td><td>" + nic + "</td></tr>"
                    + "<tr><td><strong>Route:</strong></td><td>" + route + "</td></tr>"
                    + "<tr><td><strong>Date:</strong></td><td>" + date + "</td></tr>"
                    + "<tr><td><strong>Seat:</strong></td><td>" + seat + "</td></tr>"
                    + "<tr><td><strong>Amount:</strong></td><td>LKR " + amount + "</td></tr>"
                    + "</table>"
                    + "<br/><p>Scan the QR code below during boarding:</p>"
                    + "<img src='cid:qrCodeImage' style='width:150px;height:150px;'/>"
                    + "<br/><p>Safe Travels!</p></div>";

            helper.setText(htmlContent, true); // true = isHtml

            // Attach QR code image as inline
            helper.addInline("qrCodeImage", new ByteArrayResource(imageBytes), "image/png");

            // Send the message
            mailSender.send(message);

        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send e-ticket email", e);
        }
    }

}
