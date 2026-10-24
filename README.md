# 🎓 Quizora – AI-Based Smart Quiz System

**An AI-powered online assessment and independent learning platform**

**Official Team:** CSE4204-8A-T03  
**Section:** 8A  
**Course:** CSE 4204 – Mobile Computing Lab  
**Project Type:** Full-Stack Web Application with Generative AI Integration

**Live Application:** https://ai-based-smart-quiz-system.onrender.com  
**GitHub Repository:** https://github.com/sudipto224/AI-based-Smart-Quiz-System

---

## 👥 Team Information

| Role | Full Name | Student ID |
|---|---|---|
| Team Leader & Backend Developer | Sudipto Das | 11220320830 |
| AI Integration Developer | Rakibur Rahman Mishan | 11220320829 |
| Database & Frontend Developer | Aditi Roy | 11220320846 |

**Project Supervisor:** Md. Riaz Mahmud  
Assistant Professor, Department of CSE

---

## 📖 1. Project Overview

**Quizora – AI-Based Smart Quiz System** is a modern, full-stack online quiz and assessment platform designed to simplify quiz preparation, automate question generation, improve student learning, and provide instant performance feedback.

The system is developed using **Laravel 12, React 18, Inertia.js, Tailwind CSS, MySQL, and Groq Cloud AI**.

It combines traditional course-based assessments with AI-assisted question generation and independent student practice.

Quizora supports two primary academic user roles:

- **Teacher:** Creates courses, manages quizzes, generates AI-assisted questions, reviews quiz performance, and monitors suspicious attempts.
- **Student:** Participates in course quizzes and live sessions, checks results, views leaderboards, and independently generates AI-powered practice quizzes.

The project also includes administrative account capabilities for authorized application management.

### Main Capabilities

- AI-generated MCQs from topics
- AI-generated MCQs from PDF and PPTX files
- Course-aware question generation
- Student AI self-practice without teacher involvement
- Automated question validation
- Course and question management
- Timed online quizzes
- Instant result calculation
- Detailed answer explanations
- Course-wise leaderboard
- Teacher-hosted live quiz sessions
- Suspicious activity monitoring
- Role-based authentication
- Responsive user interfaces
- Personal quiz history
- Cloud deployment

**Project Goal:** Make online assessments more intelligent, accessible, efficient, interactive, and learner-centered through AI-assisted automation.

---

## ❓ 2. Problem Statement

Traditional online quiz platforms have several limitations.

### 2.1 Manual Question Preparation

Teachers often spend considerable time preparing MCQs, writing answer options, checking correct answers, and organizing questions.

### 2.2 Limited AI Integration

Many basic quiz systems require teachers to create every question manually, even when educational materials are already available.

### 2.3 Difficulty Generating Questions from Documents

Teachers may have lecture slides or PDF notes but still need to manually convert their contents into quizzes.

### 2.4 Limited Independent Learning

Students typically depend on teachers to publish quizzes. They cannot always practice their preferred topics or personal study materials.

### 2.5 Delayed Feedback

Traditional assessments may not provide immediate scores, correct answers, or explanations.

### 2.6 Academic Integrity Challenges

Suspicious behaviors, such as switching browser tabs or submitting assessments unusually quickly, can be difficult to identify.

### 2.7 Limited Student Engagement

Without interactive assessments, instant feedback, or performance rankings, students may have fewer opportunities to track learning progress.

### Our Solution

Quizora addresses these limitations through AI-assisted question generation, document-based quizzes, independent student practice, automated scoring, suspicious activity indicators, and performance-based leaderboards.

---

## 🎯 3. Project Objectives

### Primary Objective

To develop a secure, intelligent, user-friendly online assessment platform that combines Generative AI, automated evaluation, and student-centered learning.

### Specific Objectives

1. Reduce manual teacher workload through AI-assisted question generation.
2. Generate educational MCQs from course topics and uploaded learning materials.
3. Allow teachers to review and manage generated questions.
4. Enable students to generate private practice quizzes without teacher involvement.
5. Provide automatic scoring and immediate feedback.
6. Support configurable, time-limited assessments.
7. Provide course-wise performance rankings.
8. Identify potentially suspicious quiz activities through rule-based monitoring.
9. Apply role-based authentication and data access controls.
10. Provide a responsive application that can run locally or through a cloud deployment.

