# AeroCast Jakarta

<div align="center">

![AeroCast Jakarta](https://raw.githubusercontent.com/raaihansvg/AeroCast-Jakarta/main/demo.png)

**Real-time Jakarta Air Quality Monitoring & ISPU Prediction**

[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.x-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![XGBoost](https://img.shields.io/badge/XGBoost-Model-FF6600?style=flat-square)](https://xgboost.readthedocs.io)
[![WAQI API](https://img.shields.io/badge/WAQI-API-4CAF50?style=flat-square)](https://waqi.info)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

</div>

---

## About

**AeroCast Jakarta** is a real-time air quality monitoring web application for DKI Jakarta. The system predicts **ISPU (Indeks Standar Pencemar Udara)** categories using an XGBoost machine learning model trained on sensor data from 5 official DKI Jakarta monitoring stations, with live data fetched through the WAQI API.

> Developed for the **AI For Real Impact 2026** competition.

---

## Features

| Feature | Description |
|---------|-------------|
| **Real-time Monitoring** | Live data from 5 DKI Jakarta monitoring stations via WAQI API |
| **ISPU Prediction** | Air quality classification using XGBoost model with 21 features |
| **4 ISPU Categories** | Good · Moderate · Unhealthy · Very Unhealthy |
| **5 Stations** | Bundaran HI · Kelapa Gading · Jagakarsa · Lubang Buaya · Kebon Jeruk |
| **Simulation Mode** | Test predictions with manual parameter input |
| **Responsive UI** | Modern editorial-style interface |

---

## Architecture

```
AeroCast-Jakarta/
├── index.html              # Main frontend
├── bundaran-hi-graded.jpg  # Hero image
├── src/
│   ├── css/
│   │   └── style.css       # Stylesheet
│   └── js/
│       └── app.js          # Frontend logic
└── backend/
    ├── app.py              # Flask REST API
    ├── model/              # XGBoost model (.pkl)
    └── requirements.txt    # Python dependencies
```

**Data Flow**

```
WAQI API -> Flask Backend -> XGBoost Model -> ISPU Prediction -> Frontend
```

---

## Tech Stack

**Frontend**
- HTML5, CSS3 (Vanilla)
- JavaScript (ES6+)

**Backend**
- Python 3.12
- Flask (REST API)
- XGBoost
- Pandas, NumPy, Scikit-learn

**Data Source**
- [WAQI API](https://waqi.info) — World Air Quality Index

---

## Getting Started

### Prerequisites
- Python 3.10+
- pip
- WAQI API Token — register for free at [aqicn.org/data-platform/token](https://aqicn.org/data-platform/token)

### 1. Clone the Repository

```bash
git clone https://github.com/raaihansvg/AeroCast-Jakarta.git
cd AeroCast-Jakarta
```

### 2. Set Up the Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure Environment

Create a `.env` file inside the `backend/` folder:

```env
WAQI_TOKEN=your_waqi_api_token_here
```

### 4. Run the Backend

```bash
python app.py
# Backend running at http://localhost:5001
```

### 5. Run the Frontend

Open `index.html` directly in a browser, or use a local server:

```bash
python -m http.server 8080
# Open http://localhost:8080
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/realtime?station=DKI1` | Real-time data + ISPU prediction |
| `POST` | `/api/predict` | Prediction from manual input |
| `GET` | `/api/ping` | Backend health check |

---

## Monitoring Stations

| ID | Location | Region |
|----|----------|--------|
| DKI1 | Bundaran HI | Central Jakarta |
| DKI2 | Kelapa Gading | North Jakarta |
| DKI3 | Jagakarsa | South Jakarta |
| DKI4 | Lubang Buaya | East Jakarta |
| DKI5 | Kebon Jeruk | West Jakarta |

---

## Machine Learning Model

- **Algorithm:** XGBoost Classifier
- **Features:** 21 parameters (PM2.5, PM10, SO2, CO, O3, NO2, temperature, humidity, wind speed, etc.)
- **Target:** 4 ISPU categories (0=Good, 1=Moderate, 2=Unhealthy, 3=Very Unhealthy)
- **Training Data:** Historical ISPU data from DKI Jakarta

---

## License

Distributed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built for Jakarta by <a href="https://github.com/raaihansvg">raaihansvg</a></sub>
</div>
