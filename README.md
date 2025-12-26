## CountryGuide — Country Recommendation System

CountryGuide is a country recommendation system designed to help users identify countries that best match their lifestyle preferences. Instead of relying on subjective opinions or fragmented online information, the system analyzes user descriptions and compares them with structured socio-economic data to generate meaningful recommendations.

The idea for this project came to me while I was planning a trip. Even with a destination already in mind, the sea of conflicting online reviews and opinions made the final decision feel unnecessarily complex. I built this project to cut through that noise, providing a more objective and data-driven way to validate travel choices and support better decision-making.

### Overview

The system simplifies country comparison by translating natural language user input into measurable criteria such as safety, education, economic strength, and overall well-being. Countries are then evaluated and ranked using multi-dimensional similarity analysis rather than manual comparison of individual indices.

### Technical Stack

* **Backend:** Python (FastAPI)
* **Data Processing & Modeling:** Pandas, NumPy, scikit-learn
* **Methods:** KMeans clustering, Cosine Similarity
* **Frontend:** React, Tailwind CSS, Framer Motion
* **Data Source:** Custom dataset derived from global indicators (happiness, wealth, stability, education)

### How the Recommendation Engine Works

1. **Data Scaling:** Country metrics are normalized to a 0–1 range using MinMaxScaler.
2. **Clustering:** Countries are grouped into four clusters based on shared characteristics.
3. **Similarity Analysis:** User preferences are compared with countries within the most relevant cluster using cosine similarity.
4. **Ranking:** The top three countries are returned with compatibility scores.

### API & Usage

The system exposes a RESTful endpoint for real-time recommendations.

**Endpoint:**
`POST /api/v1/recommend`

**Request example:**

```json
{
  "text": "I want a safe country with high education and a strong economy"
}
```

**Response includes:**

* Parsed preference criteria
* Best matching country
* Top three recommendations with scores

### Future Improvements

* Incorporating cost of living indicators
* Improving natural language understanding for more complex user inputs

---

**Nurgül Bedir**
Computer Engineering Student | BMÜ-401 Computer Engineering Design Project

---

