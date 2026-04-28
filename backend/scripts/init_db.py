"""Initialize database with all tables including new advanced modules tables"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db

def init_database():
    """Create all database tables"""
    app = create_app()
    
    with app.app_context():
        print("Creating database tables...")
        
        # Import all models to ensure they're registered
        from app.models import (
            User, TestResult, Assessment, HolisticProfile, CareerFeedback,
            CareerSkill, UserCareerFeedback, UserProgressSnapshot
        )
        from app.models_extended import CareerPath, ExamPreparation, Job, Roadmap
        
        # Create all tables
        db.create_all()
        
        print("[SUCCESS] Database tables created successfully!")
        print("\nTables created:")
        print("- users")
        print("- test_results")
        print("- assessments")
        print("- holistic_profiles")
        print("- career_feedback")
        print("- career_skills (NEW)")
        print("- user_career_feedback (NEW)")
        print("- user_progress_snapshots (NEW)")
        print("- career_paths")
        print("- exam_preparations")
        print("- jobs")
        print("- roadmaps")
        
        print("\n[SUCCESS] Database initialization complete!")
        print("\nNext step: Run the seed script to populate career skills:")
        print("python -m app.utils.seed_career_skills")


if __name__ == '__main__':
    init_database()