---

## ✨ 4. Core System Features

### 👨‍🏫 4.1 Teacher Panel

The Teacher Panel provides an organized environment for managing academic assessments.

**Course Management**

- Create new courses.
- View available courses.
- Update course information.
- Delete courses.
- Configure time per question.
- Organize course-specific questions.

**Question Management**

- Create MCQs manually.
- Edit existing questions.
- Delete questions.
- Configure four answer options.
- Select the correct answer.
- Add explanations.
- Associate questions with courses.

**AI Question Generation**

- Select a course.
- Enter a topic.
- Generate MCQs through the Groq API.
- Automatically populate question details.
- Review generated questions before saving.

**Material-Based AI Generator**

- Upload supported PDF or PPTX learning materials.
- Extract readable text.
- Generate 5 or 10 questions.
- Review generated MCQs.
- Remove unwanted questions.
- Save selected questions into the course question bank.

**Academic Integrity Monitoring**

- View suspicious quiz attempts.
- Inspect tab-switch activity.
- Review unusually fast attempts.
- Examine recorded attempt information.

**Additional Capabilities**

- Teacher dashboard
- Course administration
- Live quiz room workflows
- Protected teacher routes
- Secure logout

### 👨‍🎓 4.2 Student Panel

The Student Panel provides course-based learning and self-assessment features.

**Student Dashboard**

- View available courses.
- Search the course directory.
- Start course quizzes.
- Access course leaderboards.
- Join live quiz sessions.
- Access the personal AI quiz generator.

**Course-Based Quiz System**

- Attempt quizzes created by teachers.
- Answer MCQs.
- Complete timed assessments.
- Submit answers.
- Receive automatic result calculations.
- Review correct and incorrect answers.

**Quiz Timer**

- Time per question is configured by the teacher.
- The quiz interface displays a countdown.
- Time warnings support student awareness.
- Time-expiration handling supports automated submission.

**Result Review**

- Final quiz score
- Selected answers
- Correct answers
- Answer explanations
- Performance feedback

**Leaderboard**

- Course-specific rankings
- Score-based performance comparison
- Completion-time-based ranking where applicable
- Student achievement visibility

**Additional Capabilities**

- Registration and login
- Student profile management
- Protected student functionality
- Secure logout

---

## 🤖 5. Student AI Self-Practice Quiz

### Newly Added Feature

Quizora includes a dedicated AI-powered self-practice system that allows students to create and attempt quizzes independently.

Unlike teacher-managed quizzes, personal practice quizzes do not require a teacher to create questions or publish an assessment.

### 5.1 Topic-Based Quiz Generation

Students can enter any suitable educational topic.

**Example Topics:**

- Data Structures – Stack
- Linked List
- Database Normalization
- Operating Systems
- Object-Oriented Programming
- Computer Networks
- Software Engineering
- Machine Learning Fundamentals

The system sends the topic to the Groq AI service through the Laravel backend.

The AI generates structured multiple-choice questions with corresponding answers and explanations.

### 5.2 Document-Based Quiz Generation

Students can upload their own learning materials.

**Supported File Formats:**

- PDF
- PPTX

**Maximum Upload Size:** 10 MB

The system extracts readable text from the document and uses the extracted material to generate MCQs.

The initial implementation supports **5 or 10 questions** per generated quiz.

Text-based documents are recommended because scanned PDFs without machine-readable text may not be supported by the existing extraction process.

### 5.3 Personal Quiz Attempt

After question generation:

1. The generated quiz is saved under the student's account.
2. The student opens the quiz.
3. Questions and answer options are displayed.
4. Correct answers remain hidden before submission.
5. The student selects answers.
6. The student submits the completed quiz.
7. Laravel calculates the score.

### 5.4 Automatic Result Calculation

The backend compares submitted answers with the stored correct answers.

**Scoring Logic:**

- Correct answer = 1 point
- Incorrect answer = 0 points
- Unanswered question = 0 points

**Formula:**

`Percentage = (Correct Answers / Total Questions) × 100`

**Example:**

For 10 questions, if a student answers 8 correctly:

