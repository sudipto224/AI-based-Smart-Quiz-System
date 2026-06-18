# AI-Based Smart Quiz System

**Official Team Name:** CSE4204-8A-T03

---

## 👥 Team Information

| Role | Full Name | Student ID |
|------|-----------|------------|
| Team Leader + Backend | Sudipto Das | 11220320830 |
| Frontend | Chaon Das | 11210320629 |
| Artificial Intelligence | Rakibur Rahman Mishan | 11220320829 |
| Database | Aditi Roy | 11220320846 |

---

## 📖 Project Description

The **AI-based Smart Quiz System** is a complete online assessment platform built with Laravel 12, MySQL, and custom HTML/CSS/JavaScript. It supports two user roles: **Teacher** and **Student**.

- Teachers can create courses, manage multiple‑choice questions (MCQs), and use **Google Gemini AI** to automatically generate quiz questions.
- Students can take timed quizzes, receive instant feedback with correct answers and explanations, and view a course‑wise leaderboard ranked by score and completion time.

### 🤖 Key AI Features

- **AI Question Generation** – Teachers enter a topic (e.g., "Mobile IP"); the system calls Gemini API, which returns a complete MCQ (question, four options, correct answer, explanation) and auto‑fills the question form.
- **Cheating Detection** – During a quiz, the system tracks browser tab switches (`visibilitychange` event) and calculates average time per question. If any tab switch occurs or average time < 5 seconds, the attempt is flagged as suspicious (`is_suspicious = true`) and stored for teacher review.

This system integrates **gamification**, **automated content creation**, and **academic integrity monitoring** into a modern, efficient quiz platform.

---

## ❓ Problem Statement

Traditional online quiz systems suffer from:

- **Manual question creation** – time‑consuming and repetitive.
- **Cheating behaviors** (tab switching, extremely fast answering) often undetected.
- **Delayed or no feedback** for students.
- **Lack of engagement** and fair ranking.

The AI-based Smart Quiz System solves these by automating question generation, detecting suspicious behavior in real time, providing instant results with explanations, and using a time‑aware leaderboard.

---

## ✨ Proposed Features

### Student Side
- Registration and login (Laravel Breeze, customised redirects)
- Student dashboard listing available courses
- Timed quiz per course (time per question configurable by teacher)
- Timer with visual warning (red pulse when ≤10 sec left) and auto‑submit on timeout
- Instant result page: score, wrong answers with correct answers + explanations
- Course‑wise leaderboard (ranked by highest score, then shortest time)

### Teacher Side
- Dedicated teacher panel (accessible only to `is_teacher = 1`)
- Course Management: create, edit, delete courses; set time per question (seconds)
- Question Management: add, edit, delete MCQs with 4 options, correct answer, explanation
- AI Question Generator (for "Mobile Computing Lab" course only) – topic input, calls Gemini API, populates form
- Suspicious Attempts Report – view flagged attempts with tab switch count, average time, student details

### AI-Powered Features
- **AI Question Generation** using Google Gemini API (free tier)
- **Cheating Detection**: tab‑switch tracking (`visibilitychange`) + early submission detection (average <5 sec/question)

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, Custom CSS (no framework), Vanilla JavaScript |
| Backend | Laravel 12 (PHP) |
| Database | MySQL |
| Authentication | Laravel Breeze |
| AI Integration | Google Gemini API (free tier) |
| Version Control | Git & GitHub |

---

## 📁 Repository Structure
AI-Based-Smart-Quiz-System/
│

├── 📁 Week 03 Assignment/

│   ├── CSE4204-8A-T03_ArchitectureDiagram.pdf

│   ├── CSE4204-8A-T03_ERDiagram.pdf

│   ├── CSE4204-8A-T03_SRS.pdf

│   └── CSE4204-8A-T03_UseCaseDiagram.pdf
│

├── 📁 diagrams/

│   ├── 📁 Week 3/

│   │   ├── CSE4204-8A-T03_ArchitectureDiagram.png

│   │   ├── CSE4204-8A-T03_ERDiagram.png

│   │   └── CSE4204-8A-T03_UseCaseDiagram.png

│   └── 📁 Week 4/

│       ├── CSE4204-8A-T03_ActivityDiagram.pdf

│       ├── CSE4204-8A-T03_ERDiagram.pdf

│       ├── CSE4204-8A-T03_ArchitectureDiagram.pdf

│       └── CSE4204-8A-T03_UseCaseDiagram.pdf

│
├── 📁 documentation/

│   ├── 📁 week1/

│   │   └── CSE4204-8A-T03_Week01.pdf

│   ├── 📁 week2/

│   │   ├── CSE4204-8A-T03_Proposal.pdf

│   │   └── CSE4204-8A-T03_TeamInfo.pdf

│   ├── 📁 week3/

│   │   └── CSE4204-8A-T03_SRS.pdf

│   └── 📁 week4/

│       ├── CSE4204-8A-T03_AIWorkflow.pdf

│       ├── CSE4204-8A-T03_APIDesign.pdf

│       ├── CSE4204-8A-T03_SystemDesign.pdf


│      
│
└── README.md (root)
