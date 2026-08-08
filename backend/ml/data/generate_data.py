import random
import csv

random.seed(42)

ROWS = 2000

OUTPUT = "ml/data/synthetic_customers.csv"

with open(OUTPUT, "w", newline="") as f:
    writer = csv.writer(f)

    writer.writerow([
        "income",
        "credit_score",
        "loan_amount",
        "loan_term",
        "employment_years",
        "digital_activity_score",
        "transaction_consistency",
        "default",
        "transaction_count",
        "unusual_transaction_ratio",
        "account_age_days",
        "login_frequency",
        "fraud"
    ])

    for _ in range(ROWS):
        income = round(random.uniform(20000, 150000), 2)
        credit_score = random.randint(300, 850)
        loan_amount = round(random.uniform(5000, 100000), 2)
        loan_term = random.randint(12, 360)
        employment_years = round(random.uniform(0, 30), 1)
        digital_activity_score = round(random.uniform(0, 1), 4)
        transaction_consistency = round(random.uniform(0, 1), 4)

        # Risk: higher credit score + income => lower default probability
        default_prob = 0.7 - (credit_score / 850) * 0.5 - (income / 150000) * 0.2
        default = 1 if random.random() < default_prob else 0

        # Fraud features
        transaction_count = random.randint(1, 300)
        unusual_transaction_ratio = round(random.uniform(0, 1), 4)
        account_age_days = random.randint(1, 3650)
        login_frequency = round(random.uniform(1, 30), 2)

        fraud_prob = 0.1 + unusual_transaction_ratio * 0.6 + min(login_frequency / 30, 1) * 0.2
        fraud = 1 if random.random() < fraud_prob else 0

        writer.writerow([
            income,
            credit_score,
            loan_amount,
            loan_term,
            employment_years,
            digital_activity_score,
            transaction_consistency,
            default,
            transaction_count,
            unusual_transaction_ratio,
            account_age_days,
            login_frequency,
            fraud
        ])

print(f"Generated {ROWS} rows to {OUTPUT}")
