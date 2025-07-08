import json
import pandas as pd
import numpy as np
import re
from datetime import datetime

def main():
    # 1. Load the raw JSON file
    with open('data/apify_jobs_raw.json', 'r', encoding='utf-8') as f:
        jobs = json.load(f)

    # 2. Flatten and map fields
    def flatten_job(job):
        company = job.get('company', {})
        location = job.get('location', {})
        salary = job.get('salary', {})
        apply_method = job.get('applyMethod', {})
        # Some fields may not exist, so use .get with defaults
        return {
            'Job Title': job.get('title', ''),
            'Job Description': job.get('descriptionText', ''),
            'Company': company.get('name', ''),
            'Industry': (company.get('industries') or [''])[0] if isinstance(company.get('industries'), list) else '',
            'Company Followers': company.get('followerCount', ''),
            'Salary': salary.get('text', ''),
            'Employment Type': job.get('employmentType', ''),
            'Countries': location.get('parsed', {}).get('country', '') or location.get('countryCode', ''),
            'Seniority Level': job.get('experienceLevel', ''),
            'Remote': job.get('workRemoteAllowed', False),
            'Location Type': job.get('workplaceType', ''),
            'Company Size': (
                f"{company.get('employeeCountRange', {}).get('start', '')}-{company.get('employeeCountRange', {}).get('end', '')} employees"
                if company.get('employeeCountRange') else ''
            ),
            'Recruiter Name': job.get('recruiter', {}).get('name', ''),
            'Recruiter URL': job.get('recruiter', {}).get('url', ''),
            'Date Posted': job.get('postedDate', ''),
            # Add more mappings as needed
        }

    flat_jobs = [flatten_job(job) for job in jobs]
    df = pd.DataFrame(flat_jobs)

    # 3. KPI Functions

    def job_description_quality(desc):
        if pd.isna(desc) or len(desc) < 100:
            return 0.0
        score = 0.3
        if any(word in desc.lower() for word in ["responsibilities", "requirements", "qualifications", "what you'll do", "skills required", "tasks"]):
            score += 0.3
        if len(desc.split()) > 150:
            score += 0.2
        if any(word in desc.lower() for word in ["team", "project", "develop", "design", "implement", "collaborate"]):
            score += 0.2
        return min(score, 1.0)

    target_domains = {
        "qa": [
            "qa", "quality assurance", "test automation", "testing", "manual testing",
            "test case", "test plan", "selenium", "cypress", "jmeter", "test rail",
            "jira", "bug report", "defect tracking", "regression testing", "functional testing",
            "performance testing", "security testing", "api testing", "ui testing",
            "user acceptance testing", "uat", "agile testing", "scrum", "ci/cd testing"
        ],
        "web": [
            "frontend", "backend", "web developer", "javascript", "react", "vue",
            "angular", "html", "css", "node", "python", "django", "flask", "java",
            "spring boot", "c#", ".net", "php", "laravel", "ruby on rails", "go",
            "golang", "express.js", "typescript", "rest api", "graphql", "docker",
            "kubernetes", "aws", "azure", "gcp", "sql", "mongodb", "postgresql",
            "microservices", "redux", "webpack", "babel", "next.js", "nuxt.js"
        ],
        "ai": [
            "ai", "ml", "machine learning", "deep learning", "data scientist", "pytorch",
            "tensorflow", "keras", "scikit-learn", "nlp", "natural language processing",
            "computer vision", "reinforcement learning", "data analysis", "r", "julia",
            "spark", "hadoop", "neural networks", "predictive modeling", "statistical modeling",
            "generative ai", "llm", "large language model", "prompt engineering",
            "data engineering", "mlops", "python ai", "data mining"
        ],
        "uiux": [
            "ui", "ux", "user experience", "user interface", "figma", "adobe xd",
            "wireframe", "design system", "prototype", "usability testing", "user research",
            "information architecture", "interaction design", "visual design", "responsive design",
            "accessibility", "design thinking", "sketch", "invision", "user flows",
            "mockups", "design principles", "front-end design", "a/b testing", "human-computer interaction"
        ]
    }

    def domain_score(title, desc, specialties, industry):
        text = f"{title} {desc} {specialties} {industry}".lower()
        score = 0
        for terms in target_domains.values():
            score = max(score, sum(1 for t in terms if t in text) / len(terms))
        return round(min(score * 1.5, 1.0), 2)

    preferred_seniorities = ["Mid-Senior level", "Senior", "Lead", "Manager", "Director"]
    def seniority_score(seniority):
        if pd.isna(seniority):
            return 0.3
        for level in preferred_seniorities:
            if level.lower() in str(seniority).lower():
                return 1.0
        if "junior" in str(seniority).lower():
            return 0.3
        return 0.6

    preferred_countries = ['United States']
    secondary_countries = ['Canada', 'United Kingdom', 'Germany', 'Netherlands']
    neglected_countries = ['India', 'Israel']
    def location_score(country):
        if not isinstance(country, str):
            return 0.5
        if country in preferred_countries:
            return 1.0
        elif country in secondary_countries:
            return 0.7
        elif country in neglected_countries:
            return 0.0
        else:
            return 0.5

    def remote_score(remote_flag, loc_type):
        if remote_flag is True:
            return 1.0
        elif isinstance(loc_type, str) and "HYBRID" in loc_type.upper():
            return 0.8
        else:
            return 0.5

    def parse_salary(salary):
        if pd.isna(salary) or not isinstance(salary, str):
            return None, None
        match = re.findall(r"([\d]+\.?\d*)", salary.replace(',', ''))
        if len(match) >= 1:
            min_val = float(match[0])
            max_val = float(match[1]) if len(match) > 1 else min_val
            return min_val, max_val
        return None, None

    def salary_score(salary_str):
        min_val, max_val = parse_salary(salary_str)
        if min_val is None:
            return 0.5
        avg = (min_val + max_val) / 2 if max_val else min_val
        if avg >= 90:
            return 1.0
        elif avg >= 70:
            return 0.9
        elif avg >= 50:
            return 0.75
        elif avg >= 40:
            return 0.6
        else:
            return 0.4

    def company_size_score(size):
        if pd.isna(size):
            return 0.4
        size = str(size).strip().lower()
        mapping = {
            "1 employee": 0.1,
            "2-10 employees": 0.2,
            "11-50 employees": 0.3,
            "51-200 employees": 0.5,
            "201-500 employees": 0.6,
            "501-1,000 employees": 0.7,
            "1,001-5,000 employees": 0.8,
            "5,001-10,000 employees": 0.9,
            "10,001+ employees": 1.0,
        }
        return mapping.get(size, 0.4)

    def popularity_score(followers):
        if pd.isna(followers):
            return 0.5
        try:
            followers = int(followers)
        except:
            return 0.5
        if followers >= 50000:
            return 1.0
        elif followers >= 10000:
            return 0.8
        elif followers >= 1000:
            return 0.6
        else:
            return 0.4

    preferred_industries = [
        'Information Technology', 'Computer Software', 'AI', 'ML', 'IT', 'Telecommunications', 'IT Services and IT Consulting',
        'Internet', 'Web Development', 'Design', 'UI/UX', 'Quality Assurance', 'Software Testing', 'Software Development'
    ]
    def industry_score(industry):
        if pd.isna(industry):
            return 0.5
        industry = str(industry).lower()
        for keyword in preferred_industries:
            if keyword.lower() in industry:
                return 1.0
        return 0.6

    def recruiter_score(name, url):
        if pd.isna(name) and pd.isna(url):
            return 0.5
        elif pd.notna(name) and pd.notna(url):
            return 1.0
        else:
            return 0.7

    def freshness_score(posted_date_str):
        if pd.isna(posted_date_str):
            return 0.5
        try:
            posted_date = pd.to_datetime(posted_date_str)
            days_ago = (datetime.now() - posted_date).days
        except:
            return 0.5
        if days_ago <= 2:
            return 1.0
        elif days_ago <= 7:
            return 0.8
        elif days_ago <= 14:
            return 0.6
        elif days_ago <= 30:
            return 0.4
        else:
            return 0.2

    preferred_employment_types = ['Full_time', 'Contractor']
    def employment_type_score(emp_type):
        if pd.isna(emp_type):
            return 0.5
        for pref in preferred_employment_types:
            if pref.lower() in str(emp_type).lower():
                return 1.0
        return 0.6

    def contact_info_score(name, url):
        if pd.isna(name) and pd.isna(url):
            return 0.4
        elif pd.notna(name) and pd.notna(url):
            return 1.0
        else:
            return 0.7

    known_skills = [
        "python", "java", "javascript", "react", "node", "c#", "c++", "html", "css",
        "selenium", "pytest", "cypress", "machine learning", "deep learning",
        "django", "flask", "nextjs", "ui", "ux", "usability", "figma", "jira",
        "test automation", "quality assurance", "qa testing", "sql", "rest api"
    ]
    def skills_explicitness_score(desc):
        if pd.isna(desc):
            return 0.5
        desc_lower = desc.lower()
        matches = sum(1 for skill in known_skills if skill in desc_lower)
        if matches >= 10:
            return 1.0
        elif matches >= 6:
            return 0.8
        elif matches >= 3:
            return 0.6
        elif matches >= 1:
            return 0.4
        else:
            return 0.2

    experience_keywords = [
        '3+ years', '4+ years', '5+ years', '6+ years', '7+ years', '8+ years',
        'experience with', 'mid-senior', 'senior'
    ]
    seniority_high = ['mid-senior level', 'senior', 'director', 'executive']
    seniority_low = ['internship', 'entry level', 'junior']
    def experience_threshold_score(desc, seniority):
        desc = desc.lower().strip() if pd.notna(desc) else ''
        seniority = seniority.lower().strip() if pd.notna(seniority) else 'not applicable'
        if seniority in seniority_low:
            return 0.4
        elif seniority in seniority_high:
            return 1.0
        else:
            return 0.5

    # 4. Apply KPIs
    df['kpi_jd_quality'] = df['Job Description'].apply(job_description_quality)
    df['kpi_domain_fit'] = df.apply(
        lambda row: domain_score(
            row.get('Job Title', ''),
            row.get('Job Description', ''),
            '',  # Company Specialties not available
            row.get('Industry', '')
        ), axis=1
    )
    df['kpi_seniority'] = df['Seniority Level'].apply(seniority_score)
    df['kpi_location'] = df['Countries'].apply(location_score)
    df['kpi_remote'] = df.apply(
        lambda row: remote_score(row.get('Remote', False), row.get('Location Type', '')),
        axis=1
    )
    df['kpi_salary'] = df['Salary'].apply(salary_score)
    df['kpi_company_size'] = df['Company Size'].apply(company_size_score)
    df['kpi_popularity'] = df['Company Followers'].apply(popularity_score)
    df['kpi_industry_match'] = df['Industry'].apply(industry_score)
    df['kpi_recruiter'] = df.apply(
        lambda row: recruiter_score(row.get('Recruiter Name', ''), row.get('Recruiter URL', '')),
        axis=1
    )
    df['kpi_freshness'] = df['Date Posted'].apply(freshness_score)
    df['kpi_employment_type'] = df['Employment Type'].apply(employment_type_score)
    df['kpi_contact_info'] = df.apply(
        lambda row: contact_info_score(row.get('Recruiter Name', ''), row.get('Recruiter URL', '')),
        axis=1
    )
    df['kpi_skills_explicitness'] = df['Job Description'].apply(skills_explicitness_score)
    df['kpi_experience_threshold'] = df.apply(
        lambda row: experience_threshold_score(row.get('Job Description', ''), row.get('Seniority Level', '')),
        axis=1
    )

    # 5. Final Score and Tier
    kpi_columns = [col for col in df.columns if col.startswith('kpi_')]
    df['final_score'] = df[kpi_columns].mean(axis=1)

    def assign_tier(score):
        if score >= 0.80:
            return 'Green'
        elif score >= 0.60:
            return 'Yellow'
        else:
            return 'Red'

    df['tier'] = df['final_score'].apply(assign_tier)

    # 6. Save as JSON (and CSV if you want)
    df.to_json('data/apify_jobs_scored.json', orient='records', force_ascii=False, indent=2)
    df.to_csv('data/apify_jobs_scored.csv', index=False)
    print("Scored jobs saved as 'data/apify_jobs_scored.json' and 'data/apify_jobs_scored.csv'")


if __name__ == "__main__":
    main()