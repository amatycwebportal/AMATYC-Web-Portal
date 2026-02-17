# Undergraduate Math Self-Assessment Portal

### Technical Specification (Draft v0.1)
### Prepared by: Parker Homann
### Target MVP: Early April
### Stabilization: Mid-April
### Deployment: May Institutions

# 1. Purpose and Strategic Intent

This system is a web-based assessment platform designed to support teaching-focused faculty in evaluating and improving undergraduate mathematics instruction at the departmental level.

It is not a survey distribution tool. It is a structured, multi-tenant assessment platform that:

 - Enables faculty to complete standardized rubrics

 - Aggregates results at the course-bin and institutional level

 - Preserves individual anonymity

 - Supports consensus discussions

 - Provides exportable structured data for national pattern analysis

Primary objective of MVP:
Deliver a stable, role-based web portal capable of managing institutions, rubrics, users, and aggregated reporting.

# 2. High-Level Architecture
Technology Stack

|Layer|	Technology|	Rationale|
| ----- | ----- | ----- |
|Frontend|	React (TypeScript)|	Maintainable, modular, scalable UI|
|Backend|	Node.js + Express|	Lightweight, flexible REST API|
|Database|	PostgreSQL|	Structured relational data, strong aggregation|
|Authentication|	Google OAuth 2.0|	Institutional login, no password management|
|Hosting|	University server (containerized)|	Institutional control, no recurring cloud cost|
|Containerization|	Docker|	Portability and future migration|
|Version Control|	GitHub|	Collaboration, CI/CD support|

System Architecture Diagram
```mermaid
flowchart LR
    A[User Browser] --> B[React Frontend]
    B --> C[Express API Server]
    C --> D[Prisma ORM]
    D --> E[PostgreSQL Database]
    C --> F[Google OAuth]
```

# 3. Multi-Tenant Design

The system is designed as a multi-institution platform.

 - Each institution:

 - Has its own users

 - Has its own course bins and course mappings

 - Has access only to its own aggregated data

Project Leads:

 - Can view all institutions

 - Can modify global rubrics

 - Can export cross-institution data

```mermaid
flowchart TD

    %% ========================
    %% HUMAN ACTORS
    %% ========================

    subgraph HUMAN_ACTIONS["Human Actions"]
        PC[Project Central<br/>Defines Master Rubrics]
        LL[Local Leader]
        FM[Faculty Members]
        LRM[Local Review Meeting]
        CF[Consensus Form Completed]
    end

    %% ========================
    %% SYSTEM PROCESSES
    %% ========================

    subgraph SYSTEM_PROCESSES["System Processes"]
        IF[Intake Form<br/>Select Rubrics & Scales]
        RI[Rubric Instances Created<br/>Per Locality]
        FF[Individual Faculty Forms<br/> Generated]
        FR[Faculty Responses <br/>Submitted]
        AGG[Aggregation Engine<br/>Histograms & Summaries]
        REP[Color-Coded Summary<br/> Report Generated]
        CSC[Consensus Shared with <br/>Project Central]
    end

    %% ========================
    %% FLOW
    %% ========================

    PC --> IF
    IF --> RI

    LL --> IF
    FM --> FF
    RI --> FF

    FF --> FR
    FR --> AGG

    AGG --> LRM
    AGG --> LL

    LRM --> CF
    LL --> CF

    CF --> REP
    REP --> CSC

    %% Feedback loops
    REP --> LL
    LL --> FF
```

# 4. User Roles & Permissions
Role Definitions
1. Project Lead (Global Admin)

   * Create/edit institutions

   * Create/edit global rubrics and scales

   * View all institutional aggregate data

   * Export national datasets

   * Manage local leaders

2. Local Leader (Institution Admin)

   * Invite faculty users

   * Assign users to course bins

   * View aggregated institutional results

   * Export institutional CSV/Excel

   * Manage course mappings

3. Faculty User

   * Log in via Google OAuth

   * View assigned rubrics

   * Submit responses per course

   * Edit responses before final submission

Role-Based Access Control Model
```mermaid
flowchart TD
    PL[Project Lead]
    LL[Local Leader]
    F[Faculty User]

    PL -->|Full Control| INST[Institution Data]
    LL -->|Institution Only| INST
    F -->|Submit Only| RESP[Responses]
```

Authorization enforced at:

 - API middleware level

 - Database query filtering layer

# 5. Core Data Model
Entity Relationship Diagram

```mermaid
erDiagram

    INSTITUTION ||--o{ USER : has
    INSTITUTION ||--o{ COURSE_BIN : defines

    PREDEFINED_COURSE_BIN ||--o{ COURSE_BIN : maps_to
    PREDEFINED_COURSE_BIN ||--o{ SCALE_BIN : targets

    COURSE_BIN ||--o{ COURSE : contains

    RUBRIC ||--o{ SCALE : contains
    SCALE ||--o{ SCALE_BIN : restricted_by

    USER ||--o{ USER_COURSE_BIN : assigned_to
    COURSE_BIN ||--o{ USER_COURSE_BIN : includes

    USER ||--o{ RESPONSE : submits
    COURSE ||--o{ RESPONSE : belongs_to
    SCALE ||--o{ RESPONSE : evaluates

    INSTITUTION {
        uuid id
        string name
        timestamp created_at
    }

    USER {
        uuid id
        string name
        string email
        enum role
        uuid institution_id
    }

    RUBRIC {
        uuid id
        string title
        string description
        boolean active
    }

    SCALE {
        uuid id
        uuid rubric_id
        string prompt
        int order_index
        boolean editable
        boolean is_global
    }

    PREDEFINED_COURSE_BIN {
        uuid id
        string bin_name
    }

    COURSE_BIN {
        uuid id
        uuid institution_id
        uuid predefined_bin_id
        string display_name
    }

    COURSE {
        uuid id
        uuid course_bin_id
        string course_number
        string course_name
    }

    SCALE_BIN {
        uuid scale_id
        uuid predefined_bin_id
    }

    USER_COURSE_BIN {
        uuid user_id
        uuid course_bin_id
    }

    RESPONSE {
        uuid id
        uuid user_id
        uuid scale_id
        uuid course_id
        int score
        timestamp submitted_at
    }
```

