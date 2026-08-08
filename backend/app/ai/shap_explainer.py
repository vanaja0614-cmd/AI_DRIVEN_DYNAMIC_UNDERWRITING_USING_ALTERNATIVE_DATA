class SHAPExplainer:

    def __init__(self, model=None):
        self.model = model

    def explain(self, features):

        if self.model is None:
            return [
                {
                    "feature": "credit_score",
                    "impact": 0.35,
                    "direction": "positive"
                },
                {
                    "feature": "income",
                    "impact": 0.25,
                    "direction": "positive"
                },
                {
                    "feature": "loan_amount",
                    "impact": -0.20,
                    "direction": "negative"
                }
            ]

        import shap

        explainer = shap.Explainer(self.model)

        values = explainer(features)

        result = []

        for feature, value in zip(
            features.columns,
            values.values[0]
        ):
            result.append({
                "feature": feature,
                "impact": float(value),
                "direction": (
                    "positive"
                    if value >= 0
                    else "negative"
                )
            })

        return result