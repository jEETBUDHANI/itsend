"""Routes for reports, career library, and AI mentor"""
from flask import Blueprint, request, jsonify, send_file, Response
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User, HolisticProfile, TestResult
from app.services.report_generator import CareerReportGenerator
from app.services.ai_mentor import AICareerMentor
from app.data.career_library import CAREER_LIBRARY, get_career_details, search_careers
from app.data.career_roadmaps import CAREER_ROADMAPS

services_bp = Blueprint('services', __name__)
report_gen = CareerReportGenerator()
ai_mentor = AICareerMentor()


@services_bp.route('/report/generate', methods=['GET'])
@jwt_required()
def generate_pdf_report():
    """Generate and download comprehensive PDF report"""
    try:
        user_id = int(get_jwt_identity())
        
        # Get user data
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get holistic profile
        holistic = HolisticProfile.query.filter_by(user_id=user_id).first()
        if not holistic:
            return jsonify({'error': 'Complete assessments first'}), 404
        
        # Get test results for recommendations
        results = TestResult.query.filter_by(user_id=user_id).order_by(TestResult.created_at.desc()).first()
        
        recommendations = []
        if results and results.recommendations:
            recommendations = results.recommendations.get('careers', [])[:5]
        
        # Get roadmaps for top careers
        roadmaps = {}
        for rec in recommendations[:3]:
            career_name = rec.get('career', '')
            if career_name in CAREER_ROADMAPS:
                roadmaps[career_name] = CAREER_ROADMAPS[career_name]
        
        # Generate PDF
        pdf_buffer = report_gen.generate_report(
            user_data=user.to_dict(),
            holistic_profile=holistic.to_dict(),
            career_recommendations=recommendations,
            roadmaps=roadmaps
        )
        
        return send_file(
            pdf_buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'career_report_{user.full_name or user_id}.pdf'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@services_bp.route('/careers', methods=['GET'])
def get_careers():
    """Get list of all careers or search"""
    try:
        query = request.args.get('q')
        category = request.args.get('category')
        riasec = request.args.get('riasec')
        
        if query or category or riasec:
            careers = search_careers(query=query, category=category, riasec_code=riasec)
        else:
            careers = [
                {
                    'name': name,
                    'category': details.get('category'),
                    'overview': details.get('overview')
                }
                for name, details in CAREER_LIBRARY.items()
            ]
        
        return jsonify({'careers': careers}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@services_bp.route('/careers/<career_name>', methods=['GET'])
def get_career_detail(career_name):
    """Get detailed information about a specific career"""
    try:
        career = get_career_details(career_name)
        
        if not career:
            return jsonify({'error': 'Career not found'}), 404
        
        return jsonify({
            'career': career_name,
            'details': career
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@services_bp.route('/mentor/chat/stream', methods=['POST'])
@jwt_required()
def chat_with_mentor_stream():
    """Streaming chat with AI career mentor"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        if not data or not data.get('message'):
            return jsonify({'error': 'Message is required'}), 400
        
        message = data['message']
        history = data.get('history', [])
        
        # Build comprehensive user context (similar to non-streaming)
        user_context = {}
        user = User.query.get(user_id)
        if user:
            user_context['name'] = user.full_name
            user_context['academic_stage'] = user.academic_stage
        
        holistic = HolisticProfile.query.filter_by(user_id=user_id).first()
        if holistic:
            user_context['clarity_score'] = holistic.clarity_score
        
        test_result = TestResult.query.filter_by(user_id=user_id).order_by(TestResult.created_at.desc()).first()
        if test_result:
            user_context['personality_type'] = test_result.personality_type
            if test_result.recommendations:
                user_context['recommended_careers'] = test_result.recommendations.get('mcq_careers', [])[:5]

        # Return a streaming response
        return Response(
            ai_mentor.stream_chat(user_id, message, user_context, history=history),
            mimetype='text/event-stream',
            headers={
                'Cache-Control': 'no-cache',
                'Transfer-Encoding': 'chunked',
                'Connection': 'keep-alive'
            }
        )
        
    except Exception as e:
        print(f"Streaming Mentor chat error: {str(e)}")
        return jsonify({'error': str(e)}), 500


@services_bp.route('/mentor/chat', methods=['POST'])

@jwt_required()
def chat_with_mentor():
    """Chat with AI career mentor with full user context"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        if not data or not data.get('message'):
            return jsonify({'error': 'Message is required'}), 400
        
        message = data['message']
        
        # Build comprehensive user context
        user_context = {}
        
        # Get user basic info
        user = User.query.get(user_id)
        if user:
            user_context['name'] = user.full_name
            user_context['email'] = user.email
            user_context['academic_stage'] = user.academic_stage
        
        # Get holistic profile
        holistic = HolisticProfile.query.filter_by(user_id=user_id).first()
        if holistic:
            user_context['clarity_score'] = holistic.clarity_score
            user_context['profile_data'] = holistic.profile_data
        
        # Get latest test results and career recommendations
        test_result = TestResult.query.filter_by(user_id=user_id).order_by(TestResult.created_at.desc()).first()
        if test_result:
            user_context['personality_type'] = test_result.personality_type
            user_context['riasec_scores'] = test_result.scores
            
            if test_result.recommendations:
                user_context['recommended_careers'] = test_result.recommendations.get('mcq_careers', [])[:5]
                user_context['ml_courses'] = test_result.recommendations.get('ml_courses', [])[:3]
        
        # Get mentor response with full context
        response = ai_mentor.chat(user_id, message, user_context)
        
        return jsonify(response), 200
        
    except Exception as e:
        print(f"Mentor chat error: {str(e)}")  # Log for debugging
        return jsonify({'error': str(e)}), 500


@services_bp.route('/mentor/history', methods=['GET'])
@jwt_required()
def get_chat_history():
    """Get chat history with mentor"""
    try:
        user_id = int(get_jwt_identity())
        
        # Filter history for this user
        history = [
            h for h in ai_mentor.conversation_history
            if h.get('user_id') == user_id
        ]
        
        return jsonify({'history': history[-20:]}), 200  # Last 20 messages
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
