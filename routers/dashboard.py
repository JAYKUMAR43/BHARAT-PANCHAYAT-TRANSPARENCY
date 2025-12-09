from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import crud
import schemas
from database import get_db

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/village/{village_id}", response_model=schemas.DashboardVillageResponse)
def get_dashboard(village_id: int, db: Session = Depends(get_db)):
    return crud.get_village_dashboard(db, village_id)
