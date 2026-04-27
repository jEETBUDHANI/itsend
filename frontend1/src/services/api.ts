import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}`;

const isTokenExpired = (token: string) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    );

    if (!payload?.exp) {
      return false;
    }

    return payload.exp * 1000 <= Date.now();
  } catch {
    return false;
  }
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      if (isTokenExpired(token)) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(new axios.Cancel('Expired token cleared before request'));
      }

      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url ?? '';
    const isAuthRequest = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/signup');

    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  signup: async (data: { email: string; password: string; full_name: string }) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  verify: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
};

// Prediction API
export const predictionApi = {
  submitTest: async (scores: Record<string, number>) => {
    const response = await api.post('/predict/test', { scores });
    return response.data;
  },

  getResults: async () => {
    const response = await api.get('/predict/results');
    return response.data;
  },

  getResultById: async (id: string) => {
    const response = await api.get(`/predict/results/${id}`);
    return response.data;
  },
};

// User API
export const userApi = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProfile: async (data: {
    full_name?: string;
    degree?: string;
    branch?: string;
    skills?: string[];
    career_interests?: string[];
    graduation_year?: number;
    university?: string;
    gpa?: number;
  }) => {
    const response = await api.put('/user/profile', data);
    return response.data;
  },

  completeOnboarding: async (data: {
    education_level?: string;
    education_module?: 'class10' | 'class12' | 'college';
    stream?: string;
    career_interests?: string[];
    degree?: string;
    specialization?: string;
    current_year?: string;
  }) => {
    const response = await api.post('/user/complete-onboarding', data);
    return response.data;
  },
};

export const assessmentApi = {
  getHolisticProfile: async () => {
    const response = await api.get('/assessment/holistic');
    return response.data;
  },

  getAssessmentContext: async (careerName: string) => {
    const response = await api.get(`/assessment/context/${encodeURIComponent(careerName)}`);
    return response.data;
  },

  getSkillGaps: async (careerName: string) => {
    const response = await api.get(`/assessment/skill-gaps/${encodeURIComponent(careerName)}`);
    return response.data;
  },
};

export const modulesApi = {
  getCatalog: async () => {
    const response = await api.get('/modules/catalog');
    return response.data;
  },

  selectModule: async (module: 'class10' | 'class12' | 'college') => {
    const response = await api.post('/modules/select', { module });
    return response.data;
  },

  getDashboard: async () => {
    const response = await api.get('/modules/dashboard');
    return response.data;
  },

  submitAssessment: async (assessmentKey: string, payload: { inputs: Record<string, number> }) => {
    const response = await api.post(`/modules/assessments/${assessmentKey}`, payload);
    return response.data;
  },

  getRecommendation: async () => {
    const response = await api.get('/modules/recommendation');
    return response.data;
  },

  getRoadmap: async () => {
    const response = await api.get('/modules/roadmap');
    return response.data;
  },

  generateOutputs: async () => {
    const response = await api.post('/modules/generate', {});
    return response.data;
  },
};

export const class12Api = {
  submitAssessment: async (payload: Record<string, any>) => {
    const response = await api.post('/class12/submit/assessment', payload);
    return response.data;
  },

  getResults: async () => {
    const response = await api.get('/class12/results');
    return response.data;
  },
};

export const collegeApi = {
  submitAssessment: async (payload: Record<string, any>) => {
    const response = await api.post('/college/submit/assessment', payload);
    return response.data;
  },

  getResults: async () => {
    const response = await api.get('/college/results');
    return response.data;
  },
};

// Career Paths API
export const careersApi = {
  getPaths: async () => {
    const response = await api.get('/careers/paths');
    return response.data;
  },

  getPath: async (id: number) => {
    const response = await api.get(`/careers/paths/${id}`);
    return response.data;
  },

  getExams: async () => {
    const response = await api.get('/careers/exams');
    return response.data;
  },

  getJobs: async (filters?: { career_path_id?: number; min_salary?: number; max_salary?: number }) => {
    const response = await api.get('/careers/jobs', { params: filters });
    return response.data;
  },

  getJobDetails: async (id: number) => {
    const response = await api.get(`/careers/jobs/${id}`);
    return response.data;
  },
};

// Roadmaps API
export const roadmapsApi = {
  getRoadmap: async () => {
    const response = await api.get('/roadmaps/');
    return response.data;
  },

  generateRoadmap: async (data: {
    stage?: string;
    academic_stage?: string;
    current_stream?: string;
    class_grade?: string;
    target_exams?: string[];
  }) => {
    const response = await api.post('/roadmaps/generate', data);
    return response.data;
  },

  updateStage: async (data: {
    academic_stage?: string;
    current_stream?: string;
    class_grade?: string;
    target_exams?: string[];
  }) => {
    const response = await api.put('/roadmaps/update-stage', data);
    return response.data;
  },
};

// Chatbot API
export const chatbotApi = {
  ask: async (question: string) => {
    const response = await api.post('/chatbot/ask', { question });
    return response.data;
  },

  getSuggestedQuestions: async () => {
    const response = await api.get('/chatbot/suggested-questions');
    return response.data;
  },
};

// Graduate Features API
export const graduateApi = {
  // Career Comparison
  compareCareers: async (data: {
    selected_careers: string[];
    user_skills?: string[];
    preferences?: Record<string, any>;
  }) => {
    const response = await api.post('/graduate/compare-careers', data);
    return response.data;
  },

  getComparisonResults: async (id: string) => {
    const response = await api.get(`/graduate/compare-careers/${id}`);
    return response.data;
  },

  // Job Readiness
  calculateJobReadiness: async (data: {
    career_id: string;
    skills?: string[];
    experience?: number;
    certifications?: string[];
  }) => {
    const response = await api.post('/graduate/job-readiness', data);
    return response.data;
  },

  getJobReadinessScore: async (id: string) => {
    const response = await api.get(`/graduate/job-readiness/${id}`);
    return response.data;
  },

  // Action Plans
  generateActionPlan: async (data: {
    career_id: string;
    timeline_months?: number;
    current_level?: string;
    goals?: string[];
  }) => {
    const response = await api.post('/graduate/action-plans', data);
    return response.data;
  },

  getActionPlan: async (id: string) => {
    const response = await api.get(`/graduate/action-plans/${id}`);
    return response.data;
  },

  // Career Switching
  simulateCareerSwitch: async (data: {
    from_career: string;
    to_career: string;
    current_skills?: string[];
  }) => {
    const response = await api.post('/graduate/career-switch', data);
    return response.data;
  },

  // Career Paths
  getCareerPaths: async () => {
    const response = await api.get('/graduate/career-paths');
    return response.data;
  },
};

export default api;
