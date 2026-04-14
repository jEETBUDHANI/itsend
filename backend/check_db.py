from app import create_app, db
from app.models import User

app = create_app()
with app.app_context():
    # Check users
    users = User.query.all()
    print(f'\n=== DATABASE STATUS ===')
    print(f'Total users: {len(users)}')
    
    if users:
        print('\nUsers in database:')
        for user in users:
            print(f'  - ID: {user.id}, Email: {user.email}, Name: {user.full_name}')
    else:
        print('No users found. Database is empty.')
    
    # Try to create a test user
    print(f'\n=== CREATING TEST USER ===')
    test_user = User(email='test@example.com', full_name='Test User')
    test_user.set_password('password123')
    
    try:
        db.session.add(test_user)
        db.session.commit()
        print(f'✓ Test user created successfully!')
        print(f'  - ID: {test_user.id}')
        print(f'  - Email: {test_user.email}')
        print(f'  - Password hash: {test_user.password_hash[:20]}...')
        
        # Verify password
        print(f'\n=== PASSWORD VERIFICATION ===')
        pwd_check = test_user.check_password('password123')
        print(f'Password check (correct): {pwd_check}')
        pwd_check_wrong = test_user.check_password('wrongpassword')
        print(f'Password check (wrong): {pwd_check_wrong}')
        
    except Exception as e:
        print(f'✗ Error creating test user: {e}')
