"""Routes for modular education-stage platform flows."""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from app.models import User, ModuleAssessmentResult, ModuleRecommendation, ModuleRoadmap
from app.services.module_engine import ModuleEngine


modules_bp = Blueprint('modules', __name__)
engine = ModuleEngine()


def _module_from_user(user):
    if user.education_module in ('class10', 'class12', 'college'):
        return user.education_module

    # Fallback mapping for existing users.
    if user.academic_stage == '9-10':
        return 'class10'
    if user.academic_stage == '11-12':
        return 'class12'
    return 'college'


def _build_profile(user):
    return {
        'academic_stage': user.academic_stage,
        'education_module': user.education_module,
        'current_stream': user.current_stream,
        'career_interests': user.career_interests or [],
        'degree': user.degree,
        'specialization': user.specialization,
        'current_year': user.current_year,
    }


@modules_bp.route('/catalog', methods=['GET'])
@jwt_required()
def get_module_catalog():
    return jsonify({'modules': engine.list_modules()}), 200


@modules_bp.route('/select', methods=['POST'])
@jwt_required()
def select_module():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        data = request.get_json() or {}
        module_key = data.get('module')
        module = engine.get_module_config(module_key)
        if not module:
            return jsonify({'error': 'Invalid module'}), 400

        user.education_module = module_key
        user.module_goal = module.get('goal')

        if module_key == 'class10':
            user.academic_stage = '9-10'
        elif module_key == 'class12':
            user.academic_stage = '11-12'
        elif module_key == 'college':
            user.academic_stage = 'college'

        db.session.commit()
        return jsonify({'message': 'Module selected', 'module': module, 'user': user.to_dict()}), 200
    except Exception as exc:
        db.session.rollback()
        return jsonify({'error': str(exc)}), 500


@modules_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_module_dashboard():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        module_key = _module_from_user(user)
        module = engine.get_module_config(module_key)
        results = ModuleAssessmentResult.query.filter_by(user_id=user_id, module_type=module_key).all()
        snapshot = engine.progress_snapshot(module_key, [
            {'assessment_key': r.assessment_key, 'score': (r.score_payload or {}).get('score', 0)}
            for r in results
        ])

        latest_recommendation = ModuleRecommendation.query.filter_by(
            user_id=user_id,
            module_type=module_key,
        ).order_by(ModuleRecommendation.updated_at.desc()).first()

        latest_roadmap = ModuleRoadmap.query.filter_by(
            user_id=user_id,
            module_type=module_key,
            is_active=True,
        ).order_by(ModuleRoadmap.updated_at.desc()).first()

        return jsonify({
            'module': module,
            'profile': _build_profile(user),
            'progress': snapshot,
            'assessments': [item.to_dict() for item in results],
            'recommendation': latest_recommendation.to_dict() if latest_recommendation else None,
            'roadmap': latest_roadmap.to_dict() if latest_roadmap else None,
            'navigation': {
                'tabs': [
                    {'id': 'overview', 'label': 'Overview'},
                    {'id': 'assessments', 'label': 'Assessments'},
                    {'id': 'recommendation', 'label': 'Recommendations'},
                    {'id': 'roadmap', 'label': 'Roadmap'},
                    {'id': 'progress', 'label': 'Progress'},
                ]
            }
        }), 200
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


