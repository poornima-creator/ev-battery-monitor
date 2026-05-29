# ⚡ EV Battery Monitor

> A real-time EV battery health monitoring and simulation platform built with the MERN stack and Socket.IO.

![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-18%2B-green)
![React](https://img.shields.io/badge/react-18-61DAFB)
![MongoDB](https://img.shields.io/badge/mongodb-atlas-47A248)

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| 🖥️ Frontend | `ev-battery-monitor.vercel.app` |
| ⚙️ Backend API | `https://ev-battery-monitor-0im1.onrender.com` |

---

## 📸 Screenshots

> Dashboard — Live battery metrics updating every second



## ✨ Features

- 🔐 **JWT Authentication** — Secure register and login with bcrypt password hashing
- ⚡ **Real-time Dashboard** — Live battery metrics via Socket.IO (updates every 1 second)
- 🔋 **Battery Simulation** — Realistic Charging, Driving, and Idle modes
- 📊 **Analytics Page** — Daily and weekly historical charts from MongoDB
- 🚨 **Smart Alerts** — Overheat, low SOC, high current spike detection
- 📥 **CSV Export** — Download all battery history as a spreadsheet
- ⚙️ **Settings Page** — Profile, password, alert thresholds, and preferences
- 📱 **Fully Responsive** — Works on mobile, tablet, and desktop
- 🎨 **Futuristic UI** — Dark theme with neon accents and smooth animations

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework and build tool |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Smooth animations |
| Recharts | Live and historical charts |
| Socket.IO Client | Real-time data updates |
| React Router v6 | Client-side routing |
| Axios | HTTP requests to REST API |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| Socket.IO | WebSocket real-time broadcasting |
| MongoDB + Mongoose | Database and ODM |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| dotenv | Environment variable management |
| cors | Cross-origin request handling |

### Infrastructure
| Service | Purpose |
|---|---|
| Vercel | Frontend hosting (auto-deploy) |
| Render | Backend hosting |
| MongoDB Atlas | Cloud database |
| GitHub | Version control |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   CLIENT (React)                     │
│   Landing · Login · Dashboard · Analytics · Settings │
│   Recharts · Framer Motion · Socket.IO Client        │
└──────────────┬──────────────────┬───────────────────┘
               │ REST API         │ WebSocket
               ▼                  ▼
┌─────────────────────────────────────────────────────┐
│               BACKEND (Node.js + Express)            │
│   Auth Routes · Data Routes · Socket.IO Server       │
│   Battery Simulation Engine · Alert Generator        │
└──────────────┬──────────────────┬───────────────────┘
               │                  │ Every 10s
               ▼                  ▼
┌─────────────────────────────────────────────────────┐
│                  MongoDB Atlas                       │
│         users collection · batteryDatas collection   │
└─────────────────────────────────────────────────────┘
```

### Data Flow
```
Simulation Engine → Socket.IO (every 1s) → React State → Live UI
                                         ↘ MongoDB (every 10s) → Analytics API
```

---

## 🔋 Simulation Modes

| Mode | Current | Voltage | SOC | Temperature |
|---|---|---|---|---|
| ⚡ Charging | +75A to +95A | Rising → 420V | Increasing | Slow rise |
| 🚗 Driving | -25A to -55A | Falling → 300V | Decreasing | Fast rise |
| 😴 Idle | -2A to +2A | Stable | Barely changes | Slowly cools |

---



## 📁 Project Structure

```
ev-battery-monitor/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── BatteryData.js       # Battery data schema
│   ├── routes/
│   │   ├── auth.js              # Register + Login
│   │   └── data.js              # Analytics API
│   ├── middleware/
│   │   └── auth.js              # JWT verification
│   ├── simulation/
│   │   └── batteryEngine.js     # Battery simulation logic
│   ├── socket/
│   │   └── socketHandler.js     # Socket.IO real-time events
│   └── server.js                # Entry point
│
└── frontend/
    └── src/
        ├── context/
        │   └── AuthContext.jsx   # Global auth state
        ├── hooks/
        │   ├── useSocket.js      # Socket.IO hook
        │   └── useAnalytics.js   # Analytics data hook
        ├── components/
        │   ├── Sidebar.jsx       # Collapsible navigation
        │   ├── Layout.jsx        # Page wrapper
        │   ├── MetricCard.jsx    # Live value cards
        │   ├── LiveChart.jsx     # Real-time charts
        │   ├── BatteryGauge.jsx  # Radial SOC/SOH gauge
        │   ├── AlertPanel.jsx    # Warning notifications
        │   ├── ModeSelector.jsx  # Charge/Drive/Idle buttons
        │   └── StatCard.jsx      # Analytics stat cards
        └── pages/
            ├── Landing.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx
            ├── Analytics.jsx
            └── Settings.jsx
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login and get JWT token |

### Data (Protected — requires JWT)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/data/recent` | Last 100 battery records |
| GET | `/api/data/daily` | Hourly averages (last 24h) |
| GET | `/api/data/weekly` | Daily averages (last 7 days) |
| GET | `/api/data/summary` | Overall stats (min/max/avg) |
| GET | `/api/data/export` | All records for CSV export |

### Socket.IO Events
| Event | Direction | Description |
|---|---|---|
| `battery:update` | Server → Client | Live battery data (every 1s) |
| `battery:alerts` | Server → Client | Active warning alerts |
| `set:mode` | Client → Server | Change simulation mode |
| `set:user` | Client → Server | Associate user with socket |
| `reset:simulation` | Client → Server | Reset battery to defaults |

---

## 📊 Database Schema

```js
// User
{
  username:  String,   // unique
  email:     String,   // unique, lowercase
  password:  String,   // bcrypt hashed
  createdAt: Date
}

// BatteryData
{
  userId:      ObjectId,  // ref: User
  voltage:     Number,    // 300V - 420V
  current:     Number,    // -50A to +120A
  temperature: Number,    // 20°C - 65°C
  soc:         Number,    // 0 - 100%
  soh:         Number,    // 70 - 100%
  mode:        String,    // charging | driving | idle
  createdAt:   Date
}
```

---

## 🎯 Key Learnings

Building this project covers:
- Full-stack MERN development
- Real-time WebSocket communication
- JWT authentication flow
- MongoDB aggregation pipelines
- React hooks and context API
- Responsive UI with Tailwind CSS
- Cloud deployment (Vercel + Render + Atlas)
- Git version control workflow

---

## 🔮 Future Improvements

- [ ] Python microservice for ML-based SOH prediction
- [ ] Push notifications for critical alerts
- [ ] Multiple vehicle profiles
- [ ] Mobile app with React Native
- [ ] Export to PDF reports
- [ ] Dark/light theme toggle
- [ ] WebGL 3D battery visualization

---

## 👩‍💻 Author

**Poornima**
- GitHub: [@poornima-creator](https://github.com/poornima-creator)

---

## 📄 License

This project is licensed under the MIT License.

---

> Built from scratch as a full-stack learning project — Phase by Phase 🚀
