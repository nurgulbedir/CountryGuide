import os
from typing import Any, Dict

from fastapi import FastAPI
from pydantic import BaseModel

from recommender import CountryRecommender


DATA_PATH = os.path.join(os.path.dirname(__file__), "countries_advanced.json")

app = FastAPI(
    title="Country Recommendation API",
    version="1.0.0",
)


class RecommendRequest(BaseModel):
    text: str


class RecommendResponse(BaseModel):
    criteria: Dict[str, float]
    best_match: Dict[str, Any]
    recommendations: list[Dict[str, Any]]


# Instantiate recommender once and reuse
recommender = CountryRecommender(DATA_PATH)


@app.post("/api/v1/recommend", response_model=RecommendResponse)
def recommend(payload: RecommendRequest):
    """
    Request body:
    {
      "text": "kullanıcı metni"
    }

    Response:
    {
      "criteria": { ... },
      "best_match": { ... },
      "recommendations": [ { country, score }, ... ]
    }
    """
    result = recommender.recommend(payload.text)
    return RecommendResponse(**result)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)



