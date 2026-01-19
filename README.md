# BastaStorage
<!-- LOGO PLACEHOLDER -->
<!-- Add project logo image here -->

BastaStorage is a cloud storage application that helps users upload, store, and manage files securely. Users can organize files into folders and share them with proper access control.  The app includes user authentication, file sharing, and subscription-based storage plans.  
It is built using a modern tech stack with a clean and responsive interface.  


---

## Table of Contents

- [Features](#features)
  - [Authentication and Security](#authentication-and-security)
  - [File Management](#file-management)
  - [Cloud Storage and Import](#cloud-storage-and-import)
  - [Sharing and Permissions](#sharing-and-permissions)
  - [Settings and Customization](#settings-and-customization)
  - [Admin Dashboard](#admin-dashboard)
  - [Subscriptions and Billing](#subscriptions-and-billing)

- [Project Structure](#project-structure)
  - [Client (Frontend - React + Vite + Tailwind)](#client-frontend---react--vite--tailwind)
  - [Server (Backend - Node + Express + MongoDB)](#server-backend---node--express--mongodb)

- [Tech Stack](#tech-stack)

- [Getting Started](#getting-started)
  - [Clone Repository](#clone-repository)

- [Environment Setup](#environment-setup)
  - [Client .env](#client-env)
  - [Server .env](#server-env)

- [Client_Setup](#client-setup)
- [Server_Setup](#server-setup)

- [Screenshot Overview](#screenshot-overview)
  - [Login and Register](#login-and-register)
  - [Home Page](#home-page)
  - [Subscriptions (Razorpay)](#subscriptions-razorpay)

---

## Features

- Secure user authentication and authorization  
- File and folder upload, update, and deletion  
- Cloud-based storage integration  
- File sharing with permission control  
- Subscription-based plans and billing  
- Admin dashboard for user and content management  
- Responsive UI for all screen sizes  


### Authentication and Security

- JWT-based authentication  
- Secure password hashing  
- Role-based access control (User / Admin)  
- API rate limiting for sensitive routes  
- Protected private files and folders  


### File Management

- Create, rename, and delete folders  
- Upload and manage files  
- File preview and metadata handling  
- Trash, soft delete, and permanent delete support  


### Cloud Storage and Import

- Cloud object storage integration  
- Secure file upload handling  
- Import files from external sources  
- Optimized storage and retrieval  


### Sharing and Permissions

- Share files and folders with other users  
- Control access permissions (view / edit)  
- Secure public and private sharing links  


### Settings and Customization

- User profile management  
- Password update functionality  
- Storage usage tracking  
- Account preferences  


### Admin Dashboard

- View and manage users  
- Update user roles  
- Soft delete and hard delete users  
- Monitor storage usage and activity  


### Subscriptions and Billing

- Subscription-based storage plans  
- Secure payment gateway integration  
- Manage active subscriptions  
- Invoice and billing history  



## Project Structure

### Client (Frontend - React + Vite + Tailwind)

```text
frontend/
│── dist/
│── node_modules/
│── public/
│── src/
│   ├── Account recover/
│   ├── Admin Dash/
│   ├── assets/
│   ├── Auth/
│   ├── Components/
│   │   ├── Create folder/
│   │   ├── File Folder List/
│   │   ├── Google Drive/
│   │   ├── Help and support/
│   │   ├── legal/
│   │   ├── Notification/
│   │   ├── progress file folder/
│   │   ├── Rename file folder/
│   │   ├── Settings/
│   │   ├── Share files/
│   │   ├── Total Storage/
│   │   ├── Breadcrumb.jsx
│   │   ├── CreateUploadFileList.jsx
│   │   ├── Favorites.jsx
│   │   ├── FilesFolderList.jsx
│   │   ├── Home.jsx
│   │   ├── MyFiles.jsx
│   │   ├── RecentFiles.jsx
│   │   ├── SideBar.jsx
│   │   ├── TopMenu.jsx
│   │   └── UploadFile.jsx
│   ├── hooks/
│   ├── Context/
│   ├── Plans/
│   ├── Utils/
│   ├── App.jsx
│   ├── BastaStoreDashboard.jsx
│   ├── CookieConsent.jsx
│   ├── index.css
│   └── main.jsx
│── eslint.config.js
│── index.html
│── package.json
│── package-lock.json
│── vite.config.js
│── README.md


```
### Server (Backend - Node + Express + MongoDB)

```text
backend/
│── models/
│   ├── recoveryEmailModel.js
│   ├── sessionModel.js
│   ├── sharedLinksModel.js
│   ├── subscriptionModel.js
│   └── userModel.js
│
│── routes/
│   ├── authRoute.js
│   ├── directoryRoutes.js
│   ├── fileRoutes.js
│   ├── googleDriveRoute.js
│   ├── notificationRoutes.js
│   ├── subscriptionRoute.js
│   ├── userRoutes.js
│   └── webhookRoute.js
│
│── services/
│   ├── mail/
│   ├── cloudFront.js
│   └── s3.js
│
│── utils/
│── validators/
│
│── public/
│── node_modules/
│
│── .env
│── app.js
│── package.json
│── package-lock.json

```
## Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS  
- **Backend**:  Node.js, Express.js
- **DataBase**: MongoDB, Redis
- **Authentication & Security**: bcrypt + OTP + Rate Limiting  
- **Cloud Storage**: AWS S3, CloudFront CDN
- **External APIs**: Google Drive API, Google OAuth2
- **Payments & Subscriptions**: Payment Gateway (Razorpay), Webhooks, Subscription Lifecycle Handling
- **Background Jobs & Scheduling**:  Cron Jobs (for subscription expiry, grace period handling, and status updates)

---

## Getting Started

### Clone Repository

```bash
git clone https://github.com/Sunil29Kumar/BastaStorage-Backend-Project.git
cd BastaStorage-Backend-Project

```
## Environment Setup

### Client .env

```bash
VITE_BACKEND_BASE_URL=
```

### Server .env
```bash

PORT=2000

# BASE_URL=https://bastastorage-backend.onrender.com
BASE_URL=http://localhost:2000

# CLIENT_URL=https://bastastorage.netlify.app
CLIENT_URL=http://localhost:5173


SECRET_KEY=

RZP_KEY_ID=
RZP_KEY_SECRET=
RZP_WEBHOOK_SECRET=

DB_HOST=

REDIS_URL=
REDIS_USERNAME=
REDIS_PASSWORD=  

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_DRIVE_REDIRECT_URI=
GOOGLE_DRIVE_SCOPE_1=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_REDIRECT_URI=

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_PROFILE= 
AWS_REGION=
AWS_BUCKET_NAME=

CLOUDFRONT_DOMAIN_NAME=
CLOUDFRONT_KEY_PAIR_ID=
CLOUDFRONT_PRIVATE_KEY=

```

## Client Setup

**1. Navigate to the Client directory**

```bash
cd Frontend
```
**2. Install dependencies**

```bash
npm install
```
**3. Add your environment variables in .env.**

**4. Run the development server**

```bash
npm run dev

```

## Server Setup

**Follow the steps below to set up and run the backend server locally.**

**1. Navigate to the server directory**

```bash
cd Backend
```

**2. Install dependencies**

```bash
npm install
```
**3. Configure environment variables**: Create a .env file in the backend directory and add the required values.

**4. AWS Configuration**: Configure your AWS credentials and ensure the S3 bucket and CloudFront distribution are properly set up.

**5. Google Drive API Setup**: Enable the Google Drive API in the Google Cloud Console and configure the OAuth consent screen.

**6. Run initial setup script**

**7. Start the development server**: This initializes the database and creates required folders.

```bash
npm run setup
```

**8. Ensure Redis is running**: Make sure Redis is running locally or via WSL.

```bash
npm run dev
```


### Screenshot Overview

#### Login and Register

<img src="./Application%20Preview/login%20and%20register%20page/register%20page.png" alt="Register page" width="400" height="600">   <img src="./Application%20Preview/login%20and%20register%20page/login%20page.png" alt="Login page" width="400" height="600">


#### Home Page

<img src="./Application%20Preview/Dashboard/home.png" alt="home" width="400" height="600">  <img src="./Application%20Preview/Dashboard/manage%20file.png" alt="manage file" width="400" height="600"> 
<img src="./Application%20Preview/Dashboard/storage.png" alt="storage" width="400" height="600">  <img src="./Application%20Preview/Dashboard/storage%20analytics.png" alt="storage analytics" width="400" height="600"> 


#### Subscriptions (Razorpay)

<img src="./Application%20Preview/plan/manage%20subscription.png" alt="Manage Subscription" width="400" height="600"> <img src="./Application%20Preview/plan/monthly%20plan.png" alt="Monthly plan" width="400" height="600"> 
                                                           <img src="./Application%20Preview/plan/yearly%20plan.png" alt="Yearly plan" width="400" height="600"> 




## Additional Setup Requirements

#### **1. AWS Configuration (File Storage)**
AWS is used to securely store files and ensure fast global delivery.
* **Create S3 Bucket:** Create a bucket where all user files will be stored. Set up the permissions to allow for seamless file uploads.
* **CloudFront Distribution:** Configure this to deliver files globally with low latency and to generate **Signed URLs** for secure, private access.
* **IAM Permissions:** Create an IAM user and grant it `S3FullAccess` permissions so the backend can manage file operations.
* **CloudFront Private Key:** Generate and configure a CloudFront private key on your server to enable secure content access.



#### **2. Google Drive API Setup (Cloud Import)**
This allows users to import files directly from their Google Drive into BastaStorage.
* **Google Cloud Console:** Create a new project and enable the **Google Drive API**.
* **OAuth 2.0 Credentials:** Generate a `Client ID` and `Client Secret` for both the web application and server-side access.
* **Consent Screen:** Set up the OAuth consent screen and add the necessary "Drive Access" permissions (scopes).
* **API Key:** Generate an API key if required for specific Google Drive operations.



#### **3. Razorpay Setup (Payments)**
Used for managing premium storage plans and billing.
* **API Keys:** Retrieve your **Key ID** and **Secret Key** from the Razorpay Dashboard.
* **Test Mode:** Use 'Test Mode' first for development and testing before switching to 'Live Mode'.


---


##  Support
If you find this project useful, please consider giving it a star ⭐️ on GitHub to help others find it!

## License
Distributed under the **MIT License**. See [MIT](./LICENSE) for more information.

## 👤 Author
**Sunil Kumar**
* GitHub: [@Sunil29Kumar](https://github.com/Sunil29Kumar)
* LinkedIn: [Sunil Kumar](www.linkedin.com/in/sunil-kumar-31322125b)

---
*Made with ❤️ by Sunil Kumar*
