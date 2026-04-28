import os
from dotenv import load_dotenv
import json

# Load env
load_dotenv()

from app.services.ai_mentor import AICareerMentor

def test_gemini_connection():
    print("--- Testing Gemini Connection ---")
    mentor = AICareerMentor()
    
    if not mentor.api_key:
        print("ERROR: GEMINI_API_KEY not found in .env")
        return

    test_message = "Hello, who are you?"
    print(f"Sending test message: {test_message}")
    
    try:
        # Test non-streaming first
        response = mentor.chat(user_id=1, message=test_message)
        print(f"Non-streaming response: {response.get('response')[:100]}...")
        
        # Test streaming
        print("\nTesting streaming response...")
        stream = mentor.stream_chat(user_id=1, message="Tell me a very short joke about Class 10.")
        
        full_text = ""
        for chunk_data in stream:
            # chunk_data is 'data: {...}\n\n'
            if chunk_data.startswith("data: "):
                data = json.loads(chunk_data[6:].strip())
                if 'chunk' in data:
                    print(data['chunk'], end="", flush=True)
                    full_text += data['chunk']
                elif 'done' in data:
                    print("\nStream finished successfully.")
                elif 'error' in data:
                    print(f"\nStream Error: {data['error']}")
        
        if full_text:
            print("\nGemini API is CONNECTED and WORKING correctly!")
        else:
            print("\nGemini API returned empty response.")
            
    except Exception as e:
        print(f"\nERROR during testing: {str(e)}")

if __name__ == "__main__":
    test_gemini_connection()
