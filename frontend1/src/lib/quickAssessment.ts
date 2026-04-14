export type QuestionCategory = "interest" | "strength" | "work_style" | "constraint";

export type AssessmentOption = {
  id: string;
  label: string;
  tags?: string[];
};

export type AssessmentQuestion = {
  id: string;
  category: QuestionCategory;
  prompt: string;
  options: AssessmentOption[];
};

export type CareerProfile = {
  id: string;
  name: string;
  description: string;
  tags: string[];
};

export type QuickAssessmentResult = {
  completed: boolean;
  completedAt: string;
  answers: Record<string, string>;
  topCareer: { name: string; score: number } | null;
  personalizedCareers: Array<{ name: string; score: number }>;
  otherCareers: Array<{ name: string; score: number }>;
  mentorUnlocked: boolean;
  sections: {
    personalized: boolean;
    general: boolean;
  };
};

export const CAREER_PROFILES: CareerProfile[] = [
  { id: "software-engineer", name: "Software Engineer", description: "Build software solutions.", tags: ["build", "tech", "logic", "independent", "remote", "high_salary"] },
  { id: "data-scientist", name: "Data Scientist", description: "Analyze data for insights.", tags: ["analyze", "data", "research", "hybrid", "high_salary"] },
  { id: "ux-designer", name: "UX Designer", description: "Design user experiences.", tags: ["design", "creative", "user", "collaborative", "hybrid"] },
  { id: "product-manager", name: "Product Manager", description: "Lead product development.", tags: ["lead", "business", "collaborative", "hybrid", "high_salary"] },
  { id: "investment-banker", name: "Investment Banker", description: "Manage financial assets.", tags: ["finance", "analyze", "onsite", "high_salary", "fast_pace"] },
  { id: "doctor", name: "Doctor", description: "Diagnose and treat patients.", tags: ["healthcare", "helping", "onsite", "structured", "high_salary"] },
  { id: "scientist", name: "Scientist", description: "Conduct scientific research.", tags: ["research", "analyze", "structured", "onsite"] },
  { id: "accountant", name: "Accountant", description: "Manage financial records.", tags: ["finance", "structured", "hybrid", "mid_salary"] },
  { id: "teacher", name: "Teacher", description: "Educate and mentor students.", tags: ["teaching", "helping", "onsite", "collaborative", "low_salary"] },
];

export const QUICK_ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: "q1",
    category: "interest",
    prompt: "Which type of work excites you most?",
    options: [
      { id: "q1_build", label: "Building apps and tools", tags: ["build", "tech"] },
      { id: "q1_data", label: "Analyzing trends and data", tags: ["analyze", "data"] },
      { id: "q1_design", label: "Designing user experiences", tags: ["design", "creative"] },
      { id: "q1_help", label: "Helping people directly", tags: ["helping", "healthcare", "teaching"] },
    ],
  },
  {
    id: "q2",
    category: "interest",
    prompt: "Which subject area do you enjoy the most?",
    options: [
      { id: "q2_cs", label: "Computer Science", tags: ["tech", "logic"] },
      { id: "q2_math", label: "Math and Statistics", tags: ["data", "analyze", "research"] },
      { id: "q2_business", label: "Business and Finance", tags: ["business", "finance", "lead"] },
      { id: "q2_social", label: "Social Sciences / Education", tags: ["teaching", "helping", "user"] },
    ],
  },
  {
    id: "q3",
    category: "interest",
    prompt: "What impact do you want your work to create?",
    options: [
      { id: "q3_innovation", label: "Create innovative products", tags: ["build", "design", "tech"] },
      { id: "q3_decisions", label: "Drive better decisions with insights", tags: ["data", "analyze", "business"] },
      { id: "q3_people", label: "Improve people’s lives directly", tags: ["helping", "healthcare", "teaching"] },
      { id: "q3_growth", label: "Grow organizations and markets", tags: ["finance", "lead", "business"] },
    ],
  },
  {
    id: "q4",
    category: "strength",
    prompt: "Your strongest skill today is:",
    options: [
      { id: "q4_problem", label: "Problem solving", tags: ["logic", "analyze", "build"] },
      { id: "q4_communication", label: "Communication", tags: ["teaching", "lead", "collaborative"] },
      { id: "q4_creative", label: "Creativity", tags: ["design", "creative", "user"] },
      { id: "q4_discipline", label: "Discipline and accuracy", tags: ["structured", "finance", "research"] },
    ],
  },
  {
    id: "q5",
    category: "strength",
    prompt: "How do you solve difficult tasks?",
    options: [
      { id: "q5_deep", label: "Deep focus independently", tags: ["independent", "logic"] },
      { id: "q5_team", label: "Collaborate with a team", tags: ["collaborative", "lead"] },
      { id: "q5_research", label: "Research and test hypotheses", tags: ["research", "analyze"] },
      { id: "q5_people", label: "Discuss and guide people", tags: ["teaching", "helping"] },
    ],
  },
  {
    id: "q6",
    category: "strength",
    prompt: "What kind of output do you feel proud of?",
    options: [
      { id: "q6_product", label: "A working product", tags: ["build", "tech"] },
      { id: "q6_dashboard", label: "Reports and insights", tags: ["data", "analyze", "finance"] },
      { id: "q6_experience", label: "Beautiful user flows", tags: ["design", "user", "creative"] },
      { id: "q6_life", label: "Real impact on people", tags: ["helping", "healthcare", "teaching"] },
    ],
  },
  {
    id: "q7",
    category: "work_style",
    prompt: "Preferred work style:",
    options: [
      { id: "q7_independent", label: "Mostly independent", tags: ["independent"] },
      { id: "q7_collaborative", label: "Highly collaborative", tags: ["collaborative", "lead"] },
      { id: "q7_mixed", label: "Balanced mix", tags: ["hybrid", "collaborative", "independent"] },
      { id: "q7_structured", label: "Structured routines", tags: ["structured"] },
    ],
  },
  {
    id: "q8",
    category: "work_style",
    prompt: "Preferred pace:",
    options: [
      { id: "q8_fast", label: "Fast-moving and dynamic", tags: ["fast_pace", "business"] },
      { id: "q8_planned", label: "Planned and predictable", tags: ["structured"] },
      { id: "q8_explore", label: "Exploratory and research-heavy", tags: ["research"] },
      { id: "q8_balanced", label: "Balanced pace", tags: ["hybrid"] },
    ],
  },
  {
    id: "q9",
    category: "constraint",
    prompt: "Location / remote preference:",
    options: [
      { id: "q9_remote", label: "Remote-first", tags: ["remote"] },
      { id: "q9_hybrid", label: "Hybrid", tags: ["hybrid"] },
      { id: "q9_onsite", label: "Onsite", tags: ["onsite"] },
      { id: "q9_flexible", label: "Flexible", tags: ["remote", "hybrid", "onsite"] },
    ],
  },
  {
    id: "q10",
    category: "constraint",
    prompt: "Target salary range:",
    options: [
      { id: "q10_low", label: "3-6 LPA", tags: ["low_salary", "mid_salary"] },
      { id: "q10_mid", label: "6-12 LPA", tags: ["mid_salary", "high_salary"] },
      { id: "q10_high", label: "12-20 LPA", tags: ["high_salary"] },
      { id: "q10_very_high", label: "20+ LPA", tags: ["high_salary"] },
    ],
  },
];

