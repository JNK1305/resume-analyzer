


def get_result_label(score_pct: float) -> tuple:
    """
    Takes a score percentage (e.g. 82.5)
    Returns a (label, color) tuple for the UI.

    Thresholds:
    - 80%+     → Highly Suitable   (green)
    - 60-79%   → Moderately Suitable (orange)
    - Below 60% → Not Suitable      (red)
    """

    if score_pct >= 80:
        return ("🌟 Highly Suitable — Strong match for this role!", "#27ae60")

    elif score_pct >= 60:
        return ("👍 Moderately Suitable — Good match with some gaps.", "#e67e22")

    else:
        return ("❌ Not Suitable — Significant skill gaps detected.", "#e74c3c")


def get_score_color(score_pct: float) -> str:
    """
    Returns a hex color code based on score.
    Used for coloring the score display.
    """
    if score_pct >= 80:
        return "#27ae60"   # Green
    elif score_pct >= 60:
        return "#e67e22"   # Orange
    else:
        return "#e74c3c"   # Red
