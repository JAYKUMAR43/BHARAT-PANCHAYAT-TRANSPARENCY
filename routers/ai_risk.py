from fastapi import APIRouter
from math import sqrt

router = APIRouter(prefix="/ai", tags=["ai-risk"])

@router.post("/risk")
def compute_ai_risk(budget: float, spent: float, progress: float, duration: int, start_year: int):
    
    score = 0

    # 1) Overspending risk
    if spent > budget:
        score += min((spent - budget) / budget * 100, 40)

    # 2) Slow progress risk
    expected_progress = min(duration * 2, 100)
    if progress < expected_progress:
        score += (expected_progress - progress) * 0.5

    # 3) Old project year risk
    if start_year < 2020:
        score += (2020 - start_year) * 2

    # 4) Combined irregularity detection
    if spent > 50_000 and progress < 20:
        score += 25

    # Normalize
    score = min(100, max(0, score))
    return {"risk": round(score, 2)}
