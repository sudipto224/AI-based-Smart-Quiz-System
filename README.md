# Quizora – AI-Based Smart Quiz

**Official Team Name:** CSE4204-8A-T03  
**Section:** 8A

---

## 👥 Team Information

| Role | Full Name | Student ID |
|------|-----------|------------|
| Team Leader + Backend | Sudipto Das | 11220320830 |
| Artificial Intelligence | Rakibur Rahman Mishan | 11220320829 |
| Database + Frontend | Aditi Roy | 11220320846 |

---

## 📖 Project Description

**Quizora – AI-Based Smart Quiz** is a complete online assessment platform built with **Laravel 12, React, Inertia.js, Tailwind CSS, MySQL, and Groq AI**. It supports two user roles: **Teacher** and **Student**.

- Teachers can create and manage courses, manage multiple-choice questions (MCQs), generate course-aware questions using AI, generate multiple questions from PDF/PPTX course materials, and review suspicious quiz attempts.
- Students can take timed quizzes, receive instant results with correct answers and explanations, and view a course-wise leaderboard based on quiz performance.

### 🤖 Key AI Features

- **Course-Aware AI Question Generation** – Teachers select a course and enter a topic (e.g., "Normalization"). The system sends the selected course and topic through the Laravel backend to the Groq API. The AI returns a complete MCQ containing a question, four options, correct answer, and explanation, which automatically fills the question form for teacher review.

- **Material-Based AI Quiz Generation** – Teachers can upload a PDF or PPTX course material and generate **5 or 10 MCQs** from the uploaded content. The generated questions are shown in a preview page where teachers can remove unwanted questions before saving the approved questions to the database.

- **AI Response Validation** – The backend validates the generated JSON response, checks for exactly four unique options, verifies that the correct answer matches one of the options, checks required fields, and prevents duplicate questions.

### 🛡️ Suspicious Activity Detection

During a quiz, the system tracks browser tab switches using the `visibilitychange` event and calculates the average answering time.

If suspicious behavior is detected, such as a tab switch or unusually fast quiz completion, the attempt can be flagged as:

`is_suspicious = true`

and stored for teacher review.

> **Note:** Suspicious activity detection is rule-based and is not an AI/ML feature.

This system integrates **AI-assisted content generation**, **automated assessment**, **academic integrity monitoring**, and **performance-based ranking** into a modern and efficient quiz platform.

---

## ❓ Problem Statement

Traditional online quiz systems suffer from:

- **Manual question creation** – time-consuming and repetitive.
- **Preparing questions from learning materials** can require significant teacher effort.
- **Cheating behaviors** such as tab switching and extremely fast answering may remain undetected.
- **Delayed or limited feedback** for students.
- **Generic AI-generated questions** may contain content unrelated to the selected course.
- **Lack of engagement and fair ranking** in traditional assessment systems.

**Quizora – AI-Based Smart Quiz** addresses these problems by automating course-aware question generation, generating quizzes directly from learning materials, monitoring suspicious behavior, providing instant results with explanations, and maintaining a course-wise leaderboard.

---

## ✨ Proposed Features

### Student Side

- Registration and login using Laravel Breeze
- Student dashboard listing available courses
- Course-wise quiz access
- Timed quiz per course
- Time per question configurable by teacher
- Automatic quiz submission when time expires
- Instant result page
- Detailed answer review
- Selected answer, correct answer, and explanation display
- Course-wise leaderboard
- Protected student routes
- Secure logout

### Teacher Side

- Dedicated teacher panel accessible only to teacher accounts
- Teacher dashboard
- Course Management:
  - Create courses
  - Edit courses
  - Delete courses
  - Set time per question
- Question Management:
  - Add MCQs
  - Edit MCQs
  - Delete MCQs
  - Four answer options
  - Correct answer
  - Explanation
- Course-aware AI Question Generator
- PDF/PPTX Material-Based Quiz Generator
- Generate 5 or 10 questions from uploaded material
- Preview generated questions before saving
- Remove unwanted generated questions
- Save approved questions to the database
- Suspicious Attempts Report
- View tab-switch count and suspicious quiz attempts
- Protected teacher routes
- Secure logout

