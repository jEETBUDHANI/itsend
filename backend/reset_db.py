"""
Quick database reset script
This will delete the old database and create a fresh one with all the new fields
"""
import os
import sys

from app import create_app, db


def _resolve_active_sqlite_path():
    """Resolve the real SQLite file path used by SQLAlchemy in this app."""
    app = create_app()
    with app.app_context():
        database_path = db.engine.url.database
    return os.path.abspath(database_path) if database_path else None

print("\n🔧 Database Reset Script\n")
print("=" * 50)

db_path = _resolve_active_sqlite_path()
if not db_path:
    print("❌ Could not resolve active database path")
    sys.exit(1)

print(f"Active database path: {db_path}")

# Check if database exists
deleted_file = False
if os.path.exists(db_path):
    print(f"Found existing database: {db_path}")
    print("Deleting old database...")
    try:
        os.remove(db_path)
        deleted_file = True
        print("✓ Old database deleted")
    except PermissionError:
        print("⚠ Database file is currently in use. Falling back to in-place table reset.")
else:
    print("No existing database found")

# Create new database
print("\nCreating fresh database with new schema...")

try:
    app = create_app()
    with app.app_context():
        if not deleted_file and os.path.exists(db_path):
            db.drop_all()
            print("✓ Existing tables dropped")
        db.create_all()
        print("✓ New database created successfully!")
        print("\nNew tables created:")
        print("  - users (with academic_stage, current_stream, target_exams, class_grade)")
        print("  - career_paths")
        print("  - exam_preparations")
        print("  - jobs")
        print("  - roadmaps")
        print("  - test_results")
        print("  - assessments")
        print("  - holistic_profiles")
        print("  - career_feedback")
    
    print("\n" + "=" * 50)
    print("✅ DATABASE RESET COMPLETE!")
    print("\nNext steps:")
    print("  1. Seed the data: python seed_data.py")
    print("  2. Restart backend if running")
    print("  3. Create a new account at http://localhost:8080/signup")
    print("\n")
    
except Exception as e:
    print(f"\n❌ Error: {str(e)}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
