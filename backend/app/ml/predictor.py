import joblib
import numpy as np
import os

class MLPredictor:
    def __init__(self):
        # Get the directory of this file
        base_dir = os.path.dirname(os.path.abspath(__file__))
        self.models_dir = os.path.join(base_dir, 'models')
        
        # Lazy load models - don't load until needed
        self._rf_model = None
        self._selector = None
        self._label_encoder = None
        self._feature_columns = None
        
        # Personality to career mapping
        self.personality_careers = {
            "R": ["Carpenter", "Mechanic", "Electrician", "Engineer", "Technician"],
            "I": ["Scientist", "Engineer", "Researcher", "Analyst", "Doctor"],
            "A": ["Artist", "Writer", "Designer", "Musician", "Architect"],
            "S": ["Teacher", "Counselor", "Nurse", "Social Worker", "Therapist"],
            "E": ["Entrepreneur", "Manager", "Salesperson", "Lawyer", "Business"],
            "C": ["Accountant", "Analyst", "Banker", "Administrator", "Clerk"]
        }
    
    @property
    def rf_model(self):
        if self._rf_model is None:
            try:
                self._rf_model = joblib.load(os.path.join(self.models_dir, 'rf_model.pkl'))
            except Exception as e:
                print(f"Warning: Could not load RF model: {e}")
                return None
        return self._rf_model
    
    @property
    def selector(self):
        if self._selector is None:
            try:
                self._selector = joblib.load(os.path.join(self.models_dir, 'selector.pkl'))
            except Exception as e:
                print(f"Warning: Could not load selector: {e}")
                return None
        return self._selector
    
    @property
    def label_encoder(self):
        if self._label_encoder is None:
            try:
                self._label_encoder = joblib.load(os.path.join(self.models_dir, 'label_encoder.pkl'))
            except Exception as e:
                print(f"Warning: Could not load label encoder: {e}")
                return None
        return self._label_encoder
    
    @property
    def feature_columns(self):
        if self._feature_columns is None:
            try:
                self._feature_columns = joblib.load(os.path.join(self.models_dir, 'feature_columns.pkl'))
            except Exception as e:
                print(f"Warning: Could not load feature columns: {e}")
                return None
        return self._feature_columns
    
    def predict_courses(self, personality_type):
        """
        Predict courses based on personality type
        Returns: List of (course_name, confidence) tuples
        """
        # Create random student feature vector (same shape expected by selector)
        student = np.random.randint(0, 2, size=(1, len(self.feature_columns)))
        
        # Apply feature selection
        student_selected = self.selector.transform(student)
        
        # Get predictions
        probabilities = self.rf_model.predict_proba(student_selected)[0]
        courses = self.label_encoder.inverse_transform(self.rf_model.classes_)
        
        # Get careers for this personality type
        mcq_careers = self.personality_careers.get(personality_type, [])
        
        # Filter courses based on personality careers
        filtered_results = []
        for course, prob in zip(courses, probabilities):
            for career in mcq_careers:
                if career.lower() in course.lower():
                    filtered_results.append((course, float(prob)))
                    break
        
        # If no matches, return top 5 predictions
        if not filtered_results:
            results = list(zip(courses, probabilities))
            results.sort(key=lambda x: x[1], reverse=True)
            filtered_results = [(course, float(prob)) for course, prob in results[:5]]
        else:
            # Sort by probability
            filtered_results.sort(key=lambda x: x[1], reverse=True)
            filtered_results = filtered_results[:5]
        
        return filtered_results
    
    def get_personality_info(self, personality_type):
        """Get personality information"""
        personality_info = {
            "R": {
                "name": "Realistic",
                "description": "Practical and hands-on individuals who enjoy working with tools and machines.",
                "careers": self.personality_careers["R"]
            },
            "I": {
                "name": "Investigative",
                "description": "Analytical individuals who enjoy solving complex problems and conducting research.",
                "careers": self.personality_careers["I"]
            },
            "A": {
                "name": "Artistic",
                "description": "Creative individuals who enjoy expressing themselves through various art forms.",
                "careers": self.personality_careers["A"]
            },
            "S": {
                "name": "Social",
                "description": "Helpful individuals who enjoy working with and helping people.",
                "careers": self.personality_careers["S"]
            },
            "E": {
                "name": "Enterprising",
                "description": "Leadership-oriented individuals who enjoy influencing and persuading others.",
                "careers": self.personality_careers["E"]
            },
            "C": {
                "name": "Conventional",
                "description": "Organized individuals who enjoy structured tasks and working with data.",
                "careers": self.personality_careers["C"]
            }
        }
        
        return personality_info.get(personality_type, {})

# Create singleton instance
predictor = MLPredictor()
