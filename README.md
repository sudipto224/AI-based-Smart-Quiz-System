Project Ttile    :  AI-based-Smart-Quiz-System

Team Information : i) Name   : Chaon Das
                      ID     : 11210320629  
                      
			       ii) Name   : Rakibur Rahman Mishan
                       ID     : 11220320829
                       
			       iii) Name   : Sudipto Das
                        ID     : 11220320830
                      
                   iv) Name    : Aditi Roy
                       ID      : 11220320846


 Proposed Features :

## User Side
- User registration and login (Laravel Breeze, customized redirects)
- Homepage with typing animation, gradient background, and floating shapes
- Three difficulty levels: Easy (8 questions), Medium (10 questions), Hard (10 questions)
- Timer: 30 seconds per question (configurable), red pulse warning when ≤10 seconds left, auto-submit on timeout
- Instant result page: score display, wrong answers with correct answer + explanation
- Leaderboard: ranks users by best score and shortest completion time

## Admin Side
- Dedicated admin panel (accessible only to `is_admin = 1`)
- Add / delete questions with level, question text, 4 options, explanation, and correct answer
- Dynamic correct-answer dropdown that populates from the option fields

## AI-Powered Features
- **AI Question Generation**: Admin enters a topic → AI (Gemini/OpenAI) generates a complete MCQ (question, 4 options, answer, explanation) and saves it to the database.
- **Cheating Detection**:
  - Tab‑switch detection using JavaScript `visibilitychange` event
  - Early submission detection – flags attempts with average time <5 seconds per question (`is_suspicious` column in `quiz_attempts`)


Technology Stack :

- Frontend        : HTML5, Custom CSS (no framework), Vanilla JavaScript
- Backend         : Laravel 12 (PHP)
- Database        : MySQL / PostgreSQL
- Authentication  : Laravel Breeze
- AI Integration  : Google Gemini API / OpenAI API
- Version Control : Git & GitHub


Project Description :

The AI-Based Smart Quiz System is a complete online assessment platform built with Laravel. It allows students to register, log in, and take timed quizzes across three difficulty levels (Easy, Medium, Hard). After submission, students receive immediate feedback including their score, correct answers, and explanations for wrong answers. A leaderboard displays rankings based on highest score and fastest completion time.

Administrators have a dedicated panel to manage the question bank – adding, viewing, and deleting questions. Each question stores the level, text, four options, the correct answer, and an explanation.

Two advanced AI features are being integrated:

1. AI Question Generation – Administrators can generate high-quality multiple-choice questions simply by typing a topic. The system calls an AI API and auto‑fills the database, saving hours of manual work.
2. Cheating Detection – During a quiz, the system detects if a student switches to another browser tab (tab‑switch detection) and also flags submissions that are completed much faster than normal (early submission detection). Suspicious attempts are marked in the database for admin review.

This system combines gamification, automated content creation, and academic integrity monitoring to provide a modern, efficient, and trustworthy quiz platform.
