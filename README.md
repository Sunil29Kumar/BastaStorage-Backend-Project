# BastaStorage

BastaStorage is a cloud storage web application. It allows users to upload, manage, and share files and folders in a simple way. This project is built as a real-world SaaS application.

---

## Features

### File Features
- Upload files
- Rename and delete files
- View file information
- Share files using email or public link
- Files are stored securely in AWS S3

### Folder Features
- Create folders
- Rename and delete folders
- Hierarchical folder structure
- Recursive folder delete (delete folder with all files inside)

### User Features
- User can update profile details
- Secure user-based file access

### Authentication
- Register using email, password, and OTP
- Login with email and password
- Google login
- GitHub login
- Session-based authentication using cookies
- Redis used for session storage
- Logout from current device or all devices
- Free plan allows maximum 2 active devices

### Subscription & Payment
- Storage plans: 1 TB, 5 TB, 10 TB
- Monthly and yearly plans available
- User can upgrade, pause, resume, or cancel plan
- Razorpay integrated for payments
- Razorpay webhooks used for payment verification

### Security
- Protection against SQL Injection
- XSS and CSRF protection
- Rate limiting to prevent DoS attacks
- Secure HTTP-only cookies

---

## Tech Stack

- Frontend: React.js, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)
- Storage: AWS S3
- Authentication: Session-based (Cookies + Redis)
- Payment: Razorpay
- Other: REST APIs

---

## Project Status

This project is actively being developed and improved.

---

## Author

Sunil Kumar
