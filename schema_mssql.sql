-- ============================================================================
-- NVN India Private Limited (Jammalamadugu, Andhra Pradesh)
-- Microsoft SQL Server Database Schema (T-SQL)
-- Database: NVNIndiaPortal
-- ============================================================================

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'NVNIndiaPortal')
BEGIN
    CREATE DATABASE [NVNIndiaPortal];
END
GO

USE [NVNIndiaPortal];
GO

-- 1. Table: courses (All-Courses Career Tracks with Full JSON Module Syllabi)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'courses')
BEGIN
    CREATE TABLE courses (
        id INT IDENTITY(1,1) PRIMARY KEY,
        code NVARCHAR(50) UNIQUE NOT NULL,
        title NVARCHAR(200) NOT NULL,
        category NVARCHAR(100) NOT NULL,
        duration NVARCHAR(50) NOT NULL,
        mode NVARCHAR(100) NOT NULL DEFAULT 'Hybrid (Online + Lab)',
        description NVARCHAR(MAX) NOT NULL,
        technologies NVARCHAR(500) NOT NULL,
        eligibility NVARCHAR(300) NOT NULL,
        training_model NVARCHAR(150) DEFAULT '100% Industry-Sponsored / Merit-Based',
        modules_count INT DEFAULT 6,
        syllabus_json NVARCHAR(MAX),
        featured INT DEFAULT 1,
        created_at DATETIME2 DEFAULT GETDATE()
    );
    CREATE INDEX idx_courses_category ON courses(category);
    CREATE INDEX idx_courses_code ON courses(code);
END
GO

-- 2. Table: trainees (Student / Trainee Registrations & Admission Milestones)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'trainees')
BEGIN
    CREATE TABLE trainees (
        id INT IDENTITY(1,1) PRIMARY KEY,
        full_name NVARCHAR(150) NOT NULL,
        email NVARCHAR(150) NOT NULL,
        phone NVARCHAR(50) NOT NULL,
        education NVARCHAR(150) NOT NULL,
        course_id INT,
        course_name NVARCHAR(200) NOT NULL,
        batch_mode NVARCHAR(50) NOT NULL DEFAULT 'Online',
        experience_level NVARCHAR(100) DEFAULT 'Student / Fresher',
        statement NVARCHAR(MAX),
        status NVARCHAR(100) NOT NULL DEFAULT 'Applied', -- 'Applied', 'Under Review', 'Shortlisted', 'Enrolled', 'Completed', 'Placed'
        assigned_mentor NVARCHAR(150) DEFAULT 'Senior Solutions Architect',
        next_milestone NVARCHAR(200) DEFAULT 'Technical Screening & Orientation',
        created_at DATETIME2 DEFAULT GETDATE(),
        CONSTRAINT FK_Trainees_Courses FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
    );
    CREATE INDEX idx_trainees_email ON trainees(email);
    CREATE INDEX idx_trainees_status ON trainees(status);
END
GO

-- 3. Table: consultations (Enterprise IT Architecture & Advisory Sessions)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'consultations')
BEGIN
    CREATE TABLE consultations (
        id INT IDENTITY(1,1) PRIMARY KEY,
        client_name NVARCHAR(150) NOT NULL,
        organization NVARCHAR(200) NOT NULL,
        email NVARCHAR(150) NOT NULL,
        phone NVARCHAR(50) NOT NULL,
        consultancy_domain NVARCHAR(150) NOT NULL,
        preferred_date NVARCHAR(50),
        budget_range NVARCHAR(100),
        requirements NVARCHAR(MAX) NOT NULL,
        status NVARCHAR(100) NOT NULL DEFAULT 'Pending',
        created_at DATETIME2 DEFAULT GETDATE()
    );
    CREATE INDEX idx_consultations_status ON consultations(status);
END
GO

-- 4. Table: projects (Bespoke Software Projects Across All Sectors)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'projects')
BEGIN
    CREATE TABLE projects (
        id INT IDENTITY(1,1) PRIMARY KEY,
        client_name NVARCHAR(150) NOT NULL,
        organization NVARCHAR(200) NOT NULL,
        email NVARCHAR(150) NOT NULL,
        phone NVARCHAR(50),
        sector NVARCHAR(100) NOT NULL,
        project_title NVARCHAR(250) NOT NULL,
        scope_description NVARCHAR(MAX) NOT NULL,
        target_timeline NVARCHAR(100),
        budget_range NVARCHAR(100),
        architecture_spec NVARCHAR(MAX),
        status NVARCHAR(100) NOT NULL DEFAULT 'Proposal Received',
        created_at DATETIME2 DEFAULT GETDATE()
    );
    CREATE INDEX idx_projects_sector ON projects(sector);
    CREATE INDEX idx_projects_status ON projects(status);
END
GO

-- 5. Table: inquiries (General Portal Contact Inquiries)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'inquiries')
BEGIN
    CREATE TABLE inquiries (
        id INT IDENTITY(1,1) PRIMARY KEY,
        sender_name NVARCHAR(150) NOT NULL,
        email NVARCHAR(150) NOT NULL,
        phone NVARCHAR(50),
        subject NVARCHAR(250) NOT NULL,
        message NVARCHAR(MAX) NOT NULL,
        status NVARCHAR(50) NOT NULL DEFAULT 'New',
        created_at DATETIME2 DEFAULT GETDATE()
    );
END
GO

-- 6. Table: staffing_requests ("Worker for Client" Staff Augmentation Requests)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'staffing_requests')
BEGIN
    CREATE TABLE staffing_requests (
        id INT IDENTITY(1,1) PRIMARY KEY,
        client_name NVARCHAR(150) NOT NULL,
        company_name NVARCHAR(200) NOT NULL,
        email NVARCHAR(150) NOT NULL,
        phone NVARCHAR(50) NOT NULL,
        role_required NVARCHAR(150) NOT NULL,
        experience_level NVARCHAR(100) DEFAULT 'Mid-Level (3-5 yrs)',
        engagement_model NVARCHAR(150) DEFAULT 'Dedicated Full-Time Worker',
        developers_count INT DEFAULT 1,
        duration_months INT DEFAULT 6,
        budget_range NVARCHAR(100),
        requirements NVARCHAR(MAX) NOT NULL,
        status NVARCHAR(100) NOT NULL DEFAULT 'Inquiry Received',
        created_at DATETIME2 DEFAULT GETDATE()
    );
    CREATE INDEX idx_staffing_status ON staffing_requests(status);
END
GO

-- 7. Table: placements (Alumni Placement Records & Packages)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'placements')
BEGIN
    CREATE TABLE placements (
        id INT IDENTITY(1,1) PRIMARY KEY,
        student_name NVARCHAR(150) NOT NULL,
        course_completed NVARCHAR(200) NOT NULL,
        company_placed NVARCHAR(200) NOT NULL,
        role_title NVARCHAR(150) NOT NULL,
        package_ctc NVARCHAR(100) NOT NULL,
        location NVARCHAR(150) NOT NULL,
        placed_year INT DEFAULT 2026,
        hometown NVARCHAR(150) DEFAULT 'Jammalamadugu / Kadapa',
        testimonial NVARCHAR(MAX),
        created_at DATETIME2 DEFAULT GETDATE()
    );
    CREATE INDEX idx_placements_company ON placements(company_placed);
END
GO
