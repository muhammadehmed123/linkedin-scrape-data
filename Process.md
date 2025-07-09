# LinkedIn Job Data Processing Pipeline

## Overview

This project automates the process of fetching, filtering, normalizing, and scoring LinkedIn job data for AI-driven analysis and frontend display. The backend is designed to efficiently handle large datasets, reduce unnecessary data, and provide only the most relevant information for further processing and user interaction.

---

## Workflow Diagram

```mermaid
flowchart TD
    A[API Call: Fetch Raw Data] --> B[Raw Data (100+ columns)]
    B --> C[API Call: Normalize Data]
    C --> D[Normalized Data (30 columns)]
    D --> E[API Call: Filter Data]
    E --> F[Filtered Data (e.g., 100 jobs → 80 jobs)]
    F --> G[API Call: AI Scoring (KPI Calculation)]
    G --> H[Scored Data (KPIs, Tiers)]
    H --> I[Frontend/API Response]
```

---

## Step-by-Step Backend Process

### 1. **API Call: Fetch Raw Data**
- The backend fetches job data from LinkedIn (via Apify or similar service).
- **Result:** Raw JSON with all available fields (100+ columns).

### 2. **API Call: Normalize Data**
- The raw data is normalized:
  - Only the required 30 columns are kept (e.g., job title, company, location, etc.).
  - Data is flattened and cleaned for consistency.
- **Benefit:** Reduces payload size and complexity for downstream processing.

### 3. **API Call: Filter Data**
- The normalized data is filtered based on business requirements:
  - Only jobs from specific countries (e.g., USA, UK, Saudi Arabia, UAE) are kept.
  - Duplicates (by job `id`) are removed.
- **Benefit:** 
  - Reduces unnecessary data.
  - Improves processing speed and relevance.
  - Example: 100 jobs → 80 jobs after filtering.

### 4. **API Call: AI Scoring (KPI Calculation)**
- The filtered data is sent to the AI/ML module (Python script).
- Each job is scored on multiple KPIs (e.g., job description quality, domain fit, seniority, location, salary, etc.).
- Jobs are assigned a final score and tier (Green, Yellow, Red).

### 5. **API Response: Frontend**
- The scored and filtered data is returned to the frontend or API consumer.
- Only the most relevant, high-quality jobs are shown to users.

---

## Key Benefits

- **Performance:** Large datasets are reduced early, saving time and resources.
- **Relevance:** Only jobs matching business criteria are processed and displayed.
- **Scalability:** Modular API endpoints allow for easy extension and maintenance.
- **AI-Driven:** Automated KPI scoring provides actionable insights for users.

---

## Example: Data Reduction

| Step                | Jobs | Columns |
|---------------------|------|---------|
| Raw Data            | 100  | 100+    |
| After Normalization | 100  | 30      |
| After Filtering     | 80   | 30      |
| After Scoring       | 80   | 30+KPIs |

---

## API Endpoints (Sample)

- `GET /api/apify`  
  Fetch and save raw job data.

- `GET /api/apify/filtered`  
  Normalize and filter jobs, save to file.

- `GET /api/apify/score`  
  Run AI/ML scoring on filtered jobs.

- `GET /api/apify/scored`  
  Get scored jobs for frontend.

---

## Filtering Logic

- **Countries:** Only jobs with locations in USA, UK, Saudi Arabia, or UAE are kept.
- **Duplicates:** Jobs with duplicate `id` are removed.
- **Normalization:** Only essential fields are retained for further processing.

---

## Technologies Used

- **Node.js/Express:** Backend API and data processing.
- **Python (Pandas, NumPy, Scikit-learn):** AI/ML scoring and KPI calculation.
- **JSON:** Data interchange format.

---

## Conclusion

This pipeline ensures that only the most relevant, high-quality job data is processed and presented, optimizing both backend performance and frontend user experience.