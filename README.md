# 🍔 FoodieAI - AI-Powered Gourmet Lounge

FoodieAI is a state-of-the-art full-stack web application designed for a premium gourmet dining lounge. It combines a sleek, glassmorphic React frontend with a secure Flask REST API and a local MySQL database. The app features a custom **RAG-enabled AI Chef Assistant** integrated via OpenRouter (Gemini) to answer allergen, ingredient, and menu recommendation queries in real-time.

---

## 🚀 Key Features

*   **Premium Visual Experience**: Glassmorphism UI components, interactive hover transitions, and tailored dark aesthetics powered by Tailwind CSS.
*   **Component-Based Architecture**: Modular frontend design with dedicated search bars, category pills, food cards, and details modal sheets.
*   **Smart AI RAG Chef**: Context-aware restaurant assistant. Learns from live menu structures and text documents to clear up allergen warnings, nutritional info, and make recommendations.
*   **Smart Fallback System**: Local keyword-matching system keeps the AI responsive even if OpenRouter credentials or network limits are exceeded.
*   **User Profiles & Secure Checkout**: Register/Login endpoints with secure hashed passwords, sliding basket drawers, and live order tracking.
*   **Admin Control Panel**: Admin tools to manage live categories, upload/delete knowledge base text files, add menu items, and update order statuses.

---

## 🛠️ Tech Stack

*   **Frontend**: React (Vite), Tailwind CSS, Axios, React Icons, React Router DOM.
*   **Backend**: Python, Flask, Flask-SQLAlchemy, Flask-JWT-Extended (Token Authentication), Flask-CORS.
*   **Database**: MySQL (Production) / Local SQLite (Development fallback).
*   **AI Engine**: OpenRouter API (utilizing `google/gemini-2.5-flash`).

---

## 📂 Project Structure

```
├── backend/                   # Python Flask Backend API
│   ├── instance/              # Local DB instance folder
│   ├── knowledge_base/        # Store text documents for AI Context
│   ├── routes/                # Blueprint routes (auth, cart, foods, orders, AI)
│   ├── services/              # Business logic (RAG search, OpenRouter service)
│   ├── app.py                 # App initialization & MySQL seeding
│   ├── config.py              # Configuration details
│   ├── models.py              # SQLAlchemy DB models
│   └── requirements.txt       # Python dependencies
│
├── frontend/                  # Vite + React Frontend
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # Reusable sub-components (Footer, Chatbot, FoodCard, etc.)
│   │   ├── pages/             # App pages (Landing, Menu, Orders, AdminDashboard, etc.)
│   │   ├── api.js             # Central Axios Client config
│   │   ├── App.jsx            # Main app router and basket state
│   │   └── index.css          # Tailwind and Custom Scrollbar styles
│   └── vite.config.js
```

---

## ⚙️ Local Setup Guide

### 1. Prerequisite Configuration (.env)
Create a file named `.env` in the `backend/` directory:
```env
DATABASE_URL=mysql+pymysql://root:Admin%40123@localhost:3306/foodieai
JWT_SECRET_KEY=jwt-super-secret-key-5678
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=google/gemini-2.5-flash
```

### 2. Backend Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   python -m backend.app
   ```
   *(Running the server automatically connects to MySQL, creates tables, and seeds default gourmet menu categories and items!)*

### 3. Frontend Installation
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install npm modules:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Visit `http://localhost:5173/` in your browser.

---

## 🔒 Seeding & Credentials

The database seeds default test accounts on first launch:
*   **Customer User**:
    *   Email: `customer@foodieai.com`
    *   Password: `customer123`
*   **Admin User**:
    *   Email: `admin@foodieai.com`
    *   Password: `admin123`

---

## 🌐 Production Hosting

For complete step-by-step production hosting guidelines, check out the **[DEPLOYMENT.md](DEPLOYMENT.md)** file in the project root.
