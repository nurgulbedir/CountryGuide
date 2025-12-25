import json
import os

import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler


class CountryRecommender:
    """
    Core recommendation engine.

    Responsibilities:
    - Load JSON data into a DataFrame
    - Extract numerical feature matrix X
    - Min-Max normalise all numerical metrics to [0.0, 1.0]
    - Run KMeans clustering and assign each country to a cluster
    - Build a query vector from user text
    - Compute cosine similarity and apply cluster-based filtering
    """

    def __init__(self, data_path, n_clusters=4):
        self.data_path = data_path if isinstance(data_path, str) else str(data_path)
        self.n_clusters = n_clusters

        # Internal state
        self.df = None
        self.feature_cols = []
        self.scaler = None
        self.X_norm = None
        self.kmeans = None

        # Load and prepare everything at init
        self._load_and_prepare()

    # ------------------------------------------------------------------
    # Data loading & preprocessing
    # ------------------------------------------------------------------
    def _load_and_prepare(self):
        with open(self.data_path, "r", encoding="utf-8") as f:
            raw = json.load(f)

        df = pd.json_normalize(raw)

        # Keep the original for metadata / response
        self.df = df

        # Automatically pick numeric columns as features
        numeric_cols = df.select_dtypes(include=["int64", "float64"]).columns.tolist()
        self.feature_cols = numeric_cols

        # Feature matrix
        X = df[self.feature_cols].astype(float).values

        # Min-Max scaling to [0, 1]
        scaler = MinMaxScaler()
        X_norm = scaler.fit_transform(X)

        # KMeans clustering
        kmeans = KMeans(n_clusters=self.n_clusters, random_state=42, n_init=10)
        cluster_labels = kmeans.fit_predict(X_norm)

        # Persist everything
        self.scaler = scaler
        self.X_norm = X_norm
        self.kmeans = kmeans
        self.df["cluster"] = cluster_labels

    # ------------------------------------------------------------------
    # Query building from user text
    # ------------------------------------------------------------------
    def _build_query_vector(self, text):
        """
        Convert user text into a query vector aligned with feature_cols.

        Strategy:
        - Start from the (normalized) mean feature vector
        - Nudge certain dimensions towards 1.0 based on simple keyword rules
        - Return both the numeric vector and a human-readable criteria dict
        """
        assert self.df is not None
        assert self.scaler is not None
        assert self.X_norm is not None

        text_lower = text.lower()

        # Start from mean (in original scale, then normalise)
        base_values = self.df[self.feature_cols].mean().values.reshape(1, -1)
        base_norm = self.scaler.transform(base_values)[0]

        query_vec = base_norm.copy()

        def boost(feature, amount=0.3):
            if feature in self.feature_cols:
                idx = self.feature_cols.index(feature)
                query_vec[idx] = min(1.0, query_vec[idx] + amount)

        # Very simple keyword-based rules (can be extended later)
        if any(k in text_lower for k in ["güvenli", "safety", "safe", "güvenlik"]):
            boost("political_stability_index", 0.4)
            boost("healthcare_quality_index", 0.2)

        if any(k in text_lower for k in ["eğitim", "education", "üniversite"]):
            boost("education_index", 0.4)

        if any(k in text_lower for k in ["mutlu", "huzurlu", "happy", "happiness"]):
            boost("happiness_index", 0.4)

        if any(k in text_lower for k in ["gelir", "maaş", "income", "salary", "zengin"]):
            boost("wealth_index", 0.3)
            boost("gdp_per_capita", 0.3)

        if any(k in text_lower for k in ["internet", "remote", "uzaktan"]):
            boost("internet_penetration", 0.3)

        # climate keywords are present but climate itself is categorical,
        # so we don't inject them into numerical criteria for now.

        # Build human-readable criteria dict (normalized 0–1 values)
        criteria = {
            feature: float(round(query_vec[i], 3))
            for i, feature in enumerate(self.feature_cols)
        }

        return {
            "vector": query_vec,
            "criteria": criteria,
        }

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------
    def recommend(self, text, top_k=3):
        """
        Main recommendation entry point.

        Steps:
        - Build query vector
        - Compute cosine similarity against all countries
        - Find the global best match and its cluster
        - If that cluster has >= 3 countries: return top 3 from that cluster
          Else: fallback to global top 3
        - Scale cosine scores to 0–100
        """
        assert self.df is not None
        assert self.X_norm is not None

        built = self._build_query_vector(text)
        query_vec = built["vector"]

        # Cosine similarity against all normalized country vectors
        sims = cosine_similarity(
            query_vec.reshape(1, -1), self.X_norm
        )[0]  # shape: (n_countries,)

        # Global best match
        global_best_idx = int(np.argmax(sims))
        global_best_country = self.df.iloc[global_best_idx]
        target_cluster = int(global_best_country["cluster"])

        # All indices in target cluster
        cluster_mask = self.df["cluster"] == target_cluster
        cluster_indices = np.where(cluster_mask.values)[0]

        # Decide candidate pool according to fallback rule
        if len(cluster_indices) < top_k:
            # Fallback: ignore clusters, use global top_k
            candidate_indices = np.argsort(sims)[::-1][:top_k]
        else:
            # Restrict to cluster, then pick best inside
            cluster_sims = sims[cluster_indices]
            order_in_cluster = np.argsort(cluster_sims)[::-1][:top_k]
            candidate_indices = cluster_indices[order_in_cluster]

        recommendations = []
        for idx in candidate_indices:
            row = self.df.iloc[int(idx)]
            score_raw = float(sims[int(idx)])
            score_scaled = max(0.0, min(100.0, score_raw * 100.0))

            recommendations.append(
                {
                    "name": row.get("name.common", row.get("name", "")),
                    "region": row.get("region", None),
                    "subregion": row.get("subregion", None),
                    "capital": row.get("capital", None),
                    "description": row.get("description", None),
                    "cluster": int(row.get("cluster", -1)),
                    "score": round(score_scaled, 2),
                }
            )

        return {
            "criteria": built["criteria"],
            "best_match": {
                "name": global_best_country.get(
                    "name.common", global_best_country.get("name", "")
                ),
                "cluster": target_cluster,
            },
            "recommendations": recommendations,
        }


if __name__ == "__main__":
    # Simple manual test (optional)
    recommender = CountryRecommender("countries_advanced.json")
    example = "Güvenli ve yüksek eğitim seviyesine sahip, gelir düzeyi yüksek bir ülke istiyorum."
    result = recommender.recommend(example)
    print(json.dumps(result, ensure_ascii=False, indent=2))



