"""AI Career Mentor 'Shiv' with OpenRouter API integration"""
import os
import requests
from datetime import datetime

class AICareerMentor:
    """Intelligent chatbot 'Shiv' with OpenRouter API"""
    
    def __init__(self):
        self.conversation_history = []
        self.api_key = os.getenv('OPENROUTER_API_KEY')
        self.api_url = "https://openrouter.ai/api/v1/chat/completions"
        print(f"[AI Mentor] Initialized. API Key present: {bool(self.api_key)}")
    
    def chat(self, user_id, message, user_profile=None):
        """Generate AI response using OpenRouter"""
        
        print(f"[AI Mentor] Received message: '{message}' from user {user_id}")
        
        # Build user context
        user_name = user_profile.get('name', 'Student') if user_profile else 'Student'
        first_name = user_name.split()[0] if user_name != 'Student' else 'Student'
        personality = user_profile.get('personality_type', '') if user_profile else ''
        careers = user_profile.get('recommended_careers', []) if user_profile else []
        clarity_score = user_profile.get('clarity_score', 'Unknown') if user_profile else 'Unknown'
        
        career_str = ", ".join(careers) if careers else "None yet"
        
        # System prompt
        system_prompt = f"""You are Shiv, a friendly and expert AI Career Mentor.
Your goal is to talk to students like a supportive mentor/friend (similar to ChatGPT/Gemini).
Answer EVERY question helpfully, even if it's not strictly about careers (but always tie it back to their growth if possible).

User Info:
- Name: {first_name}
- Personality: {personality}
- Top Career Matches: {career_str}
- Career Clarity Score: {clarity_score}

Guidelines:
- ALWAYS intro yourself as Shiv if they ask or say hi.
- If asked "what is oops", assume Object-Oriented Programming.
- Answer technical questions (Java, Python, OOP) with clear, simple explanations.
- Be encouraging, realistic, and insightful.
- Use simple, warm language. Use emojis occasionally.
- Keep responses conversational. Not too long, not too short.
- Answer the user's EXACT question directly.
"""

        # If no API key, use fallback
        if not self.api_key:
            print("[AI Mentor] No API key found, using fallback")
            return self._fallback_response(message.lower(), first_name, careers)
        
        try:
            # Get conversation history for context
            history_messages = [{"role": "system", "content": system_prompt}]
            
            # Add last 3 messages for context
            for h in self.conversation_history[-3:]:
                if h.get('user_id') == user_id:
                    history_messages.append({"role": "user", "content": h['message']})
                    history_messages.append({"role": "assistant", "content": h['response']['response']})
            
            # Add current message
            history_messages.append({"role": "user", "content": message})
            
            print(f"[AI Mentor] Calling OpenRouter API with {len(history_messages)} messages")
            
            # Call OpenRouter API
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5000",
                "X-Title": "CareerPath Pro"
            }
            
            data = {
                "model": "liquid/lfm-2.5-1.2b-instruct:free",  # Using working Liquid model
                "messages": history_messages,
                "temperature": 0.7,
                "max_tokens": 500
            }
            
            response = requests.post(self.api_url, headers=headers, json=data, timeout=30)
            
            print(f"[AI Mentor] API Response Status: {response.status_code}")
            
            if response.status_code != 200:
                print(f"[AI Mentor] API Error Response: {response.text}")
                raise Exception(f"API returned status {response.status_code}")
            
            result = response.json()
            answer = result['choices'][0]['message']['content']
            
            print(f"[AI Mentor] Got response: {answer[:100]}...")
            
            response_data = {
                'response': answer,
                'follow_up_questions': [
                    "How can I start this journey?",
                    "What skills should I learn first?",
                    "Tell me more about career options"
                ],
                'timestamp': datetime.now().isoformat()
            }
            
            # Add to history
            self.conversation_history.append({
                'user_id': user_id,
                'message': message,
                'response': response_data,
                'timestamp': datetime.now().isoformat()
            })
            
            return response_data
            
        except Exception as e:
            print(f"[AI Mentor] OpenRouter API Error: {str(e)}")
            print(f"[AI Mentor] Falling back to simple responses")
            return self._fallback_response(message.lower(), first_name, careers)
    
    def _fallback_response(self, message, user_name, careers):
        """Fallback response when API is unavailable"""
        
        print(f"[AI Mentor] Using fallback for message: {message}")
        
        # Greetings
        if any(word in message for word in ['hi', 'hello', 'hey', 'hlo', 'hii']):
            return {
                'response': f"Hi {user_name}! 👋 I'm Shiv, your AI Career Mentor. I'm here to guide you on your career journey. What would you like to know?",
                'follow_up_questions': [
                    "What career path should I choose?",
                    "How do I improve my skills?",
                    "Tell me about Software Engineering"
                ],
                'timestamp': datetime.now().isoformat()
            }
        
        # Java/Python/Programming specific
        if any(word in message for word in ['java', 'python', 'javascript', 'c++', 'programming', 'language', 'oops', 'object oriented']):
            lang = "Java" if 'java' in message else "Python" if 'python' in message else "This concept"
            return {
                'response': f"{lang} is a fundamental part of software development! 💻\n\nIt helps strictly with:\n• **Building Systems**: Scalable applications\n• **Logic**: Core computational thinking\n• **Career**: High demand in the tech industry\n\nStart with the basics!",
                'follow_up_questions': [
                    f"What can I build with {lang}?",
                    "How long does it take to learn?",
                    "What resources should I use?"
                ],
                'timestamp': datetime.now().isoformat()
            }
        
        # Career recommendations
        if any(word in message for word in ['career', 'job', 'recommend', 'best for me']):
            if careers:
                career_list = '\n'.join([f"• {career}" for career in careers[:5]])
                return {
                    'response': f"Based on your profile, here are your top career matches:\n\n{career_list}\n\nEach of these aligns with your strengths. Would you like to know more about any specific one?",
                    'follow_up_questions': [
                        f"Tell me about {careers[0]}",
                        "What skills do I need?",
                        "How do I get started?"
                    ],
                    'timestamp': datetime.now().isoformat()
                }
        
        # General response
        return {
            'response': f"That's a great question, {user_name}! I'm here to help with career guidance, skill development, and planning your future. Could you be more specific?",
            'follow_up_questions': [
                "What are good career options?",
                "How do I choose my career path?",
                "Tell me about different fields"
            ],
            'timestamp': datetime.now().isoformat()
        }
    """Intelligent chatbot 'Shiv' with OpenRouter API"""
    
    def __init__(self):
        self.conversation_history = []
        self.api_key = os.getenv('OPENROUTER_API_KEY')
        self.api_url = "https://openrouter.ai/api/v1/chat/completions"
        print(f"[AI Mentor] Initialized. API Key present: {bool(self.api_key)}")
    
    def chat(self, user_id, message, user_profile=None):
        """Generate AI response using OpenRouter"""
        
        print(f"[AI Mentor] Received message: '{message}' from user {user_id}")
        
        # Build user context
        user_name = user_profile.get('name', 'Student') if user_profile else 'Student'
        first_name = user_name.split()[0] if user_name != 'Student' else 'Student'
        personality = user_profile.get('personality_type', '') if user_profile else ''
        careers = user_profile.get('recommended_careers', []) if user_profile else []
        clarity_score = user_profile.get('clarity_score', 'Unknown') if user_profile else 'Unknown'
        
        career_str = ", ".join(careers) if careers else "None yet"
        
        # System prompt
        system_prompt = f"""You are Shiv, a friendly AI Career Mentor and assistant.

You should behave like ChatGPT or Gemini - answer ANY question the user asks, not just career-related ones.
Be helpful, conversational, and provide detailed, practical answers.

User Info:
- Name: {first_name}
- Personality Type: {personality}
- Top Career Matches: {career_str}
- Career Clarity Score: {clarity_score}

Guidelines:
- Answer EVERY question helpfully, even if it's not about careers
- Be encouraging, realistic, and insightful
- Use simple, warm language with occasional emojis
- Keep responses conversational but informative
- If asked about programming, skills, careers, give specific practical advice
- If asked general questions, answer them naturally like ChatGPT would
- Always tie advice back to the user's growth when relevant
"""

        # If no API key, use fallback
        if not self.api_key:
            print("[AI Mentor] No API key found, using fallback")
            return self._fallback_response(message.lower(), first_name, careers)
        
        try:
            # Get conversation history for context
            history_messages = [{"role": "system", "content": system_prompt}]
            
            # Add last 3 messages for context (reduced to avoid token limits)
            for h in self.conversation_history[-3:]:
                if h.get('user_id') == user_id:
                    history_messages.append({"role": "user", "content": h['message']})
                    history_messages.append({"role": "assistant", "content": h['response']['response']})
            
            # Add current message
            history_messages.append({"role": "user", "content": message})
            
            print(f"[AI Mentor] Calling OpenRouter API with {len(history_messages)} messages")
            
            # Call OpenRouter API
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5000",  # Required by OpenRouter
                "X-Title": "CareerPath Pro"  # Optional but recommended
            }
            
            data = {
                "model": "liquid/lfm-2.5-1.2b-instruct:free",  # Free model that works!
                "messages": history_messages,
                "temperature": 0.7,
                "max_tokens": 800
            }
            
            response = requests.post(self.api_url, headers=headers, json=data, timeout=30)
            
            print(f"[AI Mentor] API Response Status: {response.status_code}")
            
            if response.status_code != 200:
                print(f"[AI Mentor] API Error Response: {response.text}")
                raise Exception(f"API returned status {response.status_code}")
            
            result = response.json()
            answer = result['choices'][0]['message']['content']
            
            print(f"[AI Mentor] Got response: {answer[:100]}...")
            
            response_data = {
                'response': answer,
                'follow_up_questions': [
                    "How can I start this journey?",
                    "What skills should I learn first?",
                    "Tell me more about career options"
                ],
                'timestamp': datetime.now().isoformat()
            }
            
            # Add to history
            self.conversation_history.append({
                'user_id': user_id,
                'message': message,
                'response': response_data,
                'timestamp': datetime.now().isoformat()
            })
            
            return response_data
            
        except Exception as e:
            print(f"[AI Mentor] OpenRouter API Error: {str(e)}")
            print(f"[AI Mentor] Falling back to simple responses")
            return self._fallback_response(message.lower(), first_name, careers)
    
    def _fallback_response(self, message, user_name, careers):
        """Fallback response when API is unavailable"""
        
        print(f"[AI Mentor] Using fallback for message: {message}")
        
        # Greetings
        if any(word in message for word in ['hi', 'hello', 'hey', 'hlo', 'hii']):
            return {
                'response': f"Hi {user_name}! 👋 I'm Shiv, your AI Career Mentor. I'm here to guide you on your career journey. What would you like to know?",
                'follow_up_questions': [
                    "What career path should I choose?",
                    "How do I improve my skills?",
                    "Tell me about Software Engineering"
                ],
                'timestamp': datetime.now().isoformat()
            }
        
        # Java/Python/Programming specific
        if any(word in message for word in ['java', 'python', 'javascript', 'c++', 'programming', 'language']):
            lang = "Java" if 'java' in message else "Python" if 'python' in message else "programming"
            return {
                'response': f"{lang} is a powerful language! 💻\n\nHere's how it can help you:\n• **Career Opportunities**: High demand in software development\n• **Versatility**: Build web apps, mobile apps, enterprise systems\n• **Strong Foundation**: Teaches core programming concepts\n• **Community**: Huge support and resources available\n\nStart with basics, practice daily, and build projects to master it!",
                'follow_up_questions': [
                    f"What can I build with {lang}?",
                    "How long does it take to learn?",
                    "What resources should I use?"
                ],
                'timestamp': datetime.now().isoformat()
            }
        
        # Skills/Learning questions
        if any(word in message for word in ['skill', 'learn', 'how to', 'start', 'begin', 'study']):
            if 'java' in message:
                return {
                    'response': f"Great choice, {user_name}! Here's how to learn Java:\n\n**Step-by-Step Roadmap:**\n\n1. **Basics (1-2 months)**\n   • Syntax, variables, loops, conditions\n   • OOP concepts: Classes, Objects, Inheritance\n   • Practice on HackerRank\n\n2. **Data Structures (2-3 months)**\n   • Arrays, Strings, LinkedList\n   • Stacks, Queues, Trees, Graphs\n   • LeetCode practice daily\n\n3. **Build Projects (3-6 months)**\n   • Library Management System\n   • E-commerce website\n   • Chat application\n\n4. **Frameworks (3-6 months)**\n   • Spring Boot for backend\n   • Hibernate for databases\n\n**Resources:**\n• FreeCodeCamp Java Course (Free)\n• Java Programming Masterclass (Udemy)\n• GeeksforGeeks tutorials\n\nYou'll be job-ready in 6-12 months! 🚀",
                    'follow_up_questions': [
                        "Best Java projects for beginners?",
                        "Java vs Python for career?",
                        "How to get Java internship?"
                    ],
                    'timestamp': datetime.now().isoformat()
                }
            else:
                return {
                    'response': f"Learning new skills is key to career growth! 📚\n\n**For Tech Careers:**\n• Programming (Python/Java)\n• Data Structures & Algorithms\n• Git & GitHub\n• Problem-solving\n\n**For Business:**\n• Excel & Data Analysis\n• Communication\n• Project Management\n\n**Universal Skills:**\n• Time management\n• Continuous learning\n• Networking\n\nWhich specific skill are you interested in? I can give you a detailed roadmap!",
                    'follow_up_questions': [
                        "How to learn programming?",
                        "Skills for Data Science?",
                        "How to improve communication?"
                    ],
                    'timestamp': datetime.now().isoformat()
                }
        
        # Career recommendations
        if any(word in message for word in ['career', 'job', 'recommend', 'best for me']):
            if careers:
                career_list = '\n'.join([f"• {career}" for career in careers[:5]])
                return {
                    'response': f"Based on your profile, here are your top career matches:\n\n{career_list}\n\nEach of these aligns with your strengths. Would you like to know more about any specific one?",
                    'follow_up_questions': [
                        f"Tell me about {careers[0]}",
                        "What skills do I need?",
                        "How do I get started?"
                    ],
                    'timestamp': datetime.now().isoformat()
                }
        
        # General response
        return {
            'response': f"That's a great question, {user_name}! I'm here to help with career guidance, skill development, and planning your future. Could you be more specific?",
            'follow_up_questions': [
                "What are good career options?",
                "How do I choose my career path?",
                "Tell me about different fields"
            ],
            'timestamp': datetime.now().isoformat()
        }
