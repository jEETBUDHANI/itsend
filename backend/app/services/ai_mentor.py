"""AI Career Mentor 'Shiv' with Google Gemini API integration and streaming support"""
import os
import google.generativeai as genai
from datetime import datetime
import json

class AICareerMentor:
    """Intelligent chatbot 'Shiv' with Gemini API and streaming support"""
    
    def __init__(self):
        self.api_key = os.getenv('GEMINI_API_KEY')
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-flash-latest')
        else:
            self.model = None
        print(f"[AI Mentor] Initialized with Gemini. API Key present: {bool(self.api_key)}")
    
    def stream_chat(self, user_id, message, user_profile=None, history=None):
        """Generate streaming AI response using Gemini"""
        
        if not self.model:
            yield "data: " + json.dumps({"response": "I'm sorry, I'm currently missing my API key. Please configure the GEMINI_API_KEY."}) + "\n\n"
            return

        # Build user context
        user_name = user_profile.get('name', 'Student') if user_profile else 'Student'
        first_name = user_name.split()[0] if user_name != 'Student' else 'Student'
        personality = user_profile.get('personality_type', '') if user_profile else ''
        careers = user_profile.get('recommended_careers', []) if user_profile else []
        clarity_score = user_profile.get('clarity_score', 'Unknown') if user_profile else 'Unknown'
        career_str = ", ".join(careers) if careers else "None yet"
        
        # Format history for Gemini
        formatted_history = []
        if history:
            for msg in history:
                role = "user" if msg['role'] == "user" else "model"
                formatted_history.append({"role": role, "parts": [msg['content']]})

        # System prompt
        system_instruction = f"""You are Shiv, a friendly and expert AI Career Mentor.

User Context:
- User Name: {first_name}
- Personality: {personality}
- Recommended Careers: {career_str}

CONCISE MODE:
- If there is conversation history, DO NOT repeat your name or long introductory greetings.
- Skip the "Hey {first_name}! It's great to see you..." fluff in subsequent messages.
- Get straight to the point and answer the user's question directly.
- Only provide the warm, enthusiastic greeting for the VERY FIRST message of a session.

Guidelines:
- Be helpful, conversational, and practical.
- Use simple language and emojis sparingly.
- Focus on Class 10/12/College guidance and programming skills.
"""

        try:
            # Create a chat session with history
            chat = self.model.start_chat(history=formatted_history)
            
            # Send message with stream=True
            response = chat.send_message(
                f"{system_instruction}\n\nUser Question: {message}",
                stream=True
            )
            
            full_response = ""
            for chunk in response:
                if chunk.text:
                    full_response += chunk.text
                    yield f"data: {json.dumps({'chunk': chunk.text})}\n\n"
            
            # Final message with metadata
            yield f"data: {json.dumps({'done': True, 'full_response': full_response, 'follow_up_questions': [
                'Tell me more about this.',
                'What are the next steps?',
                'Which colleges are best for this?'
            ]})}\n\n"

        except Exception as e:
            print(f"[AI Mentor] Gemini API Error: {str(e)}")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    def chat(self, user_id, message, user_profile=None):
        """Legacy non-streaming chat for compatibility"""
        # This can still be used if needed, but we'll focus on stream_chat
        try:
            if not self.model:
                return {"response": "API key missing."}
            
            user_name = user_profile.get('name', 'Student') if user_profile else 'Student'
            response = self.model.generate_content(f"User Name: {user_name}. Question: {message}")
            return {
                'response': response.text,
                'follow_up_questions': ["Tell me more", "Next steps"],
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            return {"response": f"Error: {str(e)}"}
