from app.ai.shap_explainer import SHAPExplainer


class ExplanationService:

    def __init__(self, model=None):

        self.explainer = SHAPExplainer(model)

    def explain(self, features):

        return self.explainer.explain(features)