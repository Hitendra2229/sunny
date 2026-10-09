/**
 * NVN India Private LTD - Frontend Application Logic & SQLite API Integration
 * Features: Full Course Syllabi (Zero Fee), Interactive Status Tracker,
 * Project Architecture Estimator, Career Track Quiz & Live SQL Query Sandbox.
 */

// Global Application State
const AppState = {
  isBackendConnected: false,
  apiBase: '/api',
  courses: [],
  filteredCourses: [],
  activeCategory: 'all',
  searchQuery: '',
  projects: [],
  trainees: [],
  consultations: [],
  inquiries: [],
  staffing: [],
  placements: [],
  activeSector: 'all',
  currentSyllabusCourse: null,
  theme: localStorage.getItem('nvn_theme') || 'dark',

  // Estimator State
  estimator: {
    sector: 'Healthcare',
    scope: 'Cloud SaaS',
    security: 'Standard'
  },

  // Career Quiz State
  quiz: {
    step: 1,
    answers: {}
  }
};

// Initialize Application on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  checkBackendHealth();
  setupNavigation();
  setupFormSubmissions();
  setupModals();
  setupSectorFilters();
  setupAdminTabs();
  initEstimator();
  initWorkerEstimator();
  initCareerQuiz();
  initCommandPalette();
  initLivePlayground();
  initTechBot();
  setupQuickDock();
  initGrandShowcase();
});

// ----------------- Grand Showcase Tab Management -----------------
window.switchShowcaseTab = function(tabId) {
  const tabs = document.querySelectorAll('.showcase-tab-btn');
  const panels = document.querySelectorAll('.showcase-panel');
  tabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-tab') === tabId));
  panels.forEach(p => p.classList.toggle('active', p.id === `panel-${tabId}`));
};

function initGrandShowcase() {
  const tabs = ['campus', 'workers', 'academy'];
  let currentIdx = 0;
  let interval = setInterval(() => {
    currentIdx = (currentIdx + 1) % tabs.length;
    if (window.switchShowcaseTab) {
      window.switchShowcaseTab(tabs[currentIdx]);
    }
  }, 7500);

  const container = document.querySelector('.real-showcase-wrapper');
  if (container) {
    container.addEventListener('mouseenter', () => clearInterval(interval));
    container.addEventListener('mouseleave', () => {
      interval = setInterval(() => {
        currentIdx = (currentIdx + 1) % tabs.length;
        if (window.switchShowcaseTab) {
          window.switchShowcaseTab(tabs[currentIdx]);
        }
      }, 7500);
    });
  }
}

// ----------------- Theme Management -----------------
function initTheme() {
  document.documentElement.setAttribute('data-theme', AppState.theme);
  const toggleBtn = document.getElementById('themeToggleBtn');
  if (toggleBtn) {
    toggleBtn.innerHTML = AppState.theme === 'dark' ? '☀️' : '🌙';
    toggleBtn.addEventListener('click', () => {
      AppState.theme = AppState.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', AppState.theme);
      localStorage.setItem('nvn_theme', AppState.theme);
      toggleBtn.innerHTML = AppState.theme === 'dark' ? '☀️' : '🌙';
    });
  }
}

// ----------------- Backend Health & Diagnostics -----------------
async function checkBackendHealth() {
  const statusBadge = document.getElementById('dbConnectionStatus');
  try {
    const res = await fetch(`${AppState.apiBase}/health`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      AppState.isBackendConnected = true;
      if (statusBadge) {
        const engineLabel = data.engine || 'SQL Relational Connected';
        statusBadge.innerHTML = `<span class="pulse-indicator"></span> .NET Core API Active (${engineLabel})`;
        statusBadge.style.color = '#34d399';
      }
      loadInitialDataFromAPI();
      return;
    }
  } catch (err) {
    console.warn("Backend API not reachable directly, using standalone browser storage mode.", err);
  }

  // Fallback to local storage / static seed
  AppState.isBackendConnected = false;
  if (statusBadge) {
    statusBadge.innerHTML = `<span class="pulse-indicator" style="background:#f59e0b; box-shadow:0 0 8px #f59e0b;"></span> Standby Mode (Run .NET Server for Live SQL)`;
    statusBadge.style.color = '#fbbf24';
  }
  loadFallbackData();
}

// ----------------- Initial Data Loading -----------------
async function loadInitialDataFromAPI() {
  try {
    // 1. Fetch Stats
    const statsRes = await fetch(`${AppState.apiBase}/stats`);
    if (statsRes.ok) {
      const statsJson = await statsRes.json();
      updateStatsUI(statsJson.data);
    }

    // 2. Fetch Courses
    const coursesRes = await fetch(`${AppState.apiBase}/courses`);
    if (coursesRes.ok) {
      const coursesJson = await coursesRes.json();
      AppState.courses = coursesJson.data || [];
      AppState.filteredCourses = [...AppState.courses];
      renderCourses(AppState.filteredCourses);
      populateCourseDropdowns(AppState.courses);
    }

    // 3. Fetch Projects
    const projectsRes = await fetch(`${AppState.apiBase}/projects`);
    if (projectsRes.ok) {
      const projJson = await projectsRes.json();
      AppState.projects = projJson.data || [];
      renderProjects(AppState.projects);
    }

    // 4. Fetch Placements
    const placementsRes = await fetch(`${AppState.apiBase}/placements`);
    if (placementsRes.ok) {
      const plJson = await placementsRes.json();
      AppState.placements = plJson.data || [];
      renderPlacements(AppState.placements);
    }

    // 5. Fetch Staffing Requests
    const staffingRes = await fetch(`${AppState.apiBase}/staffing`);
    if (staffingRes.ok) {
      const stJson = await staffingRes.json();
      AppState.staffing = stJson.data || [];
      renderStaffingTable(AppState.staffing);
    }

    // Load Admin data in background
    refreshAdminDashboard();

  } catch (e) {
    console.error("Error loading API data:", e);
    loadFallbackData();
  }
}

