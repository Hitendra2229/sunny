-- ============================================================================
-- NVN India Private LTD - Relational Database Schema (SQLite)
-- Designed for IT Solutions, Trainee Academy, IT Consultancy & Sector Projects
-- 100% Industry Sponsored / Merit-Based Industrial Training Model
-- ============================================================================

-- Table: Courses / Full Training Curricula offered by the Tech Academy
CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    duration TEXT NOT NULL,
    mode TEXT NOT NULL DEFAULT 'Hybrid (Online + Lab)',
    description TEXT NOT NULL,
    technologies TEXT NOT NULL,
    eligibility TEXT NOT NULL,
    training_model TEXT DEFAULT '100% Industry-Sponsored / Merit-Based',
    modules_count INTEGER DEFAULT 6,
    syllabus_json TEXT, -- Full detailed module-by-module breakdown
    featured INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Trainee / Student Registrations and Applications
CREATE TABLE IF NOT EXISTS trainees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    education TEXT NOT NULL,
    course_id INTEGER,
    course_name TEXT NOT NULL,
    batch_mode TEXT NOT NULL DEFAULT 'Online',
    experience_level TEXT DEFAULT 'Student / Fresher',
    statement TEXT,
    status TEXT NOT NULL DEFAULT 'Applied', -- 'Applied', 'Under Review', 'Shortlisted', 'Enrolled', 'Completed', 'Placed'
    assigned_mentor TEXT DEFAULT 'Senior Solutions Architect',
    next_milestone TEXT DEFAULT 'Technical Screening & Orientation',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses (id)
);

-- Table: IT Consultancy Booking Requests
CREATE TABLE IF NOT EXISTS consultations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_name TEXT NOT NULL,
    organization TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    consultancy_domain TEXT NOT NULL, -- 'Cloud Migration', 'Cybersecurity Audit', 'Enterprise Architecture', 'DevOps Automation', 'AI Integration'
    preferred_date TEXT,
    budget_range TEXT,
    requirements TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending', 'Scheduled', 'In Progress', 'Completed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Sector Projects / Custom Software Development Proposals
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_name TEXT NOT NULL,
    organization TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    sector TEXT NOT NULL, -- 'Healthcare', 'FinTech', 'E-Commerce', 'Manufacturing', 'EdTech', 'Government', 'Logistics'
    project_title TEXT NOT NULL,
    scope_description TEXT NOT NULL,
    target_timeline TEXT,
    budget_range TEXT,
    architecture_spec TEXT, -- Auto-generated architecture spec from interactive estimator
    status TEXT NOT NULL DEFAULT 'Proposal Received', -- 'Proposal Received', 'Scoping Call', 'Under Development', 'Delivered'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: General Inquiries & Contact Messages
CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New', -- 'New', 'Contacted', 'Resolved'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Client Worker / Staff Augmentation Requests ("Worker for Client")
CREATE TABLE IF NOT EXISTS staffing_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_name TEXT NOT NULL,
    company_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    role_required TEXT NOT NULL, -- 'Full Stack Developer', 'Python & AI Engineer', 'Java Microservices Lead', 'QA Automation Engineer', 'Cloud/DevOps Specialist', 'Mobile App Engineer'
    experience_level TEXT DEFAULT 'Mid-Level (3-5 yrs)',
    engagement_model TEXT DEFAULT 'Dedicated Full-Time Worker', -- 'Dedicated Full-Time Worker', 'Hourly Contract', 'Managed Agile Squad'
    developers_count INTEGER DEFAULT 1,
    duration_months INTEGER DEFAULT 6,
    budget_range TEXT,
    requirements TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Inquiry Received', -- 'Inquiry Received', 'Profiles Shared', 'Interview Scheduled', 'Worker Deployed', 'Closed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Placement Records & Alumni Success Stories
CREATE TABLE IF NOT EXISTS placements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_name TEXT NOT NULL,
    course_completed TEXT NOT NULL,
    company_placed TEXT NOT NULL,
    role_title TEXT NOT NULL,
    package_ctc TEXT NOT NULL,
    location TEXT NOT NULL,
    placed_year INTEGER DEFAULT 2026,
    hometown TEXT DEFAULT 'Jammalamadugu / Kadapa',
    testimonial TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for fast searches, lookups, and filtering
CREATE INDEX IF NOT EXISTS idx_trainees_email ON trainees(email);
CREATE INDEX IF NOT EXISTS idx_trainees_status ON trainees(status);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_projects_sector ON projects(sector);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_staffing_status ON staffing_requests(status);
CREATE INDEX IF NOT EXISTS idx_placements_company ON placements(company_placed);

