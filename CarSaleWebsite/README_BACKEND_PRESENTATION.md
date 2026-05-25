# AutoDrive Car Sale Website - Backend Ready Version

## Project Overview
AutoDrive is a car sale website where users can register, log in, browse car listings, add their own listings, edit them, delete them, and view a personal dashboard.

## What Was Added
This version includes a real backend using Node.js. The previous frontend-only storage was replaced with API calls, so the project now stores users and car listings in a backend JSON database.

## Main Features
- User registration
- User login
- Protected pages for logged-in users
- Browse all cars
- Add new car listing
- Edit own car listing
- Delete own car listing
- View personal listings
- Dashboard statistics
- Backend API with CRUD operations

## Backend Technology
- Node.js built-in HTTP server
- JSON file database: `backend/db.json`
- REST API endpoints
- No external npm packages required

## How To Run
1. Open the project folder.
2. Open terminal inside:
   `CarSaleWebsite/backend`
3. Run:
   `node server.js`
4. Open this link in the browser:
   `http://localhost:3000/html/index.html`

## Demo Account
Email: `demo@autodrive.com`
Password: `Password123`

## Important API Endpoints
- `POST /api/auth/register` - create a new user
- `POST /api/auth/login` - login user
- `GET /api/cars` - get all car listings
- `GET /api/cars/:id` - get one car listing
- `POST /api/cars` - create a listing
- `PUT /api/cars/:id` - update own listing
- `DELETE /api/cars/:id` - delete own listing
- `GET /api/dashboard/:userId` - get dashboard statistics

## Short Presentation Text
Our project is called AutoDrive. It is a car sale website where users can browse vehicles and manage their own listings. We implemented authentication, so users must register and log in before they can add, edit, or delete listings. The backend was built with Node.js and stores data in a JSON database. The frontend communicates with the backend using REST API requests. This makes the project more realistic because the data is no longer only stored inside the browser. The project includes CRUD operations, user-specific listings, and a dashboard that shows statistics such as total listings, total value, average price, and recent listings.

## Backend Explanation For Teacher
The backend receives HTTP requests from the frontend and returns JSON responses. For example, when a user logs in, the frontend sends the email and password to `/api/auth/login`. If the credentials are correct, the backend returns the user data and the frontend stores the logged-in user in localStorage. When the user adds a car, the frontend sends the car information to `/api/cars`. The backend attaches the logged-in user's ID to the listing and saves it in `db.json`. Editing and deleting are protected, so a user can only modify listings that belong to their own account.
