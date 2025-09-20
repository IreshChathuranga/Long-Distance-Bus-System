**Transport Ticketing and Seat Reservation System for Long-Distance Buses**
=======================================================================

Student Info
============
Name: Iresh Chathuranga  

Project Description
===================

This is a full-stack, enterprise-grade web application designed to modernize and digitalize the long-distance bus ticketing system. The platform facilitates real-time seat reservation, route management, QR-based e-ticketing, payment integration, and live bus tracking. It streamlines operations for passengers, conductors, and transport administrators through a centralized, role-based system.

Setup Instructions
==================

Project Structure
-----------------
```bash
transport-ticketing-system/
│
├── backend/                 # Spring Boot application
│   ├── src/
│   └── pom.xml
│
├── frontend/                 # HTML, CSS, JS files
|    └── images
|    └── js
|    └── css
│    └── html
│
├── README.md
└── ...
```
Prerequisites
-------------
Java JDK 21

MySQL 8+

Maven

An IDE (e.g., IntelliJ IDEA, VS Code)

Environment Configurations
--------------------------

Depending on the features, update the following configs:

1.Google OAuth API Key & Client ID (for Google Login)
2.PayHere Merchant Credentials (for Payment Integration)
3.JavaMail SMTP Settings (for Email notifications)
4.QR Code Configuration

Testing
-------

POST /api/auth/register
POST /api/auth/login
GET /api/buses
POST /api/tickets
