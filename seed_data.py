from database import Base, engine, SessionLocal
from models import State, District, Block, Village, Contractor, Project
from datetime import date

print("⏳ Seeding database...")
Base.metadata.create_all(bind=engine)
db = SessionLocal()

# Clear existing data
db.query(Project).delete()
db.query(Village).delete()
db.query(Block).delete()
db.query(District).delete()
db.query(State).delete()
db.query(Contractor).delete()
db.commit()

# Add sample locations
st = State(name="Uttar Pradesh"); db.add(st); db.commit(); db.refresh(st)
dist = District(name="Varanasi", state_id=st.id); db.add(dist); db.commit(); db.refresh(dist)
blk = Block(name="Arajiline", district_id=dist.id); db.add(blk); db.commit(); db.refresh(blk)

v1 = Village(name="Village A", block_id=blk.id)
v2 = Village(name="Village B", block_id=blk.id)
db.add_all([v1, v2]); db.commit(); db.refresh(v1); db.refresh(v2)

# Contractors
c1 = Contractor(name="Sharma Constructions", company="Sharma Infra", phone="9876543210", performance=3.5)
c2 = Contractor(name="Yadav Builders", company="Yadav Group", phone="9988776655", performance=4.1)

db.add_all([c1, c2]); db.commit(); db.refresh(c1); db.refresh(c2)

# Projects
p1 = Project(
    name="Village A Road Repair",
    description="Repairing 2 km road",
    village_id=v1.id,
    contractor_id=c1.id,
    budget=500000,
    spent=200000,
    status="ongoing",
    start_year=2025,
    duration_months=6
)

p2 = Project(
    name="Village B Drinking Water Tank",
    description="Overhead tank construction",
    village_id=v2.id,
    contractor_id=c2.id,
    budget=800000,
    spent=650000,
    status="delayed",
    start_year=2024,
    duration_months=8
)

db.add_all([p1, p2]); db.commit()
db.close()
print("✔ Database Seeding Complete! 🚀")
