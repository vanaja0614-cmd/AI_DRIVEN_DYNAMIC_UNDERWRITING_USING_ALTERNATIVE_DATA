import numpy as np
import pandas as pd

FRAUD_FEATURES = [
    "transaction_count",
    "unusual_transaction_ratio",
    "account_age_days",
    "login_frequency"
]


class FraudModel:

    def __init__(self, model=None):
        self.model = model

    def predict_probability(self, features):

        if self.model is None:

            activity = features.get(
                "unusual_transaction_ratio",
                0
            )

            login_frequency = features.get(
                "login_frequency",
                1
            )

            probability = (
                0.7 * activity +
                0.3 * min(login_frequency / 20, 1)
            )

            return float(np.clip(probability, 0, 1))

        row = pd.DataFrame([features])[FRAUD_FEATURES]

        prediction = self.model.predict_proba(row)