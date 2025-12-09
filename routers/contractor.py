from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Contractor, Project

router = APIRouter(prefix="/contractors", tags=["Contractors"])

@router.post("/add")
def add_contractor(name: str, company: str = "", phone: str = "", db: Session = Depends(get_db)):
    c = Contractor(name=name, company=company, phone=phone)
    db.add(c)
    db.commit()
    db.refresh(c)
    return c

@router.get("/list")
def list_contractors(db: Session = Depends(get_db)):
    return db.query(Contractor).all()

@router.put("/assign/{project_id}")
def assign_contractor(project_id: int, contractor_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    project.contractor_id = contractor_id
    db.commit()
    return {"message": "Assigned Successfully"}

