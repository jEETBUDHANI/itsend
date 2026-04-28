import requests
import json

API_URL = 'http://localhost:5000/api'

# Test login
print("=== TESTING LOGIN ===")
login_data = {
    'email': 'test@example.com',
    'password': 'password123'
}

try:
    response = requests.post(f'{API_URL}/auth/login', json=login_data)
    print(f'Status Code: {response.status_code}')
    print(f'Response: {json.dumps(response.json(), indent=2)}')
    
    if response.status_code == 200:
        print('\n✓ Login successful!')
        token = response.json().get('access_token')
        print(f'Token: {token[:20]}...')
    else:
        print(f'\n✗ Login failed with status {response.status_code}')
        
except Exception as e:
    print(f'Error: {e}')

print("\n=== TESTING SIGNUP ===")
signup_data = {
    'email': 'newuser@example.com',
    'password': 'securepass123',
    'full_name': 'New User'
}

try:
    response = requests.post(f'{API_URL}/auth/signup', json=signup_data)
    print(f'Status Code: {response.status_code}')
    print(f'Response: {json.dumps(response.json(), indent=2)}')
    
    if response.status_code == 201:
        print('\n✓ Signup successful!')
        token = response.json().get('access_token')
        print(f'Token: {token[:20]}...')
    else:
        print(f'\n✗ Signup failed with status {response.status_code}')
        
except Exception as e:
    print(f'Error: {e}')
