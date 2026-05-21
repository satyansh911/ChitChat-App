# ChitChat App

ChitChat App is a real-time chat application with authentication, direct messaging, emoji reactions, image and audio sharing, and a music player experience built with a React frontend and an Express/MongoDB backend.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Zustand, Socket.IO client
- Backend: Node.js, Express, MongoDB, Mongoose, Socket.IO
- Media and uploads: Cloudinary, Multer

## Project Structure

- `backend/` - Express API, Socket.IO server, database models, and upload logic
- `frontend/` - React UI, state management, and client-side chat experience
- `songs/` - Local audio assets served by the backend

## Prerequisites

- Node.js 18 or newer
- npm
- A MongoDB database
- A Cloudinary account for media uploads

## Setup

### 1. Install dependencies

From the project root:

```bash
npm install
```

This installs the backend and frontend dependencies through the root scripts.

### 2. Configure the backend environment

Create a file at `backend/.env` and add these values:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5001
JWT_SECRET=your_random_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
```

The backend reads these variables for database access, authentication, Cloudinary uploads, and local/production behavior.

### 3. Run locally

Start the backend:

```bash
npm run dev --prefix backend
```

Start the frontend in a separate terminal:

```bash
npm run dev --prefix frontend
```

The frontend will run on Vite's default port, and the backend will listen on port `5001` unless you change `PORT`.

## Production Build

To install both app halves and build the frontend for production:

```bash
npm run build
```

To start the backend in production mode after building:

```bash
npm run start
```

In production, the backend serves the built frontend from `frontend/dist` when `NODE_ENV=production`.

## Backend Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port, defaults to `5001`
- `JWT_SECRET` - Secret used to sign and verify auth tokens
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `NODE_ENV` - Use `development` locally and `production` in deployment

## Notes

- Do not commit `backend/.env`.
- If you change the deployed backend URL, update the hardcoded fallback URLs in the frontend source where the API and socket endpoints are created.
- The repo already ignores `.env` files inside `backend/`.

## Scripts

Root scripts:

- `npm install` - installs dependencies in both backend and frontend
- `npm run build` - installs dependencies and builds the frontend
- `npm run start` - starts the backend server

Backend scripts:

- `npm run dev --prefix backend` - starts the backend with nodemon
- `npm run start --prefix backend` - starts the backend with node

Frontend scripts:

- `npm run dev --prefix frontend` - starts the Vite dev server
- `npm run build --prefix frontend` - builds the frontend
- `npm run preview --prefix frontend` - previews the production build