function loadFallbackData() {
  // Built-in starter courses with full comprehensive 6-module syllabi (No fees)
  AppState.courses = [
    {
      id: 1,
      code: "NVN-FS-01",
      title: "Full Stack Enterprise Web & Cloud Development",
      category: "Software Engineering",
      duration: "16 Weeks",
      mode: "Hybrid (Online + Lab)",
      description: "Master modern microservices, React 18, Node.js, Python Flask/FastAPI, Docker, and AWS Cloud.",
      technologies: "React 18, TypeScript, Node.js, Express, Python Flask, PostgreSQL, Docker, AWS",
      training_model: "100% Industry-Sponsored Merit Track (Zero Tuition Fee)",
      modules_count: 6,
      syllabus: [
        {
          module_num: 1,
          title: "Modern Frontend Architecture & React 18 Core",
          weeks: "Weeks 1 - 3",
          topics: [
            "Advanced HTML5 Semantics, Responsive CSS3 Grid/Flexbox & Modern Design Systems",
            "Modern JavaScript ES2024 (Closures, Prototypes, Event Loop, Async/Await, Microtasks)",
            "React 18 Functional Architecture, Custom Hooks, Performance Profiling",
            "State Management: Zustand & Context API vs Redux Toolkit",
            "Client-Side Routing, Lazy Loading, Code Splitting & Webpack/Vite Bundling"
          ],
          lab_project: "Build an Enterprise Component Design System & Interactive Dashboard",
          tools: ["React 18", "TypeScript", "Vite", "Zustand", "Tailwind CSS"]
        },
        {
          module_num: 2,
          title: "Backend Microservices & Scalable REST APIs",
          weeks: "Weeks 4 - 6",
          topics: [
            "Node.js Runtime Internals, Event-Driven I/O & Cluster Multiprocessing",
            "Express.js & Python Flask/FastAPI REST API Standards & OpenAPI/Swagger 3.0",
            "Authentication & Authorization: JWT, OAuth 2.0, RBAC, Refresh Token Rotation",
            "Input Validation, Rate Limiting, CORS, Security Headers (Helmet.js), & Sanitization",
            "API Gateway Design, Reverse Proxies (Nginx), and Microservices Communication"
          ],
          lab_project: "Build a High-Throughput Auth & Identity Microservice with Rate Limiting",
          tools: ["Node.js", "Express", "Python FastAPI", "JWT", "Nginx"]
        },
        {
          module_num: 3,
          title: "Enterprise Relational & NoSQL Data Architecture",
          weeks: "Weeks 7 - 9",
          topics: [
            "PostgreSQL & SQLite Deep Dive: Foreign Keys, ACID Transactions, Isolation Levels",
            "Schema Migration, Prisma ORM / SQLAlchemy vs Raw SQL Query Tuning",
            "Database Indexing (B-Trees, Hash, GiST), Query Execution Plans & EXPLAIN ANALYZE",
            "NoSQL Systems (MongoDB) for Unstructured Logs & JSON Documents",
            "In-Memory Caching Strategies with Redis: Cache-Aside, Write-Through, Session Store"
          ],
          lab_project: "Design a Distributed Relational Schema with Caching and Sub-10ms Queries",
          tools: ["PostgreSQL", "SQLite 3", "Redis", "Prisma ORM", "MongoDB"]
        },
        {
          module_num: 4,
          title: "Containerization & Cloud Native AWS Infrastructure",
          weeks: "Weeks 10 - 12",
          topics: [
            "Docker Essentials: Multi-Stage Builds, Layer Caching, Container Security",
            "Multi-Container Orchestration with Docker Compose and Volume Persistence",
            "AWS Core Services: EC2, S3 Object Storage, CloudFront CDN, RDS Managed DBs",
            "Serverless Microservices: AWS Lambda, API Gateway, SQS Queueing",
            "Cloud Networking: VPC, Subnets, Security Groups, Internet Gateways"
          ],
          lab_project: "Containerize Full Stack App and Deploy to AWS with Automated SSL & CDN",
          tools: ["Docker", "AWS EC2", "AWS S3", "RDS", "CloudFront"]
        },
        {
          module_num: 5,
          title: "CI/CD Pipelines, Production Testing & Observability",
          weeks: "Weeks 13 - 14",
          topics: [
            "Automated Testing Pyramid: Unit Testing with Jest/PyTest, Integration Testing",
            "End-to-End Testing with Playwright & Cypress",
            "GitHub Actions Workflows: Linting, Automated Tests, Docker Build & Push to ECR",
            "Zero-Downtime Deployment Strategies: Blue/Green & Rolling Updates",
            "Observability: Centralized Logging, Error Tracking (Sentry), Performance Monitoring"
          ],
          lab_project: "Set Up an Automated Continuous Delivery Pipeline with Automated Rollback",
          tools: ["GitHub Actions", "Jest", "Playwright", "Sentry", "Docker ECR"]
        },
        {
          module_num: 6,
          title: "Live Industrial Capstone: Multi-Tenant Enterprise Platform",
          weeks: "Weeks 15 - 16",
          topics: [
            "Architecture Blueprint for a Multi-Tenant SaaS with Tenant Isolation",
            "Real-Time Collaborative Features with WebSockets and Server-Sent Events",
            "Payment Gateway Integration (Razorpay/Stripe Webhooks, Mandates, Invoicing)",
            "Code Review Sessions with Senior Software Architects",
            "Production Deployment, Load Testing with k6, and Final Architecture Defense"
          ],
          lab_project: "End-to-End Deployment of Multi-Tenant Cloud Platform under Real Traffic",
          tools: ["React", "Node.js", "PostgreSQL", "Redis", "Docker", "AWS"]
        }
      ]
    },
    {
      id: 2,
      code: "NVN-AI-02",
      title: "Applied AI, Machine Learning & Data Science",
      category: "Artificial Intelligence",
      duration: "20 Weeks",
      mode: "Online Interactive",
      description: "Hands-on machine learning, neural architectures, LLMs, computer vision, and predictive analytics.",
      technologies: "Python, PyTorch, TensorFlow, Scikit-Learn, HuggingFace, FastAPI",
      training_model: "100% Industry-Sponsored Merit Track (Zero Tuition Fee)",
      modules_count: 6,
      syllabus: [
        {
          module_num: 1,
          title: "Data Engineering, Applied Mathematics & Scientific Python",
          weeks: "Weeks 1 - 3",
          topics: [
            "Applied Linear Algebra, Matrix Transformations, Multivariate Calculus for AI",
            "Probability Distributions, Inferential Statistics, Hypothesis Testing (A/B Tests)",
            "Vectorized Data Processing with NumPy, High-Performance Wrangling with Pandas",
            "Exploratory Data Analysis (EDA) & Data Visualization with Matplotlib/Seaborn",
            "Feature Engineering, Handling Missing Values, Outlier Detection, Normalization"
          ],
          lab_project: "High-Volume Sensor & Financial Telemetry Cleaning and Feature Pipeline",
          tools: ["Python 3.11", "NumPy", "Pandas", "SciPy", "Matplotlib"]
        },
        {
          module_num: 2,
          title: "Classical Machine Learning & Ensemble Algorithms",
          weeks: "Weeks 4 - 7",
          topics: [
            "Supervised Learning: Ridge/Lasso Regression, Logistic Classification",
            "Tree-Based Models: Decision Trees, Random Forests, Gradient Boosted Trees (XGBoost)",
            "Unsupervised Learning: K-Means Clustering, PCA Dimensionality Reduction",
            "Model Evaluation: ROC-AUC, Precision-Recall, Cross-Validation, Confusion Matrices",
            "Hyperparameter Optimization with Optuna & Automated Machine Learning"
          ],
          lab_project: "Build an Automated Credit Scoring & Loan Default Prediction Engine",
          tools: ["Scikit-Learn", "XGBoost", "LightGBM", "Optuna", "Joblib"]
        },
        {
          module_num: 3,
          title: "Deep Learning & Neural Architectures with PyTorch",
          weeks: "Weeks 8 - 11",
          topics: [
            "Neural Network Fundamentals: Perceptrons, Backpropagation, Gradient Descent, AdamW",
            "PyTorch Tensors, Autograd, Custom Datasets, and DataLoader Pipelines",
            "Convolutional Neural Networks (CNNs) for Computer Vision: ResNet, EfficientNet, YOLO",
            "Transfer Learning & Fine-Tuning Vision Models for Industrial Defect Detection",
            "Model Regularization: Dropout, Batch Normalization, Weight Decay, Early Stopping"
          ],
          lab_project: "Deploy an Industrial Automated Quality Control Defect Detection Model",
          tools: ["PyTorch", "Torchvision", "CUDA", "YOLOv8", "OpenCV"]
        },
        {
          module_num: 4,
          title: "Natural Language Processing, LLMs & Modern RAG Pipelines",
          weeks: "Weeks 12 - 15",
          topics: [
            "Text Processing, Tokenization, Word2Vec, and Self-Attention Mechanisms",
            "The Transformer Architecture: Encoder-Decoder, BERT, RoBERTa, GPT",
            "HuggingFace Ecosystem: Model Hub, Tokenizers, Parameter-Efficient Fine-Tuning (PEFT/LoRA)",
            "Retrieval-Augmented Generation (RAG): Vector Databases (ChromaDB, Pinecone, FAISS)",
            "LangChain & LlamaIndex for Autonomous Agentic Tool-Use and Document Q&A"
          ],
          lab_project: "Enterprise Knowledge-Base RAG Agent with Citation Validation & Guardrails",
          tools: ["HuggingFace", "LangChain", "ChromaDB", "LlamaIndex", "Transformers"]
        },
        {
          module_num: 5,
          title: "MLOps, Model Serving & Automated Pipeline Orchestration",
          weeks: "Weeks 16 - 18",
          topics: [
            "High-Throughput Model Serving with FastAPI & Triton Inference Server",
            "Model Quantization (GGUF, AWQ, ONNX Runtime) for Low-Latency GPU/CPU Inference",
            "Experiment Tracking and Model Versioning with MLflow & DVC",
            "Data Drift and Concept Drift Monitoring in Production with Evidently AI",
            "Containerized Inference on AWS ECS & SageMaker Serverless Endpoints"
          ],
          lab_project: "Production-Ready Microsecond Inference Microservice with Docker & MLflow",
          tools: ["FastAPI", "ONNX", "MLflow", "Evidently AI", "Docker"]
        },
        {
          module_num: 6,
          title: "Live Industrial Capstone: Autonomous Multi-Modal AI System",
          weeks: "Weeks 19 - 20",
          topics: [
            "Architecting End-to-End Enterprise AI Pipeline: Ingestion, Embedding, Inference, UI",
            "Evaluation Frameworks: RAG Triad, BLEU, ROUGE, and Human-in-the-Loop Feedback",
            "Deployment to Production Cloud with Low-Latency Streaming Responses",
            "Final Project Review & Defense with Chief Data Scientists"
          ],
          lab_project: "Live Deployable Enterprise Autonomous AI Assistant with Multi-Modal Vision & Text",
          tools: ["PyTorch", "HuggingFace", "FastAPI", "Vector DB", "AWS"]
        }
      ]
    },
    {
      id: 3,
      code: "NVN-DO-03",
      title: "Cloud DevOps & Kubernetes Infrastructure",
      category: "Cloud & Infrastructure",
      duration: "14 Weeks",
      mode: "Hybrid",
      description: "Automated CI/CD pipelines, container orchestration, IaC with Terraform, and Prometheus monitoring.",
      technologies: "Docker, Kubernetes, Terraform, Jenkins, AWS, Prometheus",
      training_model: "100% Industry-Sponsored Merit Track (Zero Tuition Fee)",
      modules_count: 6,
      syllabus: []
    },
    {
      id: 4,
      code: "NVN-CS-04",
      title: "Cyber Security Analyst & Ethical Hacking",
      category: "Security & Compliance",
      duration: "12 Weeks",
      mode: "Lab Intensive",
      description: "Vulnerability assessment, penetration testing, SIEM analysis, and threat hunting.",
      technologies: "Kali Linux, Wireshark, Metasploit, Burp Suite, Splunk",
      training_model: "100% Industry-Sponsored Merit Track (Zero Tuition Fee)",
      modules_count: 6,
      syllabus: []
    },
    {
      id: 5,
      code: "NVN-JV-05",
      title: "Enterprise Java Spring Boot & Microservices",
      category: "Enterprise Systems",
      duration: "14 Weeks",
      mode: "Online Interactive",
      description: "High-throughput backend engineering for banking, fintech and high-scale corporate apps.",
      technologies: "Java 21, Spring Boot 3, Kafka, Redis, Hibernate, JUnit",
      training_model: "100% Industry-Sponsored Merit Track (Zero Tuition Fee)",
      modules_count: 6,
      syllabus: []
    },
    {
      id: 6,
      code: "NVN-MB-06",
      title: "Cross-Platform Mobile Application Engineering",
      category: "Mobile Development",
      duration: "12 Weeks",
      mode: "Hybrid",
      description: "Cross-platform mobile applications for iOS and Android with single codebase & cloud sync.",
      technologies: "Flutter, Dart, React Native, Firebase, REST APIs",
      training_model: "100% Industry-Sponsored Merit Track (Zero Tuition Fee)",
      modules_count: 6,
      syllabus: []
    },
    {
      id: 7,
      code: "NVN-QA-07",
      title: "QA Automation Engineering & SDET Lead",
      category: "Quality Assurance",
      duration: "12 Weeks",
      mode: "Hybrid",
      description: "Enterprise test automation frameworks, web UI with Playwright/Selenium, API testing, and CI/CD quality gates.",
      technologies: "Playwright, Selenium 4, Cypress, Postman, REST Assured, JMeter, GitHub CI",
      training_model: "100% Industry-Sponsored Merit Track (Zero Tuition Fee)",
      modules_count: 6,
      syllabus: []
    },
    {
      id: 8,
      code: "NVN-DS-08",
      title: "Data Science, Generative AI & LangChain Architecture",
      category: "Data & Analytics",
      duration: "16 Weeks",
      mode: "Online Interactive",
      description: "Applied data engineering, predictive modeling, RAG architectures with LangChain, and production Generative AI microservices.",
      technologies: "Python, Pandas, Scikit-Learn, PyTorch, LangChain, ChromaDB, OpenAI, FastAPI",
      training_model: "100% Industry-Sponsored Merit Track (Zero Tuition Fee)",
      modules_count: 6,
      syllabus: []
    }
  ];

  AppState.placements = [
    {
      id: 1,
      student_name: "Rahul Verma",
      hometown: "Kadapa, AP",
      course_completed: "Cloud DevOps & Kubernetes",
      company_placed: "AWS Partner Network",
      role_offered: "Cloud Solutions Architect",
      package_ctc: "₹14.5 LPA",
      work_location: "Bangalore / Hybrid",
      placement_year: 2026,
      testimonial_quote: "The hands-on Kubernetes and Terraform automation during the NVN Cloud DevOps track was 100x more valuable than 4 years of college theory. I cleared the client technical round on day 1."
    },
    {
      id: 2,
      student_name: "Priya Sharma",
      hometown: "Jammalamadugu, AP",
      course_completed: "Full Stack Web & Cloud",
      company_placed: "TCS Digital Hub",
      role_offered: "Senior Full Stack Engineer",
      package_ctc: "₹12.0 LPA",
      work_location: "Hyderabad",
      placement_year: 2026,
      testimonial_quote: "Zero fees and real enterprise project codebase access! At NVN India, I worked on a live healthcare E-Prescription microservice that prepared me directly for high-scale enterprise engineering."
    },
    {
      id: 3,
      student_name: "K. Mahesh Reddy",
      hometown: "Jammalamadugu, AP",
      course_completed: "Enterprise Java Spring Boot",
      company_placed: "Wipro Technologies",
      role_offered: "Java Backend Engineer",
      package_ctc: "₹8.5 LPA",
      work_location: "Bengaluru",
      placement_year: 2026,
      testimonial_quote: "Being from Jammalamadugu, having NVN India right on Gandikota road changed my career trajectory completely. I mastered Kafka streaming and secured an immediate MNC placement."
    },
    {
      id: 4,
      student_name: "Ankit Nair",
      hometown: "Kurnool, AP",
      course_completed: "Applied AI & Machine Learning",
      company_placed: "Infosys Applied AI",
      role_offered: "AI & Computer Vision Engineer",
      package_ctc: "₹15.2 LPA",
      work_location: "Hyderabad",
      placement_year: 2026,
      testimonial_quote: "Building real YOLO defect-detection models for manufacturing IoT clients gave my GitHub repo immense credibility. NVN mentors held daily code reviews that sharpened my engineering mindset."
    },
    {
      id: 5,
      student_name: "Sai Teja",
      hometown: "Proddatur, AP",
      course_completed: "QA Automation & SDET",
      company_placed: "Cognizant",
      role_offered: "SDET Automation Lead",
      package_ctc: "₹9.2 LPA",
      work_location: "Chennai",
      placement_year: 2026,
      testimonial_quote: "NVN's Playwright and REST API testing tracks are phenomenal. Proddatur to Jammalamadugu was just 20 mins every day to attend the high-speed coding labs."
    },
    {
      id: 6,
      student_name: "Bhavana Varma",
      hometown: "Kadapa, AP",
      course_completed: "Data Science & Generative AI",
      company_placed: "Tech Mahindra",
      role_offered: "Generative AI Specialist",
      package_ctc: "₹11.0 LPA",
      work_location: "Hyderabad",
      placement_year: 2026,
      testimonial_quote: "Learning LangChain RAG pipelines, vector databases and fine-tuning models gave me an enormous advantage in MNC hiring drives."
    },
    {
      id: 7,
      student_name: "Sneha Deshmukh",
      hometown: "Tirupati, AP",
      course_completed: "Cyber Security Analyst",
      company_placed: "Capgemini Cloud Ops",
      role_offered: "DevSecOps & Security Lead",
      package_ctc: "₹13.8 LPA",
      work_location: "Bengaluru",
      placement_year: 2026,
      testimonial_quote: "The SQLite and relational database internals we learned at NVN along with OWASP security auditing gave me a decisive edge. NVN's placement team arranged 5 interview calls within two weeks of graduation."
    },
    {
      id: 8,
      student_name: "M. Divya Sri",
      hometown: "Jammalamadugu, AP",
      course_completed: "Full Stack Web & Cloud",
      company_placed: "HCL Technologies",
      role_offered: "Frontend React Engineer",
      package_ctc: "₹7.8 LPA",
      work_location: "Vijayawada / Remote",
      placement_year: 2026,
      testimonial_quote: "From zero coding background to deploying full stack applications on AWS. NVN India proved that tier-2 students can outperform anyone with proper mentorship."
    }
  ];

  AppState.staffing = [
    {
      id: 1,
      client_name: "Vikramaditya Reddy",
      company_name: "Apex Tech Solutions USA",
      email: "vikram@apextechusa.com",
      phone: "+1 (408) 555-0192",
      role_required: "Full Stack Developer",
      workers_count: 2,
      engagement_model: "Dedicated Full-Time Worker",
      contract_duration: "6 Months",
      budget_range: "INR 80,000 - 1,50,000",
      project_scope: "Building customer onboarding portals in React 18 and Node.js microservices.",
      status: "Deployed"
    },
    {
      id: 2,
      client_name: "Rajesh Kannan",
      company_name: "PayFlow Digital",
      email: "r.kannan@payflow.in",
      phone: "+91 98401 22334",
      role_required: "QA Automation Engineer",
      workers_count: 1,
      engagement_model: "Dedicated Full-Time Worker",
      contract_duration: "12 Months",
      budget_range: "INR 50,000 - 80,000",
      project_scope: "Automating UPI payment gateway regression suites using Playwright.",
      status: "Profiles Shared"
    },
    {
      id: 3,
      client_name: "Michael Sterling",
      company_name: "BioData Labs UK",
      email: "m.sterling@biodata.co.uk",
      phone: "+44 20 7946 0912",
      role_required: "Python & AI Engineer",
      workers_count: 3,
      engagement_model: "Managed Agile Squad",
      contract_duration: "6 Months",
      budget_range: "INR 1,50,000 - 3,00,000",
      project_scope: "Building HIPAA-compliant genomic data ingestion pipeline with LangChain.",
      status: "Requirement Received"
    }
  ];

  AppState.filteredCourses = [...AppState.courses];
  renderCourses(AppState.filteredCourses);
  populateCourseDropdowns(AppState.courses);
  renderPlacements(AppState.placements);
  renderStaffingTable(AppState.staffing);
  renderPlacementsTable(AppState.placements);
}

// ----------------- Rendering Helpers -----------------
function updateStatsUI(stats) {
  if (!stats) return;
  const setEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setEl('statTrainees', `${stats.trainees_count || 5}+`);
  setEl('statConsultations', `${stats.consultations_count || 4}+`);
  setEl('statProjects', `${stats.projects_count || 6}+`);
  setEl('statDelivered', `${stats.delivered_projects || 2}`);
  setEl('adminCountTrainees', stats.trainees_count || 5);
  setEl('adminCountConsultations', stats.consultations_count || 4);
  setEl('adminCountProjects', stats.projects_count || 6);
  setEl('adminCountInquiries', stats.inquiries_count || 3);
  setEl('adminCountStaffing', stats.staffing_count || 3);
  setEl('adminCountPlacements', stats.placements_count || 8);
}

function renderPlacements(placements) {
  const container = document.getElementById('placementsContainer');
  if (!container) return;
  if (!placements || placements.length === 0) return;

  container.innerHTML = placements.map(p => {
    const initials = p.student_name ? p.student_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'NV';
    return `
      <div class="placement-card">
        <div class="placed-avatar-row">
          <div class="placed-avatar">${initials}</div>
          <div>
            <h4 style="font-size: 1rem; margin-bottom: 2px;">${escapeHtml(p.student_name)}</h4>
            <span style="font-size: 0.8rem; color: var(--text-muted);">${escapeHtml(p.role_offered || 'Software Engineer')} • 📍 ${escapeHtml(p.hometown || 'AP')}</span>
          </div>
        </div>
        <span class="placed-company-badge">${escapeHtml(p.company_placed)} • ${escapeHtml(p.package_ctc)}</span>
        <p class="placed-quote">
          "${escapeHtml(p.testimonial_quote || 'NVN India provided the exact production-level software experience and interview preparation needed to secure this dream role.')}"
        </p>
      </div>
    `;
  }).join('');
}

// ----------------- Course Rendering (No Fees + Full Course Trigger) -----------------
function renderCourses(courses) {
  const container = document.getElementById('coursesContainer');
  if (!container) return;

  if (courses.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary); background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-glass);">
        <h3>No courses found matching your criteria.</h3>
        <p style="margin-top: 8px;">Try clearing search keywords or choosing 'All Specializations'.</p>
        <button class="btn btn-secondary" style="margin-top: 14px;" onclick="resetCourseFilters()">Reset Course Filter</button>
      </div>
    `;
    return;
  }

  container.innerHTML = courses.map(course => {
    const techTags = (course.technologies || '')
      .split(',')
      .map(t => `<span class="tech-tag">${t.trim()}</span>`)
      .join('');

    return `
      <div class="course-card">
        <div class="course-header">
          <span class="course-code-badge">${course.code || 'NVN-TECH'}</span>
          <span class="course-duration">
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>
            ${course.duration || '12 Weeks'} • 6 Modules
          </span>
        </div>
        <h3 class="course-title">${course.title}</h3>
        <p class="course-desc">${course.description}</p>
        <div class="course-tech-tags">${techTags}</div>
        
        <div class="course-footer">
          <div class="course-footer-top">
            <span class="course-model-badge">
              <span>⚡</span> 100% Industry Sponsored
            </span>
            <span style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">Zero Tuition Fee</span>
          </div>
          
          <div class="course-actions-group">
            <button class="btn btn-sm btn-secondary" onclick="openSyllabusModal(${course.id})">
              📖 Full Syllabus (6 Modules)
            </button>
            <button class="btn btn-sm btn-primary" onclick="openEnrollmentModal(${course.id}, '${escapeHtml(course.title)}')">
              Apply Track
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Course Filters
function filterCoursesBySearch(term) {
  AppState.searchQuery = term.toLowerCase().trim();
  applyCourseFilters();
}

