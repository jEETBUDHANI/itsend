"""
AI Chatbot API for context-aware career guidance
Uses Google Gemini REST API for conversational AI
"""
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User, Assessment
from app.models_extended import Roadmap
import requests
import os

chatbot_bp = Blueprint('chatbot', __name__)

# Gemini REST API settings
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"


def get_user_context(user_id):
    """Build context about the user for the AI"""
    user = User.query.get(user_id)
    if not user:
        return ""
    
    context = f"User Profile:\n"
    context += f"- Name: {user.full_name}\n"
    context += f"- Academic Stage: {user.academic_stage or 'Not specified'}\n"
    context += f"- Stream: {user.current_stream or 'Not specified'}\n"
    context += f"- Class/Grade: {user.class_grade or 'Not specified'}\n"
    context += f"- Target Exams: {', '.join(user.target_exams) if user.target_exams else 'Not specified'}\n\n"
    
    # Get assessments
    assessments = Assessment.query.filter_by(user_id=user_id).all()
    if assessments:
        context += "Completed Assessments:\n"
        for assessment in assessments:
            context += f"- {assessment.assessment_type}: Completed on {assessment.completed_at.strftime('%Y-%m-%d')}\n"
    else:
        context += "No assessments completed yet.\n"
    
    # Get roadmap
    roadmap = Roadmap.query.filter_by(user_id=user_id).order_by(Roadmap.updated_at.desc()).first()
    if roadmap:
        context += f"\nCurrent Roadmap Stage: {roadmap.stage}\n"
    
    return context


@chatbot_bp.route('/ask', methods=['POST'])
@jwt_required()
def ask_chatbot():
    """Context-aware chatbot for career guidance"""
    try:
        if not GEMINI_API_KEY:
            return jsonify({
                'error': 'Chatbot not configured. Please set GEMINI_API_KEY in environment variables.'
            }), 503
        
        user_id = get_jwt_identity()
        data = request.get_json()
        question = data.get('question', '').strip()
        
        if not question:
            return jsonify({'error': 'Question required'}), 400
        
        # Build context
        user_context = get_user_context(user_id)
        
        # System prompt for the AI
        system_prompt = f"""You are a helpful career guidance counselor for Indian students. 
You help students make informed decisions about their academic and career paths.

{user_context}

Guidelines:
- Provide realistic, practical advice
- Focus on Indian education system (CBSE, State Boards)
- Mention relevant exams (JEE, NEET, CA, CLAT, CUET, etc.)
- Be supportive and encouraging
- If the student hasn't completed assessments, gently suggest taking them
- Keep responses concise (2-3 paragraphs max)
- Use simple, student-friendly language

Now answer the student's question:"""
        
        # Use Gemini REST API
        try:
            payload = {
                "contents": [{
                    "parts": [{"text": f"{system_prompt}\n\nQuestion: {question}"}]
                }]
            }
            resp = requests.post(
                f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
                json=payload,
                timeout=30
            )
            resp.raise_for_status()
            data = resp.json()
            answer = data["candidates"][0]["content"]["parts"][0]["text"]

            return jsonify({
                'success': True,
                'question': question,
                'answer': answer,
                'timestamp': 'now'
            }), 200

        except Exception as api_error:
            return jsonify({
                'error': 'Failed to get response from AI',
                'details': str(api_error)
            }), 500
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@chatbot_bp.route('/suggested-questions', methods=['GET'])
@jwt_required()
def get_suggested_questions():
    """Get suggested questions based on user's stage"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        stage = user.academic_stage if user else '9-10'
        
        suggestions = {
            '9-10': [
                "What stream should I choose after 10th?",
                "How do I decide between Science, Commerce, and Arts?",
                "What careers can I explore in each stream?",
                "When should I start thinking about career planning?"
            ],
            '11-12': [
                "Should I prepare for JEE or NEET?",
                "How do I balance board exams and entrance exam preparation?",
                "What if I don't clear JEE/NEET?",
                "Can I change my stream after 12th?",
                "Which entrance exams should I target?"
            ],
            'college': [
                "How do I build skills for my career?",
                "Should I focus on CGPA or internships?",
                "How do I prepare for placements?",
                "Should I go for higher studies or job?",
                "Which certifications are valuable for my field?"
            ]
        }
        
        questions = suggestions.get(stage, suggestions['9-10'])
        
        return jsonify({
            'success': True,
            'suggested_questions': questions,
            'stage': stage
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
