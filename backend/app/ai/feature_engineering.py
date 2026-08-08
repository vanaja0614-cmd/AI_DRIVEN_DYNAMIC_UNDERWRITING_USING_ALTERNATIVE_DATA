import pandas as pd


def build_risk_features(data: dict):

    df = pd.DataFrame([data])

    df["loan_to_income"] = (
        df["loan_amount"] / (df["income"] + 1)
    )

    df["employment_stability"] = (
        df["employment_years"] / 10
    )

    return df


def build_fraud_features(data: dict):

    df = pd.DataFrame([data])

    df["unusual_activity"] = (
        df["unusual_transaction_ratio"]
        * df["transaction_count"]
    )

    return df