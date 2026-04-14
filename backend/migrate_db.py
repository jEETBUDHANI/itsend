"""
Database migration script to add new columns to existing users table
Run this if you're getting login errors after adding new fields
"""
from app import create_app, db
from app.models import User

def migrate_database():
    """Add new columns to existing database"""
    app = create_app()
    
    with app.app_context():
        try:
            # Try to add new columns using raw SQL
            with db.engine.connect() as conn:
                columns_to_add = [
                    ("user_role", "VARCHAR(50) DEFAULT 'graduate_student'"),
                    ("degree", "VARCHAR(100)"),
                    ("specialization", "VARCHAR(100)"),
                    ("graduation_year", "INTEGER"),
                    ("current_year", "VARCHAR(50)"),
                    ("current_skills", "JSON"),
                    ("career_interests", "JSON"),
                    ("academic_stage", "VARCHAR(50)"),
                    ("current_stream", "VARCHAR(50)"),
                    ("target_exams", "JSON"),
                    ("class_grade", "VARCHAR(20)")
                ]

                for col_name, col_type in columns_to_add:
                    try:
                        conn.execute(db.text(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}"))
                        print(f"✓ Added {col_name} column")
                    except Exception:
                        print(f"- {col_name} column already exists")
                
                conn.commit()
            
            print("\n✅ Database migration completed!")
            print("You can now login successfully.\n")
            
        except Exception as e:
            print(f"\n❌ Migration failed: {str(e)}")
            print("\nAlternative: Delete the database file and restart:")
            print("  1. Stop the backend server")
            print("  2. Delete: backend/career_system.db")
            print("  3. Restart backend: python main.py")
            print("  4. Run seed data: python seed_data.py")
            print("  5. Create a new account\n")

if __name__ == '__main__':
    migrate_database()
