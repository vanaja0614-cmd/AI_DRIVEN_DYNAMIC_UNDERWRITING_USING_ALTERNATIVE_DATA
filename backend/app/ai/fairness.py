class FairnessAnalyzer:

    def demographic_parity(
        self,
        predictions,
        groups
    ):

        group_results = {}

        for group in set(groups):

            group_predictions = [
                p
                for p, g in zip(predictions, groups)
                if g == group
            ]

            if group_predictions:
                group_results[group] = sum(
                    group_predictions
                ) / len(group_predictions)

        return group_results

    def check_bias(
        self,
        group_results,
        threshold=0.8
    ):

        if not group_results:
            return {
                "fair": True,
                "message": "No group data available."
            }

        values = list(group_results.values())

        ratio = min(values) / max(values)

        return {
            "fair": ratio >= threshold,
            "ratio": ratio
        }