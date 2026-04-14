"""Holistic profile generator and analyzer"""
from app.models import Assessment, HolisticProfile, TestResult
from app import db


class ProfileAnalyzer:
    """Generate holistic career profile from multi-dimensional assessments"""
    
    def generate_holistic_profile(self, user_id):
        """Combine all assessments into holistic profile"""
        # Get all assessments
        assessments = Assessment.query.filter_by(user_id=user_id).all()
        
        test_result = TestResult.query.filter_by(user_id=user_id).order_by(TestResult.created_at.desc()).first()
        
        if not assessments and not test_result:
            return None
        
        # Organize by type
        profile_data = {}
        for assessment in assessments:
            profile_data[assessment.assessment_type] = assessment.scores
        
        # Get career recommendations from TestResult (already queried above)
        top_careers = []
        
        if test_result and test_result.recommendations:
            print(f"[ProfileAnalyzer] TestResult found: {test_result.recommendations}")
            
            # Extract careers from MCQ recommendations (these are simple strings)
            mcq_careers = test_result.recommendations.get('mcq_careers', [])
            ml_courses = test_result.recommendations.get('ml_courses', [])
            
            print(f"[ProfileAnalyzer] MCQ Careers: {mcq_careers}")
            print(f"[ProfileAnalyzer] ML Courses: {ml_courses}")
            
            # Process MCQ careers (simple strings like "Scientist", "Engineer")
            for career_name in mcq_careers:
                if isinstance(career_name, str) and career_name not in [c['name'] for c in top_careers]:
                    top_careers.append({
                        'name': career_name,
                        'match': 90,  # High match since it's from personality test
                        'salary': 'Varies'
                    })
            
            # Process ML courses (these have 'course' and 'confidence')
            for course in ml_courses:
                if isinstance(course, dict):
                    course_name = course.get('course', '')
                    if course_name and course_name not in [c['name'] for c in top_careers]:
                        top_careers.append({
                            'name': course_name,
                            'match': int(course.get('confidence', 85)),
                            'salary': 'Varies'
                        })
            
            # Limit to top 5
            top_careers = top_careers[:5]
            print(f"[ProfileAnalyzer] Final top_careers: {top_careers}")
        
        # Calculate clarity score
        clarity_score = self._calculate_clarity_score(profile_data)
        
        # Generate profile summary
        summary = self._generate_summary(profile_data)
        
        # Create or update holistic profile
        holistic = HolisticProfile.query.filter_by(user_id=user_id).first()
        
        # Include top_careers in profile_data
        complete_profile_data = {
            **profile_data,
            'summary': summary,
            'top_careers': top_careers,
            'topCareers': top_careers  # Both formats for compatibility
        }
        
        if holistic:
            holistic.profile_data = complete_profile_data
            holistic.clarity_score = clarity_score
        else:
            holistic = HolisticProfile(
                user_id=user_id,
                profile_data=complete_profile_data,
                clarity_score=clarity_score
            )
            db.session.add(holistic)
        
        db.session.commit()
        return holistic
    
    def _calculate_clarity_score(self, profile_data):
        """Calculate career clarity score (0-100)"""
        factors = []
        
        # Check if assessments are complete
        required_types = ['riasec', 'aptitude', 'personality', 'values', 'risk']
        completion = sum(1 for t in required_types if t in profile_data) / len(required_types)
        factors.append(completion * 30)  # 30% weight
        
        # Check score consistency (higher variance = lower clarity)
        if 'riasec' in profile_data:
            scores = list(profile_data['riasec'].values())
            variance = max(scores) - min(scores)
            consistency = min(variance / 12 * 100, 100)  # Normalize
            factors.append(consistency * 0.4)  # 40% weight
        
        # Check value alignment
        if 'values' in profile_data:
            top_values = sorted(profile_data['values'].items(), key=lambda x: x[1], reverse=True)[:2]
            if len(top_values) >= 2:
                alignment = (top_values[0][1] - top_values[1][1]) / 5 * 100
                factors.append(min(alignment, 30))  # 30% weight
        
        return min(sum(factors), 100)
    
    def _generate_summary(self, profile_data):
        """Generate text summary of profile"""
        summary_parts = []
        
        # RIASEC summary
        if 'riasec' in profile_data:
            dominant = max(profile_data['riasec'], key=profile_data['riasec'].get)
            riasec_map = {
                'R': 'practical and hands-on',
                'I': 'analytical and investigative',
                'A': 'creative and artistic',
                'S': 'helpful and people-oriented',
                'E': 'enterprising and leadership-focused',
                'C': 'organized and detail-oriented'
            }
            summary_parts.append(riasec_map.get(dominant, 'balanced'))
        
        # Values summary
        if 'values' in profile_data:
            top_value = max(profile_data['values'], key=profile_data['values'].get)
            summary_parts.append(f"values {top_value}")
        
        # Personality summary
        if 'personality' in profile_data:
            traits = profile_data['personality']
            if traits.get('openness', 0) > 70:
                summary_parts.append("open to new experiences")
            if traits.get('conscientiousness', 0) > 70:
                summary_parts.append("highly organized")
        
        return ", ".join(summary_parts) if summary_parts else "developing career profile"
    """Generate holistic career profile from multi-dimensional assessments"""
    
    def generate_holistic_profile(self, user_id):
        """Combine all assessments into holistic profile"""
        # Get all assessments
        assessments = Assessment.query.filter_by(user_id=user_id).all()
        
        if not assessments:
            return None
        
        # Organize by type
        profile_data = {}
        for assessment in assessments:
            profile_data[assessment.assessment_type] = assessment.scores
        
        # Get career recommendations from TestResult
        test_result = TestResult.query.filter_by(user_id=user_id).order_by(TestResult.created_at.desc()).first()
        top_careers = []
        
        if test_result and test_result.recommendations:
            print(f"[ProfileAnalyzer] TestResult found: {test_result.recommendations}")
            
            # Extract careers from MCQ recommendations (these are simple strings)
            mcq_careers = test_result.recommendations.get('mcq_careers', [])
            ml_courses = test_result.recommendations.get('ml_courses', [])
            
            print(f"[ProfileAnalyzer] MCQ Careers: {mcq_careers}")
            print(f"[ProfileAnalyzer] ML Courses: {ml_courses}")
            
            # Process MCQ careers (simple strings like "Scientist", "Engineer")
            for career_name in mcq_careers:
                if isinstance(career_name, str) and career_name not in [c['name'] for c in top_careers]:
                    top_careers.append({
                        'name': career_name,
                        'match': 90,  # High match since it's from personality test
                        'salary': 'Varies'
                    })
            
            # Process ML courses (these have 'course' and 'confidence')
            for course in ml_courses:
                if isinstance(course, dict):
                    course_name = course.get('course', '')
                    if course_name and course_name not in [c['name'] for c in top_careers]:
                        top_careers.append({
                            'name': course_name,
                            'match': int(course.get('confidence', 85)),
                            'salary': 'Varies'
                        })
            
            # Limit to top 5
            top_careers = top_careers[:5]
            print(f"[ProfileAnalyzer] Final top_careers: {top_careers}")
        
        # Calculate clarity score
        clarity_score = self._calculate_clarity_score(profile_data)
        
        # Generate profile summary
        summary = self._generate_summary(profile_data)
        
        # Create or update holistic profile
        holistic = HolisticProfile.query.filter_by(user_id=user_id).first()
        
        # Include top_careers in profile_data
        complete_profile_data = {
            **profile_data,
            'summary': summary,
            'top_careers': top_careers,
            'topCareers': top_careers  # Both formats for compatibility
        }
        
        if holistic:
            holistic.profile_data = complete_profile_data
            holistic.clarity_score = clarity_score
        else:
            holistic = HolisticProfile(
                user_id=user_id,
                profile_data=complete_profile_data,
                clarity_score=clarity_score
            )
            db.session.add(holistic)
        
        db.session.commit()
        return holistic
    
    def _calculate_clarity_score(self, profile_data):
        """Calculate career clarity score (0-100)"""
        factors = []
        
        # Check if assessments are complete
        required_types = ['riasec', 'aptitude', 'personality', 'values', 'risk']
        completion = sum(1 for t in required_types if t in profile_data) / len(required_types)
        factors.append(completion * 30)  # 30% weight
        
        # Check score consistency (higher variance = lower clarity)
        if 'riasec' in profile_data:
            scores = list(profile_data['riasec'].values())
            variance = max(scores) - min(scores)
            consistency = min(variance / 12 * 100, 100)  # Normalize
            factors.append(consistency * 0.4)  # 40% weight
        
        # Check value alignment
        if 'values' in profile_data:
            top_values = sorted(profile_data['values'].items(), key=lambda x: x[1], reverse=True)[:2]
            if len(top_values) >= 2:
                alignment = (top_values[0][1] - top_values[1][1]) / 5 * 100
                factors.append(min(alignment, 30))  # 30% weight
        
        return min(sum(factors), 100)
    
    def _generate_summary(self, profile_data):
        """Generate text summary of profile"""
        summary_parts = []
        
        # RIASEC summary
        if 'riasec' in profile_data:
            dominant = max(profile_data['riasec'], key=profile_data['riasec'].get)
            riasec_map = {
                'R': 'practical and hands-on',
                'I': 'analytical and investigative',
                'A': 'creative and artistic',
                'S': 'helpful and people-oriented',
                'E': 'enterprising and leadership-focused',
                'C': 'organized and detail-oriented'
            }
            summary_parts.append(riasec_map.get(dominant, 'balanced'))
        
        # Values summary
        if 'values' in profile_data:
            top_value = max(profile_data['values'], key=profile_data['values'].get)
            summary_parts.append(f"values {top_value}")
        
        # Personality summary
        if 'personality' in profile_data:
            traits = profile_data['personality']
            if traits.get('openness', 0) > 70:
                summary_parts.append("open to new experiences")
            if traits.get('conscientiousness', 0) > 70:
                summary_parts.append("highly organized")
        
        return ", ".join(summary_parts) if summary_parts else "developing career profile"


