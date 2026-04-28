import requests
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv('OPENROUTER_API_KEY')
print(f"API Key loaded: {bool(api_key)}")

headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json',
    'HTTP-Referer': 'http://localhost:5000'
}

data = {
    'model': 'google/gemini-2.0-flash-exp:free',
    'messages': [
        {'role': 'user', 'content': 'Explain OOP in programming in 2 sentences'}
    ],
    'max_tokens': 150
}

print("\nTesting OpenRouter API...")
try:
    r = requests.post('https://openrouter.ai/api/v1/chat/completions', headers=headers, json=data, timeout=15)
    print(f"Status Code: {r.status_code}")
    
    if r.status_code == 200:
        result = r.json()
        answer = result['choices'][0]['message']['content']
        print(f"\n✅ SUCCESS! AI Response:\n{answer}")
    else:
        print(f"\n❌ ERROR: {r.text}")
except Exception as e:
    print(f"\n❌ Exception: {e}")