const scoreCareer = (career: CareerProfile, selectedOptions: AssessmentOption[]) => {
  let score = 0;
  selectedOptions.forEach((option, idx) => {
    const tags = option.tags ?? [];
    const matches = tags.filter((tag) => career.tags.includes(tag)).length;
    const question = QUICK_ASSESSMENT_QUESTIONS[idx];
    const weight = question?.category === "constraint" ? 1 : question?.category === "work_style" ? 2 : 3;
    score += matches * weight;
  });
  return score;
};

export const computeQuickAssessmentResult = (answers: Record<string, string>): QuickAssessmentResult => {
  const selectedOptions: AssessmentOption[] = QUICK_ASSESSMENT_QUESTIONS.map((q) => {
    const selected = q.options.find((opt) => opt.id === answers[q.id]);
    return selected ?? q.options[0];
  });

  const scored = CAREER_PROFILES.map((career) => ({
    name: career.name,
    score: scoreCareer(career, selectedOptions),
  })).sort((a, b) => b.score - a.score);

  const maxScore = scored[0]?.score || 1;
  const normalized = scored.map((item) => ({
    ...item,
    score: Math.max(35, Math.round((item.score / maxScore) * 100)),
  }));

  const personalizedCareers = normalized.slice(0, 2);
  const otherCareers = normalized.slice(2);

  return {
    completed: true,
    completedAt: new Date().toISOString(),
    answers,
    topCareer: personalizedCareers[0] ?? null,
    personalizedCareers,
    otherCareers,
    mentorUnlocked: (personalizedCareers[0]?.score ?? 0) >= 60,
    sections: {
      personalized: true,
      general: true,
    },
  };
};

const assessmentKey = (userId: number | string) => `quick_assessment_${userId}`;
const progressKey = (userId: number | string) => `career_progress_${userId}`;

export const saveQuickAssessmentResult = (userId: number | string, result: QuickAssessmentResult) => {
  localStorage.setItem(assessmentKey(userId), JSON.stringify(result));

  const existingProgress = localStorage.getItem(progressKey(userId));
  if (!existingProgress) {
    const seededProgress = [
      {
        id: `p_${result.personalizedCareers[0]?.name || "path"}`,
        career: result.personalizedCareers[0]?.name || "Recommended Path",
        section: "personalized",
        status: "in_progress",
        progress: 20,
        nextStep: "Complete foundational skills module",
        recommendedAction: "Finish one starter project this week",
      },
      {
        id: "g_software_engineer",
        career: "Software Engineer",
        section: "general",
        status: "not_started",
        progress: 0,
        nextStep: "Start with programming fundamentals",
        recommendedAction: "Take the intro coding track",
      },
    ];
    localStorage.setItem(progressKey(userId), JSON.stringify(seededProgress));
  }
};

export const getQuickAssessmentResult = (userId: number | string): QuickAssessmentResult | null => {
  const raw = localStorage.getItem(assessmentKey(userId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as QuickAssessmentResult;
  } catch {
    return null;
  }
};

export const isQuickAssessmentComplete = (userId: number | string) => {
  const result = getQuickAssessmentResult(userId);
  return !!result?.completed;
};

export const getCareerProgress = (userId: number | string) => {
  const raw = localStorage.getItem(progressKey(userId));
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Array<{
      id: string;
      career: string;
      section: "personalized" | "general";
      status: "not_started" | "in_progress" | "completed";
      progress: number;
      nextStep: string;
      recommendedAction: string;
    }>;
  } catch {
    return [];
  }
};
