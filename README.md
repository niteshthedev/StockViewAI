
# 📈 StockView

**StockView** is a full-stack MERN (MongoDB, Express, React, Node.js) web application that provides real-time stock data in a clean and intuitive interface. Built for performance and scalability, the app uses **Vite** for blazing-fast frontend development.

Live demo: [StockViewAi Live DEMO](https://stockviewai.vercel.app)

---


## 🚀 Features

* 📊 Real-time stock market data
* 🔍 Search and view individual stock details
* 📈 Clean, responsive UI built with React + Vite
* 🔐 RESTful API using Node.js and Express
* 💾 MongoDB database integration
* 🌐 Deployed frontend on Vercel

---

## 🧱 Tech Stack

| Layer      | Tech                              |
| ---------- | --------------------------------- |
| Frontend   | React (via Vite), JavaScript, CSS |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB (via Mongoose)            |
| Deployment | Vercel (frontend), Local backend  |

---

## 📁 Project Structure

```
StockView/
├── frontend/        # React + Vite UI
├── backend/         # Node.js + Express API
└── README.md
```

---

## 🛠️ Getting Started

### Prerequisites

* Node.js (v18+)
* MongoDB instance (local or cloud, e.g., MongoDB Atlas)
* npm 

---

### 1. Clone the Repository

```bash
git clone https://github.com/iamnkr67/StockView.git
cd StockView
```

---

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `/backend`:

```env
EMAIL=your-email-address
PASSWORD=your-email-password
PORT=3001
SECRET_KEY=your-secret-key
URI=your-mongodb-uri
```

Then run the backend:

```bash
npm start
```

---

### 3. Setup Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

---

## 🔗 API Overview

* `GET /api/stocks`: Fetch all stock data
* `GET /api/stocks/:symbol`: Get data for a specific stock
* `POST /api/stocks`: Add a new stock
* `DELETE /api/stocks/:id`: Remove a stock

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to fork the repository and submit a pull request.

---

## 📬 Contact

Created by [@iamnkr67](https://github.com/iamnkr67), [@sri0777](https://github.com/sri0777)

