import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, Briefcase, Zap, Code, BarChart, BrainCircuit, ChevronRight, Target, LayoutDashboard, AlertCircle, Search, ExternalLink, HeartPulse, Dna, Landmark, Scale, Users } from 'lucide-react';

const genGenericQs = (opt1: string, opt2: string, opt3: string) => [
  { text: "What is your primary career goal?", options: [opt1, opt2, opt3] },
  { text: "Which working environment do you prefer?", options: ["Corporate Office", "Field/Lab Work", "Freelance/Remote"] },
  { text: "How do you handle complex problems?", options: ["Analyze data", "Consult others", "Experiment systematically"] },
  { text: "What type of impact do you want to make?", options: ["Technological Innovation", "Social/Humanitarian", "Financial/Business Growth"] },
  { text: "Which skill do you consider your strongest?", options: ["Logical Reasoning", "Communication & Empathy", "Creativity & Design"] }
];

const STREAM_DATA: Record<string, any> = {
  PCM: {
    phase1Qs: [
      { text: "When building a project, what part excites you most?", options: ["Writing logic & UI", "Visualizing results", "Making it learn"] },
      { text: "Which tool are you most curious about?", options: ["React / Node.js", "Excel / Power BI", "Neural Networks / Python"] },
      { text: "How do you handle errors?", options: ["Debug code line by line", "Check data cleanliness", "Adjust model weights"] },
      { text: "Strongest mathematical skill?", options: ["Discrete Math / Logic", "Statistics / Probability", "Linear Algebra / Calculus"] },
      { text: "What is your primary goal?", options: ["Create products", "Understand data", "Push boundaries of tech"] }
    ],
    domains: {
      DEV: { id: "DEV", name: "Software Development", icon: Code, color: "from-blue-500 to-cyan-500", description: "Building robust applications.", subCareers: ["Frontend Developer", "Backend Developer", "Full Stack Developer", "UI/UX Designer"] },
      DATA: { id: "DATA", name: "Data & Analytics", icon: BarChart, color: "from-green-500 to-emerald-500", description: "Finding hidden insights.", subCareers: ["Data Analyst", "Business Analyst", "Power BI Developer"] },
      AI: { id: "AI", name: "Artificial Intelligence", icon: BrainCircuit, color: "from-purple-500 to-pink-500", description: "Creating intelligent systems.", subCareers: ["Data Scientist", "Machine Learning Engineer", "AI Researcher"] }
    },
    quizzes: {
      "Frontend Developer": [
        { text: "Which language is used for styling web pages?", options: ["HTML", "JQuery", "CSS", "XML"], correct: 2 },
        { text: "What is React primarily used for?", options: ["Database Management", "Building User Interfaces", "Server-side logic", "Data Analysis"], correct: 1 },
        { text: "Which of the following is not a JavaScript framework/library?", options: ["Vue", "Angular", "Django", "React"], correct: 2 },
        { text: "What does UI stand for?", options: ["User Interface", "User Integration", "Universal Identity", "Unified Information"], correct: 0 },
        { text: "What is the purpose of a CSS framework like Tailwind?", options: ["To write server logic", "To manage databases", "To rapidly style UI components", "To compile JavaScript"], correct: 2 }
      ],
      "Backend Developer": [
        { text: "Which of the following is a NoSQL database?", options: ["PostgreSQL", "MySQL", "MongoDB", "SQLite"], correct: 2 },
        { text: "What does API stand for?", options: ["Application Programming Interface", "Advanced Program Integration", "Application Process Integration", "Automated Programming Interface"], correct: 0 },
        { text: "Which language is heavily used for backend development in the Node.js environment?", options: ["Python", "JavaScript", "C#", "Ruby"], correct: 1 },
        { text: "What HTTP method is typically used to retrieve data?", options: ["POST", "GET", "PUT", "DELETE"], correct: 1 },
        { text: "What is the role of a web server?", options: ["To render UI on the client", "To process requests and return responses", "To store data permanently", "To design graphics"], correct: 1 }
      ],
      "Data Analyst": [
        { text: "Which tool is predominantly used for spreadsheet data analysis?", options: ["Photoshop", "Microsoft Excel", "Visual Studio", "Figma"], correct: 1 },
        { text: "What does SQL stand for?", options: ["Structured Query Language", "Sequential Query Logic", "Standard Question Language", "System Query Link"], correct: 0 },
        { text: "Which Python library is famous for Data Manipulation?", options: ["React", "Pandas", "Flask", "Django"], correct: 1 },
        { text: "What is the purpose of Data Visualization?", options: ["To hide data", "To make data easier to understand via charts", "To encrypt data", "To store data"], correct: 1 },
        { text: "Which aggregate function gives the average in SQL?", options: ["SUM()", "COUNT()", "AVG()", "MAX()"], correct: 2 }
      ],
      "Data Scientist": [
        { text: "Which of the following is a Machine Learning technique?", options: ["HTML Parsing", "Linear Regression", "CSS Styling", "DOM Manipulation"], correct: 1 },
        { text: "What is the purpose of training a model?", options: ["To make the code run faster", "To allow the model to learn patterns from data", "To store it in a database", "To create a UI"], correct: 1 },
        { text: "Which library is heavily used for Machine Learning in Python?", options: ["React", "Express", "Scikit-Learn", "Bootstrap"], correct: 2 },
        { text: "What is Overfitting?", options: ["When a model learns the training data too well and performs poorly on new data", "When a model is too small", "When data is lost", "When a server crashes"], correct: 0 },
        { text: "What type of data does NLP (Natural Language Processing) deal with?", options: ["Images", "Text and Speech", "Numbers only", "Videos"], correct: 1 }
      ]
    },
    roadmaps: {
      "Frontend Developer": { overview: "Build user interfaces and experiences for the web.", steps: ["Master HTML, CSS, JavaScript", "Learn React or Vue.js", "Understand State Management", "Learn Tailwind CSS", "Build interactive portfolio"], salary: "6 - 12 LPA", skills: ["React", "TypeScript", "Tailwind CSS", "Responsive Design"] },
      "Backend Developer": { overview: "Build robust server-side logic, APIs, and databases.", steps: ["Learn Node.js or Python", "Master SQL and NoSQL", "Understand RESTful APIs", "Learn Authentication", "Basic DevOps (Docker)"], salary: "7 - 14 LPA", skills: ["Node.js/Python", "Databases", "API Design", "Architecture"] },
      "Full Stack Developer": { overview: "End-to-end development handling client and server.", steps: ["Master Frontend basics", "Master Backend basics", "Connect Database", "Learn CI/CD", "Build SaaS apps"], salary: "8 - 16 LPA", skills: ["MERN/PERN", "APIs", "Deployment", "Git"] },
      "UI/UX Designer": { overview: "Design the look, feel, and user journey of products.", steps: ["Learn Design Principles", "Master Figma", "Understand User Research", "Create Wireframes", "Build visual portfolio"], salary: "5 - 10 LPA", skills: ["Figma", "Wireframing", "User Research", "Prototyping"] },
      "Data Analyst": { overview: "Analyze data to help businesses make decisions.", steps: ["Master Advanced Excel", "Learn SQL", "Learn Power BI/Tableau", "Basic Python (Pandas)", "Develop business acumen"], salary: "5 - 10 LPA", skills: ["SQL", "Excel", "Power BI", "Python"] },
      "Data Scientist": { overview: "Extract deep insights and build predictive models.", steps: ["Master Python and Pandas", "Dive into Probability", "Learn Machine Learning", "Understand Deep Learning", "Kaggle competitions"], salary: "8 - 18 LPA", skills: ["Python", "Machine Learning", "Statistics", "Deep Learning"] },
      "Machine Learning Engineer": { overview: "Put machine learning models into production.", steps: ["Master Python", "Learn ML Frameworks", "Master MLOps", "Learn Cloud ML", "Optimize models"], salary: "10 - 20 LPA", skills: ["Python", "MLOps", "Cloud", "Engineering"] },
      "AI Researcher": { overview: "Push boundaries of Artificial Intelligence.", steps: ["Strong Calculus", "Deep Learning architectures", "Read research papers", "Publish papers", "Pursue Masters/PhD"], salary: "12 - 25+ LPA", skills: ["Math", "Research", "PyTorch", "Algorithms"] },
      "Business Analyst": { overview: "Bridge the gap between IT and business.", steps: ["Improve communication", "Learn Excel & SQL", "Understand Agile", "Learn requirements gathering", "Master stakeholder management"], salary: "6 - 12 LPA", skills: ["Requirements", "Agile", "Excel", "Communication"] },
      "Power BI Developer": { overview: "Specialized role building interactive BI reports.", steps: ["Master DAX", "Understand Data Modeling", "Build interactive dashboards", "Power BI Service administration", "Pass PL-300 Exam"], salary: "6 - 11 LPA", skills: ["Power BI", "DAX", "Data Modeling", "SQL"] }
    }
  },
  PCB: {
    phase1Qs: genGenericQs("Treating patients", "Researching diseases", "Managing healthcare"),
    domains: {
      CLINICAL: { id: "CLINICAL", name: "Clinical Practice", icon: HeartPulse, color: "from-red-500 to-rose-500", description: "Direct patient diagnosis and care.", subCareers: ["MBBS Doctor", "Dental Surgeon"] },
      RESEARCH: { id: "RESEARCH", name: "Bio-Research", icon: Dna, color: "from-green-500 to-emerald-500", description: "Laboratory research and genetics.", subCareers: ["Biotechnologist", "Geneticist"] }
    },
    quizzes: {
      "MBBS Doctor": [
        { text: "Which organ pumps blood throughout the human body?", options: ["Brain", "Liver", "Heart", "Lungs"], correct: 2 },
        { text: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi"], correct: 2 },
        { text: "Which blood cells are responsible for fighting infection?", options: ["Red Blood Cells", "White Blood Cells", "Platelets", "Plasma"], correct: 1 },
        { text: "What is the normal human body temperature?", options: ["35 C", "37 C", "39 C", "40 C"], correct: 1 },
        { text: "What does CPR stand for?", options: ["Cardio Pulse Rescue", "Cardiopulmonary Resuscitation", "Cardiac Pressure Release", "Central Pulse Rate"], correct: 1 }
      ]
    },
    roadmaps: {
      "MBBS Doctor": { overview: "Diagnose illnesses, treat injuries, and care for patients.", steps: ["Clear NEET-UG", "Complete 5.5 years MBBS", "1 year Mandatory Internship", "Clear NEET-PG", "MD/MS Specialization"], salary: "10 - 30 LPA", skills: ["Anatomy", "Diagnosis", "Patient Care", "Surgery"] },
      "Dental Surgeon": { overview: "Diagnose and treat oral health issues.", steps: ["Clear NEET-UG", "Complete BDS", "Dental Internship", "MDS Specialization", "Open Dental Clinic"], salary: "6 - 15 LPA", skills: ["Oral Surgery", "Orthodontics", "Patient Care", "Precision"] },
      "Biotechnologist": { overview: "Use biological systems to develop innovative products.", steps: ["BSc Biotechnology", "MSc/PhD Research", "Laboratory Internships", "Publish Research Papers", "R&D Industry Role"], salary: "6 - 15 LPA", skills: ["Genetics", "Lab Tech", "Data Analysis", "Research"] },
      "Geneticist": { overview: "Study genes, heredity, and variation of organisms.", steps: ["BSc Genetics/Biology", "MSc Genetics", "PhD in Genetics", "Clinical or Research Lab", "Post-Doctoral Fellowship"], salary: "8 - 20 LPA", skills: ["DNA Sequencing", "Bioinformatics", "Research", "Analysis"] }
    }
  },
  COMMERCE: {
    phase1Qs: genGenericQs("Managing Finances", "Running a Business", "Analyzing Markets"),
    domains: {
      FINANCE: { id: "FINANCE", name: "Finance & Accounting", icon: Landmark, color: "from-blue-500 to-indigo-500", description: "Managing money, taxes, and corporate accounts.", subCareers: ["Chartered Accountant (CA)", "Investment Banker"] },
      MANAGEMENT: { id: "MANAGEMENT", name: "Business Management", icon: Users, color: "from-purple-500 to-fuchsia-500", description: "Running operations and teams.", subCareers: ["Marketing Manager", "HR Specialist"] }
    },
    quizzes: {
      "Chartered Accountant (CA)": [
        { text: "What is a Balance Sheet?", options: ["A list of employees", "A financial statement of assets and liabilities", "A tax form", "A bank receipt"], correct: 1 },
        { text: "What does ROI mean?", options: ["Return on Investment", "Rate of Income", "Rule of Interest", "Return on Integration"], correct: 0 },
        { text: "Which of the following is a direct tax?", options: ["GST", "VAT", "Income Tax", "Customs Duty"], correct: 2 },
        { text: "What does 'depreciation' refer to in accounting?", options: ["Increase in value", "Decrease in asset value over time", "A type of loan", "Bank interest"], correct: 1 },
        { text: "What is a financial audit?", options: ["Hiring staff", "Official inspection of an organization's accounts", "Marketing campaign", "Buying stocks"], correct: 1 }
      ]
    },
    roadmaps: {
      "Chartered Accountant (CA)": { overview: "Manage financial accounting, auditing, and taxation.", steps: ["CA Foundation Exam", "CA Intermediate", "Articleship (3 years)", "CA Final Exam", "ICAI Membership"], salary: "8 - 25 LPA", skills: ["Accounting", "Taxation", "Auditing", "Financial Laws"] },
      "Investment Banker": { overview: "Raise capital for companies and provide strategic financial advice.", steps: ["BCom / BBA", "MBA Finance from top tier institute", "Finance Internships", "CFA Certification", "Associate Role"], salary: "15 - 40+ LPA", skills: ["Financial Modeling", "Valuation", "Networking", "Economics"] },
      "Marketing Manager": { overview: "Develop strategies to promote products and services.", steps: ["BBA / BCom", "MBA in Marketing", "Digital Marketing Certifications", "Brand Management roles", "Lead Marketing Campaigns"], salary: "8 - 20 LPA", skills: ["SEO/SEM", "Market Research", "Communication", "Strategy"] },
      "HR Specialist": { overview: "Recruit, train, and manage company employees.", steps: ["BBA/BA", "MBA in Human Resources", "Learn HR Tools (Workday)", "Talent Acquisition Role", "HR Business Partner"], salary: "6 - 15 LPA", skills: ["Recruitment", "Empathy", "Conflict Resolution", "Labor Laws"] }
    }
  },
  ARTS: {
    phase1Qs: genGenericQs("Studying human behavior", "Defending the law", "Creating visual media"),
    domains: {
      HUMANITIES: { id: "HUMANITIES", name: "Humanities & Social Sciences", icon: Users, color: "from-yellow-500 to-orange-500", description: "Studying human society and behavior.", subCareers: ["Psychologist", "Sociologist"] },
      LAW: { id: "LAW", name: "Legal Studies", icon: Scale, color: "from-gray-500 to-slate-500", description: "Law, order, and corporate governance.", subCareers: ["Corporate Lawyer", "Criminal Lawyer"] }
    },
    quizzes: {
      "Psychologist": [
        { text: "What is the primary study of Psychology?", options: ["Rocks and Minerals", "The Mind and Human Behavior", "Stars and Planets", "Ancient History"], correct: 1 },
        { text: "Who is known as the founder of psychoanalysis?", options: ["B.F. Skinner", "Ivan Pavlov", "Sigmund Freud", "Carl Jung"], correct: 2 },
        { text: "What is 'cognitive dissonance'?", options: ["A type of brain scan", "Mental discomfort from holding conflicting beliefs", "A sleep disorder", "Memory loss"], correct: 1 },
        { text: "Which part of the brain is strongly associated with memory?", options: ["Heart", "Hippocampus", "Brainstem", "Spinal cord"], correct: 1 },
        { text: "What is classical conditioning?", options: ["Learning through association", "Learning by reading a book", "A physical workout", "Genetic inheritance"], correct: 0 }
      ]
    },
    roadmaps: {
      "Psychologist": { overview: "Study human behavior, cognitive processes, and provide counseling.", steps: ["BA Psychology", "MA/MSc Psychology", "MPhil / Clinical Training", "Obtain RCI License", "Clinical Practice"], salary: "5 - 15 LPA", skills: ["Empathy", "Counseling", "Research", "Assessment"] },
      "Sociologist": { overview: "Study society, social behavior, and cultural patterns.", steps: ["BA Sociology", "MA Sociology", "Field Research Projects", "PhD in Sociology", "Academic or Policy Role"], salary: "4 - 12 LPA", skills: ["Research", "Critical Thinking", "Data Collection", "Writing"] },
      "Corporate Lawyer": { overview: "Handle legal aspects of business, mergers, and corporate contracts.", steps: ["Clear CLAT Exam", "BA LLB (5 years)", "Corporate Law Internships", "Pass Bar Council Exam", "Join Top Law Firm"], salary: "10 - 30 LPA", skills: ["Contract Law", "Negotiation", "Research", "Communication"] },
      "Criminal Lawyer": { overview: "Defend individuals and organizations facing criminal charges.", steps: ["Clear CLAT", "LLB Degree", "Intern under Senior Advocate", "Pass Bar Exam", "Courtroom Practice"], salary: "6 - 20+ LPA", skills: ["Litigation", "Debate", "Criminal Law", "Evidence Analysis"] }
    }
  }
};

const CollegeAssessment = () => {
  const navigate = useNavigate();
  const [userStream, setUserStream] = useState<string>("PCM");
  
  useEffect(() => {
    try {
      const class12Data = JSON.parse(localStorage.getItem('class12_journey') || '{}');
      if (class12Data.stream) {
        setUserStream(class12Data.stream.toUpperCase());
      }
    } catch(e) {}
  }, []);

  const streamData = STREAM_DATA[userStream] || STREAM_DATA['PCM'];
  const PHASE1_QUESTIONS = streamData.phase1Qs;
  const DOMAINS = streamData.domains;
  const ROADMAPS = streamData.roadmaps;
  
  const getQuiz = (subCareer: string) => {
    if (streamData.quizzes && streamData.quizzes[subCareer]) {
      return streamData.quizzes[subCareer];
    }
    // Fallback quiz if not explicitly defined
    return [
      { text: `What is the core focus of a ${subCareer}?`, options: ["Engineering", "The specific domain requirements", "Sales", "HR"], correct: 1 },
      { text: "What is a required soft skill?", options: ["Cooking", "Communication", "Running", "Singing"], correct: 1 },
      { text: "Is continuous learning required?", options: ["No", "Yes", "Maybe", "Only in first year"], correct: 1 },
      { text: "Which tool is commonly used?", options: ["Hammer", "Industry specific software", "Oven", "Tractor"], correct: 1 },
      { text: "What is the primary goal?", options: ["Solving domain problems", "Making coffee", "Sleeping", "Playing games"], correct: 0 }
    ];
  };

  const [step, setStep] = useState<'instructions' | 'phase1' | 'domain-results' | 'phase2' | 'phase2-fail' | 'gateway' | 'final-results'>('instructions');
  const [phase1Answers, setPhase1Answers] = useState<number[]>([]);
  const [phase1QIndex, setPhase1QIndex] = useState(0);
  const [domainId, setDomainId] = useState<string>('');
  const [selectedSubCareer, setSelectedSubCareer] = useState<string>('');
  const [phase2Answers, setPhase2Answers] = useState<number[]>([]);
  const [phase2QIndex, setPhase2QIndex] = useState(0);
  const [phase2Score, setPhase2Score] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('college_completed') === 'true') {
      const savedDomain = localStorage.getItem('college_domain');
      const savedCareer = localStorage.getItem('college_selected_career');
      if (savedDomain && savedCareer) {
        setDomainId(savedDomain);
        setSelectedSubCareer(savedCareer);
        setStep('final-results');
      }
    }
  }, []);

  const handlePhase1Answer = (optIndex: number) => {
    const newAnswers = [...phase1Answers, optIndex];
    setPhase1Answers(newAnswers);
    if (phase1QIndex < PHASE1_QUESTIONS.length - 1) {
      setPhase1QIndex(phase1QIndex + 1);
    } else {
      processPhase1Results(newAnswers);
    }
  };

  const processPhase1Results = (answers: number[]) => {
    setIsProcessing(true);
    setTimeout(() => {
      let counts = [0, 0, 0];
      answers.forEach(a => counts[a]++);
      const maxIndex = counts.indexOf(Math.max(...counts));
      const keys = Object.keys(DOMAINS);
      const determinedDomain = keys[maxIndex] || keys[0];
      setDomainId(determinedDomain);
      setIsProcessing(false);
      setStep('domain-results');
    }, 1500);
  };

  const startPhase2 = (subCareer: string) => {
    setSelectedSubCareer(subCareer);
    setPhase2Answers([]);
    setPhase2QIndex(0);
    setPhase2Score(0);
    setStep('phase2');
  };

  const handlePhase2Answer = (optIndex: number) => {
    const newAnswers = [...phase2Answers, optIndex];
    setPhase2Answers(newAnswers);
    
    const quiz = getQuiz(selectedSubCareer);
    if (phase2QIndex < quiz.length - 1) {
      setPhase2QIndex(phase2QIndex + 1);
    } else {
      const score = newAnswers.filter((ans, i) => ans === quiz[i].correct).length;
      const percentage = Math.round((score / quiz.length) * 100);
      setPhase2Score(percentage);
      
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        if (percentage >= 80) {
          localStorage.setItem('college_completed', 'true');
          localStorage.setItem('college_domain', domainId);
          localStorage.setItem('college_selected_career', selectedSubCareer);
          setStep('gateway');
        } else {
          setStep('phase2-fail');
        }
      }, 1500);
    }
  };

  const retryPhase2 = () => {
    setPhase2Answers([]);
    setPhase2QIndex(0);
    setPhase2Score(0);
    setStep('phase2');
  };

  const changeSubCareer = (newSubCareer: string) => {
    setSelectedSubCareer(newSubCareer);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mb-6 shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
        <h2 className="text-2xl font-bold animate-pulse text-orange-400">Analyzing Your Responses...</h2>
        <p className="text-gray-400 mt-2">Please wait a moment</p>
      </div>
    );
  }

  const renderInstructions = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-8 h-8 text-yellow-400" />
        <h1 className="text-3xl font-bold">College Career Placement Profile</h1>
      </div>
      <Card className="p-8 bg-white/[0.04] border border-white/10 mb-6">
        <p className="text-gray-300 mb-4 text-lg">Your assessment is tailored for <strong>{userStream}</strong>. We'll start with a broad assessment to find your domain, and then test your technical skills to unlock a tailored roadmap.</p>
        <div className="flex gap-4 text-sm text-gray-400 bg-white/5 p-4 rounded-lg">
          <div className="flex-1">
            <span className="font-bold text-orange-400 block mb-1">Phase 1</span>
            General Aptitude Questions
          </div>
          <div className="w-px bg-white/10" />
          <div className="flex-1">
            <span className="font-bold text-orange-400 block mb-1">Phase 2</span>
            5 Specific Technical Questions (Requires 80% to pass)
          </div>
        </div>
      </Card>
      <Button onClick={() => setStep('phase1')} className="w-full bg-gradient-to-r from-orange-500 to-red-500 py-6 text-lg">
        Start General Assessment
      </Button>
    </motion.div>
  );

  const renderPhase1 = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between mb-2 text-sm text-gray-400">
          <span>Phase 1: General Assessment</span>
          <span>{Math.round(((phase1QIndex) / PHASE1_QUESTIONS.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((phase1QIndex) / PHASE1_QUESTIONS.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-orange-500 to-red-500"
          />
        </div>
      </div>
      <Card className="p-8 bg-white/[0.04] border border-white/10">
        <h3 className="text-xl font-bold mb-6">{PHASE1_QUESTIONS[phase1QIndex].text}</h3>
        <div className="space-y-3">
          {PHASE1_QUESTIONS[phase1QIndex].options.map((opt: string, idx: number) => (
            <button key={idx} onClick={() => handlePhase1Answer(idx)}
              className="w-full p-4 text-left rounded-lg bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-white/10 transition-all font-medium text-gray-200">
              {opt}
            </button>
          ))}
        </div>
      </Card>
    </motion.div>
  );

  const renderDomainResults = () => {
    if (!domainId) return null;
    const domain = DOMAINS[domainId];
    const Icon = domain.icon;
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
        <div className="text-center mb-10 p-8 rounded-2xl bg-gradient-to-b from-white/10 to-transparent border border-white/5">
          <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${domain.color} flex items-center justify-center mb-6 shadow-lg shadow-current`}>
            <Icon className="w-10 h-10 text-white" />
          </div>
          <p className="text-orange-400 font-bold tracking-widest text-sm uppercase mb-2">Phase 1 Complete</p>
          <h2 className="text-3xl font-bold mb-4">You are mapped to: {domain.name}</h2>
          <p className="text-gray-400 max-w-lg mx-auto">{domain.description}</p>
        </div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-orange-400" /> Select a Specific Career Path</h3>
        <p className="text-sm text-gray-400 mb-6">Choose one of the specialized roles below. You must pass a 5-question technical test (80% or higher) to unlock its roadmap.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {domain.subCareers.map((career: string) => (
            <div key={career} onClick={() => startPhase2(career)} className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all cursor-pointer group">
              <h4 className="font-bold text-lg mb-2 group-hover:text-orange-400 transition-colors">{career}</h4>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">{ROADMAPS[career]?.overview || "A specialized career path."}</p>
              <span className="text-orange-400 text-sm font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Start Technical Test <ChevronRight className="w-4 h-4" /></span>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  const renderPhase2 = () => {
    const quiz = getQuiz(selectedSubCareer);
    const q = quiz[phase2QIndex];
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <span className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 inline-flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4" /> Technical Test: {selectedSubCareer}
          </span>
          <Button variant="ghost" onClick={() => setStep('domain-results')} className="text-gray-400 text-xs">
            &larr; Change Career
          </Button>
        </div>
        <div className="mb-6">
          <div className="flex justify-between mb-2 text-sm text-gray-400">
            <span>Question {phase2QIndex + 1} of {quiz.length}</span>
            <span>{Math.round(((phase2QIndex) / quiz.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((phase2QIndex) / quiz.length) * 100}%` }}
              className={`h-full bg-gradient-to-r from-blue-500 to-cyan-500`}
            />
          </div>
        </div>
        <Card className="p-8 bg-white/[0.04] border border-white/10">
          <h3 className="text-xl font-bold mb-6">{q.text}</h3>
          <div className="space-y-3">
            {q.options.map((opt: string, idx: number) => (
              <button key={idx} onClick={() => handlePhase2Answer(idx)}
                className={`w-full p-4 text-left rounded-lg bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all font-medium text-gray-200`}>
                {opt}
              </button>
            ))}
          </div>
        </Card>
      </motion.div>
    );
  };

  const renderPhase2Fail = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto text-center mt-10">
      <div className="w-24 h-24 mx-auto rounded-full bg-red-500/10 flex items-center justify-center mb-8 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
        <AlertCircle className="w-12 h-12 text-red-500" />
      </div>
      <h2 className="text-4xl font-black mb-4">You Scored <span className="text-red-500">{phase2Score}%</span></h2>
      <p className="text-gray-400 mb-8 text-lg">You need at least <strong className="text-white">80%</strong> to prove your foundational knowledge for <strong>{selectedSubCareer}</strong>. Review your core concepts and try again.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={() => setStep('domain-results')} variant="outline" className="border-white/20 py-6">Change Career</Button>
        <Button onClick={retryPhase2} className="bg-gradient-to-r from-red-500 to-orange-500 py-6 font-bold shadow-lg shadow-red-500/20">Retry Assessment</Button>
      </div>
    </motion.div>
  );

  const renderGateway = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto text-center mt-10">
      <div className="w-28 h-28 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-8 border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
        <CheckCircle2 className="w-14 h-14 text-emerald-400" />
      </div>
      <h2 className="text-4xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Yes, you are ready to go for this!</h2>
      <p className="text-gray-300 mb-2 text-xl">You passed the technical assessment for <strong>{selectedSubCareer}</strong> with an outstanding <strong className="text-emerald-400">{phase2Score}%</strong>.</p>
      <p className="text-gray-500 mb-10 text-md">Your holistic profile, specialized roadmap, and active career opportunities have been successfully unlocked.</p>
      <Button onClick={() => setStep('final-results')} className="w-full py-8 text-xl bg-gradient-to-r from-emerald-500 to-teal-500 font-bold shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02]">
        <Search className="w-6 h-6 mr-3" /> Search Roadmap & Career Opportunities
      </Button>
    </motion.div>
  );

  const renderFinalResults = () => {
    const domain = DOMAINS[domainId];
    const roadmap = ROADMAPS[selectedSubCareer] || { overview: "Generic overview", steps: ["Learn basics", "Practice", "Get certified", "Apply for jobs"], salary: "As per industry standards", skills: ["Communication", "Domain Knowledge"] };
    
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          <div>
            <h1 className="text-3xl font-bold">Holistic Career Profile</h1>
            <p className="text-gray-400">Domain: <span className="text-white font-semibold">{domain.name}</span></p>
          </div>
        </div>

        <div className="p-8 bg-black/60 text-white backdrop-blur-md rounded-2xl border border-white/10 mb-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -z-10" />
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-8 h-8 text-orange-400" />
            <h2 className="text-2xl font-bold text-white">{selectedSubCareer}</h2>
          </div>
          <p className="text-gray-300 mb-8 text-lg">{roadmap.overview}</p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2 p-6 rounded-xl bg-white/5 border border-white/5">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><LayoutDashboard className="w-5 h-5 text-emerald-400" /> Step-by-Step Roadmap</h3>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-emerald-500/30">
                {roadmap.steps.map((step: string, i: number) => (
                  <div key={i} className="relative flex items-center group">
                    <div className="absolute -left-0 w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-300 font-bold text-xs shadow-lg shadow-emerald-500/20 z-10">
                      {i + 1}
                    </div>
                    <div className="ml-12 p-3 w-full rounded-lg bg-white/5 border border-white/10 group-hover:border-emerald-500/30 transition-colors">
                      <p className="text-sm text-gray-200">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-white/5 border border-white/5">
                <h3 className="font-bold mb-3 text-orange-300 text-sm uppercase tracking-wider">Expected Salary</h3>
                <p className="text-2xl font-black text-white">{roadmap.salary}</p>
              </div>
              <div className="p-5 rounded-xl bg-white/5 border border-white/5">
                <h3 className="font-bold mb-3 text-blue-300 text-sm uppercase tracking-wider">Key Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {roadmap.skills.map((s: string) => (
                    <span key={s} className="px-3 py-1 rounded-full text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
            <div>
              <h3 className="font-bold text-blue-400 text-lg flex items-center gap-2"><Briefcase className="w-5 h-5" /> Active Career Opportunities</h3>
              <p className="text-sm text-gray-300">Ready to take the leap? Explore active job listings for {selectedSubCareer} directly on LinkedIn.</p>
            </div>
            <Button onClick={() => window.open(`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(selectedSubCareer)}`, '_blank')} className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap shadow-lg shadow-blue-500/20">
              View Jobs on LinkedIn <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>

        </div>

        {/* Alternative Options */}
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
          <Briefcase className="w-5 h-5 text-gray-400" /> Option B: Explore Other {domain.name} Careers
        </h3>
        <p className="text-sm text-gray-400 mb-6">Curious about other paths in this domain? Select an option below to instantly view its roadmap.</p>
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {domain.subCareers.filter((c: string) => c !== selectedSubCareer).map((career: string) => (
            <div key={career} onClick={() => changeSubCareer(career)} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-gray-400 hover:bg-white/10 transition-all cursor-pointer group">
              <h4 className="font-bold text-md mb-2 group-hover:text-white text-gray-300 transition-colors">{career}</h4>
              <span className="text-gray-500 text-xs font-semibold flex items-center gap-1 group-hover:text-gray-300 transition-colors">View Roadmap <ChevronRight className="w-3 h-3" /></span>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center border-t border-white/10 pt-8 mt-8 pb-10">
          <Button onClick={() => {
            localStorage.removeItem('college_completed');
            localStorage.removeItem('college_domain');
            localStorage.removeItem('college_selected_career');
            setPhase1Answers([]);
            setPhase1QIndex(0);
            setStep('instructions');
          }} variant="ghost" className="text-gray-400 hover:text-white">
            Restart Entire Assessment
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6 text-gray-400 hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>

        {step === 'instructions' && renderInstructions()}
        {step === 'phase1' && renderPhase1()}
        {step === 'domain-results' && renderDomainResults()}
        {step === 'phase2' && renderPhase2()}
        {step === 'phase2-fail' && renderPhase2Fail()}
        {step === 'gateway' && renderGateway()}
        {step === 'final-results' && renderFinalResults()}
      </div>
    </div>
  );
};

export default CollegeAssessment;
