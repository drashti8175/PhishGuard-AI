import os
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
from app.services.url_extractor import extract_url_features

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_STORE_DIR = os.path.join(MODEL_DIR, "model_store")
MODEL_PATH = os.path.join(MODEL_STORE_DIR, "phishing_detector.joblib")

# Ensure the model store folder exists
os.makedirs(MODEL_STORE_DIR, exist_ok=True)

def generate_synthetic_data(num_samples: int = 5000) -> pd.DataFrame:
    """
    Generates a highly-correlated synthetic dataset mapping the 16 extracted 
    features to a target safety label (0 = Safe, 1 = Phishing).
    """
    print(f"Creating a simulated dataset of {num_samples} records based on true cyber threat distributions...")
    
    np.random.seed(42)
    half_samples = num_samples // 2

    # SAFE URLs
    safe_data = {
        "url_length": np.random.normal(loc=25, scale=8, size=half_samples).astype(int).clip(10, 60),
        "num_dots": np.random.poisson(lam=1.5, size=half_samples).clip(1, 3),
        "is_https": np.random.choice([1, 0], size=half_samples, p=[0.95, 0.05]),
        "has_ip": np.zeros(half_samples, dtype=int),
        "is_shortened": np.random.choice([1, 0], size=half_samples, p=[0.02, 0.98]),
        "num_ats": np.zeros(half_samples, dtype=int),
        "num_dashes": np.random.poisson(lam=0.2, size=half_samples).clip(0, 1),
        "has_suspicious_keywords": np.random.choice([1, 0], size=half_samples, p=[0.01, 0.99]),
        "prefix_suffix": np.random.choice([1, 0], size=half_samples, p=[0.03, 0.97]),
        "path_depth": np.random.poisson(lam=1.2, size=half_samples).clip(0, 4),
        "num_subdomains": np.random.poisson(lam=0.1, size=half_samples).clip(0, 1),
        "has_unicode": np.random.choice([1, 0], size=half_samples, p=[0.005, 0.995]),
        "num_digits": np.random.poisson(lam=0.5, size=half_samples).clip(0, 3),
        "num_queries": np.random.poisson(lam=0.1, size=half_samples).clip(0, 2),
        "has_redirection": np.zeros(half_samples, dtype=int),
        "num_percentage": np.random.poisson(lam=0.05, size=half_samples).clip(0, 1),
        "label": np.zeros(half_samples, dtype=int)
    }

    # MALICIOUS/PHISHING URLs
    phish_data = {
        "url_length": np.random.normal(loc=110, scale=35, size=half_samples).astype(int).clip(45, 250),
        "num_dots": np.random.poisson(lam=5.2, size=half_samples).clip(2, 9),
        "is_https": np.random.choice([1, 0], size=half_samples, p=[0.45, 0.55]),
        "has_ip": np.random.choice([1, 0], size=half_samples, p=[0.12, 0.88]),
        "is_shortened": np.random.choice([1, 0], size=half_samples, p=[0.18, 0.82]),
        "num_ats": np.random.choice([1, 0], size=half_samples, p=[0.08, 0.92]),
        "num_dashes": np.random.poisson(lam=3.1, size=half_samples).clip(0, 7),
        "has_suspicious_keywords": np.random.choice([1, 0], size=half_samples, p=[0.88, 0.12]),
        "prefix_suffix": np.random.choice([1, 0], size=half_samples, p=[0.75, 0.25]),
        "path_depth": np.random.poisson(lam=3.8, size=half_samples).clip(1, 8),
        "num_subdomains": np.random.poisson(lam=2.4, size=half_samples).clip(0, 5),
        "has_unicode": np.random.choice([1, 0], size=half_samples, p=[0.15, 0.85]),
        "num_digits": np.random.poisson(lam=6.8, size=half_samples).clip(0, 20),
        "num_queries": np.random.poisson(lam=1.5, size=half_samples).clip(0, 6),
        "has_redirection": np.random.choice([1, 0], size=half_samples, p=[0.15, 0.85]),
        "num_percentage": np.random.poisson(lam=2.8, size=half_samples).clip(0, 10),
        "label": np.ones(half_samples, dtype=int)
    }

    df_safe = pd.DataFrame(safe_data)
    df_phish = pd.DataFrame(phish_data)
    
    return pd.concat([df_safe, df_phish], ignore_index=True)

def train_and_save():
    """
    Trains the classifier on the 16 features and saves the output model.
    """
    # Create or load dataset
    df = generate_synthetic_data(6000)
    
    features = [
        "url_length", "num_dots", "is_https", "has_ip", "is_shortened",
        "num_ats", "num_dashes", "has_suspicious_keywords", "prefix_suffix",
        "path_depth", "num_subdomains", "has_unicode", "num_digits",
        "num_queries", "has_redirection", "num_percentage"
    ]
    
    X = df[features]
    y = df["label"]
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    print("Training Random Forest Classifier model...")
    # Setup Random Forest model
    clf = RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42, n_jobs=-1)
    clf.fit(X_train, y_train)
    
    # Metrics
    y_pred = clf.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print("\n--- Model Training Completed ---")
    print(f"Random Forest Classifier Accuracy: {accuracy * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save the model
    joblib.dump(clf, MODEL_PATH)
    print(f"Trained model saved successfully to: {MODEL_PATH}")
    return accuracy

if __name__ == "__main__":
    train_and_save()
