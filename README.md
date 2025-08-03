# 🏠 House Price Prediction

AI-powered web app to predict house prices in Boston using machine learning — built with a modern **React + Flask** stack.

![Preview](preview.png)

---

## ⚙️ Tech Stack

- **Frontend** — React + Vite + TailwindCSS  
- **Backend** — Flask + Scikit-Learn  
- **HTTP Client** — Axios  
- **ML Model** — GradientBoostingRegressor  

---

## 🚀 Getting Started

### 📦 Backend (Flask)
```bash
cd backend
python app.py
```
### 💻 Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
### 📬 API Endpoint
| Method | Route    | Description         |
| ------ | -------- | ------------------- |
| POST   | /predict | Predict house price |

### 📁 Folder Structure
```bash
.
├── backend/
│   ├── app.py          # Flask API
│   └── model.pkl       # Trained ML model
└── frontend/
    ├── src/
    └── ...
```
### ✨ Features
1.  Predict house price instantly based on input features
2.  Clean startup-style user interface
3.  Lightweight & fast integration
