# Ethereum Transactions Viewer

This project is a simple full-stack web application that displays Ethereum transaction data with search, filter, sort, pagination, and responsive design.

## 📁 Project Structure

The project is divided into two parts:

```
evm-backend/   → Node.js server that fetches data from MongoDB and serves REST APIs  
evm-frontend/  → React Single Page Application (SPA) that displays the data in a styled table
```

---

## 🚀 How to Run the Project

Follow these steps to run the full application on your local machine:

### 1. Clone the repository (if not already)

```bash
git clone <your-repo-url>
cd your-project-folder
```

---

### 2. Start the Backend Server

Navigate to the backend folder and run the server:

```bash
cd evm-backend
node index.js
```

📌 This starts the Express server at `http://localhost:5500`, which serves API data from your MongoDB database.

---

### 3. Start the Frontend App

Open a new terminal and go back to the root folder. Then go to the frontend directory and start the React app:

```bash
cd ../evm-frontend
npm install    # Run this if you're starting for the first time
npm start
```

📌 This launches the frontend SPA in your default browser at `http://localhost:3000`.

---

## 🌐 Features

- Pagination (with page numbers, next/prev, ellipsis)
- Search by address or hash
- Advanced filters (status, value range, gas used, chain type)
- Copy-to-clipboard for addresses and hashes
- Responsive UI with Bootstrap 5

---

## ⚙️ Technologies Used

- **Frontend:** React, Bootstrap
- **Backend:** Node.js, Express
- **Database:** MongoDB

---

## 🧪 Example API Endpoint

```
GET http://localhost:5000/api/transactions
```

---

## 📄 License

This project is open-source and free to use under the MIT License.

---
