export type CollegeOption = {
  name: string;
  city: string;
  state: string;
  fees: string;
  exam: string;
  note: string;
};

export type Class12CareerProfile = {
  career: string;
  examFocus: string;
  strategy: string;
  skills: string[];
  roadmap: string[];
  colleges: CollegeOption[];
  dailyPlan: string[];
  weeklyPlan: string[];
};

const DEFAULT_PROFILE: Class12CareerProfile = {
  career: 'Software Engineer',
  examFocus: 'JEE Main, JEE Advanced, state CETs, and coding readiness',
  strategy: 'Build PCM strength, solve mock tests weekly, and keep one coding project active in parallel.',
  skills: ['Problem solving', 'Mathematics', 'Programming basics', 'Logical thinking'],
  roadmap: [
    'Strengthen core subjects with a weekly revision loop',
    'Choose one target exam and one backup exam',
    'Track college cutoffs, branch options, and scholarship opportunities',
    'Prepare application documents and keep portfolio/resume updated',
  ],
  colleges: [
    { name: 'IIT Bombay', city: 'Mumbai', state: 'Maharashtra', fees: '2.3L/year', exam: 'JEE Advanced', note: 'Top engineering option' },
    { name: 'IIT Delhi', city: 'New Delhi', state: 'Delhi', fees: '2.2L/year', exam: 'JEE Advanced', note: 'Strong placements and research' },
    { name: 'NIT Trichy', city: 'Tiruchirappalli', state: 'Tamil Nadu', fees: '1.9L/year', exam: 'JEE Main', note: 'Balanced academics and placements' },
    { name: 'IIIT Hyderabad', city: 'Hyderabad', state: 'Telangana', fees: '2.5L/year', exam: 'UGEE / JEE Main', note: 'Excellent CS ecosystem' },
    { name: 'BITS Pilani', city: 'Pilani', state: 'Rajasthan', fees: '4.8L/year', exam: 'BITSAT', note: 'Private institute with flexible dual degree' },
    { name: 'VIT Vellore', city: 'Vellore', state: 'Tamil Nadu', fees: '2.1L/year', exam: 'VITEEE', note: 'Large campus and multiple specializations' },
  ],
  dailyPlan: ['3 hrs PCM', '1 hr coding basics', '30 min revision'],
  weeklyPlan: ['2 mock tests', '1 doubt-clearing session', '1 portfolio/coding project update'],
};

