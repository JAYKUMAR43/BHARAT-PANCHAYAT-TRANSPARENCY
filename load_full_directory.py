import csv
from sqlalchemy.orm import Session
from database import engine, SessionLocal, Base
from models import State, District, Block, Village

# 1. Create tables if not exist
Base.metadata.create_all(bind=engine)

def process_csv(file_path: str):
    db: Session = SessionLocal()
    try:
        state_cache = {}
        district_cache = {}
        block_cache = {}

        with open(file_path, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for idx, row in enumerate(reader):
                # adjust column names according to CSV
                state_name = row.get("stateNameEnglish") or row.get("StateName") 
                district_name = row.get("districtNameEnglish") or row.get("DistrictName")
                block_name = row.get("blockName") or row.get("DevelopmentBlockName")
                village_name = row.get("villageNameEnglish") or row.get("VillageName")

                if not (state_name and district_name and block_name and village_name):
                    continue  # skip incomplete rows

                # Ensure state
                st_key = state_name.strip()
                if st_key not in state_cache:
                    st_obj = db.query(State).filter(State.name == st_key).first()
                    if st_obj is None:
                        st_obj = State(name=st_key)
                        db.add(st_obj)
                        db.commit()
                        db.refresh(st_obj)
                    state_cache[st_key] = st_obj.id
                state_id = state_cache[st_key]

                # Ensure district
                dist_key = f"{state_id}::{district_name.strip()}"
                if dist_key not in district_cache:
                    dist_obj = db.query(District).filter(
                        District.name == district_name.strip(),
                        District.state_id == state_id
                    ).first()
                    if dist_obj is None:
                        dist_obj = District(name=district_name.strip(), state_id=state_id)
                        db.add(dist_obj)
                        db.commit()
                        db.refresh(dist_obj)
                    district_cache[dist_key] = dist_obj.id
                district_id = district_cache[dist_key]

                # Ensure block
                block_key = f"{district_id}::{block_name.strip()}"
                if block_key not in block_cache:
                    block_obj = db.query(Block).filter(
                        Block.name == block_name.strip(),
                        Block.district_id == district_id
                    ).first()
                    if block_obj is None:
                        block_obj = Block(name=block_name.strip(), district_id=district_id)
                        db.add(block_obj)
                        db.commit()
                        db.refresh(block_obj)
                    block_cache[block_key] = block_obj.id
                block_id = block_cache[block_key]

                # Insert village
                village_obj = Village(
                    name=village_name.strip(),
                    block_id=block_id,
                    # optional: population= int(row["Population"]) if available
                )
                db.add(village_obj)

                # periodically commit
                if idx % 10000 == 0:
                    print(f"Processed {idx} rows … committing")
                    db.commit()
            # final commit
            db.commit()
            print("Finished processing CSV.")
    except Exception as e:
        print("Error:", e)
    finally:
        db.close()

if __name__ == "__main__":
    csv_path = "path/to/your/lgd_full_villages.csv"  # << UPDATE this
    process_csv(csv_path)