- Score: 8/10
- Percentage: 80%

### 5.5 Detailed Answer Review

After submitting a quiz, students can view:

- Total score
- Percentage
- Their submitted answers
- Correct answers
- Question explanations

### 5.6 Personal Quiz History

Students can access recent personal practice quizzes.

The history shows:

- Quiz title
- Completion status
- Total questions
- Achieved score
- Option to continue an unfinished quiz

The current implementation retrieves the 15 most recent personal practice quizzes.

### 5.7 Privacy and Security

Student self-practice quizzes are private.

- Students can access only their own practice quizzes.
- Quiz ownership is checked on the backend.
- Other students cannot view another student's private practice.
- Correct answers are not included in the pre-submission response.
- Completed quizzes cannot be rescored by repeated submission.
- Personal practice results do not affect public course leaderboards.

**Important:** Student AI quizzes are intended for personal learning, not official teacher-administered assessments.

---

## 🧠 6. AI Integration

### AI Platform

**Groq Cloud API**

### AI Model

**GPT-OSS 120B**

**Model Identifier:** `openai/gpt-oss-120b`

### AI Integration Method

The Laravel backend communicates with the AI service through an HTTP API.

The Groq API key is stored in server-side environment configuration.

AI requests are processed on the backend rather than exposing the API key directly to React.

### 6.1 Course-Aware AI Question Generation

Teachers select a course and provide a relevant topic.

**Workflow:**

1. Teacher selects a course.
2. Teacher enters a topic.
3. Laravel receives the generation request.
4. The backend prepares the course and topic context.
5. Groq processes the request.
6. The AI returns question data.
7. The system validates the response.
8. Generated content is presented for teacher review.
9. The teacher saves the approved question.

This process helps align generated questions with the intended subject.

### 6.2 PDF/PPTX-Based AI Generation

**Workflow:**

1. Teacher or student uploads a document.
2. Laravel validates the upload.
3. The backend extracts readable text.
4. Relevant content is prepared for AI processing.
5. The text is sent to Groq.
6. Groq generates structured MCQs.
7. Laravel validates the generated data.
8. The system presents the generated questions.

Teacher-generated questions can be reviewed and saved to course question banks.

Student-generated questions are saved as private self-practice quizzes.

### 6.3 Structured AI Response

The AI is instructed to return structured JSON.

**Example:**

```json
{
  "questions": [
    {
      "question": "Which data structure follows LIFO?",
      "options": [
        "Queue",
        "Stack",
        "Linked List",
        "Tree"
      ],
      "correct_answer": "Stack",
      "explanation": "A stack follows the Last-In, First-Out principle."
    }
  ]
}
```

This is an illustrative response containing one question. Actual quiz generation requests the configured question count.

### 6.4 AI Response Validation

The backend validates AI-generated responses before accepting them.

Validation includes:

- Valid JSON structure
- Required question fields
- Four answer options
- Nonempty question text
- Unique answer options
- Valid correct answer
- Required explanation
- Duplicate question prevention
- Requested question count verification

Malformed or incomplete AI responses are rejected.

### 6.5 AI Error Handling

The application handles situations such as:

- Missing AI configuration
- Unavailable AI service
- Failed HTTP requests
- Invalid JSON responses
- Incomplete AI-generated questions
- Unsupported or unreadable documents

Students receive a user-friendly error message when their personal quiz cannot be generated.

### 6.6 Important AI Limitations

AI-generated questions may sometimes contain factual inaccuracies or incomplete explanations.

Teachers should review AI-generated content before using it in official assessments.

Students should use AI-generated personal quizzes as learning aids and independently verify important answers.

---

## 🛡️ 7. Suspicious Activity Detection

Quizora contains rule-based functionality for identifying potentially suspicious student quiz attempts.

### Browser Tab Monitoring

The frontend can detect browser visibility changes through the JavaScript `visibilitychange` event.

This helps record instances where a student leaves the quiz tab.

### Unusually Fast Submission

The system can examine response or completion time to identify unusually fast attempts.

### Suspicious Attempt Flag

Potentially suspicious attempts can be marked with:

`is_suspicious = true`

Relevant attempt information is stored for teacher review.

