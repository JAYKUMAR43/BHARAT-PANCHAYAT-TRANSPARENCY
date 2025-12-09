from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/ai", tags=["AI Risk Prediction"])


class RiskRequest(BaseModel):
    progress_percent: float
    budget: float
    spent: float


@router.post("/risk")
def compute_risk(payload: RiskRequest):
    try:
        # Basic rule-based risk
        budget = payload.budget
        spent = payload.spent
        progress = payload.progress_percent

        if budget <= 0:
            raise HTTPException(status_code=400, detail="Invalid budget")

        spent_ratio = spent / budget

        risk_score = 50

        if spent_ratio > progress / 100:
            risk_score += 25  # overspending

        if progress < 50 and spent_ratio > 0.8:
            risk_score += 25  # heavy risk

        risk_score = min(risk_score, 100)

        level = (
            "Low" if risk_score <= 40 else
            "Medium" if risk_score <= 70 else
            "High"
        )

        return {
            "risk_score": risk_score,
            "risk_level": level,
            "details": {
                "spent_ratio": round(spent_ratio, 2),
                "progress": progress,
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
