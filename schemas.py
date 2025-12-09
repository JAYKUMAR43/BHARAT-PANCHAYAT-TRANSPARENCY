from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ORMBase(BaseModel):
    class Config:
        from_attributes = True


# ----------------------------
# Location Schemas
# ----------------------------
class StateBase(ORMBase):
    id: int
    name: str


class DistrictBase(ORMBase):
    id: int
    name: str
    state_id: int


class BlockBase(ORMBase):
    id: int
    name: str
    district_id: int


class VillageBase(ORMBase):
    id: int
    name: str
    block_id: int


# ----------------------------
# Project Schemas
# ----------------------------
class ProjectBase(ORMBase):
    id: int
    village_id: int
    contractor_id: Optional[int] = None
    name: str
    description: Optional[str]
    status: str
    budget: float
    spent: float
    progress_percent: float
    start_year: Optional[int]
    duration_months: Optional[int]
    risk_level: Optional[str]


class ProjectCreate(BaseModel):
    village_id: int
    name: str
    contractor_id: Optional[int] = None
    description: Optional[str] = None
    status: str = "ongoing"
    budget: float = 0
    spent: float = 0
    progress_percent: float = 0
    start_year: Optional[int] = None
    duration_months: Optional[int] = None
    risk_level: Optional[str] = "Low"


class ProjectUpdate(BaseModel):
    name: Optional[str]
    contractor_id: Optional[int] = None
    description: Optional[str]
    status: Optional[str]
    budget: Optional[float]
    spent: Optional[float]
    progress_percent: Optional[float]
    start_year: Optional[int]
    duration_months: Optional[int]
    risk_level: Optional[str]

class ProjectResponse(ProjectBase):
    pass



# ----------------------------
# Feedback Schemas
# ----------------------------
class FeedbackBase(ORMBase):
    id: int
    project_id: int
    rating: int
    comment: Optional[str]
    image_path: Optional[str]


class FeedbackCreate(BaseModel):
    rating: int
    comment: Optional[str] = None


class FeedbackResponse(FeedbackBase):
    pass


# ----------------------------
# Dashboard Response
# ----------------------------
class DashboardVillageResponse(BaseModel):
    total_projects: int
    completed_projects: int
    ongoing_projects: int
    delayed_projects: int
    total_budget: float
    total_spent: float
    avg_progress: float
    complaints: int  # 🔥 ADDED
    project_list: List[ProjectResponse]