### Teacher Review

Authorized teachers can inspect suspicious attempts and consider the available evidence.

**Important:** Suspicious activity detection is rule-based, not Machine Learning. A suspicious flag is an indicator requiring review, not proof of cheating.

---

## 🏆 8. Leaderboard and Performance Evaluation

Quizora includes course-wise ranking functionality.

Students are ranked using quiz performance information, including score and completion time where applicable.

### Benefits

- Encourages academic participation.
- Helps students compare course performance.
- Provides a competitive learning environment.
- Makes quiz achievements more visible.
- Supports performance tracking.

Private Student AI Self-Practice results remain separate from official course leaderboards.

---

## 🎮 9. Live Quiz Sessions

Quizora includes live quiz room functionality for interactive classroom assessments.

### Teacher Side

Teachers can manage live quiz room workflows associated with classroom activities.

### Student Side

Students can use a room code provided by a teacher to join a live quiz session.

### Purpose

The live quiz functionality supports:

- Interactive classroom activities
- Teacher-guided assessments
- Student participation
- Real-time session-based quiz workflows

The implementation is integrated separately from private AI Self-Practice quizzes.

---

## 🔐 10. Authentication and Authorization

Quizora uses Laravel-based authentication and role-aware access restrictions.

### Authentication Features

- User registration
- User login
- Secure password hashing
- Authenticated sessions
- Profile management
- Secure logout

### Authorization

The system distinguishes between Teacher and Student responsibilities.

The codebase also contains privileged administrative account support.

### Access Control Principles

- Teacher functions require authorized teacher access.
- Student personal practice requires an authenticated student account.
- Private practice quizzes use ownership checks.
- Unauthorized access to another student's practice is rejected.
- AI credentials remain on the backend.
- Protected routes prevent unauthenticated requests.

---

## 🛠️ 11. Technology Stack

| Component | Technology |
|---|---|
| Frontend | React 18 |
| Frontend Integration | Inertia.js |
| UI Styling | Tailwind CSS |
| Frontend Build Tool | Vite |
| Backend | Laravel 12 |
| Programming Language | PHP 8.2+ |
| Local Database | MySQL |
| Production Database | PostgreSQL |
| ORM | Laravel Eloquent |
| Authentication | Laravel Breeze |
| AI Provider | Groq Cloud API |
| AI Model | GPT-OSS 120B |
| HTTP Communication | Laravel HTTP Client |
| PDF Processing | Text extraction service |
| PPTX Processing | PHP ZipArchive |
| Version Control | Git |
| Repository Hosting | GitHub |
| Cloud Application Hosting | Render |
| Database Management | phpMyAdmin / pgAdmin |

### Why Laravel?

Laravel provides backend routing, validation, database operations, authentication, authorization, API communication, and business logic.

### Why React?

React enables reusable components and interactive user interfaces.

### Why Inertia.js?

Inertia.js connects Laravel backend responses with React pages without requiring a completely separate frontend REST API architecture for normal page navigation.

### Why MySQL and PostgreSQL?

MySQL is used in the local development environment.

PostgreSQL is used by the Render-hosted application.

Laravel's database abstraction and migrations allow the application to work with the configured database engine.

### Why Groq?

Groq provides hosted AI inference through an API, allowing the application to generate MCQs without locally hosting a large language model.

---

## 🏗️ 12. System Architecture

Quizora follows a full-stack web architecture using React, Inertia.js, Laravel, databases, and an external AI service.

```text
                    USER
                      |
              Web Browser
                      |
               React Frontend
                      |
                 Inertia.js
                      |
              Laravel Backend
                      |
       +--------------+--------------+
       |              |              |
 Authentication   Quiz Logic     AI Integration
       |              |              |
       +--------------+              |
              |                      |
        Eloquent ORM             Groq API
              |                      |
     MySQL / PostgreSQL       GPT-OSS 120B
              |                      |
        Data Storage          Generated MCQs
              |                      |
              +----------+-----------+
                         |
                  Laravel Response
                         |
                    React UI
```

### Architecture Components

**Presentation Layer**

React and Tailwind CSS handle page rendering and user interactions.

**Application Layer**

Laravel controllers, services, routes, and validation manage application logic.

