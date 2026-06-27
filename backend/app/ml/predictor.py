import os
import joblib
from app.ml.train import MODEL_PATH, train_and_save

class PhishingPredictor:
    def __init__(self):
        self.model = None

    def load_model(self):
        # Cache loaded model to prevent duplicate disk reads
        if self.model is not None:
            return
        
        # Self-healing check: Auto-run training if missing
        if not os.path.exists(MODEL_PATH):
            print("Phishing classifier binary not found. Running self-healing training trigger...")
            train_and_save()
            
        try:
            self.model = joblib.load(MODEL_PATH)
            print("Successfully loaded phishing classifier model.")
        except Exception as e:
            print(f"Error loading model: {e}")
            raise e

    def predict(self, features: dict) -> tuple:
        self.load_model()
        
        # Maintain strict training features column order
        feature_order = [
            "url_length", "num_dots", "is_https", "has_ip", "is_shortened",
            "num_ats", "num_dashes", "has_suspicious_keywords", "prefix_suffix",
            "path_depth", "num_subdomains", "has_unicode", "num_digits",
            "num_queries", "has_redirection", "num_percentage"
        ]
        
        # Prepare vector
        features_vector = [[features[f] for f in feature_order]]
        
        # Predict probability. probs = [prob_safe, prob_phish]
        probs = self.model.predict_proba(features_vector)[0]
        phishing_probability = float(probs[1])
        
        # Prediction threshold at 50%
        prediction_label = "Phishing" if phishing_probability >= 0.5 else "Safe"
        return phishing_probability, prediction_label

predictor = PhishingPredictor()