function filterCoursesByCategory(cat, btn) {
  document.querySelectorAll('.course-cat-pill').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  AppState.activeCategory = cat;
  applyCourseFilters();
}

function resetCourseFilters() {
  AppState.searchQuery = '';
  AppState.activeCategory = 'all';
  const searchInput = document.getElementById('courseSearchInput');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('.course-cat-pill').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-cat') === 'all');
  });
  applyCourseFilters();
}

function applyCourseFilters() {
  AppState.filteredCourses = AppState.courses.filter(c => {
    const matchesCat = AppState.activeCategory === 'all' || (c.category && c.category.toLowerCase().includes(AppState.activeCategory.toLowerCase()));
    const matchesSearch = !AppState.searchQuery || 
      c.title.toLowerCase().includes(AppState.searchQuery) ||
      (c.technologies && c.technologies.toLowerCase().includes(AppState.searchQuery)) ||
      (c.description && c.description.toLowerCase().includes(AppState.searchQuery)) ||
      (c.code && c.code.toLowerCase().includes(AppState.searchQuery));
    return matchesCat && matchesSearch;
  });
  renderCourses(AppState.filteredCourses);
}

// ----------------- Full Course Syllabus Modal Logic -----------------
async function openSyllabusModal(courseId) {
  let course = AppState.courses.find(c => c.id === courseId);
  
  // If syllabus not loaded or empty, fetch from API
  if ((!course || !course.syllabus || course.syllabus.length === 0) && AppState.isBackendConnected) {
    try {
      const res = await fetch(`${AppState.apiBase}/courses/${courseId}`);
      if (res.ok) {
        const json = await res.json();
        course = json.data;
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (!course) {
    showToast("Course curriculum details not available.", "error");
    return;
  }

  AppState.currentSyllabusCourse = course;

  // Set modal header details
  document.getElementById('modalSyllabusCode').textContent = course.code || 'NVN-TECH';
  document.getElementById('syllabusModalTitle').textContent = course.title;
  document.getElementById('modalSyllabusDesc').textContent = course.description || '';
  document.getElementById('modalSyllabusDuration').textContent = course.duration || '12 Weeks';
  document.getElementById('modalSyllabusMode').textContent = course.mode || 'Hybrid';
  document.getElementById('modalSyllabusModulesCount').textContent = `${(course.syllabus && course.syllabus.length) || 6} Comprehensive Modules`;

  // Render Module Accordion
  const accordionList = document.getElementById('syllabusAccordionList');
  const modules = course.syllabus && course.syllabus.length > 0 ? course.syllabus : getDefaultSyllabus(course.code);

  accordionList.innerHTML = modules.map((mod, idx) => {
    const topicsHtml = (mod.topics || []).map(t => `<li>${escapeHtml(t)}</li>`).join('');
    const toolsHtml = (mod.tools || []).map(tool => `<span class="tech-tag">${escapeHtml(tool)}</span>`).join('');

    return `
      <div class="module-accordion-item ${idx === 0 ? 'active' : ''}" id="moduleAccItem_${idx}">
        <div class="module-accordion-header" onclick="toggleAccordionModule(${idx})">
          <div class="module-title-wrap">
            <span class="module-badge-num">M${mod.module_num || idx + 1}</span>
            <div>
              <span class="module-title-text">${mod.title}</span>
              <span class="module-weeks-tag">(${mod.weeks || `Module ${idx + 1}`})</span>
            </div>
          </div>
          <span class="accordion-toggle-arrow">▼</span>
        </div>
        <div class="module-accordion-body">
          <h5 style="font-size:0.82rem; text-transform:uppercase; color:var(--text-muted); margin-bottom:8px;">Topics & Competencies:</h5>
          <ul class="topics-checklist">
            ${topicsHtml}
          </ul>

          ${mod.lab_project ? `
            <div class="lab-project-box">
              <span class="lab-icon">🛠️</span>
              <div>
                <span class="lab-title">Hands-On Industrial Lab Assignment:</span>
                <span class="lab-desc">${escapeHtml(mod.lab_project)}</span>
              </div>
            </div>
          ` : ''}

          ${toolsHtml ? `
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-top:8px;">
              <span style="font-size:0.75rem; color:var(--text-muted);">Key Frameworks & Tools:</span>
              ${toolsHtml}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  openModal('syllabusModal');
}

function toggleAccordionModule(idx) {
  const item = document.getElementById(`moduleAccItem_${idx}`);
  if (item) {
    item.classList.toggle('active');
  }
}

function toggleAllAccordionModules() {
  const items = document.querySelectorAll('.module-accordion-item');
  const allActive = Array.from(items).every(i => i.classList.contains('active'));
  items.forEach(i => i.classList.toggle('active', !allActive));
}

function applyFromCurrentSyllabus() {
  if (!AppState.currentSyllabusCourse) return;
  closeModal('syllabusModal');
  openEnrollmentModal(AppState.currentSyllabusCourse.id, AppState.currentSyllabusCourse.title);
}

function printOrDownloadSyllabus() {
  window.print();
}

function getDefaultSyllabus(code) {
  return [
    {
      module_num: 1,
      title: "Foundations, Core Principles & Toolchain Setup",
      weeks: "Weeks 1 - 2",
      topics: ["Development Environment Configuration & Git CLI Standards", "Architecture Patterns & Algorithmic Rigor", "Linting, Clean Code Conventions & Unit Test Fundamentals"],
      lab_project: "Baseline Engineering Environment & Initial Code Review Pipeline",
      tools: ["Git", "Docker", "VS Code", "Terminal"]
    },
    {
      module_num: 2,
      title: "Core Frameworks & Domain Engineering",
      weeks: "Weeks 3 - 5",
      topics: ["Deep Dive into Specialized Domain Libraries", "State Management & Concurrent Data Pipelines", "Security Standards, Sanitization & Authentication"],
      lab_project: "Build and Test Core Domain Modules with Full Coverage",
      tools: ["Framework Core", "JWT", "REST"]
    },
    {
      module_num: 3,
      title: "Enterprise Architecture & Scalability",
      weeks: "Weeks 6 - 8",
      topics: ["Microservice Interfaces, API Contracts & Documentation", "High-Volume Data Indexing & Query Optimization", "Caching Strategies & Fault Tolerance"],
      lab_project: "Scalable Microservice Architecture with Sub-50ms Response",
      tools: ["PostgreSQL", "Redis", "Nginx"]
    },
    {
      module_num: 4,
      title: "Cloud Deployment & Automated CI/CD",
      weeks: "Weeks 9 - 10",
      topics: ["Containerization with Docker Multi-Stage Builds", "Automated Pipelines with GitHub Actions", "Cloud Infrastructure Hosting & Monitoring"],
      lab_project: "Automate Continuous Deployment to Cloud Sandbox with Health Checks",
      tools: ["Docker", "AWS", "GitHub Actions"]
    },
    {
      module_num: 5,
      title: "Security Auditing & Code Optimization",
      weeks: "Weeks 11",
      topics: ["Static & Dynamic Vulnerability Scanning", "Load Testing with k6 / JMeter under 1,000+ Concurrent Requests", "SLA & Error Budget Implementation"],
      lab_project: "Penetration Audit & High-Load Stress Testing Report",
      tools: ["k6", "OWASP ZAP", "Prometheus"]
    },
    {
      module_num: 6,
      title: "Industrial Live Capstone & Placement Defense",
      weeks: "Weeks 12",
      topics: ["Full Lifecycle Production Capstone Execution", "1-on-1 Code Review with Enterprise Tech Lead", "Resume Audit, Mock Tech Interviews & Placement Drive"],
      lab_project: "Deploy Live Production Project to Real Server with Monitoring",
      tools: ["Full Stack", "Docker", "Cloud", "Sentry"]
    }
  ];
}

// ----------------- Interactive 1: Trainee Status Tracker -----------------
async function lookupTraineeStatus() {
  const query = document.getElementById('trackerQueryInput').value.trim();
  const resultBox = document.getElementById('trackerResultBox');
  if (!query) {
    showToast("Please enter an email address or Application ID.", "info");
    return;
  }

  let trainee = null;

  if (AppState.isBackendConnected) {
    try {
      const res = await fetch(`${AppState.apiBase}/trainees/status?query=${encodeURIComponent(query)}`);
      if (res.ok) {
        const json = await res.json();
        trainee = json.data;
      }
    } catch (e) {
      console.warn(e);
    }
  }

  // Fallback to local search
  if (!trainee) {
    trainee = AppState.trainees.find(t => 
      String(t.id) === query || 
      (t.email && t.email.toLowerCase() === query.toLowerCase())
    );
  }

  if (!trainee) {
    resultBox.style.display = 'block';
    resultBox.innerHTML = `
      <div class="tracker-result-card" style="border-color:rgba(244,63,94,0.4);">
        <h4 style="color:#fb7185;">No Application Found</h4>
        <p style="color:var(--text-secondary); font-size:0.88rem; margin-top:4px;">
          No registered candidate was found matching <code>${escapeHtml(query)}</code>. Please check your spelling or submit a fresh application above!
        </p>
      </div>
    `;
    return;
  }

  // Stepper Stage Calculation
  const stages = ["Applied", "Under Review", "Shortlisted", "Enrolled", "Placed"];
  const currentStatus = trainee.status || "Applied";
  let activeIndex = stages.indexOf(currentStatus);
  if (activeIndex === -1) activeIndex = 0;

  const progressPercent = (activeIndex / (stages.length - 1)) * 100;

  resultBox.style.display = 'block';
  resultBox.innerHTML = `
    <div class="tracker-result-card">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
        <div>
          <span style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); font-weight:700;">Candidate File #${trainee.id}</span>
          <h3 style="font-size:1.4rem; color:var(--text-primary); margin-top:2px;">${escapeHtml(trainee.full_name)}</h3>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="course-code-badge">${escapeHtml(trainee.course_name || 'Tech Academy')}</span>
          <span class="course-model-badge" style="color:#38bdf8; border-color:rgba(56,189,248,0.4); background:rgba(56,189,248,0.1);">
            Current Status: ${currentStatus}
          </span>
        </div>
      </div>

      <!-- Stepper Visualizer -->
      <div class="stepper-container">
        <div class="stepper-progress-line" style="width: calc(${progressPercent}% - 80px);"></div>
        
        <div class="step-node ${activeIndex >= 0 ? (activeIndex === 0 ? 'active' : 'completed') : ''}">
          <div class="node-circle">${activeIndex > 0 ? '✓' : '1'}</div>
          <span class="step-title">Applied</span>
        </div>

        <div class="step-node ${activeIndex >= 1 ? (activeIndex === 1 ? 'active' : 'completed') : ''}">
          <div class="node-circle">${activeIndex > 1 ? '✓' : '2'}</div>
          <span class="step-title">Under Review</span>
        </div>

        <div class="step-node ${activeIndex >= 2 ? (activeIndex === 2 ? 'active' : 'completed') : ''}">
          <div class="node-circle">${activeIndex > 2 ? '✓' : '3'}</div>
          <span class="step-title">Shortlisted</span>
        </div>

        <div class="step-node ${activeIndex >= 3 ? (activeIndex === 3 ? 'active' : 'completed') : ''}">
          <div class="node-circle">${activeIndex > 3 ? '✓' : '4'}</div>
          <span class="step-title">Enrolled</span>
        </div>

        <div class="step-node ${activeIndex >= 4 ? (activeIndex === 4 ? 'active' : 'completed') : ''}">
          <div class="node-circle">${activeIndex >= 4 ? '✓' : '5'}</div>
          <span class="step-title">Placed / Certified</span>
        </div>
      </div>

      <!-- Trainee Profile Details Grid -->
      <div class="tracker-details-grid">
        <div class="tracker-detail-item">
          <div class="tracker-detail-lbl">Contact Email</div>
          <div class="tracker-detail-val">${escapeHtml(trainee.email)}</div>
        </div>
        <div class="tracker-detail-item">
          <div class="tracker-detail-lbl">Learning Track</div>
          <div class="tracker-detail-val">${escapeHtml(trainee.batch_mode || 'Hybrid')} Mode</div>
        </div>
        <div class="tracker-detail-item">
          <div class="tracker-detail-lbl">Assigned Mentor</div>
          <div class="tracker-detail-val" style="color:var(--accent-cyan);">${escapeHtml(trainee.assigned_mentor || 'Senior Architect')}</div>
        </div>
        <div class="tracker-detail-item">
          <div class="tracker-detail-lbl">Next Scheduled Milestone</div>
          <div class="tracker-detail-val" style="color:#34d399;">${escapeHtml(trainee.next_milestone || 'Batch Orientation')}</div>
        </div>
      </div>
    </div>
  `;
}

// ----------------- Interactive 2: 60-Second Career Track Matcher Quiz -----------------
function initCareerQuiz() {
  const questions = [
    {
      step: 1,
      title: "Step 1 of 3: What domain excites you the most?",
      choices: [
        { label: "💻 Full Stack Web & Cloud Apps", val: "FS" },
        { label: "🤖 AI, Machine Learning & LLMs", val: "AI" },
        { label: "☁️ Cloud Infrastructure, Linux & CI/CD", val: "DO" },
        { label: "🛡️ Cyber Defense, Ethical Hacking & VAPT", val: "CS" }
      ]
    },
    {
      step: 2,
      title: "Step 2 of 3: What is your primary language or interest?",
      choices: [
        { label: "JavaScript / TypeScript / React", val: "JS" },
        { label: "Python & Data Science Ecosystem", val: "PY" },
        { label: "Java, Spring Boot & Distributed Banking", val: "JV" },
        { label: "Mobile Apps (Flutter / Dart / iOS / Android)", val: "MB" }
      ]
    },
    {
      step: 3,
      title: "Step 3 of 3: What role are you aiming to secure?",
      choices: [
        { label: "Full Stack SDE at Tech Tier-1 / SaaS", val: "SDE" },
        { label: "AI & Data Engineer / Prompt Architect", val: "AIE" },
        { label: "DevOps & Cloud Reliability Engineer", val: "SRE" },
        { label: "Cyber Security Analyst / SOC Consultant", val: "SEC" }
      ]
    }
  ];

  renderQuizStep(1, questions);
}

function renderQuizStep(stepNum, questions) {
  const qObj = questions.find(q => q.step === stepNum);
  if (!qObj) return;

  const titleEl = document.getElementById('quizQuestionTitle');
  const gridEl = document.getElementById('quizAnswersGrid');
  if (!titleEl || !gridEl) return;

  titleEl.textContent = qObj.title;
  gridEl.innerHTML = qObj.choices.map((c, idx) => `
    <button class="quiz-choice-btn" onclick="selectQuizChoice(${stepNum}, '${c.val}')">
      ${c.label}
    </button>
  `).join('');
}

function selectQuizChoice(stepNum, val) {
  AppState.quiz.answers[`step_${stepNum}`] = val;

  if (stepNum < 3) {
    const questions = [
      {
        step: 2,
        title: "Step 2 of 3: What is your primary language or focus?",
        choices: [
          { label: "JavaScript / TypeScript / React", val: "JS" },
          { label: "Python & Data Science Ecosystem", val: "PY" },
          { label: "Java, Spring Boot & Enterprise Systems", val: "JV" },
          { label: "Mobile Apps (Flutter / React Native)", val: "MB" }
        ]
      },
      {
        step: 3,
        title: "Step 3 of 3: What role are you aiming to secure?",
        choices: [
          { label: "Full Stack SDE at Tech Tier-1 / SaaS", val: "SDE" },
          { label: "AI & Data Engineer / Prompt Architect", val: "AIE" },
          { label: "DevOps & Cloud Reliability Engineer", val: "SRE" },
          { label: "Cyber Security Analyst / SOC Consultant", val: "SEC" }
        ]
      }
    ];
    renderQuizStep(stepNum + 1, questions);
  } else {
    evaluateQuizResult();
  }
}

function evaluateQuizResult() {
  const ans = AppState.quiz.answers;
  let matchedCode = "NVN-FS-01";

  if (ans.step_1 === "AI" || ans.step_2 === "PY" || ans.step_3 === "AIE") {
    matchedCode = "NVN-AI-02";
  } else if (ans.step_1 === "DO" || ans.step_3 === "SRE") {
    matchedCode = "NVN-DO-03";
  } else if (ans.step_1 === "CS" || ans.step_3 === "SEC") {
    matchedCode = "NVN-CS-04";
  } else if (ans.step_2 === "JV") {
    matchedCode = "NVN-JV-05";
  } else if (ans.step_2 === "MB") {
    matchedCode = "NVN-MB-06";
  }

  const course = AppState.courses.find(c => c.code === matchedCode) || AppState.courses[0];
  const resultBox = document.getElementById('quizResultBox');

  if (resultBox && course) {
    resultBox.innerHTML = `
      <div style="font-size:2.8rem; margin-bottom:10px;">🌟</div>
      <span class="course-code-badge" style="margin-bottom:8px;">${course.code}</span>
      <h4 style="font-size:1.3rem; margin:6px 0 10px; color:#ffffff;">${course.title}</h4>
      <p style="color:var(--text-secondary); font-size:0.85rem; margin-bottom:16px;">
        Matched based on your target competencies. 100% Industry-Sponsored Merit Track with full live capstone & placement assistance.
      </p>
      <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
        <button class="btn btn-sm btn-secondary" onclick="openSyllabusModal(${course.id})">
          📖 View Full Curriculum
        </button>
        <button class="btn btn-sm btn-primary" onclick="openEnrollmentModal(${course.id}, '${escapeHtml(course.title)}')">
          Apply for this Specialization
        </button>
      </div>
    `;
    showToast(`Optimal Specialization Matched: ${course.title}`, 'success');
  }
}

// ----------------- Interactive 3: Enterprise IT Architecture & Project Estimator -----------------
function initEstimator() {
  const setupGroup = (containerId, stateKey) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.querySelectorAll('.option-select-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.option-select-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        AppState.estimator[stateKey] = btn.getAttribute('data-val');
        updateEstimatorBlueprint();
      });
    });
  };

  setupGroup('estimatorSectorOptions', 'sector');
  setupGroup('estimatorScopeOptions', 'scope');
  setupGroup('estimatorSecurityOptions', 'security');
  updateEstimatorBlueprint();
}

function updateEstimatorBlueprint() {
  const { sector, scope, security } = AppState.estimator;

  const titleEl = document.getElementById('specTitle');
  const summaryEl = document.getElementById('specSummary');
  const timelineEl = document.getElementById('specTimeline');
  const teamEl = document.getElementById('specTeam');
  const cloudEl = document.getElementById('specCloud');
  const pillsEl = document.getElementById('specTechPills');

  let timeline = "10 - 14 Weeks";
  let team = "1 Lead Architect, 2 SDEs, 1 QA";
  let cloud = "AWS Multi-AZ Hardened";
  let tech = ["React 18", "Python FastAPI", "PostgreSQL", "Docker", "AWS"];

  if (sector === "Healthcare") {
    tech = ["React 18", "Python FastAPI", "WebRTC Video", "PostgreSQL", "Docker", "AWS S3 HIPAA"];
    timeline = "12 - 16 Weeks";
    cloud = "AWS HealthLake / HIPAA Compliant VPC";
    team = "1 Healthcare Architect, 3 SDEs, 1 Compliance QA";
  } else if (sector === "FinTech") {
    tech = ["Spring Boot 3", "Java 21", "Apache Kafka", "Redis Cluster", "PostgreSQL", "Vault"];
    timeline = "16 - 20 Weeks";
    cloud = "Multi-Region Cloud (RBI / PCI-DSS Audit Ready)";
    team = "1 FinTech Security Architect, 4 SDEs, 1 DevOps";
  } else if (sector === "Manufacturing") {
    tech = ["MQTT Broker", "TimescaleDB", "Python PyTorch", "Grafana", "Docker", "SCADA"];
    timeline = "12 - 16 Weeks";
    cloud = "AWS IoT Core & Industrial Edge Gateway";
    team = "1 IoT Systems Architect, 2 SDEs, 1 Data Engineer";
  } else if (sector === "EdTech") {
    tech = ["Next.js", "WebRTC", "AI Proctoring (PyTorch)", "PostgreSQL", "Redis"];
    timeline = "8 - 12 Weeks";
    cloud = "Auto-Scaling AWS Elastic Beanstalk / ECS";
    team = "1 Architect, 2 SDEs, 1 UI/UX Specialist";
  }

  if (titleEl) titleEl.textContent = `${security !== 'Standard' ? security + ' ' : ''}${sector} ${scope}`;
  if (summaryEl) summaryEl.textContent = `Engineered for enterprise scale with automated CI/CD, tenant data isolation, and ${security} security controls.`;
  if (timelineEl) timelineEl.textContent = timeline;
  if (teamEl) teamEl.textContent = team;
  if (cloudEl) cloudEl.textContent = cloud;
  if (pillsEl) {
    pillsEl.innerHTML = tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
  }
}

function applyEstimatorSpecToModal() {
  openModal('projectModal');
  const { sector, scope, security } = AppState.estimator;

  const sectorSelect = document.getElementById('projectSectorSelect');
  const titleInput = document.getElementById('projectTitle');
  const scopeInput = document.getElementById('projectScope');

  if (sectorSelect) sectorSelect.value = sector;
  if (titleInput) titleInput.value = `${security !== 'Standard' ? security + ' ' : ''}${sector} ${scope} Architecture`;
  if (scopeInput) {
    scopeInput.value = `Architecture Specification:\n- Sector: ${sector}\n- Scope: ${scope}\n- Compliance: ${security}\n- Generated by NVN Interactive Spec Engine.`;
  }
}

// ----------------- Interactive 4: Live SQLite Query Sandbox -----------------
function setQueryPreset(sql) {
  const input = document.getElementById('sqlQueryInput');
  if (input) {
    input.value = sql;
    runCustomSqlQuery();
  }
}

async function runCustomSqlQuery() {
  const input = document.getElementById('sqlQueryInput');
  const statusEl = document.getElementById('sqlResultStatus');
  const container = document.getElementById('sqlResultContainer');
  if (!input || !container) return;

  const sql = input.value.trim();
  if (!sql) {
    showToast("Please enter a SQL query.", "info");
    return;
  }

  if (!sql.toUpperCase().startsWith("SELECT")) {
    showToast("Data Safety Rule: Only SELECT queries are permitted in the interactive runner.", "error");
    return;
  }

  if (statusEl) statusEl.textContent = "Executing query on nvn_india.db...";

  try {
    if (AppState.isBackendConnected) {
      const res = await fetch(`${AppState.apiBase}/db/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: sql })
      });
      const json = await res.json();

      if (!json.success) {
        if (statusEl) statusEl.textContent = `❌ SQL Error: ${json.error}`;
        container.innerHTML = `<div style="padding:16px; color:#fb7185; font-family:Consolas, monospace;">${escapeHtml(json.error)}</div>`;
        return;
      }

      const cols = json.columns || [];
      const rows = json.data || [];

      if (statusEl) statusEl.textContent = `✅ Returned ${json.row_count} row(s) in 4ms from SQLite.`;

      if (rows.length === 0) {
        container.innerHTML = `<div style="padding:16px; color:var(--text-muted); text-align:center;">Query executed successfully. 0 rows returned.</div>`;
        return;
      }

      container.innerHTML = `
        <table class="admin-table" style="font-size:0.82rem;">
          <thead>
            <tr>${cols.map(c => `<th>${escapeHtml(c)}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${rows.map(row => `
              <tr>${cols.map(c => `<td>${escapeHtml(row[c] !== null ? String(row[c]) : 'NULL')}</td>`).join('')}</tr>
            `).join('')}
          </tbody>
        </table>
      `;
      return;
    }
  } catch (err) {
    console.error("SQL query error:", err);
  }

  // Fallback demo execution
  if (statusEl) statusEl.textContent = `ℹ️ Showing sample local query preview:`;
  container.innerHTML = `
    <div style="padding:16px; color:var(--text-secondary); font-family:Consolas, monospace;">
      Run 'server.py' to execute live native queries directly against nvn_india.db.
    </div>
  `;
}

// ----------------- Projects Rendering & Filter -----------------
function renderProjects(projects) {
  const container = document.getElementById('projectsContainer');
  if (!container) return;

  const filtered = AppState.activeSector === 'all'
    ? projects
    : projects.filter(p => (p.sector || '').toLowerCase().includes(AppState.activeSector.toLowerCase()));

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary); background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-glass);">
        <h3>No projects found in this sector yet.</h3>
        <p style="margin-top: 8px;">Be the pioneer! Submit a custom software proposal below.</p>
        <button class="btn btn-primary" style="margin-top: 16px;" onclick="openProjectModal('${AppState.activeSector}')">Propose Sector Project</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(p => {
    const sectorClass = getSectorClass(p.sector);
    const statusClass = getStatusClass(p.status);

    return `
      <div class="project-card">
        <div class="project-top-row">
          <span class="sector-tag-pill ${sectorClass}">${p.sector || 'Enterprise IT'}</span>
          <span class="project-status-badge ${statusClass}">${p.status || 'Active'}</span>
        </div>
        <h3 class="project-title">${p.project_title}</h3>
        <span class="project-org">Client: ${p.organization || 'Confidential Client'}</span>
        <p class="project-desc">${p.scope_description}</p>
        <div class="project-meta-row">
          <span><strong>Timeline:</strong> ${p.target_timeline || 'N/A'}</span>
          <span><strong>Client Lead:</strong> ${p.client_name || 'Enterprise'}</span>
        </div>
      </div>
    `;
  }).join('');
}

function getSectorClass(sector) {
  const s = (sector || '').toLowerCase();
  if (s.includes('health')) return 'sector-healthcare';
  if (s.includes('fin')) return 'sector-fintech';
  if (s.includes('commerce') || s.includes('retail')) return 'sector-ecommerce';
  if (s.includes('manufactur') || s.includes('iot')) return 'sector-manufacturing';
  if (s.includes('edtech') || s.includes('education')) return 'sector-edtech';
  if (s.includes('gov') || s.includes('smart')) return 'sector-government';
  return 'sector-fintech';
}

function getStatusClass(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('deliver') || s.includes('complete')) return 'status-delivered';
  if (s.includes('develop') || s.includes('progress')) return 'status-development';
  return 'status-proposal';
}

function setupSectorFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      AppState.activeSector = btn.getAttribute('data-sector') || 'all';
      renderProjects(AppState.projects);
    });
  });
}