**Database Layer**

Eloquent ORM communicates with MySQL or PostgreSQL.

**AI Layer**

The Laravel backend calls Groq API to generate educational questions.

**Security Layer**

Authentication, authorization, validation, ownership checks, and protected configuration help secure application operations.

---

## 🔄 13. Working Process

### 13.1 Teacher-Created Quiz

```text
Teacher Login
      |
Create / Select Course
      |
Add Questions
      |
Manual Input or AI Generation
      |
Review Questions
      |
Save to Database
      |
Student Takes Quiz
      |
Automatic Evaluation
      |
Result and Leaderboard
```

### 13.2 Student AI Self-Practice

```text
Student Login
      |
Create My AI Quiz
      |
Select Input Type
      |
+-----+------+
|            |
Topic     PDF/PPTX
|            |
+-----+------+
      |
Laravel Backend
      |
Groq AI
      |
Generated MCQs
      |
Question Validation
      |
Private Quiz Storage
      |
Student Answers
      |
Submit Quiz
      |
Automatic Scoring
      |
Result and Explanation
```

### 13.3 Live Quiz

```text
Teacher Live Session
        |
    Room Code
        |
 Student Joins
        |
 Quiz Participation
        |
 Assessment Workflow
```

---

## 🗄️ 14. Database Design

Quizora uses a relational database with Eloquent models and database migrations.

The main application manages information associated with:

- User accounts
- Academic courses
- Questions
- Quiz attempts
- Assessment results
- Suspicious activity information
- Personal AI practice quizzes
- Live quiz functionality

The exact set of tables depends on the migrations installed in the project.

### Student AI Practice Table

**Table:** `student_practice_quizzes`

| Column | Purpose |
|---|---|
| `id` | Unique practice quiz ID |
| `user_id` | Owner of the quiz |
| `title` | Quiz title |
| `source_type` | Topic or material |
| `total_questions` | Number of MCQs |
| `questions` | JSON containing generated questions |
| `answers` | Student-submitted answers |
| `score` | Final score |
| `completed_at` | Submission completion time |
| `created_at` | Creation timestamp |
| `updated_at` | Update timestamp |

This table is designed to keep independent practice data separate from official teacher-managed quizzes.

---

## 📁 15. Project Directory Structure

```text
AI-based-Smart-Quiz-System/
|
├── backend/
|   |
|   ├── app/
|   |   ├── Http/
|   |   |   └── Controllers/
|   |   |       ├── DashboardController.php
|   |   |       ├── TeacherController.php
|   |   |       ├── QuizController.php
|   |   |       ├── ResultController.php
|   |   |       ├── LeaderboardController.php
|   |   |       ├── MaterialQuizController.php
|   |   |       └── StudentAiPracticeController.php
|   |   |
|   |   ├── Models/
|   |   |   └── StudentPracticeQuiz.php
|   |   |
|   |   └── Services/
|   |       └── MaterialTextExtractor.php
|   |
|   ├── config/
|   |   └── services.php
|   |
|   ├── database/
|   |   ├── migrations/
|   |   |   └── 2026_10_24_000001_create_student_practice_quizzes_table.php
|   |   ├── factories/
|   |   └── seeders/
|   |
|   ├── public/
|   |   ├── build/
|   |   └── images/
|   |
|   ├── resources/
|   |   ├── css/
|   |   ├── js/
|   |   |   ├── Components/
|   |   |   ├── Layouts/
|   |   |   └── Pages/
|   |   |       ├── Student/
|   |   |       |   ├── Dashboard.jsx
|   |   |       |   └── SelfPractice.jsx
|   |   |       └── ...
|   |   └── views/
|   |
|   ├── routes/
|   |   ├── web.php
|   |   ├── auth.php
|   |   ├── quizora_features.php
|   |   └── student_ai_practice.php
|   |
|   ├── storage/
|   |
|   ├── tests/
|   |   └── Feature/
|   |       └── StudentAiPracticeTest.php
|   |
|   ├── .env.example
|   ├── artisan
|   ├── composer.json
|   ├── package.json
|   └── vite.config.js
|
├── database/
|
├── diagrams/
|   ├── Week 3/
|   └── Week 4/
|
├── documentation/
|   ├── week1/
|   ├── week2/
|   ├── week3/
|   ├── week4/
|   ├── week5/
|   ├── week6/
|   ├── week7/
|   ├── week8/
|   └── week9/
|
├── postman/
|
└── README.md
```

