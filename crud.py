from sqlalchemy.orm import Session
from models import State, District, Block, Village, Project, Contractor, Feedback


# ----------------------------
# LOCATION QUERIES
# ----------------------------
def get_states(db: Session):
    return db.query(State).all()


def get_districts_by_state(db: Session, state_id: int):
    return db.query(District).filter(District.state_id == state_id).all()


def get_blocks_by_district(db: Session, district_id: int):
    return db.query(Block).filter(Block.district_id == district_id).all()


def get_villages_by_block(db: Session, block_id: int):
    return db.query(Village).filter(Village.block_id == block_id).all()


# ----------------------------
# PROJECT QUERIES
# ----------------------------
def get_projects_by_village(db: Session, village_id: int):
    return (
        db.query(Project)
        .filter(Project.village_id == village_id)
        .outerjoin(Project.contractor)   # IMPORTANT JOIN
        .all()
    )


def get_project(db: Session, project_id: int):
    return (
        db.query(Project)
        .filter(Project.id == project_id)
        .outerjoin(Project.contractor)
        .first()
    )


def create_project(db: Session, project: Project):
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def update_project(db: Session, project_id: int, data: dict):
    project = db.query(Project).get(project_id)
    for k, v in data.items():
        setattr(project, k, v)
    db.commit()
    db.refresh(project)
    return project


def delete_project(db: Session, project_id: int):
    project = db.query(Project).get(project_id)
    if project:
        db.delete(project)
        db.commit()
    return {"deleted": True}


# ----------------------------
# FEEDBACK
# ----------------------------
def add_feedback(db: Session, feedback: Feedback):
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback


def list_feedback(db: Session, project_id: int):
    return db.query(Feedback).filter(Feedback.project_id == project_id).all()


def list_problematic_feedback(db: Session, village_id: int):
    return (
        db.query(Feedback, Project)
        .join(Project, Feedback.project_id == Project.id)
        .filter(Project.village_id == village_id)
        .filter(Feedback.rating <= 3)
        .all()
    )


# ----------------------------
# DASHBOARD SUMMARY
# ----------------------------
def get_projects_by_village(db: Session, village_id: int):
    return (
        db.query(Project)
        .filter(Project.village_id == village_id)
        .all()
    )


    feedback_count = (
        db.query(Feedback)
        .join(Project)
        .filter(Project.village_id == village_id, Feedback.rating <= 3)
        .count()
    )

    if not projects:
        return {
            "total_projects": 0,
            "completed_projects": 0,
            "ongoing_projects": 0,
            "delayed_projects": 0,
            "complaints": feedback_count,
            "total_budget": 0,
            "total_spent": 0,
            "avg_progress": 0,
            "project_list": []
        }

    total = len(projects)
    completed = sum(1 for p in projects if p.status.lower() == "completed")
    ongoing = sum(1 for p in projects if p.status.lower() == "ongoing")
    delayed = sum(1 for p in projects if p.status.lower() == "delayed")

    budget = sum(p.budget for p in projects)
    spent = sum(p.spent for p in projects)
    avg_progress = round(sum(p.progress_percent for p in projects) / total, 1)

    return {
        "total_projects": total,
        "completed_projects": completed,
        "ongoing_projects": ongoing,
        "delayed_projects": delayed,
        "complaints": feedback_count,
        "total_budget": budget,
        "total_spent": spent,
        "avg_progress": avg_progress,
        "project_list": projects
    }

from sqlalchemy.orm import Session
from models import Project, Feedback


def get_village_dashboard(db: Session, village_id: int):
    projects = db.query(Project).filter(Project.village_id == village_id).all()

    feedback_count = (
        db.query(Feedback)
        .join(Project)
        .filter(Project.village_id == village_id, Feedback.rating <= 3)
        .count()
    )

    if not projects:
        return {
            "total_projects": 0,
            "completed_projects": 0,
            "ongoing_projects": 0,
            "delayed_projects": 0,
            "total_budget": 0,
            "total_spent": 0,
            "avg_progress": 0,
            "complaints": feedback_count,
            "project_list": []
        }

    total = len(projects)
    completed = len([p for p in projects if p.status.lower() == "completed"])
    ongoing = len([p for p in projects if p.status.lower() == "ongoing"])
    delayed = len([p for p in projects if p.status.lower() == "delayed"])

    total_budget = sum(p.budget for p in projects)
    total_spent = sum(p.spent for p in projects)
    avg_progress = round(sum(p.progress_percent for p in projects) / total, 1)

    return {
        "total_projects": total,
        "completed_projects": completed,
        "ongoing_projects": ongoing,
        "delayed_projects": delayed,
        "total_budget": total_budget,
        "total_spent": total_spent,
        "avg_progress": avg_progress,
        "complaints": feedback_count,
        "project_list": projects
    }
