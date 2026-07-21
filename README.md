# 🎓 MyTeachingApp – Full-Stack Learning Management Platform

MyTeachingApp is a full-stack Learning Management System (LMS) designed to connect students, instructors, and industry professionals through an interactive online learning platform.

The platform allows instructors to create and manage courses, while students can explore courses, make secure payments, enroll, and track their learning progress. Built using **React.js, Spring Boot, and MySQL**, the application follows a scalable architecture with secure authentication, RESTful APIs, and third-party service integrations.

---

# 🚀 Features

## 👨‍🎓 Student Features

* User registration and login
* Browse available courses
* Purchase courses securely
* Course enrollment after successful payment
* Track learning progress
* Personalized student dashboard

## 👨‍🏫 Instructor Features

* Create and manage courses
* Upload course content
* Manage course information
* Monitor student enrollments

## 👨‍💼 Admin Features

* Manage users
* Manage courses
* Monitor platform activities
* Role-based access control

---

# 🛠️ Tech Stack

## Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Bootstrap
* Axios

## Backend

* Java
* Spring Boot
* Spring MVC
* Hibernate / JPA
* RESTful APIs
* Maven

## Database

* MySQL

## Authentication & Security

* JWT Authentication
* OAuth 2.0
* Google Sign-In Integration
* Role-Based Authorization
* Protected REST APIs

## Payment Integration

* Razorpay Payment Gateway
* Secure online transaction processing
* Payment verification workflow

## Development Tools

* Git & GitHub
* Postman
* IntelliJ IDEA
* VS Code

---

# 🏗️ System Architecture

```
React.js Frontend
        |
        |
REST API Communication
        |
        |
Spring Boot Backend
        |
        |
MySQL Database
```

### Authentication Flow

```
User Login
    |
JWT Authentication / Google OAuth
    |
Security Validation
    |
Access Protected Resources
```

### Payment Flow

```
Student selects course
        |
Create Razorpay Order
        |
Complete Payment
        |
Verify Transaction
        |
Course Enrollment Confirmation
```

---

# 📚 Application Modules

## 🔐 Authentication Module

Features:

* User registration and login
* JWT-based authentication
* Google OAuth Sign-In
* Secure password handling
* Role-based authorization

Supported Roles:

* Admin
* Instructor
* Student

---

## 📖 Course Management Module

Features:

* Course creation
* Course updates
* Course categorization
* Course listing
* Learning resource management

---

## 💳 Payment Module

Features:

* Razorpay payment gateway integration
* Secure course purchase workflow
* Payment order creation
* Transaction verification
* Automatic course enrollment after successful payment

---

## 📊 Dashboard Module

Features:

* Personalized dashboards
* Course overview
* Enrollment tracking
* User activity monitoring

---

# 🌐 REST API Modules

The backend provides REST APIs for:

* Authentication
* User management
* Course management
* Enrollment management
* Payment processing
* Dashboard data

Example APIs:

| Method | Endpoint              | Description          |
| ------ | --------------------- | -------------------- |
| POST   | /auth/register        | Register user        |
| POST   | /auth/login           | User login           |
| GET    | /courses              | Fetch courses        |
| POST   | /courses              | Create course        |
| POST   | /payment/create-order | Create payment order |
| POST   | /payment/verify       | Verify payment       |

---

# 🔒 Security Implementation

* JWT token-based authentication
* Google OAuth 2.0 authentication
* Role-based access control
* Protected backend endpoints
* Secure API communication

---

# 📈 Project Highlights

✅ Complete Full-Stack LMS Application
✅ Spring Boot REST API Development
✅ React Responsive User Interface
✅ JWT Authentication Implementation
✅ Google OAuth Integration
✅ Razorpay Payment Gateway Integration
✅ Role-Based Authorization
✅ MySQL Database Design
✅ MVC Architecture
✅ Scalable Backend Structure

---

# 📂 Project Structure

```
MyTeachingApp
│
├── myteachingapp_backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── entity
│   └── security
│
├── myteachingapp_frontend
│   ├── components
│   ├── pages
│   ├── services
│   └── assets
│
└── README.md
```

---

# ⚙️ Installation & Setup

## Prerequisites

* Java 17+
* Node.js
* MySQL
* Maven

---

## Backend Setup

Clone the repository:

```bash
git clone https://github.com/Faiz-Khan01/MyTeachingApp.git
```

Navigate to backend:

```bash
cd myteachingapp_backend
```

Configure MySQL database in:

```
application.properties
```

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

---

## Frontend Setup

Navigate to frontend:

```bash
cd myteachingapp_frontend
```

Install dependencies:

```bash
npm install
```

Run React application:

```bash
npm start
```

---

# 🔮 Future Enhancements

* Cloud deployment using AWS
* Docker containerization
* Email notifications
* Course certificates
* Live classes integration
* Course ratings and reviews
* Analytics dashboard

---

# 👨‍💻 Author

**Faiz Khan**

Java Backend Developer | Full-Stack Developer

---

# 🤝 Contribution

Suggestions and improvements are welcome.

If you find this project useful, consider giving it a ⭐.