Some directories contain additional controllers, pages, migrations, and supporting files.

---

## 💻 16. Local Installation Guide

### System Requirements

- Windows 10/11, Linux, or macOS
- PHP 8.2 or later
- Composer
- Node.js and npm
- MySQL
- Git
- Required PHP extensions
- Internet connection for Groq AI requests

For Windows development, XAMPP is recommended.

### Step 1 – Clone the Repository

```bash
git clone https://github.com/sudipto224/AI-based-Smart-Quiz-System.git
```

### Step 2 – Open the Backend

```bash
cd AI-based-Smart-Quiz-System/backend
```

### Step 3 – Install PHP Dependencies

```bash
composer install
```

### Step 4 – Install JavaScript Dependencies

```bash
npm install
```

### Step 5 – Configure Environment

For Windows Command Prompt:

```bat
copy .env.example .env
```

Generate the application key:

```bash
php artisan key:generate
```

### Step 6 – Configure MySQL

Start MySQL from XAMPP.

Create a local database:

`ai_smart_quiz_db`

Update `backend/.env`:

```env
APP_NAME=Quizora
APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ai_smart_quiz_db
DB_USERNAME=root
DB_PASSWORD=
```

Adjust the database username, password, or port if your local configuration differs.

### Step 7 – Configure Groq AI

Add the Groq API key to `backend/.env`:

```env
GROQ_API_KEY=your_groq_api_key
```

The backend reads this through:

`backend/config/services.php`

```php
'groq' => [
    'api_key' => env('GROQ_API_KEY'),
],
```

Never expose the real key in GitHub or frontend source files.

### Step 8 – Run Database Migrations

```bash
php artisan migrate
```

This creates the required tables for the configured database.

### Step 9 – Clear Laravel Configuration Cache

```bash
php artisan optimize:clear
```

### Step 10 – Start Laravel Backend

```bash
php artisan serve
```

Default local backend URL:

http://127.0.0.1:8000

### Step 11 – Start Vite Frontend

Open a second terminal inside the `backend` directory:

```bash
npm run dev
```

Default Vite development server:

http://localhost:5173

Open the Laravel application URL in your browser. Vite serves frontend development assets.

---

## 🧪 17. Testing

The project uses Laravel's testing facilities for backend verification.

### Run All Tests

```bash
php artisan test
```

### Test Student AI Practice

```bash
php artisan test --filter=StudentAiPracticeTest
```

The Student AI Practice test covers scenarios including:

- Private quiz creation
- AI response processing using mocked HTTP responses
- Quiz ownership
- Result scoring
- Repeated submission protection
- Unauthorized student access
- Teacher access restrictions

### Check Student AI Routes

```bash
php artisan route:list --name=student.ai-practice
```

Expected route names:

```text
student.ai-practice.index
student.ai-practice.generate
student.ai-practice.show
student.ai-practice.submit
```

### Test Frontend Build

```bash
npm run build
```

### Manual Functional Testing

**Teacher Testing**

- Teacher authentication
- Course creation
- Manual MCQ creation
- Topic-based AI generation
- PDF/PPTX generation
- Question preview
- Saving approved questions
- Suspicious attempt reporting

**Student Testing**

- Student authentication
- Course quiz attempt
- Timer functionality
- Result display
- Leaderboard access
- Live room joining
- AI self-practice by topic
- AI self-practice by PDF/PPTX
- Personal quiz history
- Private result access

Tests should pass before production deployment.

---

## ☁️ 18. Deployment

### Source Code Hosting

GitHub

**Repository:**

https://github.com/sudipto224/AI-based-Smart-Quiz-System

### Application Hosting

Render

**Live URL:**

https://ai-based-smart-quiz-system.onrender.com

### Production Database

PostgreSQL hosted through Render.

### Deployment Workflow

```text
Local Development
       |
Git Commit
       |
GitHub Push
       |
Render Auto Deploy
       |
Application Build
       |
Environment Configuration
       |
Database Migration
       |
Live Application
```

