import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier


DATA_PATH = "ml/data/synthetic_customers.csv"
MODEL_PATH = "ml/models/risk_model.pkl"


df = pd.read_csv(DATA_PATH)

features = [
    "income",
    "credit_score",
    "loan_amount",
    "loan_term",
    "employment_years",
    "digital_activity_score",
    "transaction_consistency"
]

X = df[features]

y = df["default"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)

model.fit(
    X_train,
    y_train
)


os.makedirs(
    os.path.dirname(MODEL_PATH),
    exist_ok=True
)

joblib.dump(
    model,
    MODEL_PATH
)

print("Risk model trained successfully.")
print(f"Model saved to {MODEL_PATH}")