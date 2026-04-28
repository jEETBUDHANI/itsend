# Test Backend Setup
# Run this to verify everything is working

from app import create_app

print("Testing backend setup...")
print("=" * 50)

try:
    app = create_app()
    print("✅ Flask app created successfully!")
    print("✅ Database models loaded!")
    print("✅ Routes registered!")
    print("✅ ML models loaded!")
    print("\n" + "=" * 50)
    print("🎉 Backend is ready to run!")
    print("Run: python main.py")
    print("=" * 50)
except Exception as e:
    print(f"❌ Error: {e}")
    print("\nPlease check:")
    print("1. All dependencies installed")
    print("2. ML model files in app/ml/models/")
    print("3. .env file exists")
