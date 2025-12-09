from database import SessionLocal, engine, Base
from models import State, District, Block, Village, Project
from datetime import date

# Make sure tables exist
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# 1) Purana data clear (optional)
db.query(Project).delete()
db.query(Village).delete()
db.query(Block).delete()
db.query(District).delete()
db.query(State).delete()
db.commit()

# 2) Seed States
up = State(name="Uttar Pradesh")
br = State(name="Bihar")
db.add_all([up, br])
db.commit()
db.refresh(up)
db.refresh(br)

# 3) Seed Districts
dist1 = District(name="Lucknow", state_id=up.id)
dist2 = District(name="Kanpur", state_id=up.id)
dist3 = District(name="Patna", state_id=br.id)
db.add_all([dist1, dist2, dist3])
db.commit()
db.refresh(dist1)
db.refresh(dist2)
db.refresh(dist3)

# 4) Seed Blocks
block1 = Block(name="Aliganj", district_id=dist1.id)
block2 = Block(name="Gomti Nagar", district_id=dist1.id)
block3 = Block(name="Kakadeo", district_id=dist2.id)
db.add_all([block1, block2, block3])
db.commit()
db.refresh(block1)
db.refresh(block2)
db.refresh(block3)

# 5) Seed Villages
v1 = Village(name="Village A", block_id=block1.id)
v2 = Village(name="Village B", block_id=block2.id)
v3 = Village(name="Village C", block_id=block3.id)
db.add_all([v1, v2, v3])
db.commit()
db.refresh(v1)
db.refresh(v2)
db.refresh(v3)

# 6) Example project
p1 = Project(
    village_id=v1.id,
    name="Village A Road Repair",
    description="Repair 2 km road",
    status="Ongoing",
    budget=500000,
    spent=150000,
    progress_percent=30,
    start_year=2025,
    duration_months=6,
    risk_level="Low",
)
db.add(p1)
db.commit()

db.close()
print("✔ Sample location & project data inserted!")
