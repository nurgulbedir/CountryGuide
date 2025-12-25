# CountryGuide: AI-Based Country Recommendation System

A modern, AI-powered country recommendation system that helps users find their ideal country based on natural language preferences using machine learning techniques.

## 🚀 Features

- **AI-Powered Recommendations**: Uses KMeans clustering and cosine similarity to provide personalized country suggestions
- **Natural Language Processing**: Understands user preferences from text input
- **Modern UI**: Beautiful glassmorphism design with dark mode
- **Real-time Analysis**: Fast API responses with visual criteria analysis
- **Cluster-based Filtering**: Smart filtering based on best match clusters

## 🛠️ Technologies

### Backend
- Python 3.x
- FastAPI
- Pandas, NumPy
- scikit-learn (KMeans, Cosine Similarity)

### Frontend
- React 18
- Tailwind CSS
- Framer Motion
- Recharts

## 📦 Installation

### Backend Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# Run the API server
python main.py
```

Backend will run on `http://localhost:8000`

### Frontend Setup

```bash
# Install Node dependencies
npm install

# Run development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📖 Usage

1. Start both backend and frontend servers
2. Open `http://localhost:3000` in your browser
3. Enter your country preferences (e.g., "I want a safe country with high economic level and good education")
4. Get personalized country recommendations!

## 🏗️ Project Structure

```
ulke_oneri/
├── backend/
│   ├── recommender.py          # Main recommendation engine
│   ├── main.py                 # FastAPI endpoints
│   ├── countries_advanced.json # Country dataset
│   └── requirements.txt        # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── CountryRecommendation.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   │   └── profile-photo.jpg
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── PROJE_RAPORU.md
```

## 🔬 How It Works

1. **Data Loading**: Country data is loaded from JSON and converted to DataFrame
2. **Feature Extraction**: Numerical metrics are automatically selected
3. **Normalization**: All metrics are normalized to 0-1 range using Min-Max Scaler
4. **Clustering**: Countries are grouped into 4 clusters using KMeans
5. **Query Processing**: User text is converted to a criteria vector using keyword-based rules
6. **Similarity Calculation**: Cosine similarity is computed between query and all countries
7. **Filtering**: Recommendations are selected from the best match's cluster
8. **Results**: Top 3 countries with scores are returned

## 📝 API Documentation

### POST `/api/v1/recommend`

**Request:**
```json
{
  "text": "I want a safe country with good education"
}
```

**Response:**
```json
{
  "criteria": {
    "education_index": 0.95,
    "wealth_index": 0.87,
    ...
  },
  "best_match": {
    "name": "Switzerland",
    "cluster": 1
  },
  "recommendations": [
    {
      "name": "Switzerland",
      "score": 98.5,
      "region": "Europe",
      ...
    }
  ]
}
```

API documentation available at `http://localhost:8000/docs`

## 👤 Author

**Nurgül Bedir**
- Computer Engineering Student
- Organizer at GDG Elazığ
- [Linktree](https://linktr.ee/nurgulbedir)

## 📄 License

This project is developed as part of the Computer Engineering Design Course at Fırat University.

## 🙏 Acknowledgments

- Fırat University Engineering Faculty
- GDG Elazığ Community

