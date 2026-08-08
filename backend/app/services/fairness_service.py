from app.ai.fairness import FairnessAnalyzer
from app.models.risk_score import RiskScore


class FairnessService:

    def __init__(self):

        self.analyzer = FairnessAnalyzer()

    def analyze(
        self,
        predictions,
        groups
    ):

        results = self.analyzer.demographic_parity(
            predictions,
            groups
        )

        return self.analyzer.check_bias(
            results
        )

    def cohort_summary(
        self,
        db
    ):

        """Real cohort stats derived from stored risk decisions."""

        rows = (
            db.query(RiskScore)
            .all()
        )

        if not rows:
            return {
                "cohorts": [],
                "total": 0,
                "generated_at": None,
                "baseline": None
            }

        from collections import Counter

        counts = Counter(r.risk_level for r in rows)
        approved = Counter(
            r.risk_level for r in rows if r.decision == "APPROVE"
        )
        total = len(rows)

        overall_approval = len(
            [r for r in rows if r.decision == "APPROVE"]
        ) / total

        baseline_key = "LOW"

        baseline_rate = (
            approved[baseline_key] / counts[baseline_key]
            if counts.get(baseline_key)
            else overall_approval
        )

        cohorts = []

        for level in ("LOW", "MEDIUM", "HIGH"):
            n = counts.get(level, 0)
            if n == 0:
                continue
            rate = approved.get(level, 0) / n
            variance = rate - baseline_rate
            cohorts.append({
                "name": f"Risk Cohort: {level}",
                "apps": n,
                "approval": f"{rate * 100:.1f}%",
                "approval_value": round(rate, 4),
                "variance": (
                    "Baseline" if level == baseline_key
                    else f"{variance * 100:+.1f}%"
                ),
                "flagged": level in ("HIGH",)
            })

        return {
            "cohorts": cohorts,
            "total": total,
            "generated_at": None,
            "baseline": baseline_key,
            "baseline_approval": round(baseline_rate, 4)
        }