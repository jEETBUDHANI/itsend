"""Class 10 Assessment Engine - Stream Selection and Career Guidance"""
import json
from typing import Dict, List, Tuple
from app.data.class10_questions import (
    CLASS10_BASE_QUESTIONS,
    CLASS10_SCIENCE_LAYER2,
    CLASS10_COMMERCE_LAYER2,
    CLASS10_ARTS_LAYER2,
    STREAM_PREDICTION_RULES,
    CLASS10_CAREER_CLUSTERS,
)


class Class10AssessmentEngine:
    """
    Two-layer assessment engine for Class 10 students:
    Layer 1: Base assessment → Stream prediction (decision node)
    Layer 2: Stream-specific assessment → Career clusters + Roadmap
    """
    
    def __init__(self):
        self.BASE_QUESTIONS = CLASS10_BASE_QUESTIONS
        self.STREAM_RULES = STREAM_PREDICTION_RULES
        self.CAREER_CLUSTERS = CLASS10_CAREER_CLUSTERS
    
    # ===== LAYER 1: BASE ASSESSMENT =====
    
    def get_base_questions(self) -> List[Dict]:
        """Return all base assessment questions for Class 10 Layer 1"""
        return self.BASE_QUESTIONS
    
    def process_base_assessment(self, answers: Dict) -> Dict:
        """
        Process Layer 1 responses and predict stream.
        
        Args:
            answers: {
                "1": ["Physics", "Chemistry", "Mathematics"],  # interests
                "2": ["Solving problems", "Experiments"],
                ...
                "6": 4,  # personality scale
                ...
            }
        
        Returns:
            {
                "stream_prediction": "science",  # or "commerce" or "arts"
                "stream_confidence": 0.85,
                "prediction_details": {...},
                "next_step": "layer2_assessment",
                "predicted_specialization": "PCM" or "PCB" (for science)
            }
        """
        # Calculate stream scores
        stream_scores = self._calculate_stream_scores(answers)
        
        # Predict stream with confidence
        predicted_stream = max(stream_scores, key=stream_scores.get)
        max_score = stream_scores[predicted_stream]
        total_score = sum(stream_scores.values())
        confidence = max_score / total_score if total_score > 0 else 0
        
        # Predict specialization (for Science)
        specialization = None
        if predicted_stream == "science":
            specialization = self._predict_science_specialization(answers)
        
        return {
            "stream_prediction": predicted_stream,
            "stream_confidence": round(confidence, 2),
            "stream_scores": stream_scores,
            "prediction_details": {
                "description": self.STREAM_RULES[predicted_stream]["description"],
                "career_matches": self.STREAM_RULES[predicted_stream]["career_matches"],
            },
            "predicted_specialization": specialization,
            "next_step": "layer2_assessment",
            "layer1_complete": True
        }
    
    def _calculate_stream_scores(self, answers: Dict) -> Dict[str, float]:
        """Calculate affinity scores for each stream based on answers"""
        scores = {"science": 0, "commerce": 0, "arts": 0}
        
        # Question 1: Subject interests (ID 1)
        if "1" in answers:
            subjects = answers["1"] if isinstance(answers["1"], list) else [answers["1"]]
            science_subjects = {"Physics", "Chemistry", "Biology", "Mathematics"}
            commerce_subjects = {"Economics", "Mathematics"}
            arts_subjects = {"English", "History", "Geography"}
            
            scores["science"] += len([s for s in subjects if s in science_subjects]) * 2
            scores["commerce"] += len([s for s in subjects if s in commerce_subjects]) * 2
            scores["arts"] += len([s for s in subjects if s in arts_subjects]) * 2
        
        # Question 2: Activity types (ID 2)
        if "2" in answers:
            activities = answers["2"] if isinstance(answers["2"], list) else [answers["2"]]
            scores["science"] += len([a for a in activities if a in ["Solving problems", "Experiments", "Building things"]]) * 1.5
            scores["commerce"] += len([a for a in activities if a in ["Analyzing data", "Leadership"]]) * 1.5
            scores["arts"] += len([a for a in activities if a in ["Reading", "Writing", "Discussions"]]) * 1.5
        
        # Question 3: Strength (ID 3)
        if "3" in answers:
            strength = answers["3"]
            if strength == "Problem-solving":
                scores["science"] += 2
                scores["commerce"] += 1
            elif strength == "Creative thinking":
                scores["arts"] += 2
            elif strength == "Communication":
                scores["arts"] += 2
            elif strength == "Critical analysis":
                scores["commerce"] += 2
                scores["science"] += 1
        
        # Question 4: Career interests (ID 4)
        if "4" in answers:
            careers = answers["4"] if isinstance(answers["4"], list) else [answers["4"]]
            science_careers = ["Technology/IT", "Engineering", "Medicine/Healthcare"]
            commerce_careers = ["Business/Finance", "Government/Administration"]
            arts_careers = ["Law", "Arts/Media", "Teaching", "Government/Administration"]
            
            scores["science"] += len([c for c in careers if c in science_careers]) * 2.5
            scores["commerce"] += len([c for c in careers if c in commerce_careers]) * 2.5
            scores["arts"] += len([c for c in careers if c in arts_careers]) * 2.5
        
        # Question 5: Learning preference (ID 5)
        if "5" in answers:
            pref = answers["5"]
            if pref == "Through experiments and hands-on":
                scores["science"] += 1.5
            elif pref == "Through case studies and analysis":
                scores["commerce"] += 1.5
            elif pref == "Through discussion and theory":
                scores["arts"] += 1.5
        
        # Personality traits boost (Q 6-10)
        # These are scale-based, use lower weight
        if "6" in answers:  # Openness
            scores["science"] += answers["6"] * 0.3
            scores["arts"] += answers["6"] * 0.2
        
        if "8" in answers:  # Extraversion
            scores["commerce"] += answers["8"] * 0.3
            scores["arts"] += answers["8"] * 0.2
        
        if "7" in answers:  # Conscientiousness
            scores["science"] += answers["7"] * 0.2
            scores["commerce"] += answers["7"] * 0.3
        
        # Normalize
        max_score = max(scores.values()) if max(scores.values()) > 0 else 1
        return {k: round(v / max_score * 100, 1) for k, v in scores.items()}
    
    def _predict_science_specialization(self, answers: Dict) -> str:
        """Predict PCM or PCB for science students"""
        pcm_score = 0
        pcb_score = 0
        
        # Check interest in Math (PCM indicator)
        if "1" in answers:
            subjects = answers["1"] if isinstance(answers["1"], list) else [answers["1"]]
            if "Mathematics" in subjects:
                pcm_score += 2
            if "Biology" in subjects:
                pcb_score += 2
        
        # Check career interests
        if "4" in answers:
            careers = answers["4"] if isinstance(answers["4"], list) else [answers["4"]]
            if "Engineering" in careers or "Technology/IT" in careers:
                pcm_score += 2
            if "Medicine/Healthcare" in careers:
                pcb_score += 2
        
        return "PCM" if pcm_score >= pcb_score else "PCB" if pcb_score > pcm_score else "PCM"
    
    # ===== LAYER 2: STREAM-SPECIFIC ASSESSMENT =====
    
    def get_layer2_questions(self, stream: str) -> List[Dict]:
        """Get Layer 2 questions based on predicted stream"""
        if stream == "science":
            return CLASS10_SCIENCE_LAYER2
        elif stream == "commerce":
            return CLASS10_COMMERCE_LAYER2
        elif stream == "arts":
            return CLASS10_ARTS_LAYER2
        return []
    
    def process_layer2_assessment(
        self, 
        stream: str, 
        specialization: str,
        layer1_results: Dict,
        layer2_answers: Dict
    ) -> Dict:
        """
        Process Layer 2 responses and generate recommendations.
        
        Args:
            stream: "science", "commerce", or "arts"
            specialization: For science: "PCM" or "PCB"
            layer1_results: Results from Layer 1
            layer2_answers: Responses to Layer 2 questions
        
        Returns:
            {
                "stream": "science",
                "specialization": "PCM",
                "career_clusters": [...],
                "recommended_careers": [...],
                "next_steps": [...],
                "roadmap": {...}
            }
        """
        # Calculate layer 2 scores
        layer2_scores = self._calculate_layer2_scores(stream, layer2_answers)
        
        # Get career recommendations
        career_clusters = self._get_career_recommendations(stream, specialization)
        
        # Generate roadmap
        roadmap = self._generate_class10_roadmap(stream, specialization, layer2_scores)
        
        # Prepare summary
        return {
            "stream": stream,
            "specialization": specialization,
            "layer1_scores": layer1_results.get("stream_scores", {}),
            "layer2_scores": layer2_scores,
            "career_clusters": career_clusters,
            "recommended_careers": career_clusters[:3],  # Top 3
            "why_this_stream": self._generate_why_explanation(stream, specialization, layer1_results, layer2_scores),
            "roadmap": roadmap,
            "next_step": "show_results",
            "assessment_complete": True
        }
    
    def _calculate_layer2_scores(self, stream: str, answers: Dict) -> Dict:
        """Calculate strength areas in Layer 2"""
        scores = {}
        
        if stream == "science":
            questions = {q["id"]: q for q in CLASS10_SCIENCE_LAYER2}
        elif stream == "commerce":
            questions = {q["id"]: q for q in CLASS10_COMMERCE_LAYER2}
        else:  # arts
            questions = {q["id"]: q for q in CLASS10_ARTS_LAYER2}
        
        for q_id, answer in answers.items():
            if int(q_id) in questions:
                q = questions[int(q_id)]
                weight = q.get("weight", 0.2)
                category = q.get("category", "general")
                
                # Normalize answer to 0-5 scale
                if isinstance(answer, int):
                    norm_answer = answer
                else:
                    norm_answer = 3  # Default middle for choice answers
                
                if category not in scores:
                    scores[category] = []
                scores[category].append(norm_answer * weight)
        
        # Average by category
        return {cat: round(sum(vals) / len(vals), 1) for cat, vals in scores.items()}
    
    def _get_career_recommendations(self, stream: str, specialization: str = None) -> List[Dict]:
        """Get recommended careers for the stream"""
        if stream == "science":
            cluster_key = specialization if specialization in ["PCM", "PCB"] else "PCM"
            return self.CAREER_CLUSTERS["science"].get(cluster_key, [])
        elif stream == "commerce":
            return self.CAREER_CLUSTERS["commerce"]["all"]
        else:  # arts
            return self.CAREER_CLUSTERS["arts"]["all"]
    
    def _generate_why_explanation(
        self, 
        stream: str, 
        specialization: str,
        layer1_results: Dict,
        layer2_scores: Dict
    ) -> str:
        """Generate explanation for why this stream was recommended"""
        confidence = layer1_results.get("stream_confidence", 0.7)
        
        if stream == "science":
            spec_text = f"{specialization} stream specifically"
            return (
                f"Based on your strong interest in {spec_text}, high scores in analytical thinking, "
                f"and career goals aligned with technology or healthcare, Science is the ideal choice. "
                f"Confidence: {int(confidence * 100)}%"
            )
        elif stream == "commerce":
            return (
                f"Your numerical aptitude, interest in business topics, and career goals in finance "
                f"or entrepreneurship make Commerce the perfect fit. Confidence: {int(confidence * 100)}%"
            )
        else:  # arts
            return (
                f"Your communication skills, analytical thinking for reasoning, and interest in law "
                f"or government make Arts an excellent choice. Confidence: {int(confidence * 100)}%"
            )
    
    def _generate_class10_roadmap(self, stream: str, specialization: str, scores: Dict) -> Dict:
        """Generate personalized roadmap for Class 11-12"""
        
        roadmap_items = []
        
        # Subject preparation focus
        if stream == "science":
            subjects = ["Physics", "Chemistry", specialization.replace("P", "").replace("M", "")]
            if specialization == "PCM":
                subjects = ["Physics", "Chemistry", "Mathematics"]
            else:
                subjects = ["Physics", "Chemistry", "Biology"]
        elif stream == "commerce":
            subjects = ["Accounting", "Economics", "Business Studies"]
        else:  # arts
            subjects = ["English", "History", "Geography / Economics"]
        
        roadmap_items.append({
            "phase": "Class 11 - Foundation",
            "duration": "12 months",
            "key_activities": [
                f"Master core {stream} subjects: {', '.join(subjects)}",
                "Build strong fundamentals in each subject",
                "Participate in subject-based projects",
                "Attend coaching if needed for competitive exams"
            ],
            "skills_to_develop": ["Subject mastery", "Time management", "Problem-solving"],
            "milestones": ["Complete Class 11 curriculum", "Score above 85% in Class 11"]
        })
        
        roadmap_items.append({
            "phase": "Class 12 - Intensive Preparation",
            "duration": "12 months",
            "key_activities": [
                "Complete Class 12 curriculum",
                f"Prepare for entrance exams (JEE/NEET/CUET)" if stream == "science" else "Prepare for competitive exams (CA/CS/Government)",
                "Solve practice papers and mock tests",
                "Strengthen weak areas"
            ],
            "skills_to_develop": ["Exam strategy", "Time management", "Stress management"],
            "milestones": ["Score above 90% in Class 12", "Qualify entrance exam if applicable"]
        })
        
        roadmap_items.append({
            "phase": "Beyond Class 12 - Career Path",
            "duration": "Ongoing",
            "key_activities": [
                "Explore specialization options in chosen field",
                "Gain internship/practical experience",
                "Participate in competitions and projects",
                "Network with professionals in field"
            ],
            "skills_to_develop": ["Leadership", "Communication", "Technical depth"],
            "milestones": ["Get admission to desired college", "Start internship in field"]
        })
        
        return {
            "stream": stream,
            "specialization": specialization,
            "total_duration": "24+ months",
            "phases": roadmap_items,
            "exam_preparation": stream == "science",  # Boolean indicating exam focus
            "target_score": 90  # Minimum target percentage
        }


def create_class10_engine() -> Class10AssessmentEngine:
    """Factory function to create assessment engine"""
    return Class10AssessmentEngine()