function populateCourseDropdowns(courses) {
  const selects = [document.getElementById('modalCourseSelect'), document.getElementById('traineeCourseSelect')];
  selects.forEach(select => {
    if (!select) return;
    const currentVal = select.value;
    select.innerHTML = `<option value="">Select Training Specialization...</option>` +
      courses.map(c => `<option value="${c.id}" data-name="${escapeHtml(c.title)}">${c.code} - ${c.title}</option>`).join('');
    if (currentVal) select.value = currentVal;
  });
}

// ----------------- Form Submissions (REST API / SQLite) -----------------
function setupFormSubmissions() {
  // 1. Trainee Registration Form
  const traineeForm = document.getElementById('traineeEnrollForm');
  if (traineeForm) {
    traineeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const courseSelect = document.getElementById('modalCourseSelect');
      const selectedOption = courseSelect.options[courseSelect.selectedIndex];
      const courseName = selectedOption ? selectedOption.getAttribute('data-name') || selectedOption.text : 'General Academy';

      const payload = {
        full_name: document.getElementById('traineeFullName').value,
        email: document.getElementById('traineeEmail').value,
        phone: document.getElementById('traineePhone').value,
        education: document.getElementById('traineeEducation').value,
        course_id: courseSelect.value || null,
        course_name: courseName,
        batch_mode: document.getElementById('traineeMode').value,
        experience_level: document.getElementById('traineeExp').value,
        statement: document.getElementById('traineeStatement').value
      };

      try {
        if (AppState.isBackendConnected) {
          const res = await fetch(`${AppState.apiBase}/trainees`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const result = await res.json();
          if (result.success) {
            showToast('Student Application Submitted Successfully to Database!', 'success');
            closeModal('enrollmentModal');
            traineeForm.reset();
            refreshAdminDashboard();
            return;
          }
        }
      } catch (err) {
        console.error("API submit error:", err);
      }

      payload.id = Date.now();
      payload.status = 'Applied';
      payload.assigned_mentor = 'Senior Solutions Architect';
      payload.next_milestone = 'Technical Screening';
      AppState.trainees.unshift(payload);
      showToast('Application Recorded in Local System!', 'success');
      closeModal('enrollmentModal');
      traineeForm.reset();
      renderTraineesTable(AppState.trainees);
    });
  }

  // 2. IT Consultation Booking Form
  const consultForm = document.getElementById('consultationForm');
  if (consultForm) {
    consultForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        client_name: document.getElementById('consultClientName').value,
        organization: document.getElementById('consultOrganization').value,
        email: document.getElementById('consultEmail').value,
        phone: document.getElementById('consultPhone').value,
        consultancy_domain: document.getElementById('consultDomain').value,
        preferred_date: document.getElementById('consultDate').value,
        budget_range: document.getElementById('consultBudget').value,
        requirements: document.getElementById('consultRequirements').value
      };

      try {
        if (AppState.isBackendConnected) {
          const res = await fetch(`${AppState.apiBase}/consultations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const result = await res.json();
          if (result.success) {
            showToast('Consultation Booked! Our IT Architects will reach out.', 'success');
            closeModal('consultationModal');
            consultForm.reset();
            refreshAdminDashboard();
            return;
          }
        }
      } catch (err) {
        console.error("API submit error:", err);
      }

      payload.id = Date.now();
      payload.status = 'Pending';
      AppState.consultations.unshift(payload);
      showToast('Consultation Saved (Local Mode)!', 'success');
      closeModal('consultationModal');
      consultForm.reset();
      renderConsultationsTable(AppState.consultations);
    });
  }

  // 3. Sector Project Proposal Form
  const projectForm = document.getElementById('projectRFPForm');
  if (projectForm) {
    projectForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        client_name: document.getElementById('projectClientName').value,
        organization: document.getElementById('projectOrg').value,
        email: document.getElementById('projectEmail').value,
        phone: document.getElementById('projectPhone').value,
        sector: document.getElementById('projectSectorSelect').value,
        project_title: document.getElementById('projectTitle').value,
        scope_description: document.getElementById('projectScope').value,
        target_timeline: document.getElementById('projectTimeline').value,
        budget_range: document.getElementById('projectBudget').value
      };

      try {
        if (AppState.isBackendConnected) {
          const res = await fetch(`${AppState.apiBase}/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const result = await res.json();
          if (result.success) {
            showToast('Project RFP successfully stored in database!', 'success');
            closeModal('projectModal');
            projectForm.reset();
            const pRes = await fetch(`${AppState.apiBase}/projects`);
            const pData = await pRes.json();
            AppState.projects = pData.data || [];
            renderProjects(AppState.projects);
            refreshAdminDashboard();
            return;
          }
        }
      } catch (err) {
        console.error("API submit error:", err);
      }

      payload.id = Date.now();
      payload.status = 'Proposal Received';
      AppState.projects.unshift(payload);
      renderProjects(AppState.projects);
      showToast('Project RFP Added (Local Mode)!', 'success');
      closeModal('projectModal');
      projectForm.reset();
      renderProjectsTable(AppState.projects);
    });
  }

  // 4. Contact / General Inquiry Form
  const contactForm = document.getElementById('generalContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        sender_name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        phone: document.getElementById('contactPhone').value,
        subject: document.getElementById('contactSubject').value,
        message: document.getElementById('contactMessage').value
      };

      try {
        if (AppState.isBackendConnected) {
          const res = await fetch(`${AppState.apiBase}/inquiries`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const result = await res.json();
          if (result.success) {
            showToast('Message sent! Stored in NVN India system.', 'success');
            contactForm.reset();
            refreshAdminDashboard();
            return;
          }
        }
      } catch (err) {
        console.error("Contact submit error:", err);
      }

      payload.id = Date.now();
      payload.status = 'New';
      AppState.inquiries.unshift(payload);
      showToast('Message received and recorded!', 'success');
      contactForm.reset();
      renderInquiriesTable(AppState.inquiries);
    });
  }

  // 5. Worker for Client Staffing Request Modal Form
  const staffingForm = document.getElementById('staffingRequestModalForm');
  if (staffingForm) {
    staffingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        client_name: document.getElementById('staffingClientName').value,
        company_name: document.getElementById('staffingCompany').value,
        email: document.getElementById('staffingEmail').value,
        phone: document.getElementById('staffingPhone').value,
        role_required: document.getElementById('staffingRole').value,
        workers_count: parseInt(document.getElementById('staffingWorkersCount').value, 10) || 1,
        engagement_model: document.getElementById('staffingModel').value,
        contract_duration: document.getElementById('staffingDuration').value,
        budget_range: document.getElementById('staffingBudget').value,
        project_scope: document.getElementById('staffingScope').value
      };

      try {
        if (AppState.isBackendConnected) {
          const res = await fetch(`${AppState.apiBase}/staffing`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const result = await res.json();
          if (result.success) {
            showToast('Staffing Request Submitted! Pre-vetted candidate profiles will be deployed in 48 hours.', 'success');
            closeModal('staffingModal');
            staffingForm.reset();
            refreshAdminDashboard();
            return;
          }
        }
      } catch (err) {
        console.error("Staffing submit error:", err);
      }

      payload.id = Date.now();
      payload.status = 'Requirement Received';
      AppState.staffing.unshift(payload);
      showToast('Staffing Request Recorded (Local Mode)!', 'success');
      closeModal('staffingModal');
      staffingForm.reset();
      renderStaffingTable(AppState.staffing);
    });
  }

  // 6. Enterprise Consultation & Campus Visit Modal Form
  const modalConsultForm = document.getElementById('consultationModalForm');
  if (modalConsultForm) {
    modalConsultForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        client_name: document.getElementById('modalConsultName').value,
        organization: document.getElementById('modalConsultOrg').value,
        email: document.getElementById('modalConsultEmail').value,
        phone: document.getElementById('modalConsultPhone').value,
        consultancy_domain: document.getElementById('modalConsultDomain').value,
        preferred_date: document.getElementById('modalConsultDate').value,
        budget_range: 'Standard Advisory',
        requirements: document.getElementById('modalConsultReq').value
      };

      try {
        if (AppState.isBackendConnected) {
          const res = await fetch(`${AppState.apiBase}/consultations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const result = await res.json();
          if (result.success) {
            showToast('Advisory / Campus Visit Booked! Our Jammalamadugu team will connect.', 'success');
            closeModal('consultationModal');
            modalConsultForm.reset();
            refreshAdminDashboard();
            return;
          }
        }
      } catch (err) {
        console.error("API consult modal error:", err);
      }

      payload.id = Date.now();
      payload.status = 'Pending';
      AppState.consultations.unshift(payload);
      showToast('Consultation Recorded (Local Mode)!', 'success');
      closeModal('consultationModal');
      modalConsultForm.reset();
      renderConsultationsTable(AppState.consultations);
    });
  }
}

// ----------------- Admin Dashboard & Database Explorer -----------------
function setupAdminTabs() {
  const tabs = document.querySelectorAll('.admin-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.admin-tab-panel').forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-target');
      const panel = document.getElementById(targetId);
      if (panel) panel.classList.add('active');

      if (targetId === 'adminTabDiagnostics') {
        loadDiagnosticsView();
      } else if (targetId === 'adminTabSqlRunner') {
        runCustomSqlQuery();
      }
    });
  });

  const resetBtn = document.getElementById('btnResetDatabase');
  if (resetBtn) {
    resetBtn.addEventListener('click', async () => {
      if (!confirm("Are you sure you want to reset and re-seed the SQLite database with clean enterprise starter records?")) return;

      try {
        if (AppState.isBackendConnected) {
          const res = await fetch(`${AppState.apiBase}/db/reset`, { method: 'POST' });
          const json = await res.json();
          if (json.success) {
            showToast('Database reset and seeded with default records!', 'success');
            loadInitialDataFromAPI();
            return;
          }
        }
      } catch (e) {
        console.error("Reset error:", e);
      }
      showToast('Database reset applied.', 'info');
      loadFallbackData();
    });
  }

  const exportBtn = document.getElementById('btnExportDatabase');
  if (exportBtn) {
    exportBtn.addEventListener('click', async () => {
      try {
        if (AppState.isBackendConnected) {
          const res = await fetch(`${AppState.apiBase}/db/export`);
          const json = await res.json();
          downloadJSON(json.data, `nvn_india_db_export_${Date.now()}.json`);
          showToast('Database JSON backup downloaded!', 'success');
          return;
        }
      } catch (e) {
        console.error("Export error:", e);
      }
      downloadJSON(AppState, `nvn_india_local_export_${Date.now()}.json`);
    });
  }
}

async function refreshAdminDashboard() {
  if (!AppState.isBackendConnected) return;

  try {
    const [traineesRes, consultsRes, projRes, inqRes, staffRes, placRes] = await Promise.all([
      fetch(`${AppState.apiBase}/trainees`),
      fetch(`${AppState.apiBase}/consultations`),
      fetch(`${AppState.apiBase}/projects`),
      fetch(`${AppState.apiBase}/inquiries`),
      fetch(`${AppState.apiBase}/staffing`),
      fetch(`${AppState.apiBase}/placements`)
    ]);

    if (traineesRes.ok) {
      const data = await traineesRes.json();
      AppState.trainees = data.data || [];
      renderTraineesTable(AppState.trainees);
    }
    if (consultsRes.ok) {
      const data = await consultsRes.json();
      AppState.consultations = data.data || [];
      renderConsultationsTable(AppState.consultations);
    }
    if (projRes.ok) {
      const data = await projRes.json();
      AppState.projects = data.data || [];
      renderProjectsTable(AppState.projects);
    }
    if (inqRes.ok) {
      const data = await inqRes.json();
      AppState.inquiries = data.data || [];
      renderInquiriesTable(AppState.inquiries);
    }
    if (staffRes.ok) {
      const data = await staffRes.json();
      AppState.staffing = data.data || [];
      renderStaffingTable(AppState.staffing);
    }
    if (placRes.ok) {
      const data = await placRes.json();
      AppState.placements = data.data || [];
      renderPlacementsTable(AppState.placements);
      renderPlacements(AppState.placements);
    }

    const statsRes = await fetch(`${AppState.apiBase}/stats`);
    if (statsRes.ok) {
      const statsJson = await statsRes.json();
      updateStatsUI(statsJson.data);
    }
  } catch (err) {
    console.warn("Could not refresh admin data from API:", err);
  }
}

function renderTraineesTable(trainees) {
  const tbody = document.getElementById('traineesTableBody');
  if (!tbody) return;

  if (trainees.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:24px; color:var(--text-secondary);">No trainee applications registered yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = trainees.map(t => `
    <tr>
      <td>#${t.id}</td>
      <td><strong>${escapeHtml(t.full_name)}</strong><br><small style="color:var(--text-muted);">${escapeHtml(t.email)}</small></td>
      <td>${escapeHtml(t.phone || '-')}</td>
      <td><span class="course-code-badge" style="font-size:0.75rem;">${escapeHtml(t.course_name || 'General')}</span><br><small style="color:var(--text-muted);">${escapeHtml(t.batch_mode || 'Hybrid')}</small></td>
      <td>${escapeHtml(t.education || '-')}</td>
      <td>
        <select class="table-status-select" onchange="updateTraineeStatus(${t.id}, this.value)">
          <option value="Applied" ${t.status === 'Applied' ? 'selected' : ''}>Applied</option>
          <option value="Under Review" ${t.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
          <option value="Shortlisted" ${t.status === 'Shortlisted' ? 'selected' : ''}>Shortlisted</option>
          <option value="Enrolled" ${t.status === 'Enrolled' ? 'selected' : ''}>Enrolled</option>
          <option value="Placed" ${t.status === 'Placed' ? 'selected' : ''}>Placed</option>
          <option value="Completed" ${t.status === 'Completed' ? 'selected' : ''}>Completed</option>
        </select>
      </td>
      <td>
        <button class="btn-delete-record" onclick="deleteTraineeRecord(${t.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

async function updateTraineeStatus(id, newStatus) {
  if (AppState.isBackendConnected) {
    try {
      await fetch(`${AppState.apiBase}/trainees/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      showToast(`Trainee #${id} status updated to ${newStatus}`, 'success');
      refreshAdminDashboard();
      return;
    } catch (e) {
      console.error(e);
    }
  }
  const item = AppState.trainees.find(t => t.id === id);
  if (item) item.status = newStatus;
  showToast(`Trainee status updated to ${newStatus}`, 'info');
}

async function deleteTraineeRecord(id) {
  if (!confirm(`Are you sure you want to delete trainee application #${id}?`)) return;

  if (AppState.isBackendConnected) {
    try {
      await fetch(`${AppState.apiBase}/trainees/${id}`, { method: 'DELETE' });
      showToast(`Trainee #${id} deleted`, 'info');
      refreshAdminDashboard();
      return;
    } catch (e) {
      console.error(e);
    }
  }
  AppState.trainees = AppState.trainees.filter(t => t.id !== id);
  renderTraineesTable(AppState.trainees);
  showToast(`Record #${id} removed`, 'info');
}

function renderConsultationsTable(consultations) {
  const tbody = document.getElementById('consultationsTableBody');
  if (!tbody) return;

  if (consultations.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:24px; color:var(--text-secondary);">No IT consultations booked yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = consultations.map(c => `
    <tr>
      <td>#${c.id}</td>
      <td><strong>${escapeHtml(c.client_name)}</strong><br><small style="color:var(--accent-cyan);">${escapeHtml(c.organization || 'Individual')}</small></td>
      <td>${escapeHtml(c.email)}<br><small style="color:var(--text-muted);">${escapeHtml(c.phone || '-')}</small></td>
      <td><strong>${escapeHtml(c.consultancy_domain)}</strong><br><small style="color:var(--text-secondary);">${escapeHtml(c.budget_range || 'Flexible')}</small></td>
      <td><span style="font-size:0.8rem; color:var(--text-muted);">${escapeHtml(c.preferred_date || 'ASAP')}</span></td>
      <td>
        <select class="table-status-select" onchange="updateConsultationStatus(${c.id}, this.value)">
          <option value="Pending" ${c.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="Scheduled" ${c.status === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
          <option value="In Progress" ${c.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
          <option value="Completed" ${c.status === 'Completed' ? 'selected' : ''}>Completed</option>
        </select>
      </td>
      <td>
        <button class="btn-delete-record" onclick="deleteConsultationRecord(${c.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

async function updateConsultationStatus(id, newStatus) {
  if (AppState.isBackendConnected) {
    try {
      await fetch(`${AppState.apiBase}/consultations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      showToast(`Consultation #${id} updated to ${newStatus}`, 'success');
      refreshAdminDashboard();
      return;
    } catch (e) {
      console.error(e);
    }
  }
  const item = AppState.consultations.find(c => c.id === id);
  if (item) item.status = newStatus;
  showToast(`Status updated to ${newStatus}`, 'info');
}

async function deleteConsultationRecord(id) {
  if (!confirm(`Delete consultation request #${id}?`)) return;
  if (AppState.isBackendConnected) {
    try {
      await fetch(`${AppState.apiBase}/consultations/${id}`, { method: 'DELETE' });
      showToast(`Consultation #${id} removed`, 'info');
      refreshAdminDashboard();
      return;
    } catch (e) {
      console.error(e);
    }
  }
  AppState.consultations = AppState.consultations.filter(c => c.id !== id);
  renderConsultationsTable(AppState.consultations);
}

function renderProjectsTable(projects) {
  const tbody = document.getElementById('projectsTableBody');
  if (!tbody) return;

  if (projects.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:24px; color:var(--text-secondary);">No projects registered.</td></tr>`;
    return;
  }

  tbody.innerHTML = projects.map(p => `
    <tr>
      <td>#${p.id}</td>
      <td><strong>${escapeHtml(p.project_title)}</strong><br><small style="color:var(--text-muted);">${escapeHtml(p.organization || '-')}</small></td>
      <td><span class="sector-tag-pill ${getSectorClass(p.sector)}" style="font-size:0.7rem;">${escapeHtml(p.sector)}</span></td>
      <td>${escapeHtml(p.client_name)}<br><small style="color:var(--text-muted);">${escapeHtml(p.email)}</small></td>
      <td>${escapeHtml(p.target_timeline || '-')}</td>
      <td>
        <select class="table-status-select" onchange="updateProjectStatus(${p.id}, this.value)">
          <option value="Proposal Received" ${p.status === 'Proposal Received' ? 'selected' : ''}>Proposal Received</option>
          <option value="Scoping Call" ${p.status === 'Scoping Call' ? 'selected' : ''}>Scoping Call</option>
          <option value="Under Development" ${p.status === 'Under Development' ? 'selected' : ''}>Under Development</option>
          <option value="Delivered" ${p.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
        </select>
      </td>
      <td>
        <button class="btn-delete-record" onclick="deleteProjectRecord(${p.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

async function updateProjectStatus(id, newStatus) {
  if (AppState.isBackendConnected) {
    try {
      await fetch(`${AppState.apiBase}/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      showToast(`Project #${id} status changed to ${newStatus}`, 'success');
      refreshAdminDashboard();
      return;
    } catch (e) {
      console.error(e);
    }
  }
  const item = AppState.projects.find(p => p.id === id);
  if (item) item.status = newStatus;
  renderProjects(AppState.projects);
}

async function deleteProjectRecord(id) {
  if (!confirm(`Delete project record #${id}?`)) return;
  if (AppState.isBackendConnected) {
    try {
      await fetch(`${AppState.apiBase}/projects/${id}`, { method: 'DELETE' });
      showToast(`Project #${id} deleted`, 'info');
      refreshAdminDashboard();
      return;
    } catch (e) {
      console.error(e);
    }
  }
  AppState.projects = AppState.projects.filter(p => p.id !== id);
  renderProjects(AppState.projects);
  renderProjectsTable(AppState.projects);
}

function renderInquiriesTable(inquiries) {
  const tbody = document.getElementById('inquiriesTableBody');
  if (!tbody) return;

  if (inquiries.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:24px; color:var(--text-secondary);">No inquiries received.</td></tr>`;
    return;
  }

  tbody.innerHTML = inquiries.map(i => `
    <tr>
      <td>#${i.id}</td>
      <td><strong>${escapeHtml(i.sender_name)}</strong><br><small style="color:var(--text-muted);">${escapeHtml(i.email)}</small></td>
      <td><strong>${escapeHtml(i.subject)}</strong></td>
      <td style="max-width:300px;"><small style="color:var(--text-secondary);">${escapeHtml(i.message)}</small></td>
      <td>
        <select class="table-status-select" onchange="updateInquiryStatus(${i.id}, this.value)">
          <option value="New" ${i.status === 'New' ? 'selected' : ''}>New</option>
          <option value="Contacted" ${i.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
          <option value="Resolved" ${i.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
        </select>
      </td>
      <td>
        <button class="btn-delete-record" onclick="deleteInquiryRecord(${i.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

async function updateInquiryStatus(id, newStatus) {
  if (AppState.isBackendConnected) {
    try {
      await fetch(`${AppState.apiBase}/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      showToast(`Inquiry #${id} marked as ${newStatus}`, 'success');
      refreshAdminDashboard();
      return;
    } catch (e) {
      console.error(e);
    }
  }
  const item = AppState.inquiries.find(inq => inq.id === id);
  if (item) item.status = newStatus;
  showToast(`Inquiry #${id} updated`, 'info');
}

async function deleteInquiryRecord(id) {
  if (!confirm(`Delete inquiry #${id}?`)) return;
  if (AppState.isBackendConnected) {
    try {
      await fetch(`${AppState.apiBase}/inquiries/${id}`, { method: 'DELETE' });
      showToast(`Inquiry #${id} deleted`, 'info');
      refreshAdminDashboard();
      return;
    } catch (e) {
      console.error(e);
    }
  }
  AppState.inquiries = AppState.inquiries.filter(i => i.id !== id);
  renderInquiriesTable(AppState.inquiries);
}

function renderStaffingTable(staffing) {
  const tbody = document.getElementById('staffingTableBody');
  if (!tbody) return;

  if (!staffing || staffing.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:24px; color:var(--text-secondary);">No client worker staffing requests yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = staffing.map(s => `
    <tr>
      <td>#${s.id}</td>
      <td><strong>${escapeHtml(s.client_name)}</strong><br><small style="color:var(--text-muted);">${escapeHtml(s.company_name || '-')}</small></td>
      <td><small>${escapeHtml(s.email)}<br>${escapeHtml(s.phone || '-')}</small></td>
      <td><span class="course-code-badge" style="background:rgba(16,185,129,0.15); color:var(--accent-emerald); border-color:rgba(16,185,129,0.3); font-size:0.75rem;">${escapeHtml(s.role_required)}</span></td>
      <td>${s.workers_count || 1} Worker(s)<br><small style="color:var(--text-muted);">${escapeHtml(s.engagement_model || 'Full-Time')}</small></td>
      <td>${escapeHtml(s.contract_duration || '-')}<br><small style="color:#34d399;">${escapeHtml(s.budget_range || '-')}</small></td>
      <td>
        <select class="table-status-select" onchange="updateStaffingStatus(${s.id}, this.value)">
          <option value="Requirement Received" ${s.status === 'Requirement Received' ? 'selected' : ''}>Requirement Received</option>
          <option value="Profiles Shared" ${s.status === 'Profiles Shared' ? 'selected' : ''}>Profiles Shared</option>
          <option value="Client Interview" ${s.status === 'Client Interview' ? 'selected' : ''}>Client Interview</option>
          <option value="Deployed" ${s.status === 'Deployed' ? 'selected' : ''}>Deployed</option>
          <option value="Trial Period" ${s.status === 'Trial Period' ? 'selected' : ''}>Trial Period</option>
          <option value="Completed" ${s.status === 'Completed' ? 'selected' : ''}>Completed</option>
        </select>
      </td>
      <td>
        <button class="btn-delete-record" onclick="deleteStaffingRecord(${s.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

async function updateStaffingStatus(id, newStatus) {
  if (AppState.isBackendConnected) {
    try {
      await fetch(`${AppState.apiBase}/staffing/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      showToast(`Staffing request #${id} updated to ${newStatus}`, 'success');
      refreshAdminDashboard();
      return;
    } catch (e) {
      console.error(e);
    }
  }
  const item = AppState.staffing.find(s => s.id === id);
  if (item) item.status = newStatus;
  renderStaffingTable(AppState.staffing);
}

async function deleteStaffingRecord(id) {
  if (!confirm(`Are you sure you want to delete staffing request #${id}?`)) return;
  if (AppState.isBackendConnected) {
    try {
      await fetch(`${AppState.apiBase}/staffing/${id}`, { method: 'DELETE' });
      showToast(`Staffing request #${id} deleted`, 'info');
      refreshAdminDashboard();
      return;
    } catch (e) {
      console.error(e);
    }
  }
  AppState.staffing = AppState.staffing.filter(s => s.id !== id);
  renderStaffingTable(AppState.staffing);
}

function renderPlacementsTable(placements) {
  const tbody = document.getElementById('placementsTableBody');
  if (!tbody) return;

  if (!placements || placements.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:24px; color:var(--text-secondary);">No placement records recorded.</td></tr>`;
    return;
  }

  tbody.innerHTML = placements.map(p => `
    <tr>
      <td>#${p.id}</td>
      <td><strong>${escapeHtml(p.student_name)}</strong><br><small style="color:var(--accent-cyan);">📍 ${escapeHtml(p.hometown || 'AP')}</small></td>
      <td><span class="course-code-badge" style="font-size:0.75rem;">${escapeHtml(p.course_completed)}</span></td>
      <td><strong style="color:#34d399;">${escapeHtml(p.company_placed)}</strong></td>
      <td>${escapeHtml(p.role_offered || '-')}<br><strong style="color:var(--accent-emerald);">${escapeHtml(p.package_ctc || '-')}</strong></td>
      <td>${escapeHtml(p.work_location || '-')}</td>
      <td>${p.placement_year || 2026}</td>
      <td style="max-width:240px;"><small style="color:var(--text-secondary); font-style:italic;">"${escapeHtml(p.testimonial_quote || '-')}"</small></td>
    </tr>
  `).join('');
}

// ----------------- Worker for Client Estimator & Modals -----------------
function initWorkerEstimator() {
  updateWorkerCalculation();
}

function updateWorkerCalculation() {
  const roleEl = document.getElementById('calcWorkerRole');
  const levelEl = document.getElementById('calcWorkerLevel');
  const countEl = document.getElementById('calcWorkersCount');
  const modelEl = document.getElementById('calcWorkerModel');
  const durationEl = document.getElementById('calcWorkerDuration');

  if (!roleEl || !countEl) return;

  const role = roleEl.value;
  const level = levelEl ? levelEl.value : 'Mid-Level';
  const count = parseInt(countEl.value, 10) || 1;
  const model = modelEl ? modelEl.value : 'Dedicated Full-Time Worker';
  const duration = durationEl ? durationEl.value : '6 Months';

  const countDisplay = document.getElementById('calcWorkersCountDisplay');
  if (countDisplay) countDisplay.textContent = count;

  const baseRates = {
    'Full Stack Developer': 75000,
    'Python & AI Engineer': 85000,
    'Enterprise Java Specialist': 80000,
    'QA Automation Engineer': 65000,
    'Cloud/DevOps Specialist': 90000,
    'Mobile App Engineer': 75000
  };

  const levelMultipliers = {
    'Junior': 0.8,
    'Mid-Level': 1.0,
    'Senior': 1.35,
    'Lead': 1.65
  };

  const modelMultipliers = {
    'Dedicated Full-Time Worker': 1.0,
    'Hourly Contract': 1.15,
    'Managed Agile Squad': 1.25
  };

  const durationDiscounts = {
    '3 Months': 1.0,
    '6 Months': 0.95,
    '12 Months': 0.90
  };

  const baseRate = baseRates[role] || 75000;
  const levelMult = levelMultipliers[level] || 1.0;
  const modelMult = modelMultipliers[model] || 1.0;
  const durationDiscount = durationDiscounts[duration] || 1.0;

  const monthlyPerWorker = Math.round(baseRate * levelMult * modelMult * durationDiscount);
  const totalMonthlyInr = monthlyPerWorker * count;
  const totalMonthlyUsd = Math.round(totalMonthlyInr / 83.5);

  const inrEl = document.getElementById('calcCostInr');
  const usdEl = document.getElementById('calcCostUsd');
  const summaryRoleEl = document.getElementById('calcSummaryRole');
  const summaryHoursEl = document.getElementById('calcSummaryHours');

  if (inrEl) inrEl.textContent = `₹${totalMonthlyInr.toLocaleString('en-IN')}`;
  if (usdEl) usdEl.textContent = `Approx. $${totalMonthlyUsd.toLocaleString('en-US')} USD / month`;
  if (summaryRoleEl) summaryRoleEl.textContent = `${count}x ${level} ${role}`;
  if (summaryHoursEl) summaryHoursEl.textContent = `${count * 160} Total Engineering Hours / mo`;
}

function applyWorkerCalcToModal() {
  const roleEl = document.getElementById('calcWorkerRole');
  const countEl = document.getElementById('calcWorkersCount');
  const modelEl = document.getElementById('calcWorkerModel');
  const durationEl = document.getElementById('calcWorkerDuration');

  openModal('staffingModal');

  if (roleEl) {
    const sRole = document.getElementById('staffingRole');
    if (sRole) sRole.value = roleEl.value;
  }
  if (countEl) {
    const sCount = document.getElementById('staffingWorkersCount');
    if (sCount) {
      const val = parseInt(countEl.value, 10);
      sCount.value = val >= 5 ? '5+' : String(val);
    }
  }
  if (modelEl) {
    const sModel = document.getElementById('staffingModel');
    if (sModel) {
      if (modelEl.value.includes('Full-Time')) sModel.value = 'Dedicated Full-Time Worker';
      else if (modelEl.value.includes('Hourly')) sModel.value = 'Hourly Flexible Contract';
      else sModel.value = 'Managed Agile Squad';
    }
  }
  if (durationEl) {
    const sDur = document.getElementById('staffingDuration');
    if (sDur) sDur.value = durationEl.value;
  }
}

function openStaffingModal(role, count) {
  openModal('staffingModal');
  if (role) {
    const sRole = document.getElementById('staffingRole');
    if (sRole) sRole.value = role;
  }
  if (count) {
    const sCount = document.getElementById('staffingWorkersCount');
    if (sCount) sCount.value = String(count);
  }
}

function loadDiagnosticsView() {
  const diagBox = document.getElementById('sqlDiagnosticsBox');
  if (!diagBox) return;

  const schemaInfo = `
========================================================================
NVN INDIA PRIVATE LIMITED - LIVE SQLITE RELATIONAL DATABASE DIAGNOSTICS
========================================================================
Storage Engine    : SQLite 3.x with WAL / Native OS Concurrency
Database File     : nvn_india.db
Headquarters      : Jammalamadugu, Kadapa District, Andhra Pradesh - 516434
Active Connection : ${AppState.isBackendConnected ? 'Connected (Flask REST API Server Active)' : 'Standalone Local / Memory Cache'}
Training Model    : 100% Industry Sponsored Merit Tracks (Zero Fees)
Last Refreshed    : ${new Date().toISOString()}

RELATIONAL TABLES & RECORD COUNTS:
------------------------------------------------------------------------
1. [courses]           : ${AppState.courses.length} Comprehensive Curricula (Full 6-Module Syllabi Stored)
2. [trainees]          : ${AppState.trainees.length} Student Trainee Applications & Lifecycle Tracking
3. [consultations]     : ${AppState.consultations.length} Enterprise IT Architecture & Campus Bookings
4. [projects]          : ${AppState.projects.length} Multi-Sector Software Deployments
5. [inquiries]         : ${AppState.inquiries.length} Public & Corporate Inquiries
6. [staffing_requests] : ${AppState.staffing.length} Dedicated Client Engineer Deployments (Worker for Client)
7. [placements]        : ${AppState.placements.length} Alumni Placements (TCS, Infosys, Wipro, Cognizant, etc.)

INDEX STRUCTURE:
------------------------------------------------------------------------
- idx_trainees_email       ON trainees(email)
- idx_trainees_status      ON trainees(status)
- idx_consultations_status ON consultations(status)
- idx_projects_sector      ON projects(sector)
- idx_projects_status      ON projects(status)
- idx_staffing_status      ON staffing_requests(status)

API ENDPOINTS AVAILABLE:
------------------------------------------------------------------------
- GET  /api/health
- GET  /api/stats
- GET  /api/courses
- GET  /api/courses/:id
- GET  /api/trainees        | POST /api/trainees       | PATCH /api/trainees/:id
- GET  /api/trainees/status?query=...
- GET  /api/consultations   | POST /api/consultations  | PATCH /api/consultations/:id
- GET  /api/projects        | POST /api/projects       | PATCH /api/projects/:id
- GET  /api/inquiries       | POST /api/inquiries      | PATCH /api/inquiries/:id
- GET  /api/staffing        | POST /api/staffing       | PATCH /api/staffing/:id  | DELETE /api/staffing/:id
- GET  /api/placements      | POST /api/placements
- POST /api/db/query        (Safe Interactive SELECT SQL execution)
- GET  /api/db/export
- POST /api/db/reset
`;
  diagBox.textContent = schemaInfo;
}

// ----------------- Modal Management -----------------
function setupModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

function openEnrollmentModal(courseId, courseTitle) {
  openModal('enrollmentModal');
  const select = document.getElementById('modalCourseSelect');
  if (select && courseId) {
    select.value = courseId;
  }
}

function openConsultationModal(domain) {
  openModal('consultationModal');
  const select = document.getElementById('consultDomain');
  if (select && domain) {
    select.value = domain;
  }
}

function openProjectModal(sector) {
  openModal('projectModal');
  const select = document.getElementById('projectSectorSelect');
  if (select && sector && sector !== 'all') {
    select.value = sector;
  }
}

// ----------------- Toast Alerts -----------------
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span style="font-size:1.2rem;">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
    <span style="flex-grow:1;">${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ----------------- Utility Helpers -----------------
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportTableToCSV(tableId, filename) {
  const table = document.getElementById(tableId);
  if (!table) return;

  const rows = Array.from(table.querySelectorAll('tr'));
  const csvContent = rows.map(row => {
    const cells = Array.from(row.querySelectorAll('th, td'));
    return cells.map(cell => {
      let text = cell.innerText.replace(/"/g, '""').replace(/\n/g, ' ');
      return `"${text}"`;
    }).join(',');
  }).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`CSV Export downloaded: ${filename}`, 'success');
}

function setupNavigation() {
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isVisible = navLinks.style.display === 'flex';
      navLinks.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '76px';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'var(--bg-secondary)';
        navLinks.style.padding = '20px';
        navLinks.style.boxShadow = 'var(--shadow-lg)';
      }
    });
  }
}

// ==========================================================================
// 1. SPOTLIGHT COMMAND PALETTE (Ctrl + K / Cmd + K)
// ==========================================================================
const CommandPaletteState = {
  isOpen: false,
  selectedIndex: 0,
  commands: [
    // Academy & Syllabi (All 8 Tracks)
    { id: 'track-fs', title: 'Full-Stack Web Architecture (16 Weeks)', category: 'Academy Syllabus', icon: '💻', action: () => openSyllabusModalByCode('NVN-FS-01') },
    { id: 'track-ai', title: 'AI & Applied Machine Learning (20 Weeks)', category: 'Academy Syllabus', icon: '🧠', action: () => openSyllabusModalByCode('NVN-AI-02') },
    { id: 'track-devops', title: 'Cloud DevOps & Kubernetes (16 Weeks)', category: 'Academy Syllabus', icon: '☁️', action: () => openSyllabusModalByCode('NVN-CL-03') },
    { id: 'track-sec', title: 'Cyber Security Analyst & Ethical Hacking (12 Weeks)', category: 'Academy Syllabus', icon: '🛡️', action: () => openSyllabusModalByCode('NVN-CS-04') },
    { id: 'track-java', title: 'Enterprise Java Spring Boot & Microservices (14 Weeks)', category: 'Academy Syllabus', icon: '☕', action: () => openSyllabusModalByCode('NVN-JV-05') },
    { id: 'track-mob', title: 'Cross-Platform Mobile Engineering (12 Weeks)', category: 'Academy Syllabus', icon: '📱', action: () => openSyllabusModalByCode('NVN-MB-06') },
    { id: 'track-qa', title: 'QA Automation Engineering & SDET Lead (12 Weeks)', category: 'Academy Syllabus', icon: '🧪', action: () => openSyllabusModalByCode('NVN-QA-07') },
    { id: 'track-ds', title: 'Data Science, Generative AI & LangChain (16 Weeks)', category: 'Academy Syllabus', icon: '🤖', action: () => openSyllabusModalByCode('NVN-DS-08') },
    
    // Core Actions & Modals
    { id: 'action-staffing', title: 'Hire Dedicated Worker for Client (Staff Augmentation)', category: 'Worker for Client', icon: '👥', action: () => openStaffingModal() },
    { id: 'action-calc-worker', title: 'Worker Cost & Dedicated Team Estimator', category: 'Worker for Client', icon: '💰', action: () => scrollToSection('clientWorkers') },
    { id: 'action-enroll', title: 'Enroll in All Courses (100% Free / Sponsored)', category: 'Academy', icon: '📝', action: () => openEnrollmentModal() },
    { id: 'action-consult', title: 'Book Enterprise IT Advisory / Campus Visit', category: 'Action', icon: '💼', action: () => openConsultationModal() },
    { id: 'action-rfp', title: 'Propose Sector Software Project (Submit RFP)', category: 'Action', icon: '🌐', action: () => openProjectModal() },
    { id: 'action-theme', title: 'Toggle Light / Dark Theme', category: 'Utility', icon: '🌓', action: () => toggleTheme() },

    // Interactive Tools & Navigation
    { id: 'nav-jammalamadugu', title: 'Jammalamadugu Tech Campus & Headquarters', category: 'Campus Hub', icon: '🏛️', action: () => scrollToSection('jammalamaduguHub') },
    { id: 'nav-placements', title: 'Placed Trainees Hall of Fame & Packages', category: 'Placements', icon: '🌟', action: () => scrollToSection('placementStories') },
    { id: 'nav-tracker', title: 'Track Trainee Application Lifecycle Status', category: 'Tool', icon: '🔍', action: () => scrollToSection('statusTracker') },
    { id: 'nav-playground', title: 'Live Code Sandbox & Microservices Terminal', category: 'Tool', icon: '⚡', action: () => scrollToSection('livePlayground') },
    { id: 'nav-estimator', title: 'IT Architecture & Project Spec Estimator', category: 'Tool', icon: '🧮', action: () => scrollToSection('projectEstimator') },
    { id: 'nav-quiz', title: 'Take 60-Second Career Track Matcher Quiz', category: 'Tool', icon: '🎯', action: () => scrollToSection('careerQuiz') },
    { id: 'nav-roadmap', title: 'View 6-Stage Industrial Career Acceleration Roadmap', category: 'Academy', icon: '🗺️', action: () => scrollToSection('careerRoadmap') },
    { id: 'nav-admin', title: 'SQLite Relational Database Explorer & SQL Console', category: 'Database', icon: '🗄️', action: () => scrollToSection('adminSection') },
    { id: 'nav-contact', title: 'Contact Jammalamadugu Headquarters (WhatsApp / Call)', category: 'Company', icon: '📞', action: () => scrollToSection('contact') }
  ],
  filteredList: []
};

function initCommandPalette() {
  CommandPaletteState.filteredList = [...CommandPaletteState.commands];
  
  // Global Shortcut: Ctrl+K or Cmd+K
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openCommandPalette();
    } else if (e.key === 'Escape' && CommandPaletteState.isOpen) {
      closeCommandPalette();
    }
  });

  const overlay = document.getElementById('commandPaletteOverlay');
  const input = document.getElementById('commandSearchInput');

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeCommandPalette();
    });
  }

  if (input) {
    input.addEventListener('input', (e) => {
      filterCommandPalette(e.target.value);
    });

    input.addEventListener('keydown', (e) => {
      const items = CommandPaletteState.filteredList;
      if (!items.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        CommandPaletteState.selectedIndex = (CommandPaletteState.selectedIndex + 1) % items.length;
        renderCommandPaletteList();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        CommandPaletteState.selectedIndex = (CommandPaletteState.selectedIndex - 1 + items.length) % items.length;
        renderCommandPaletteList();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executeSelectedCommand();
      }
    });
  }
}

function openCommandPalette() {
  const overlay = document.getElementById('commandPaletteOverlay');
  const input = document.getElementById('commandSearchInput');
  if (!overlay) return;

  CommandPaletteState.isOpen = true;
  CommandPaletteState.selectedIndex = 0;
  CommandPaletteState.filteredList = [...CommandPaletteState.commands];
  overlay.classList.add('active');

  if (input) {
    input.value = '';
    renderCommandPaletteList();
    setTimeout(() => input.focus(), 50);
  }
}

function closeCommandPalette() {
  const overlay = document.getElementById('commandPaletteOverlay');
  if (!overlay) return;
  CommandPaletteState.isOpen = false;
  overlay.classList.remove('active');
}

function filterCommandPalette(query) {
  const q = query.trim().toLowerCase();
  if (!q) {
    CommandPaletteState.filteredList = [...CommandPaletteState.commands];
  } else {
    CommandPaletteState.filteredList = CommandPaletteState.commands.filter(cmd => 
      cmd.title.toLowerCase().includes(q) || 
      cmd.category.toLowerCase().includes(q)
    );
  }
  CommandPaletteState.selectedIndex = 0;
  renderCommandPaletteList();
}

function renderCommandPaletteList() {
  const listEl = document.getElementById('commandResultsList');
  if (!listEl) return;

  const items = CommandPaletteState.filteredList;
  if (!items.length) {
    listEl.innerHTML = `
      <li style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
        No commands found matching your query.
      </li>
    `;
    return;
  }

  listEl.innerHTML = items.map((cmd, idx) => `
    <li class="command-item ${idx === CommandPaletteState.selectedIndex ? 'selected' : ''}" 
        onclick="executeCommandAtIndex(${idx})">
      <div class="command-item-left">
        <span class="command-item-icon">${cmd.icon}</span>
        <div>
          <div style="font-weight: 600; color: var(--text-primary); font-size: 0.92rem;">${escapeHtml(cmd.title)}</div>
        </div>
      </div>
      <span class="command-item-cat">${escapeHtml(cmd.category)}</span>
    </li>
  `).join('');

  // Auto-scroll selected into view
  const selectedEl = listEl.children[CommandPaletteState.selectedIndex];
  if (selectedEl) {
    selectedEl.scrollIntoView({ block: 'nearest' });
  }
}

function executeSelectedCommand() {
  const items = CommandPaletteState.filteredList;
  if (!items.length) return;
  const cmd = items[CommandPaletteState.selectedIndex];
  if (cmd && typeof cmd.action === 'function') {
    closeCommandPalette();
    cmd.action();
  }
}

function executeCommandAtIndex(idx) {
  const items = CommandPaletteState.filteredList;
  if (items[idx] && typeof items[idx].action === 'function') {
    closeCommandPalette();
    items[idx].action();
  }
}

function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function openSyllabusModalByCode(courseCode) {
  const course = AppState.courses.find(c => c.course_code === courseCode);
  if (course) {
    openSyllabusModal(course);
  } else {
    scrollToSection('academy');
  }
}


// ==========================================================================
// 2. INTERACTIVE LIVE CODE & ARCHITECTURE PLAYGROUND
// ==========================================================================
const PlaygroundCodeStore = {
  fastapi: `from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel, Field
import sqlite3

app = FastAPI(
    title="NVN India Enterprise API Gateway",
    version="3.4.0",
    description="High-Throughput Microservice Architecture"
)

class TraineeApplication(BaseModel):
    full_name: str = Field(..., example="Aarav Sharma")
    email: str = Field(..., example="aarav@domain.com")
    track_code: str = Field(..., example="NVN-FS-01")
    academic_cgpa: float = Field(..., ge=6.0, le=10.0)

@app.post("/api/v1/trainees/enroll", status_code=status.HTTP_201_CREATED)
async def enroll_trainee(payload: TraineeApplication):
    """
    Submits application directly into NVN India's relational database.
    Zero tuition fees applied. 100% company-sponsored track.
    """
    conn = sqlite3.connect("nvn_india.db")
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO trainees (name, email, course_code, status, tuition_fee) VALUES (?, ?, ?, 'Under Review', 0.0)",
        (payload.full_name, payload.email, payload.track_code)
    )
    conn.commit()
    conn.close()
    return {"status": "SUCCESS", "message": "Enrolled in 16-Week Zero-Fee Track"}`,

  react: `import React, { useState, useEffect } from 'react';

export interface ArchitectureMetricProps {
  systemName: string;
  uptimeSla: number;
  activeNodes: number;
}

export const CloudArchitectureDashboard: React.FC<ArchitectureMetricProps> = ({
  systemName = "NVN Core Microservice Grid",
  uptimeSla = 99.99,
  activeNodes = 24
}) => {
  const [latency, setLatency] = useState<number>(3.8);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Number((3.2 + Math.random() * 1.2).toFixed(2)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glassmorphic-card cyber-border p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-cyan-400">{systemName}</h3>
        <span className="badge-emerald animate-pulse">Production Live</span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>Uptime: <strong className="text-emerald-400">{uptimeSla}%</strong></div>
        <div>Nodes: <strong className="text-cyan-400">{activeNodes} Ready</strong></div>
        <div>Edge Latency: <strong className="text-amber-400">{latency} ms</strong></div>
      </div>
    </div>
  );
};`,

  k8s: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: nvn-india-api-service
  namespace: production
  labels:
    app: nvn-enterprise-gateway
    tier: microservice
spec:
  replicas: 5
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: nvn-enterprise-gateway
  template:
    metadata:
      labels:
        app: nvn-enterprise-gateway
    spec:
      containers:
      - name: api-server
        image: registry.nvnindia.internal/services/core-api:v3.4.0
        ports:
        - containerPort: 5000
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 5000
          initialDelaySeconds: 15
          periodSeconds: 10`,

  pytorch: `import torch
import torch.nn as nn
import torch.optim as optim

class NVNDefectClassifier(nn.Module):
    """
    Industrial IoT Computer Vision Model developed in NVN AI Academy.
    Detects micro-fractures in high-speed manufacturing conveyor lines.
    """
    def __init__(self, num_classes=4):
        super().__init__()
        self.backbone = nn.Sequential(
            nn.Conv2d(3, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.AdaptiveAvgPool2d((1, 1))
        )
        self.classifier = nn.Linear(128, num_classes)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        features = self.backbone(x)
        features = torch.flatten(features, 1)
        return self.classifier(features)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = NVNDefectClassifier().to(device)
print(f"Model initialized on: {device} | Total Parameters: {sum(p.numel() for p in model.parameters())}")`
};

let activePlaygroundTab = 'fastapi';

function initLivePlayground() {
  switchPlaygroundTab('fastapi');
}

function switchPlaygroundTab(tabKey) {
  activePlaygroundTab = tabKey;
  
  const tabIds = {
    fastapi: 'tabFastAPI',
    react: 'tabReact',
    k8s: 'tabK8s',
    pytorch: 'tabPyTorch'
  };

  Object.entries(tabIds).forEach(([key, id]) => {
    const btn = document.getElementById(id);
    if (btn) {
      if (key === tabKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  });

  const previewArea = document.getElementById('codePreviewArea');
  if (previewArea) {
    const rawCode = PlaygroundCodeStore[tabKey] || '';
    previewArea.innerText = rawCode;
  }
}

function simulatePlaygroundRun() {
  const statusText = document.getElementById('playgroundStatusText');
  if (!statusText) return;

  statusText.innerHTML = '<span style="color:#f59e0b;">⏳ Compiling and dispatching test pod...</span>';
  
  setTimeout(() => {
    statusText.innerHTML = '<span style="color:#00f2fe;">⚡ Running unit tests &amp; benchmark profile...</span>';
  }, 600);

  setTimeout(() => {
    statusText.innerHTML = '<span style="color:#10b981;">✅ Verified: 18/18 Tests Passed • Build Deployed (3.8ms latency)</span>';
    showToast('Simulation Succeeded: Architecture test passed with 0 errors.', 'success');
  }, 1400);
}

function copyPlaygroundSnippet() {
  const code = PlaygroundCodeStore[activePlaygroundTab] || '';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(code).then(() => {
      showToast('Code snippet copied to clipboard!', 'success');
    }).catch(() => {
      fallbackCopyText(code);
    });
  } else {
    fallbackCopyText(code);
  }
}

function fallbackCopyText(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
  showToast('Code snippet copied to clipboard!', 'success');
}


// ==========================================================================
// 3. SMART FLOATING AI TECHBOT ASSISTANT
// ==========================================================================
const TechBotState = {
  isOpen: false
};

function initTechBot() {
  // Ready
}

function toggleTechBot() {
  const win = document.getElementById('techBotWindow');
  if (!win) return;
  TechBotState.isOpen = !TechBotState.isOpen;
  if (TechBotState.isOpen) {
    win.classList.add('active');
    const input = document.getElementById('techBotInput');
    if (input) setTimeout(() => input.focus(), 100);
  } else {
    win.classList.remove('active');
  }
}

function askTechBot(question) {
  const input = document.getElementById('techBotInput');
  if (input) {
    input.value = question;
    submitTechBotMessage(question);
  }
}

function handleTechBotSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('techBotInput');
  if (!input) return;
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  submitTechBotMessage(msg);
}

function submitTechBotMessage(userText) {
  appendTechBotMessage(userText, 'user');
  
  // Show typing or micro-delay
  setTimeout(() => {
    const botReply = generateTechBotResponse(userText);
    appendTechBotMessage(botReply, 'bot');
  }, 350);
}

function appendTechBotMessage(htmlContent, sender) {
  const container = document.getElementById('chatMessagesContainer');
  if (!container) return;

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}`;
  bubble.innerHTML = htmlContent;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

function generateTechBotResponse(userText) {
  const q = userText.toLowerCase();

  if (q.includes('free') || q.includes('fee') || q.includes('cost') || q.includes('tuition') || q.includes('price')) {
    return `
      🎓 <strong>Zero Tuition Fee Policy:</strong><br>
      All courses at <strong>NVN India Academy</strong> are <strong>100% Industry-Sponsored</strong>. We do NOT charge students any tuition fees. Admission is purely merit-based following our screening test.
      <br><br>
      <button class="btn btn-sm btn-primary" onclick="openEnrollmentModal()">Apply for Free Track</button>
    `;
  }

  if (q.includes('worker') || q.includes('staffing') || q.includes('hire') || q.includes('developer') || q.includes('client') || q.includes('dedicated')) {
    return `
      👥 <strong>Worker for Client (Staff Augmentation):</strong><br>
      NVN India Private Limited deploys pre-vetted engineers directly into your client sprints within <strong>48 hours</strong>:
      <ul style="margin:6px 0 8px 18px; font-size:0.85rem;">
        <li><strong>Talent:</strong> Full Stack (React/Node), Python AI, Java Spring Boot, QA Automation, Cloud DevOps &amp; Mobile developers.</li>
        <li><strong>Risk-Free Trial:</strong> 1-Week (5-Day) sprint evaluation before long-term commitment.</li>
        <li><strong>Transparent Rates:</strong> ₹55,000 - ₹1,20,000 / month ($820 - $1,500/mo) — saves up to 65% vs local recruitment.</li>
        <li>100% IP assignment, strict NDA, and daily agile video scrums.</li>
      </ul>
      <div style="display:flex; gap:8px; margin-top:8px;">
        <button class="btn btn-sm btn-emerald" onclick="openStaffingModal()">Hire Dedicated Worker</button>
        <button class="btn btn-sm btn-secondary" onclick="scrollToSection('clientWorkers')">Cost Estimator</button>
      </div>
    `;
  }

  if (q.includes('jammalamadugu') || q.includes('location') || q.includes('address') || q.includes('where') || q.includes('campus') || q.includes('visit') || q.includes('office')) {
    return `
      🏛️ <strong>Headquarters &amp; Tech Innovation Campus:</strong><br>
      <strong>NVN India Private Limited</strong><br>
      Tech Innovation Campus &amp; Software Development Center,<br>
      D.No. 1/674, Opposite to Town Church, Upstairs,<br>
      <strong>Jammalamadugu</strong>, YSR Kadapa District, Andhra Pradesh - 516434, India.<br>
      <br>
      • 📞 Helpline / Mobile: <strong><a href="tel:+918639092368" style="color:#38bdf8;">+91 86390 92368</a></strong><br>
      • 💬 WhatsApp: <strong><a href="https://wa.me/918639092368" target="_blank" style="color:#34d399;">+91 86390 92368</a></strong><br>
      • ✉️ Email: <strong><a href="mailto:nvnindiapvtltd@gmail.com" style="color:#38bdf8;">nvnindiapvtltd@gmail.com</a></strong><br>
      • 🚗 Transit: 20 mins from Proddatur (18km), 1 hr 15 mins from Kadapa (65km).<br>
      <br>
      <button class="btn btn-sm btn-primary" onclick="openConsultationModal()">Schedule a Campus Visit</button>
    `;
  }

  if (q.includes('placement') || q.includes('salary') || q.includes('package') || q.includes('alumni') || q.includes('placed') || q.includes('job') || q.includes('hiring partner')) {
    return `
      🌟 <strong>100% Placement Support &amp; Alumni Hall of Fame:</strong><br>
      Our graduates have achieved verified placements across top IT firms:
      <ul style="margin:6px 0 8px 18px; font-size:0.85rem;">
        <li><strong>Highest Package:</strong> ₹15.2 LPA (Infosys AI) &amp; ₹14.5 LPA (AWS Partner)</li>
        <li><strong>Top Hiring Partners:</strong> TCS, Infosys, Wipro, Cognizant, Tech Mahindra, HCL, Accenture, Capgemini.</li>
        <li><strong>Mentorship:</strong> System design interview prep, mock code rounds, and direct corporate placement drives.</li>
      </ul>
      <button class="btn btn-sm btn-primary" onclick="scrollToSection('placementStories')">View Placements Hall of Fame</button>
    `;
  }

  if (q.includes('course') || q.includes('training') || q.includes('allcourses') || q.includes('syllabus') || q.includes('curriculum')) {
    return `
      🎓 <strong>All Courses IT Training (100% Industry Sponsored):</strong><br>
      We offer 8 comprehensive career tracks (12-20 weeks, zero tuition fee):
      <ul style="margin:6px 0 8px 18px; font-size:0.85rem;">
        <li>1. Full Stack Enterprise Web &amp; Cloud (React 18 / Node / Python)</li>
        <li>2. Applied AI, Machine Learning &amp; Computer Vision</li>
        <li>3. Cloud DevOps &amp; Kubernetes (AWS / Terraform)</li>
        <li>4. Cyber Security Analyst &amp; Ethical Hacking</li>
        <li>5. Enterprise Java Spring Boot &amp; Microservices</li>
        <li>6. Cross-Platform Mobile Apps (Flutter / React Native)</li>
        <li>7. QA Automation Engineering &amp; SDET Lead (Playwright)</li>
        <li>8. Data Science, Generative AI &amp; LangChain Architecture</li>
      </ul>
      <button class="btn btn-sm btn-primary" onclick="openEnrollmentModal()">Enroll in Academy</button>
    `;
  }

  if (q.includes('consultancy') || q.includes('service') || q.includes('advisory') || q.includes('cloud')) {
    return `
      💼 <strong>NVN India IT Consultancy Services:</strong><br>
      We specialize in:
      <ul style="margin:6px 0 8px 18px; font-size:0.85rem;">
        <li>Cloud-Native Migration (AWS, Azure, GCP, K8s)</li>
        <li>Enterprise Zero-Trust Cybersecurity &amp; VAPT</li>
        <li>Legacy Monolith to Microservices Refactoring</li>
        <li>Bespoke Industrial AI/ML Engineering &amp; IoT</li>
      </ul>
      <button class="btn btn-sm btn-secondary" onclick="openConsultationModal()">Book Strategic Consultation</button>
    `;
  }

  if (q.includes('project') || q.includes('healthcare') || q.includes('fintech') || q.includes('ecommerce') || q.includes('rfp')) {
    return `
      🏥 <strong>Sector Solutions Experience:</strong><br>
      NVN India builds bespoke software across <strong>every sector where IT is required</strong>, including:
      <ul style="margin:6px 0 8px 18px; font-size:0.85rem;">
        <li>Healthcare (Telehealth, EHR, MedTech)</li>
        <li>FinTech (UPI Core Gateways, Fraud Detection)</li>
        <li>Manufacturing (IoT Edge &amp; Computer Vision)</li>
        <li>EdTech &amp; Smart City Infrastructure</li>
      </ul>
      <button class="btn btn-sm btn-emerald" onclick="openProjectModal()">Propose an RFP Project</button>
    `;
  }

  if (q.includes('track') || q.includes('status') || q.includes('application') || q.includes('id')) {
    return `
      🔍 <strong>Application Tracking:</strong><br>
      You can track your live candidate status using your registered email address or Application ID (e.g. <code>aarav.sharma@example.com</code> or <code>1</code>).
      <br><br>
      <button class="btn btn-sm btn-secondary" onclick="scrollToSection('statusTracker')">Jump to Tracker</button>
    `;
  }

  if (q.includes('database') || q.includes('sqlite') || q.includes('admin') || q.includes('sql')) {
    return `
      🗄️ <strong>Database Management Console:</strong><br>
      NVN India portal runs on an active SQLite relational database (<code>nvn_india.db</code>). You can inspect courses, trainee applications, staffing requests, and execute safe queries directly in the admin console.
      <br><br>
      <button class="btn btn-sm btn-admin" onclick="scrollToSection('adminSection')">Open Database Console</button>
    `;
  }

  if (q.includes('contact') || q.includes('phone') || q.includes('email')) {
    return `
      📍 <strong>NVN India Private Limited Contacts:</strong><br>
      • Innovation Campus HQ: D.No. 1/674, Opposite to Town Church, Upstairs, Jammalamadugu, AP - 516434<br>
      • Direct WhatsApp: <strong><a href="https://wa.me/918639092368" target="_blank" style="color:#34d399;">+91 86390 92368</a></strong><br>
      • Mobile / Helpline: <strong><a href="tel:+918639092368" style="color:#38bdf8;">+91 86390 92368</a></strong><br>
      • Email: <strong><a href="mailto:nvnindiapvtltd@gmail.com" style="color:#38bdf8;">nvnindiapvtltd@gmail.com</a></strong><br>
      • Working Hours: Mon - Sat: 9:00 AM - 7:30 PM IST
    `;
  }

  // Fallback response with helpful links
  return `
    🤖 I can assist you with:
    <div style="margin-top:8px; display:flex; flex-direction:column; gap:6px;">
      <a href="#clientWorkers" onclick="toggleTechBot()" style="color:var(--accent-emerald);">▸ Worker for Client: Hire Dedicated Tech Engineers</a>
      <a href="#academy" onclick="toggleTechBot()" style="color:var(--accent-cyan);">▸ All Courses IT Training (100% Industry Sponsored)</a>
      <a href="#placementStories" onclick="toggleTechBot()" style="color:var(--accent-cyan);">▸ Placements Hall of Fame &amp; Hiring Partners</a>
      <a href="#jammalamaduguHub" onclick="toggleTechBot()" style="color:var(--accent-cyan);">▸ Jammalamadugu Innovation Campus &amp; Labs</a>
      <a href="#projects" onclick="toggleTechBot()" style="color:var(--accent-cyan);">▸ Software Projects for Any Industry Sector</a>
      <a href="#statusTracker" onclick="toggleTechBot()" style="color:var(--accent-cyan);">▸ Real-Time Application Lifecycle Tracker</a>
      <a href="#adminSection" onclick="toggleTechBot()" style="color:var(--accent-cyan);">▸ Relational SQLite Database Explorer</a>
    </div>
  `;
}


// ==========================================================================
// 4. FLOATING QUICK-ACCESS DOCK ACTIVE SCROLL SYNC
// ==========================================================================
function setupQuickDock() {
  const sections = ['academy', 'statusTracker', 'consultancy', 'projects', 'livePlayground', 'projectEstimator', 'adminSection'];
  const dockLinks = document.querySelectorAll('.dock-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          current = id;
        }
      }
    });

    dockLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${current}`) {
        link.classList.add('active-highlight');
      } else {
        link.classList.remove('active-highlight');
      }
    });
  }, { passive: true });
}

