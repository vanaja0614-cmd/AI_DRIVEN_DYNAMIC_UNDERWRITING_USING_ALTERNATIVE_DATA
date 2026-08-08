import numpy as np
import pandas as pd

RISK_FEATURES = [
    "income",
    "credit_score",
    "loan_amount",
    "loan_term",
    "employment_years",
    "digital_activity_score",
    "transaction_consistency"
]


class RiskModel:

    def __init__(self, model=None):
        self.model = model

    def predict_score(self, features):

        if self.model is None:

            credit_score = features.get("credit_score", 650)
            income = features.get("income", 50000)
            loan_amount = features.get("loan_amount", 10000)

            score = (
                0.5 * (credit_score / 850)
                + 0.3 * min(income / 100000, 1)
                + 0.2 * max(0, 1 - loan_amount / 100000)
            )

            return float(np.clip(score, 0, 1))

        row = pd.DataFrame([features])[RISK_FEATURES]

        prediction = self.model.predict_proba(row)

        return float(prediction[0][1])
