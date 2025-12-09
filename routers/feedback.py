from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
import crud
from database import get_db
from models import Feedback
import os, shutil

router = APIRouter(prefix="/feedback", tags=["Feedback"])

UPLOAD_DIR = "uploads/"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/add/{project_id}")
async def add_feedback(
    project_id: int,
    rating: int = Form(...),
    comment: str = Form(""),
    latitude: float = Form(None),
    longitude: float = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    image_path = None

    if image:
        save_location = os.path.join(UPLOAD_DIR, image.filename)
        with open(save_location, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image_path = image.filename

    fb = Feedback(
        project_id=project_id,
        rating=rating,
        comment=comment,
        image_path=image_path,
        latitude=latitude,
        longitude=longitude  # 🔥 GPS added
    )

    db.add(fb)
    db.commit()
    db.refresh(fb)

    return {"success": True, "feedback": fb}