@modules_bp.route('/assessments/<assessment_key>', methods=['POST'])
@jwt_required()
def submit_module_assessment(assessment_key):
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        module_key = _module_from_user(user)
        payload = request.get_json() or {}
        score_payload = engine.score_assessment(module_key, assessment_key, payload)

        existing = ModuleAssessmentResult.query.filter_by(
            user_id=user_id,
            module_type=module_key,
            assessment_key=assessment_key,
        ).first()

        if existing:
            existing.input_payload = payload
            existing.score_payload = score_payload
            existing.schema_version = 'v1'
            record = existing
        else:
            record = ModuleAssessmentResult(
                user_id=user_id,
                module_type=module_key,
                assessment_key=assessment_key,
                schema_version='v1',
                input_payload=payload,
                score_payload=score_payload,
            )
            db.session.add(record)

        db.session.commit()

        # If completed all required assessments, auto-generate recommendation and roadmap.
        module = engine.get_module_config(module_key)
        all_results = ModuleAssessmentResult.query.filter_by(user_id=user_id, module_type=module_key).all()
        required = set(module.get('assessment_order', []))
        completed = {r.assessment_key for r in all_results}

        generated = None
        if required.issubset(completed):
            generated = _generate_module_outputs(user, module_key, all_results)

        return jsonify({
            'message': 'Assessment submitted',
            'module': module_key,
            'assessment': record.to_dict(),
            'generated': generated,
        }), 200
    except Exception as exc:
        db.session.rollback()
        return jsonify({'error': str(exc)}), 500


@modules_bp.route('/recommendation', methods=['GET'])
@jwt_required()
def get_module_recommendation():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        module_key = _module_from_user(user)
        rec = ModuleRecommendation.query.filter_by(user_id=user_id, module_type=module_key).order_by(
            ModuleRecommendation.updated_at.desc()
        ).first()

        if not rec:
            return jsonify({'error': 'No recommendation yet. Complete module assessments.'}), 404

        return jsonify({'recommendation': rec.to_dict()}), 200
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


@modules_bp.route('/roadmap', methods=['GET'])
@jwt_required()
def get_module_roadmap():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        module_key = _module_from_user(user)
        roadmap = ModuleRoadmap.query.filter_by(
            user_id=user_id,
            module_type=module_key,
            is_active=True,
        ).order_by(ModuleRoadmap.updated_at.desc()).first()

        if not roadmap:
            return jsonify({'error': 'No roadmap yet. Complete module assessments.'}), 404

        return jsonify({'roadmap': roadmap.to_dict()}), 200
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


@modules_bp.route('/generate', methods=['POST'])
@jwt_required()
def force_generate_module_outputs():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        module_key = _module_from_user(user)
        all_results = ModuleAssessmentResult.query.filter_by(user_id=user_id, module_type=module_key).all()

        if not all_results:
            return jsonify({'error': 'No module assessments found'}), 404

        generated = _generate_module_outputs(user, module_key, all_results)
        return jsonify({'generated': generated}), 200
    except Exception as exc:
        db.session.rollback()
        return jsonify({'error': str(exc)}), 500


def _generate_module_outputs(user, module_key, all_results):
    profile = _build_profile(user)
    compact_results = [
        {
            'assessment_key': r.assessment_key,
            'score': (r.score_payload or {}).get('score', 0),
            'normalized_inputs': (r.score_payload or {}).get('normalized_inputs', {}),
        }
        for r in all_results
    ]

    recommendation_payload = engine.build_recommendation(module_key, profile, compact_results)
    roadmap_payload = engine.build_roadmap(module_key, recommendation_payload)

    rec = ModuleRecommendation.query.filter_by(user_id=user.id, module_type=module_key).first()
    if rec:
        rec.output_type = recommendation_payload.get('output_type')
        rec.recommendation_payload = recommendation_payload
        rec.confidence_score = recommendation_payload.get('overall_score', 0)
    else:
        rec = ModuleRecommendation(
            user_id=user.id,
            module_type=module_key,
            output_type=recommendation_payload.get('output_type'),
            recommendation_payload=recommendation_payload,
            confidence_score=recommendation_payload.get('overall_score', 0),
        )
        db.session.add(rec)

    existing_roadmaps = ModuleRoadmap.query.filter_by(user_id=user.id, module_type=module_key, is_active=True).all()
    for item in existing_roadmaps:
        item.is_active = False

    roadmap = ModuleRoadmap(
        user_id=user.id,
        module_type=module_key,
        roadmap_payload=roadmap_payload,
        is_active=True,
    )
    db.session.add(roadmap)

    db.session.commit()

    return {
        'recommendation': rec.to_dict(),
        'roadmap': roadmap.to_dict(),
    }
