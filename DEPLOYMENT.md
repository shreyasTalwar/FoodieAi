# FoodieAI Hosting & Deployment Guide

This document describes how to deploy the FoodieAI application (React frontend, Flask backend, and MySQL database) to production.

---

## 1. Database Provisioning (MySQL)

You need a hosted MySQL database. You can use services like **Aiven.io**, **Railway.app**, or **AWS RDS**.

1. Create a MySQL database (e.g., named `foodieai`).
2. Get the connection URI. It must follow this pattern:
   ```
   mysql+pymysql://<username>:<password>@<host>:<port>/foodieai
   ```
   *(Ensure characters like `@` in passwords are URL-encoded as `%40` if using the string directly in code, though our configuration code handles quoting automatically).*

---

## 2. Backend Deployment (Flask API)

Deploy the Python backend to a service like **Render** or **Railway**.

### Render Setup:
1. Create a new **Web Service** on Render connected to your Git repository.
2. Set the following settings:
   * **Root Directory**: `backend` (or leave empty if deploying the entire monorepo, and set base directory to `backend`).
   * **Runtime**: `Python`
   * **Build Command**: `pip install -r requirements.txt`
   * **Start Command**: `gunicorn -w 4 -b 0.0.0.0:$PORT backend.app:app` (Gunicorn should be in `requirements.txt`).
3. Add the following **Environment Variables**:
   * `DATABASE_URL`: `mysql+pymysql://<user>:<password>@<host>:<port>/foodieai`
   * `JWT_SECRET_KEY`: A secure random string.
   * `OPENROUTER_API_KEY`: Your OpenRouter API Key.
   * `OPENROUTER_MODEL`: `google/gemini-2.5-flash`
   * `FLASK_ENV`: `production`

---

## 3. Frontend Deployment (Vite React)

Deploy the frontend to **Vercel**, **Netlify**, or **Render Static Sites**.

### Vercel Setup:
1. Connect your Git repository to Vercel.
2. Configure the project:
   * **Framework Preset**: `Vite`
   * **Root Directory**: `frontend`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
3. Add the **Environment Variable**:
   * `VITE_API_URL`: Your live backend API URL (e.g., `https://your-backend-url.onrender.com/api`).
4. Click **Deploy**.

---

## 4. Production Checklist

1. **CORS Configuration**:
   Ensure the backend allows requests from your production frontend domain. You can configure CORS origins in `backend/app.py`:
   ```python
   CORS(app, resources={r"/api/*": {"origins": ["https://your-frontend-domain.vercel.app"]}})
   ```
2. **Database Migrations**:
   The application automatically runs `db.create_all()` and seeds categories, foods, FAQs, and users on startup, so the schema will auto-generate upon the first deployment.