### Production Environment

The application requires:

- Laravel application configuration
- Production database credentials
- Groq API key
- Production application URL
- Appropriate session and cache configuration
- Secure application key

Production should use:

```env
APP_ENV=production
APP_DEBUG=false
```

For a PostgreSQL production database, configure Laravel with the PostgreSQL connection driver and the corresponding host, port, database, username, and password.

### Production Database Migration

After deploying new code that introduces database tables, run:

```bash
php artisan migrate --force
```

The command must execute in the production application environment with the correct production database configuration.

**Important:** Deploying code does not automatically guarantee that the database migration has been executed.

The Student AI Self-Practice feature requires the `student_practice_quizzes` table.

### Free Hosting Limitation

On Render free instances, the application may become inactive after a period without traffic.

The first request after inactivity may take longer than normal.

---

## 🔒 19. Security Features

Quizora implements application-level security measures through Laravel and its existing authorization structure.

### Authentication Security

- Protected authentication routes
- Laravel password hashing
- Session-based authentication
- Restricted access to authenticated functionality

### Role-Based Protection

- Teacher-only management functionality
- Student-only self-practice functionality
- Administrative access controls where configured

### Data Protection

- Student quiz ownership checks
- Backend validation
- Server-side score calculation
- Hidden correct answers before submission
- Restricted personal quiz access

### AI Security

- Groq API key stored server-side
- Structured response validation
- Question and option checks
- Input validation
- Basic AI instruction isolation

### Upload Handling

- File type restrictions
- File size restrictions
- Text extraction validation
- User-friendly error handling

**Privacy Note:** Uploaded study content is processed and sent to the configured AI provider for generation. Students should avoid uploading confidential, sensitive, or unauthorized materials.

---

## 📊 20. Expected Outcomes and Benefits

### Benefits for Teachers

- Reduced manual question preparation effort
- Faster generation of educational assessments
- Easier course and question organization
- AI-assisted quiz creation
- Better visibility into suspicious attempts

### Benefits for Students

- Immediate assessment feedback
- Access to course-specific quizzes
- Personalized AI-powered practice
- Independent learning opportunities
- Clear explanations of answers
- Personal practice history
- Performance tracking

### Technical Outcomes

- Full-stack development experience
- Generative AI API integration
- Database-backed assessment workflows
- Document text processing
- Role-based access control
- Automated evaluation
- Cloud application deployment

---

## ⚠️ 21. Current Limitations

Although Quizora provides a range of educational tools, some limitations remain.

1. **AI Accuracy:** Generated MCQs can occasionally contain factual errors.
2. **AI Service Dependency:** AI generation requires a working external API and internet connectivity.
3. **Document Extraction:** Scanned PDFs may not provide readable text without OCR support.
4. **File Size:** The current Student AI Practice implementation limits uploads to 10 MB.
5. **Question Count:** Personal AI Practice currently supports 5 or 10 questions per generation.
6. **Private Practice Scope:** Personal practice scores do not count toward official course rankings.
7. **Suspicious Activity Monitoring:** Rule-based flags cannot conclusively determine cheating.
8. **Hosting Latency:** Free cloud services may experience startup delays.
9. **Model Output:** Complex topics and long learning documents may require additional review or refinement.
10. **Deployment Dependency:** New database-backed features require the relevant production migrations before they can function correctly.

---

## 🚀 22. Future Development

Potential improvements include:

### AI Enhancements

- Multiple AI model support
- More question count options
- AI-powered question difficulty levels
- Topic-specific adaptive quizzes
- AI-generated learning feedback
- Improved answer verification
- Automatic question quality scoring

### Student Features

- Personalized learning recommendations
- Performance analytics dashboard
- Weak-topic detection
- Practice quiz difficulty selection
- Custom quiz timers
- Student progress visualization
- Study recommendations based on previous attempts

### Document Processing

- DOCX support
- OCR for scanned PDFs
- Image-based study material analysis
- Multi-file document uploads
- Better extraction from complex PDFs

### Classroom Features

- Expanded live quiz functionality
- Additional teacher reporting
- Question bank import/export
- Student attendance integration
- Quiz scheduling
- Notifications and reminders