# 6. Rubric Structure

 - ~7 primary rubrics

 - Each rubric contains multiple “scales”
    - Scale is akin to question / query

 - Each scale scored 0–4
    - Likert

 - Project Leads can:

    - Add new scales

    - Edit scale wording

    - Deactivate scales (preserve historical data)

Scales remain versioned to preserve longitudinal consistency.

# 7. Course Binning Strategy

Each institution:

 - Maps local courses into predefined backend categories

 - Backend categories remain standardized for national aggregation

Example:

|Local Course|	Backend Bin|
| ----- | ----- |
|MATH 101|	College Algebra|
|Survey of Math|	Quantitative Reasoning|

Aggregation always occurs at:

 - Course bin level

 - Institutional level

 - Cross-institution level (Project Leads only)


# 8. Data Flow
```mermaid
flowchart LR

    LL[Local Leader] -->|Invite| F[Faculty]
    F -->|Login via Google| AUTH[OAuth]
    F -->|Complete Rubric| RESP[Submit Responses]
    RESP --> DB[(Database)]
    DB --> AGG[Aggregation Engine]
    AGG --> DASH[Live Dashboard]
    DASH --> LL
    AGG --> PL[Project Lead View]
```
# 9. Reporting & Visualization

MVP Reporting:

 - Histogram per scale

 - Average score per course bin

 - Average score per rubric

 - Export CSV

 - Export Excel

Future expansion:

 - Longitudinal comparison
    - Longitudinal comparison allows an institution to run the assessment multiple times (e.g., annually) and compare results across time.

    - Instead of seeing a single snapshot, departments would see:

    - Year-over-year score changes

    - Trend direction (improving, declining, stagnant)

    - Impact of reforms after implementation

    - Example:
       - If “Course Coordination” averaged 2.1 in 2026 and 3.0 in 2027, that change becomes visible and measurable.
    
```mermaid
erDiagram
    INSTITUTION ||--o{ ASSESSMENT_CYCLE : runs
    ASSESSMENT_CYCLE ||--o{ RESPONSE : contains
```


 - National benchmarking
    - National benchmarking allows institutions to compare themselves against anonymized national averages across participating schools.

    - Example:

       - Your institution’s “Quantitative Reasoning” bin averages 2.4.

       - National average is 2.9.

       - Peer teaching-focused institutions average 3.1.
```mermaid
flowchart TD
    INST1 --> AGG
    INST2 --> AGG
    INST3 --> AGG
    AGG --> NATIONAL_DATA
```


# 10. Privacy & Compliance

 - No student data

 - No FERPA implications

 - Standard faculty PII (name, email)

 - Google OAuth eliminates password storage

 - Individual responses not exposed to peers

 - Only aggregated data visible

Optional future:

 - Audit logging (who modified rubric, when)

# 11. Admin Dashboard Capabilities

Project Lead Dashboard:

 - Institution management

 - Rubric editor (no-code)

 - Scale ordering

 - Activate/deactivate scales

 - Export national data

Local Leader Dashboard:

 - Course bin editor

 - User invitation

 - Aggregated visualization

 - Export institutional data

# 12. Deployment & DevOps
Repository Structure
 - /frontend
 - /backend
 - /docker
 - /docker-compose.yml

Docker Strategy

 - Separate frontend + backend containers

 - PostgreSQL container

 - Single docker-compose for MVP

Ready for migration to:

 - University VM

 - AWS

 - Azure

 - GCP

Container Diagram
```mermaid
flowchart TD
    A[React Container]
    B[Express API Container]
    C[Postgres Container]

    A --> B
    B --> C
```

# 13. MVP Feature Scope

 - Google OAuth login

 - Role-based routing

 - Institution isolation

 - Rubric rendering

 - Scale scoring 0–4

 - Course-based submission

 - Aggregated dashboard

 - CSV export

 - Admin rubric editor

# 14. Definition of Success (April)

By early April:

 - Users can log in

 - Local leaders can invite faculty

 - Faculty can complete rubrics

 - Aggregated data visible live

 - Export works

 - Deployed in Docker container on test server

By mid-April:

 - Bug fixes complete

 - UI stabilized

 - Ready for May institutional rollout

# 15. Maintainability Strategy

 - Modular React components

 - Clear separation of concerns

 - Clean REST API structure

 - Environment-based configuration

 - Documented database schema

 - Minimal external dependencies

 - No Google Sheets or fragile document APIs

The system is designed so that another developer could assume maintenance without specialized knowledge.