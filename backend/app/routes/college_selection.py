"""
COLLEGE SKELETON ROUTES
Handles degree, branch, and year selection
Routes students to appropriate flow
"""

from flask import Blueprint, request, jsonify
from app.data.college_selection import DEGREES, COLLEGE_YEARS, YEAR_TO_STAGE

college_skeleton_bp = Blueprint('college_skeleton', __name__)

@college_skeleton_bp.route('/degrees', methods=['GET'])
def get_degrees():
    """Get all available degrees with branches"""
    try:
        data = {
            "degrees": [
                {
                    "code": code,
                    "name": degree["name"],
                    "branches": degree["branches"]
                }
                for code, degree in DEGREES.items()
            ]
        }
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@college_skeleton_bp.route('/years', methods=['GET'])
def get_years():
    """Get all available college years"""
    try:
        data = {
            "years": [
                {
                    "code": code,
                    "display": year["display"],
                    "stage": year["stage"],
                    "description": year["description"],
                    "route": year["route"],
                    "focus": year["focus"]
                }
                for code, year in COLLEGE_YEARS.items()
            ]
        }
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@college_skeleton_bp.route('/validate-selection', methods=['POST'])
def validate_selection():
    """Validate degree, branch, year selection and return routing info"""
    try:
        data = request.get_json()
        
        degree_code = data.get('degree')
        branch = data.get('branch')
        year_code = data.get('year')
        
        # Validate degree
        if degree_code not in DEGREES:
            return jsonify({"error": "Invalid degree selected"}), 400
        
        # Validate branch
        if branch not in DEGREES[degree_code]['branches']:
            return jsonify({"error": "Invalid branch for selected degree"}), 400
        
        # Validate year
        if year_code not in COLLEGE_YEARS:
            return jsonify({"error": "Invalid year selected"}), 400
        
        # Get routing info
        year_info = COLLEGE_YEARS[year_code]
        stage = YEAR_TO_STAGE[year_code]
        
        response = {
            "valid": True,
            "degree": {
                "code": degree_code,
                "name": DEGREES[degree_code]["name"]
            },
            "branch": branch,
            "year": {
                "code": year_code,
                "display": year_info["display"],
                "stage": stage
            },
            "route": year_info["route"],
            "message": f"Selection confirmed: {DEGREES[degree_code]['name']} - {branch} - {year_info['display']}"
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({"error": str(e), "traceback": str(e)}), 500
