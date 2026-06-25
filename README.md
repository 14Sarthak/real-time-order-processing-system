# 🍽️ Real-Time Order Processing System

A real-time food delivery order processing system inspired by platforms like Zomato and Swiggy. The project simulates the complete order lifecycle—from order placement to delivery—using an event-driven architecture, WebSockets, and MongoDB. It demonstrates how independent backend services can process orders asynchronously while providing live updates to the frontend.

---

# 🚀 Live Demo

**Frontend**

https://real-time-order-processing-system.vercel.app

**Backend**

https://real-time-order-processing-system.onrender.com

---


# 📸 Preview

## Dashboard

![Dashboard](assets/dashboard.png)

## Live Tracking

![Live Tracking](assets/live-tracking.png)

---

# 🎥 Demo Video



https://github.com/user-attachments/assets/f8710c5f-843a-4ab2-a43d-81d485d64d8e



---


# 🏗️ System Architecture

```text
User Places Order
        │
        ▼
Frontend Dashboard
(HTML • CSS • JavaScript)
        │
        ▼
Express REST API
        │
        ▼
MongoDB Atlas
(Order Storage)
        │
        ▼
Order Processing Pipeline
        │
 ┌──────┼─────────────┐
 ▼      ▼             ▼
Restaurant      Driver Assignment
Service         Service
                │
                ▼
         Notification Service
                │
                ▼
        WebSocket Server
                │
                ▼
     Live Dashboard Updates
```

---

# ⚙️ Tech Stack

| Layer                   | Technology                  |
| ----------------------- | --------------------------- |
| Frontend                | HTML, CSS, JavaScript       |
| Backend                 | Node.js, Express.js         |
| Database                | MongoDB Atlas               |
| Real-Time Communication | WebSockets                  |
| Deployment              | Vercel, Render              |
| Architecture            | Event-Driven Order Pipeline |

---

# ✨ Features

* Real-time food order placement
* Live order status updates
* Driver assignment simulation
* Restaurant order processing simulation
* Notification service simulation
* WebSocket-based live dashboard updates
* MongoDB Atlas for persistent order storage
* Responsive two-column dashboard
* Deployed on Vercel and Render

---


# 🚀 Run Locally

Clone the repository:

```bash
git clone https://github.com/14Sarthak/real-time-order-processing-system.git
cd real-time-order-processing-system
```

Install dependencies:

```bash
npm install
```

Create `backend/.env`

```env
PORT=4401
MONGO_URI=your_mongodb_connection_string
CLIENT_ORIGIN=http://127.0.0.1:5500
ORDER_STAGE_DELAY_MS=2500
```

Start the backend:

```bash
npm run dev:backend
```

Start the frontend using **VS Code Live Server** by opening:

```text
frontend/index.html
```

---

# 📂 Project Structure

```text
real-time-order-processing-system/
│
├── assets/
│   ├── dashboard.png
│   └── live-tracking.png
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── realtime/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.js
│   │   └── server.js
│
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── app.js
│
├── package.json
├── .gitignore
└── README.md
```

---

# 💡 Future Improvements

* Integrate Apache Kafka for real event streaming
* Add Redis Geospatial Search for nearest-driver matching
* Use Google Maps for live route visualization
* Split services into independent microservices
* Add user authentication and restaurant management

---

