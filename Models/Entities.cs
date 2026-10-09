using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace NVNIndiaPortal.Models
{
    public class Course
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("code")]
        public string Code { get; set; } = string.Empty;

        [JsonPropertyName("title")]
        public string Title { get; set; } = string.Empty;

        [JsonPropertyName("category")]
        public string Category { get; set; } = string.Empty;

        [JsonPropertyName("duration")]
        public string Duration { get; set; } = string.Empty;

        [JsonPropertyName("mode")]
        public string Mode { get; set; } = "Hybrid (Online + Lab)";

        [JsonPropertyName("description")]
        public string Description { get; set; } = string.Empty;

        [JsonPropertyName("technologies")]
        public string Technologies { get; set; } = string.Empty;

        [JsonPropertyName("eligibility")]
        public string Eligibility { get; set; } = string.Empty;

        [JsonPropertyName("training_model")]
        public string TrainingModel { get; set; } = "100% Industry-Sponsored Merit Track (Zero Tuition Fee)";

        [JsonPropertyName("modules_count")]
        public int ModulesCount { get; set; } = 6;

        [JsonPropertyName("syllabus_json")]
        public string? SyllabusJson { get; set; }

        [JsonPropertyName("featured")]
        public int Featured { get; set; } = 1;

        [JsonPropertyName("created_at")]
        public DateTime? CreatedAt { get; set; }

        // Parsed syllabus for JSON response
        [JsonPropertyName("syllabus")]
        public object? Syllabus { get; set; }
    }

    public class Trainee
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("full_name")]
        public string FullName { get; set; } = string.Empty;

        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [JsonPropertyName("phone")]
        public string Phone { get; set; } = string.Empty;

        [JsonPropertyName("education")]
        public string Education { get; set; } = string.Empty;

        [JsonPropertyName("course_id")]
        public int? CourseId { get; set; }

        [JsonPropertyName("course_name")]
        public string CourseName { get; set; } = string.Empty;

        [JsonPropertyName("batch_mode")]
        public string BatchMode { get; set; } = "Online";

        [JsonPropertyName("experience_level")]
        public string ExperienceLevel { get; set; } = "Student / Fresher";

        [JsonPropertyName("statement")]
        public string? Statement { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; } = "Applied";

        [JsonPropertyName("assigned_mentor")]
        public string AssignedMentor { get; set; } = "Senior Solutions Architect";

        [JsonPropertyName("next_milestone")]
        public string NextMilestone { get; set; } = "Technical Screening & Orientation";

        [JsonPropertyName("created_at")]
        public DateTime? CreatedAt { get; set; }
    }

    public class Consultation
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("client_name")]
        public string ClientName { get; set; } = string.Empty;

        [JsonPropertyName("organization")]
        public string Organization { get; set; } = string.Empty;

        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [JsonPropertyName("phone")]
        public string Phone { get; set; } = string.Empty;

        [JsonPropertyName("consultancy_domain")]
        public string ConsultancyDomain { get; set; } = string.Empty;

        [JsonPropertyName("preferred_date")]
        public string? PreferredDate { get; set; }

        [JsonPropertyName("budget_range")]
        public string? BudgetRange { get; set; }

        [JsonPropertyName("requirements")]
        public string Requirements { get; set; } = string.Empty;

        [JsonPropertyName("status")]
        public string Status { get; set; } = "Pending";

        [JsonPropertyName("created_at")]
        public DateTime? CreatedAt { get; set; }
    }

    public class Project
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("client_name")]
        public string ClientName { get; set; } = string.Empty;

        [JsonPropertyName("organization")]
        public string Organization { get; set; } = string.Empty;

        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [JsonPropertyName("phone")]
        public string? Phone { get; set; }

        [JsonPropertyName("sector")]
        public string Sector { get; set; } = string.Empty;

        [JsonPropertyName("project_title")]
        public string ProjectTitle { get; set; } = string.Empty;

        [JsonPropertyName("scope_description")]
        public string ScopeDescription { get; set; } = string.Empty;

        [JsonPropertyName("target_timeline")]
        public string? TargetTimeline { get; set; }

        [JsonPropertyName("budget_range")]
        public string? BudgetRange { get; set; }

        [JsonPropertyName("architecture_spec")]
        public string? ArchitectureSpec { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; } = "Proposal Received";

        [JsonPropertyName("created_at")]
        public DateTime? CreatedAt { get; set; }
    }

    public class Inquiry
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("sender_name")]
        public string SenderName { get; set; } = string.Empty;

        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [JsonPropertyName("phone")]
        public string? Phone { get; set; }

        [JsonPropertyName("subject")]
        public string Subject { get; set; } = string.Empty;

        [JsonPropertyName("message")]
        public string Message { get; set; } = string.Empty;

        [JsonPropertyName("status")]
        public string Status { get; set; } = "New";

        [JsonPropertyName("created_at")]
        public DateTime? CreatedAt { get; set; }
    }

    public class StaffingRequest
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("client_name")]
        public string ClientName { get; set; } = string.Empty;

        [JsonPropertyName("company_name")]
        public string CompanyName { get; set; } = string.Empty;

        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [JsonPropertyName("phone")]
        public string Phone { get; set; } = string.Empty;

        [JsonPropertyName("role_required")]
        public string RoleRequired { get; set; } = string.Empty;

        [JsonPropertyName("experience_level")]
        public string ExperienceLevel { get; set; } = "Mid-Level (3-5 yrs)";

        [JsonPropertyName("engagement_model")]
        public string EngagementModel { get; set; } = "Dedicated Full-Time Worker";

        [JsonPropertyName("developers_count")]
        public int DevelopersCount { get; set; } = 1;

        [JsonPropertyName("duration_months")]
        public int DurationMonths { get; set; } = 6;

        [JsonPropertyName("budget_range")]
        public string? BudgetRange { get; set; }

        [JsonPropertyName("requirements")]
        public string Requirements { get; set; } = string.Empty;

        [JsonPropertyName("status")]
        public string Status { get; set; } = "Inquiry Received";

        [JsonPropertyName("created_at")]
        public DateTime? CreatedAt { get; set; }
    }

    public class Placement
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("student_name")]
        public string StudentName { get; set; } = string.Empty;

        [JsonPropertyName("course_completed")]
        public string CourseCompleted { get; set; } = string.Empty;

        [JsonPropertyName("company_placed")]
        public string CompanyPlaced { get; set; } = string.Empty;

        [JsonPropertyName("role_title")]
        public string RoleTitle { get; set; } = string.Empty;

        [JsonPropertyName("package_ctc")]
        public string PackageCtc { get; set; } = string.Empty;

        [JsonPropertyName("location")]
        public string Location { get; set; } = string.Empty;

        [JsonPropertyName("placed_year")]
        public int PlacedYear { get; set; } = 2026;

        [JsonPropertyName("hometown")]
        public string Hometown { get; set; } = "Jammalamadugu / Kadapa";

        [JsonPropertyName("testimonial")]
        public string? Testimonial { get; set; }

        [JsonPropertyName("created_at")]
        public DateTime? CreatedAt { get; set; }
    }

    public class StatsDto
    {
        [JsonPropertyName("headquarters")]
        public string Headquarters { get; set; } = "Jammalamadugu, Andhra Pradesh";

        [JsonPropertyName("total_courses")]
        public int TotalCourses { get; set; }

        [JsonPropertyName("courses_count")]
        public int CoursesCount { get; set; }

        [JsonPropertyName("total_trainees")]
        public int TotalTrainees { get; set; }

        [JsonPropertyName("trainees_count")]
        public int TraineesCount { get; set; }

        [JsonPropertyName("enrolled_trainees")]
        public int EnrolledTrainees { get; set; }

        [JsonPropertyName("placed_trainees")]
        public int PlacedTrainees { get; set; }

        [JsonPropertyName("total_projects")]
        public int TotalProjects { get; set; }

        [JsonPropertyName("projects_count")]
        public int ProjectsCount { get; set; }

        [JsonPropertyName("delivered_projects")]
        public int DeliveredProjects { get; set; }

        [JsonPropertyName("total_consultations")]
        public int TotalConsultations { get; set; }

        [JsonPropertyName("consultations_count")]
        public int ConsultationsCount { get; set; }

        [JsonPropertyName("inquiries_count")]
        public int InquiriesCount { get; set; }

        [JsonPropertyName("staffing_requests_count")]
        public int StaffingRequestsCount { get; set; }

        [JsonPropertyName("active_workers_count")]
        public int ActiveWorkersCount { get; set; }

        [JsonPropertyName("placements_count")]
        public int PlacementsCount { get; set; }

        [JsonPropertyName("hiring_partners_count")]
        public int HiringPartnersCount { get; set; }

        [JsonPropertyName("client_satisfaction")]
        public string ClientSatisfaction { get; set; } = "99.2%";

        [JsonPropertyName("uptime")]
        public string Uptime { get; set; } = "99.98%";

        [JsonPropertyName("engine")]
        public string Engine { get; set; } = "Microsoft SQL Server";
    }

    public class SqlQueryRequest
    {
        [JsonPropertyName("query")]
        public string? Query { get; set; }
    }

    public class SqlQueryResponse
    {
        [JsonPropertyName("success")]
        public bool Success { get; set; }

        [JsonPropertyName("columns")]
        public List<string> Columns { get; set; } = new();

        [JsonPropertyName("rows")]
        public List<Dictionary<string, object?>> Rows { get; set; } = new();

        [JsonPropertyName("row_count")]
        public int RowCount { get; set; }

        [JsonPropertyName("message")]
        public string? Message { get; set; }
    }

    public class ApiResponse<T>
    {
        [JsonPropertyName("success")]
        public bool Success { get; set; } = true;

        [JsonPropertyName("data")]
        public T? Data { get; set; }

        [JsonPropertyName("message")]
        public string? Message { get; set; }

        [JsonPropertyName("total")]
        public int? Total { get; set; }

        [JsonPropertyName("error")]
        public string? Error { get; set; }
    }
}