### AI Features

- **AI Question Generation** using Groq Cloud API
- **Course-Aware Prompt Generation** using selected course and topic
- **PDF/PPTX-Based AI Quiz Generation**
- **Structured AI Response Validation**
- **Duplicate Question Prevention**
- **User-Friendly AI Error Handling**

### Current AI Configuration

- **AI Platform:** Groq Cloud API
- **AI Model:** GPT-OSS 120B
- **Model ID:** `openai/gpt-oss-120b`

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Inertia.js |
| Styling | Tailwind CSS |
| Backend | Laravel 12 (PHP 8.2+) |
| Database | MySQL |
| ORM | Laravel Eloquent ORM |
| Authentication | Laravel Breeze |
| AI Integration | Groq Cloud API |
| AI Model | GPT-OSS 120B (`openai/gpt-oss-120b`) |
| PDF Processing | PDF Text Extraction |
| PPTX Processing | PHP ZipArchive |
| Version Control | Git & GitHub |

---

## 📁 Repository Structure

```text
AI-Based-Smart-Quiz-System/
│
├── 📁 backend/
│   │
│   ├── 📁 app/
│   │   ├── 📁 Http/
│   │   │   └── 📁 Controllers/
│   │   ├── 📁 Models/
│   │   └── 📁 Services/
│   │
│   ├── 📁 database/
│   │   └── 📁 migrations/
│   │
│   ├── 📁 public/
│   │   └── 📁 images/
│   │
│   ├── 📁 resources/
│   │   ├── 📁 css/
│   │   ├── 📁 js/
│   │   │   ├── 📁 Components/
│   │   │   ├── 📁 Layouts/
│   │   │   └── 📁 Pages/
│   │   └── 📁 views/
│   │
│   ├── 📁 routes/
│   ├── 📁 storage/
│   └── 📁 tests/
│
├── 📁 Week 03 Assignment/
│   ├── CSE4204-8A-T03_ArchitectureDiagram.pdf
│   ├── CSE4204-8A-T03_ERDiagram.pdf
│   ├── CSE4204-8A-T03_SRS.pdf
│   └── CSE4204-8A-T03_UseCaseDiagram.pdf
│
├── 📁 diagrams/
│   │
│   ├── 📁 Week 3/
│   │   ├── CSE4204-8A-T03_ArchitectureDiagram.png
│   │   ├── CSE4204-8A-T03_ERDiagram.png
│   │   └── CSE4204-8A-T03_UseCaseDiagram.png
│   │
│   └── 📁 Week 4/
│       ├── CSE4204-8A-T03_ActivityDiagram.pdf
│       ├── CSE4204-8A-T03_ERDiagram.pdf
│       ├── CSE4204-8A-T03_ArchitectureDiagram.pdf
│       └── CSE4204-8A-T03_UseCaseDiagram.pdf
│
├── 📁 documentation/
│   │
│   ├── 📁 week1/
│   │   └── CSE4204-8A-T03_Week01.pdf
│   │
│   ├── 📁 week2/
│   │   ├── CSE4204-8A-T03_Proposal.pdf
│   │   └── CSE4204-8A-T03_TeamInfo.pdf
│   │
│   ├── 📁 week3/
│   │   └── CSE4204-8A-T03_SRS.pdf
│   │
│   ├── 📁 week4/
│   │   ├── CSE4204-8A-T03_AIWorkflow.pdf
│   │   ├── CSE4204-8A-T03_APIDesign.pdf
│   │   └── CSE4204-8A-T03_SystemDesign.pdf
│   │
│   ├── 📁 week5/
│   │
│   ├── 📁 week6/
│   │
│   ├── 📁 week7/
│   │
│   ├── 📁 week8/
│   │   └── Week 08 AI Integration Documentation
│   │
│   └── 📁 week9/
│       └── Week 09 Progress and Integration Report
│
├── 📁 database/
│
├── 📁 postman/
│
└── README.md