const CAREER_LIBRARY: Record<string, Class12CareerProfile> = {
  'Software Engineer': DEFAULT_PROFILE,
  'Doctor': {
    career: 'Doctor',
    examFocus: 'NEET UG, NCERT biology mastery, and time-based MCQ practice',
    strategy: 'Prioritize Biology and Chemistry daily, revise NCERT repeatedly, and run full-length mocks every week.',
    skills: ['Biology', 'Chemistry', 'Memory retention', 'Clinical reasoning'],
    roadmap: [
      'Lock in NCERT-based revision for Biology and Chemistry',
      'Use a mock-test calendar and analysis log',
      'Shortlist medical colleges with category and state quota awareness',
      'Prepare for counselling, documentation, and backup plans',
    ],
    colleges: [
      { name: 'AIIMS Delhi', city: 'New Delhi', state: 'Delhi', fees: '1.6L/year', exam: 'NEET UG', note: 'Top national medical institute' },
      { name: 'CMC Vellore', city: 'Vellore', state: 'Tamil Nadu', fees: '2.4L/year', exam: 'NEET UG', note: 'Strong clinical exposure' },
      { name: 'JIPMER', city: 'Puducherry', state: 'Puducherry', fees: '1.8L/year', exam: 'NEET UG', note: 'Renowned medical education' },
      { name: 'KGMU', city: 'Lucknow', state: 'Uttar Pradesh', fees: '1.2L/year', exam: 'NEET UG', note: 'Leading government medical college' },
      { name: 'MAMC', city: 'New Delhi', state: 'Delhi', fees: '1.1L/year', exam: 'NEET UG', note: 'Strong internship network' },
      { name: 'BHU IMS', city: 'Varanasi', state: 'Uttar Pradesh', fees: '1.0L/year', exam: 'NEET UG', note: 'Affordable and respected' },
    ],
    dailyPlan: ['2 hrs Biology', '2 hrs Chemistry/Physics', '1 hr revision'],
    weeklyPlan: ['2 NEET mocks', '1 error-analysis session', 'NCERT re-read cycle'],
  },
  'Chartered Accountant': {
    career: 'Chartered Accountant',
    examFocus: 'CUET / commerce degree planning + CA Foundation and Intermediate',
    strategy: 'Build strong Accounts and Law fundamentals, solve case-based questions, and keep a concept ledger for revisions.',
    skills: ['Accounts', 'Law basics', 'Economics', 'Attention to detail'],
    roadmap: [
      'Choose the best commerce or related degree path',
      'Build Accounts, Law, and Economics foundations',
      'Plan CA Foundation attempt and backup university options',
      'Track internship/article-ship opportunities early',
    ],
    colleges: [
      { name: 'SRCC', city: 'New Delhi', state: 'Delhi', fees: '0.9L/year', exam: 'CUET', note: 'Commerce prestige and strong peer group' },
      { name: 'Christ University', city: 'Bengaluru', state: 'Karnataka', fees: '1.5L/year', exam: 'University Test', note: 'Structured commerce programs' },
      { name: 'St. Xavier’s College', city: 'Mumbai', state: 'Maharashtra', fees: '0.95L/year', exam: 'Merit / CUET', note: 'Highly reputed in commerce' },
      { name: 'Loyola College', city: 'Chennai', state: 'Tamil Nadu', fees: '0.8L/year', exam: 'Merit', note: 'Strong academic reputation' },
      { name: 'NMIMS', city: 'Mumbai', state: 'Maharashtra', fees: '3.1L/year', exam: 'NPAT', note: 'Business and finance oriented' },
      { name: 'Hindu College', city: 'New Delhi', state: 'Delhi', fees: '0.7L/year', exam: 'CUET', note: 'Great commerce ecosystem' },
    ],
    dailyPlan: ['2 hrs Accounts', '1 hr Law', '1 hr practice questions'],
    weeklyPlan: ['1 full mock test', 'Formula revision', 'Case-study practice'],
  },
  'UI/UX Designer': {
    career: 'UI/UX Designer',
    examFocus: 'NID DAT, NIFT, UCEED, portfolio building, and visual communication',
    strategy: 'Show your design thinking through sketches, case studies, and a clean portfolio with repeated critique loops.',
    skills: ['Sketching', 'Visual communication', 'Tool proficiency', 'User empathy'],
    roadmap: [
      'Develop sketching, visual communication, and tool familiarity',
      'Build a design portfolio with case studies',
      'Target design entrance exams and college shortlists',
      'Practice user research and product thinking tasks',
    ],
    colleges: [
      { name: 'NID Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', fees: '2.8L/year', exam: 'NID DAT', note: 'Top design institute' },
      { name: 'NIFT Delhi', city: 'New Delhi', state: 'Delhi', fees: '2.7L/year', exam: 'NIFT', note: 'Strong visual and fashion design options' },
      { name: 'Srishti Manipal', city: 'Bengaluru', state: 'Karnataka', fees: '5.1L/year', exam: 'Portfolio / Interview', note: 'Creative and experimental focus' },
      { name: 'Pearl Academy', city: 'Jaipur', state: 'Rajasthan', fees: '4.2L/year', exam: 'Pearl entrance', note: 'Good for applied design careers' },
      { name: 'MIT Institute of Design', city: 'Pune', state: 'Maharashtra', fees: '3.4L/year', exam: 'MITID DAT', note: 'Balanced design curriculum' },
      { name: 'IIITDM Jabalpur', city: 'Jabalpur', state: 'Madhya Pradesh', fees: '2.2L/year', exam: 'UCEED', note: 'Product design and HCI-friendly' },
    ],
    dailyPlan: ['1 hr sketching', '1 hr design tools', '1 hr portfolio practice'],
    weeklyPlan: ['2 design challenges', 'Portfolio review', 'User research task'],
  },
  'Data Scientist': {
    career: 'Data Scientist',
    examFocus: 'JEE/CUET-style degree entry + statistics, Python, and analytical problem solving',
    strategy: 'Build Python + maths + statistics foundations, then practice mini-projects using real datasets.',
    skills: ['Python', 'Statistics', 'Data visualization', 'Analytical thinking'],
    roadmap: [
      'Choose an analytics-friendly degree path',
      'Learn Python, statistics, and data visualization basics',
      'Build 2-3 data projects and a GitHub portfolio',
      'Shortlist colleges with strong coding and analytics exposure',
    ],
    colleges: [
      { name: 'IIT Madras', city: 'Chennai', state: 'Tamil Nadu', fees: '2.1L/year', exam: 'JEE Advanced', note: 'Strong analytics and research culture' },
      { name: 'ISI Kolkata', city: 'Kolkata', state: 'West Bengal', fees: '0.7L/year', exam: 'ISI Admission Test', note: 'Statistics powerhouse' },
      { name: 'IIT Kanpur', city: 'Kanpur', state: 'Uttar Pradesh', fees: '2.2L/year', exam: 'JEE Advanced', note: 'Strong math and CS foundation' },
      { name: 'BHU', city: 'Varanasi', state: 'Uttar Pradesh', fees: '1.0L/year', exam: 'CUET', note: 'Good analytics-friendly ecosystem' },
      { name: 'NMIMS', city: 'Mumbai', state: 'Maharashtra', fees: '3.0L/year', exam: 'NPAT', note: 'Business analytics oriented' },
      { name: 'Christ University', city: 'Bengaluru', state: 'Karnataka', fees: '1.6L/year', exam: 'University Test', note: 'Flexible analytics path' },
    ],
    dailyPlan: ['2 hrs maths/statistics', '1 hr Python', '1 mini project or dataset exercise'],
    weeklyPlan: ['1 project update', '1 mock/data quiz', '1 concept revision block'],
  },
  'Data Analyst': {
    career: 'Data Analyst',
    examFocus: 'CUET / analytics-friendly degree pathways with statistics and spreadsheet rigor',
    strategy: 'Focus on statistics, Excel, SQL, and dashboard storytelling with regular case-study practice.',
    skills: ['Statistics', 'Excel/SQL', 'Data visualization', 'Business communication'],
    roadmap: [
      'Choose a degree with analytics and quantitative coursework',
      'Build Excel, SQL, and basic Python capability',
      'Create dashboard and case-study portfolio projects',
      'Target analyst internships by second year',
    ],
    colleges: [
      { name: 'SRCC', city: 'New Delhi', state: 'Delhi', fees: '0.9L/year', exam: 'CUET', note: 'Strong commerce + analytics track' },
      { name: 'Christ University', city: 'Bengaluru', state: 'Karnataka', fees: '1.6L/year', exam: 'University Test', note: 'Good industry exposure' },
      { name: 'NMIMS', city: 'Mumbai', state: 'Maharashtra', fees: '3.0L/year', exam: 'NPAT', note: 'Business analytics options' },
      { name: 'Loyola College', city: 'Chennai', state: 'Tamil Nadu', fees: '0.8L/year', exam: 'Merit', note: 'Strong commerce academics' },
      { name: 'St. Xavier’s College', city: 'Mumbai', state: 'Maharashtra', fees: '0.95L/year', exam: 'Merit / CUET', note: 'Quality economics and commerce base' },
      { name: 'Delhi University (South Campus)', city: 'New Delhi', state: 'Delhi', fees: '0.7L/year', exam: 'CUET', note: 'Affordable and competitive ecosystem' },
    ],
    dailyPlan: ['1 hr statistics', '1 hr Excel/SQL practice', '1 hr case-study or dashboard work'],
    weeklyPlan: ['1 mini analytics project', '1 mock aptitude section', '1 portfolio update'],
  },
  'Business Manager': {
    career: 'Business Manager',
    examFocus: 'CUET, NPAT, and BBA/BMS admission tracks with communication and quant prep',
    strategy: 'Build communication, case-solving, and basic business math with internships and club activity.',
    skills: ['Communication', 'Leadership', 'Decision making', 'Business fundamentals'],
    roadmap: [
      'Target BBA/BMS programs with strong placement cells',
      'Build presentation, group discussion, and interview skills',
      'Participate in business competitions and college clubs',
      'Take internships in marketing, sales, or operations',
    ],
    colleges: [
      { name: 'Shaheed Sukhdev College of Business Studies', city: 'New Delhi', state: 'Delhi', fees: '0.6L/year', exam: 'CUET', note: 'Top BMS destination' },
      { name: 'NMIMS', city: 'Mumbai', state: 'Maharashtra', fees: '3.2L/year', exam: 'NPAT', note: 'Strong management pathway' },
      { name: 'Symbiosis', city: 'Pune', state: 'Maharashtra', fees: '2.9L/year', exam: 'SET', note: 'Good internship network' },
      { name: 'Christ University', city: 'Bengaluru', state: 'Karnataka', fees: '1.7L/year', exam: 'University Test', note: 'Balanced management curriculum' },
      { name: 'Loyola College', city: 'Chennai', state: 'Tamil Nadu', fees: '0.9L/year', exam: 'Merit', note: 'Strong academic base' },
      { name: 'St. Xavier’s College', city: 'Mumbai', state: 'Maharashtra', fees: '1.0L/year', exam: 'Merit / CUET', note: 'Strong brand and alumni network' },
    ],
    dailyPlan: ['1 hr communication/GD prep', '1 hr quant/business aptitude', '1 hr business news + notes'],
    weeklyPlan: ['1 case-study simulation', '1 presentation practice', '1 internship application batch'],
  },
  'Biotech Researcher': {
    career: 'Biotech Researcher',
    examFocus: 'NEET/CUET routes with strong biology-chemistry depth and lab readiness',
    strategy: 'Build core biology and chemistry foundations and prioritize research exposure through labs and internships.',
    skills: ['Biology', 'Chemistry', 'Research methods', 'Analytical documentation'],
    roadmap: [
      'Choose biotech/life-science oriented degree pathways',
      'Strengthen wet-lab and data recording fundamentals',
      'Work on mini-research projects and internships',
      'Plan specialization or higher studies trajectory',
    ],
    colleges: [
      { name: 'IISER Pune', city: 'Pune', state: 'Maharashtra', fees: '1.5L/year', exam: 'IAT', note: 'Strong pure sciences ecosystem' },
      { name: 'University of Hyderabad', city: 'Hyderabad', state: 'Telangana', fees: '0.7L/year', exam: 'CUET-PG pathway later', note: 'Research focused environment' },
      { name: 'VIT Vellore', city: 'Vellore', state: 'Tamil Nadu', fees: '2.2L/year', exam: 'VITEEE / Merit', note: 'Biotech and applied labs' },
      { name: 'Amity University', city: 'Noida', state: 'Uttar Pradesh', fees: '2.8L/year', exam: 'Merit', note: 'Industry-linked programs' },
      { name: 'Christ University', city: 'Bengaluru', state: 'Karnataka', fees: '1.6L/year', exam: 'University Test', note: 'Life-sciences track' },
      { name: 'Savitribai Phule Pune University', city: 'Pune', state: 'Maharashtra', fees: '0.6L/year', exam: 'Merit / Entrance', note: 'Affordable strong academics' },
    ],
    dailyPlan: ['2 hrs biology + chemistry', '1 hr research reading', '30 min revision notes'],
    weeklyPlan: ['1 mock test', '1 lab-skills practice block', '1 project literature review'],
  },
  'Content and Media Professional': {
    career: 'Content and Media Professional',
    examFocus: 'CUET, media entrance tests, writing portfolio and communication readiness',
    strategy: 'Build writing consistency, media awareness, and portfolio quality through real content projects.',
    skills: ['Writing', 'Storytelling', 'Media research', 'Communication'],
    roadmap: [
      'Target journalism/media/communication programs',
      'Build portfolio with articles, scripts, and short-form media pieces',
      'Develop editing and digital publishing workflow',
      'Take internships in media houses and digital teams',
    ],
    colleges: [
      { name: 'Delhi College of Arts and Commerce', city: 'New Delhi', state: 'Delhi', fees: '0.5L/year', exam: 'CUET', note: 'Strong humanities and media track' },
      { name: 'Lady Shri Ram College', city: 'New Delhi', state: 'Delhi', fees: '0.7L/year', exam: 'CUET', note: 'Top humanities ecosystem' },
      { name: 'Symbiosis Institute of Media and Communication', city: 'Pune', state: 'Maharashtra', fees: '3.1L/year', exam: 'SET', note: 'Industry-oriented media training' },
      { name: 'Asian College of Journalism', city: 'Chennai', state: 'Tamil Nadu', fees: '4.0L/year', exam: 'Entrance + Interview', note: 'Specialized journalism route' },
      { name: 'Christ University', city: 'Bengaluru', state: 'Karnataka', fees: '1.8L/year', exam: 'University Test', note: 'Communication and media programs' },
      { name: 'St. Xavier’s College', city: 'Mumbai', state: 'Maharashtra', fees: '1.0L/year', exam: 'Merit / CUET', note: 'Good liberal arts + media exposure' },
    ],
    dailyPlan: ['1 hr writing practice', '1 hr current affairs/media analysis', '1 hr editing and publishing practice'],
    weeklyPlan: ['2 portfolio pieces', '1 mentor review', '1 internship/application sprint'],
  },
};

export const getClass12CareerProfile = (career?: string | null): Class12CareerProfile => {
  if (!career) {
    return DEFAULT_PROFILE;
  }

  return CAREER_LIBRARY[career] || DEFAULT_PROFILE;
};

export const CLASS12_CAREER_LIBRARY = CAREER_LIBRARY;