# Career confidence and risk analyzer
class CareerAnalyzer:
    """Analyze career fit, confidence, and risk"""
    
    def calculate_career_confidence(self, profile_data, career):
        """Calculate confidence score for a career"""
        factors = {}
        
        # Interest match (25%)
        if 'riasec' in profile_data:
            interest_match = self._calculate_interest_match(profile_data['riasec'], career)
            factors['interest_match'] = interest_match * 0.25
        
        # Aptitude match (25%)
        if 'aptitude' in profile_data:
            aptitude_match = self._calculate_aptitude_match(profile_data['aptitude'], career)
            factors['aptitude_match'] = aptitude_match * 0.25
        
        # Personality fit (20%)
        if 'personality' in profile_data:
            personality_fit = self._calculate_personality_fit(profile_data['personality'], career)
            factors['personality_fit'] = personality_fit * 0.20
        
        # Values alignment (15%)
        if 'values' in profile_data:
            values_alignment = self._calculate_values_alignment(profile_data['values'], career)
            factors['values_alignment'] = values_alignment * 0.15
        
        # Market demand (15%)
        market_demand = self._get_market_demand(career)
        factors['market_demand'] = market_demand * 0.15
        
        total_confidence = sum(factors.values())
        
        return {
            'score': round(total_confidence, 2),
            'level': self._get_confidence_level(total_confidence),
            'breakdown': {k: round(v / sum([0.25, 0.25, 0.20, 0.15, 0.15][i] for i, _ in enumerate(factors)) * 100, 2) 
                         for i, (k, v) in enumerate(factors.items())},
            'explanation': self._generate_confidence_explanation(factors, total_confidence)
        }
    
    def calculate_career_risk(self, profile_data, career):
        """Calculate risk score for a career"""
        risks = []
        
        # Skill gap risk
        if 'aptitude' in profile_data:
            skill_gap = self._calculate_skill_gap(profile_data['aptitude'], career)
            if skill_gap > 30:
                risks.append({
                    'type': 'skill_gap',
                    'severity': skill_gap / 100,
                    'description': f'Significant skill development needed',
                    'mitigation': 'Take online courses, practice projects'
                })
        
        # Interest-reality gap
        if 'riasec' in profile_data and 'values' in profile_data:
            reality_gap = self._check_reality_gap(profile_data, career)
            if reality_gap > 0.5:
                risks.append({
                    'type': 'reality_gap',
                    'severity': reality_gap,
                    'description': 'Career expectations may not match reality',
                    'mitigation': 'Research day-to-day tasks, talk to professionals'
                })
        
        overall_risk = sum(r['severity'] for r in risks) / max(len(risks), 1) * 100
        
        return {
            'overall_risk': round(overall_risk, 2),
            'level': self._get_risk_level(overall_risk),
            'factors': risks
        }
    
    def _calculate_interest_match(self, riasec_scores, career):
        """Calculate how well interests match career"""
        # Career-RIASEC mapping (simplified)
        career_profiles = {
            'Software Engineer': {'I': 0.4, 'R': 0.3, 'C': 0.3},
            'Data Scientist': {'I': 0.5, 'C': 0.3, 'R': 0.2},
            'UX Designer': {'A': 0.5, 'I': 0.3, 'E': 0.2},
            'Teacher': {'S': 0.5, 'A': 0.3, 'I': 0.2},
            # Add more careers...
        }
        
        profile = career_profiles.get(career, {'R': 0.2, 'I': 0.2, 'A': 0.2, 'S': 0.2, 'E': 0.1, 'C': 0.1})
        
        # Calculate weighted match
        match = sum(riasec_scores.get(code, 0) / 12 * weight * 100 
                   for code, weight in profile.items())
        
        return min(match, 100)
    
    def _calculate_aptitude_match(self, aptitude_scores, career):
        """Calculate aptitude alignment"""
        # Simplified - return average aptitude
        return sum(aptitude_scores.values()) / len(aptitude_scores) if aptitude_scores else 50
    
    def _calculate_personality_fit(self, personality_scores, career):
        """Calculate personality fit"""
        # Simplified - return average
        return sum(personality_scores.values()) / len(personality_scores) if personality_scores else 50
    
    def _calculate_values_alignment(self, values_scores, career):
        """Calculate values alignment"""
        return sum(values_scores.values()) / len(values_scores) * 20 if values_scores else 50
    
    def _get_market_demand(self, career):
        """Get market demand score"""
        # Simplified - high demand careers
        high_demand = ['Software Engineer', 'Data Scientist', 'Product Manager', 'UX Designer']
        return 85 if career in high_demand else 60
    
    def _calculate_skill_gap(self, aptitude_scores, career):
        """Calculate skill gap percentage"""
        # Simplified
        avg_aptitude = sum(aptitude_scores.values()) / len(aptitude_scores)
        return max(0, 80 - avg_aptitude)
    
    def _check_reality_gap(self, profile_data, career):
        """Check if expectations match reality"""
        # Simplified
        return 0.3  # 30% gap
    
    def _get_confidence_level(self, score):
        if score >= 75:
            return 'High'
        elif score >= 50:
            return 'Medium'
        return 'Low'
    
    def _get_risk_level(self, score):
        if score >= 60:
            return 'High'
        elif score >= 30:
            return 'Medium'
        return 'Low'
    
    def _generate_confidence_explanation(self, factors, total):
        if total >= 75:
            return "Strong alignment across all dimensions"
        elif total >= 50:
            return "Good fit with some areas for development"
        return "Consider exploring other options or building foundational skills"