### Platform Improvements

- Multilingual interface
- Mobile application support
- Accessibility enhancements
- Improved performance and caching
- Scalable background AI processing
- Advanced administrative tools

These are proposed improvements, not claims that all features are already implemented.

---

## 📚 23. Academic Documentation

The repository contains project documentation, diagrams, and academic progress materials.

### Week 1

Initial planning and project introduction.

### Week 2

Project proposal and team information.

### Week 3

Software Requirements Specification (SRS) and system diagrams.

### Week 4

System design, architecture, API design, and AI workflow documentation.

### Weeks 5–7

Project development and implementation activities.

### Week 8

AI integration documentation.

### Week 9

Progress and integration reporting.

### Supporting Documents

- Software Requirements Specification
- Architecture Diagram
- Entity Relationship Diagram
- Use Case Diagram
- Activity Diagram
- AI Workflow
- API Design
- Progress Reports
- Presentation and demonstration materials, where included in the repository

---

## 🧑‍💻 24. Development Responsibilities

### Sudipto Das — Team Leader & Backend

- Backend application development
- Laravel business logic
- Controllers and routing
- Database-related integration
- Assessment workflows
- Team coordination
- Backend functionality testing

### Rakibur Rahman Mishan — AI Integration

- AI API integration
- Prompt design
- AI-generated MCQ workflows
- AI response handling
- AI functionality testing and refinement

### Aditi Roy — Database & Frontend

- Frontend interface development
- React component implementation
- Database design and integration
- User interface improvements
- Frontend-backend coordination

Development responsibilities are presented according to the team information supplied for the project.

---

## 🔧 25. Troubleshooting

### MySQL Connection Refused

**Possible Cause:** MySQL server is stopped or the configured port is incorrect.

**Solution:** Start MySQL through XAMPP and verify the database configuration in `.env`.

### Database Table Does Not Exist

**Possible Cause:** Required migrations have not been executed.

**Solution:**

```bash
php artisan migrate
```

Do not use `migrate:fresh` on an existing database containing important data.

### AI Quiz Generation Fails

**Possible Causes:**

- Missing Groq API key
- AI provider unavailable
- API quota or rate limit
- Invalid AI response
- Unreadable study material

**Solutions:**

- Check backend environment configuration.
- Verify AI service connectivity.
- Inspect Laravel application logs without exposing secrets.
- Try a smaller readable document.

### Route Not Found

Verify the relevant route registration:

```bash
php artisan route:list
```

### Laravel Configuration Issues

```bash
php artisan config:clear
```

### Frontend Build Issues

```bash
npm install
npm run build
```

### PHP Namespace Error

Ensure that PHP source files begin with `<?php` as the first characters of the file, without preceding whitespace or a UTF-8 BOM.

---

## 📌 26. Project Status

**Development:** Active

**Version Control:** GitHub

**Hosting:** Render

**Local Database:** MySQL

**Production Database:** PostgreSQL

**AI Platform:** Groq Cloud

**Latest Added Module:** Student AI Self-Practice Quiz

The Student AI Practice source code has been committed to the repository. Its production availability depends on successful deployment, configuration, and execution of the required database migration.

---

## 📜 27. Conclusion

**Quizora – AI-Based Smart Quiz System** demonstrates how modern web development and Generative AI can be combined to create a practical educational assessment platform.

By integrating Laravel, React, Inertia.js, relational databases, and Groq AI, the project provides tools for automated question generation, teacher-managed assessments, independent student learning, instant scoring, and performance tracking.

The addition of the **Student AI Self-Practice Quiz** feature extends the platform beyond traditional teacher-controlled assessments, enabling students to practice topics and study materials independently.

Quizora aims to make digital assessment more efficient, interactive, accessible, and supportive of continuous learning.

---

## 🔗 Project Links

**GitHub Repository:**  
https://github.com/sudipto224/AI-based-Smart-Quiz-System

**Live Application:**  
https://ai-based-smart-quiz-system.onrender.com

---

**Developed by Team CSE4204-8A-T03 — Section 8A**

**Quizora – Learn • Practice • Assess • Improve**

*An academic full-stack project integrating intelligent question generation with modern online assessment.*
