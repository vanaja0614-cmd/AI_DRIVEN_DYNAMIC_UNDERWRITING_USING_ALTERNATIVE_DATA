import os
import joblib


def load_model(path: str):

    if not os.path.exists(path):
        return None

    return joblib.load(path)