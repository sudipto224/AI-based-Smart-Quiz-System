// Quizora Smart Guide: safe, curated in-app help.
// These workflows explain what to click. They NEVER submit, approve, delete,
// access restricted routes, or ask for passwords.

export const ROLE_STYLE = {
    student: {
        name: 'Student guide',
        color: '#205A42',
        soft: '#E8F2E9',
        text: '#173D2E',
    },
    teacher: {
        name: 'Faculty guide',
        color: '#93533D',
        soft: '#F8EBDF',
        text: '#5C392A',
    },
    admin: {
        name: 'Admin guide',
        color: '#363D36',
        soft: '#F3E8DA',
        text: '#292F2A',
    },
    applicant: {
        name: 'Account guide',
        color: '#475569',
        soft: '#F1F5F9',
        text: '#334155',
    },
};

const step = (title, description, extra = {}) => ({
    title,
    description,
    ...extra,
});

export const GUIDES = {
    student: [
        {
            id: 'student-overview',
            icon: 'compass',
            title: 'Explore my dashboard',
            description: 'Find courses, start quizzes and check rankings.',
            keywords: 'home overview navigation beginner',
            steps: [
                step('Welcome to your dashboard', 'This is your learning home. Your available courses and learning shortcuts are shown here.', {
                    at: '/dashboard', go: '/dashboard', target: 'h1',
                }),
                step('Find a course', 'Use Search Courses to filter courses by title or description. If no course appears, wait until a teacher publishes one.', {
                    at: '/dashboard', go: '/dashboard', target: 'input[placeholder="Search courses..."]',
                }),
                step('Start a regular quiz', 'Find the course you want, then click Start Quiz. No quiz is started automatically by this guide.', {
                    at: '/dashboard', go: '/dashboard', target: 'a[href*="/quiz/"]', contains: 'Start Quiz',
                }),
                step('Open course rankings', 'Select Leaderboard on a course card to view its ranking.', {
                    at: '/dashboard', go: '/dashboard', target: 'a[href*="/leaderboard/"]',
                }),
                step('Join a live classroom', 'When your teacher provides a room code, click Join Live Quiz.', {
                    at: '/dashboard', go: '/dashboard', target: 'a[href*="/student/live-quiz"]',
                }),
            ],
        },
        {
            id: 'student-quiz',
            icon: 'book',
            title: 'How to take a quiz',
            description: 'From course selection to results.',
            keywords: 'start answer submit score mcq exam assessment',
            steps: [
                step('Choose a course', 'Go to your dashboard and click Start Quiz on an available course.', {
                    at: '/dashboard', go: '/dashboard', target: 'a[href*="/quiz/"]', contains: 'Start Quiz',
                }),
                step('Answer the questions', 'On the quiz page, select one answer for each question. Watch the question timer.', {
                    starts: '/quiz/', target: 'input[type="radio"]',
                }),
                step('Submit your answers', 'When you are ready, use the Submit button on the quiz page. This guide will never submit a quiz for you.', {
                    starts: '/quiz/', target: 'button[type="submit"]',
                }),
                step('Read your result', 'After submitting, review your score and question feedback on the result page.', {
                    starts: '/result/', target: 'h2',
                }),
            ],
        },
        {
            id: 'student-live',
            icon: 'users',
            title: 'Join a live quiz room',
            description: 'Use your teacher’s room code.',
            keywords: 'session room code teacher live waiting join',
            steps: [
                step('Open Live Quiz', 'Choose Join Live Quiz from your dashboard.', {
                    at: '/dashboard', go: '/dashboard', target: 'a[href*="/student/live-quiz"]',
                }),
                step('Enter the room code', 'Type the room code exactly as your teacher shared it.', {
                    at: '/student/live-quiz', go: '/student/live-quiz', target: 'input[placeholder="DBMS-4821"]',
                }),
                step('Join the session', 'Press the Join button. You may be placed in a waiting room until the teacher starts.', {
                    at: '/student/live-quiz', go: '/student/live-quiz', target: 'button[type="submit"]',
                }),
                step('Wait for the teacher', 'Stay on the waiting page until the teacher starts the session. Follow the on-screen timer and instructions.', {
                    starts: '/student/live-quiz/', target: 'h1',
                }),
            ],
        },
        {
            id: 'student-profile',
            icon: 'user',
            title: 'Update my profile',
            description: 'Find the profile and account controls.',
            keywords: 'name password account edit',
            steps: [
                step('Open Profile', 'Click Profile in the top navigation to open your account settings.', {
                    target: 'a[href*="/profile"]', go: '/profile',
                }),
                step('Review your settings', 'Edit only your own details and use the page’s save controls when ready. The guide does not change your account.', {
                    at: '/profile', go: '/profile', target: 'h2',
                }),
            ],
        },
    ],
    teacher: [
        {
            id: 'teacher-overview',
            icon: 'compass',
            title: 'Explore faculty dashboard',
            description: 'See your courses and teacher tools.',
            keywords: 'home overview navigation',
            steps: [
                step('Welcome to Faculty Studio', 'Your teacher dashboard is the starting point for course and assessment management.', {
                    at: '/dashboard', go: '/dashboard', target: 'h1',
                }),
                step('Manage your courses', 'Open Course Management to review the courses you created.', {
                    at: '/dashboard', go: '/dashboard', target: 'a[href*="/teacher/courses"]', contains: 'Course Management',
                }),
                step('Host a live quiz', 'Open Live Classrooms when you want to set up a timed classroom quiz.', {
                    at: '/dashboard', go: '/dashboard', target: 'a[href*="/teacher/live-quiz-rooms"]',
                }),
                step('Review suspicious attempts', 'Use Attempt Monitoring for flagged quiz activity. A flag is not proof of cheating.', {
                    at: '/dashboard', go: '/dashboard', target: 'a[href*="/teacher/suspicious-attempts"]',
                }),
            ],
        },
        {
            id: 'teacher-course',
            icon: 'book',
            title: 'Create a new course',
            description: 'Name the course and configure quiz time.',
            keywords: 'add course time create teacher',
            steps: [
                step('Find Create Course', 'Click Create Course from your teacher dashboard.', {
                    at: '/dashboard', go: '/dashboard', target: 'a[href*="/teacher/courses/create"]',
                }),
                step('Enter course name', 'Choose a meaningful course name that students will easily recognize.', {
                    at: '/teacher/courses/create', go: '/teacher/courses/create', target: 'input[type="text"]',
                }),
                step('Describe the course', 'Add a short description so students know what the course covers.', {
                    at: '/teacher/courses/create', go: '/teacher/courses/create', target: 'textarea',
                }),
                step('Set question timing', 'Choose the number of seconds allowed per question.', {
                    at: '/teacher/courses/create', go: '/teacher/courses/create', target: 'input[type="number"]',
                }),
                step('Save your course', 'Click Save Course when all fields are correct. This guide never saves a course on your behalf.', {
                    at: '/teacher/courses/create', go: '/teacher/courses/create', target: 'button[type="submit"]',
                }),
            ],
        },
        {
            id: 'teacher-questions',
            icon: 'list',
            title: 'Add questions to a course',
            description: 'Find question management and manual MCQs.',
            keywords: 'question answer mcq create edit teacher',
            steps: [
                step('Choose your course', 'On your dashboard, click Questions on the course you want to edit. Create a course first if the list is empty.', {
                    at: '/dashboard', go: '/dashboard', target: 'a[href*="/questions"]', contains: 'Questions',
                }),
                step('Open Add Question', 'On the course Questions page, choose the option to create a new question.', {
                    starts: '/teacher/courses/', target: 'a[href*="/questions/create"]',
                }),
                step('Complete the question form', 'Write a clear question, prepare four options, and identify the correct answer before saving.', {
                    starts: '/teacher/courses/', target: 'form',
                }),
            ],
        },
        {
            id: 'teacher-ai',
            icon: 'sparkles',
            title: 'Use AI question tools',
            description: 'Generate or review questions inside a course.',
            keywords: 'ai generate groq topic distractor quality',
            steps: [
                step('Open course questions', 'Choose Questions for one of your courses on the dashboard.', {
                    at: '/dashboard', go: '/dashboard', target: 'a[href*="/questions"]', contains: 'Questions',
                }),
                step('Open the Question Creator', 'Click Add Question on the Questions page.', {
                    starts: '/teacher/courses/', target: 'a[href*="/questions/create"]',
                }),
                step('Give AI a clear topic', 'On the question creation page, enter a specific topic such as Database Normalization. Use its AI action to generate a draft.', {
                    starts: '/teacher/courses/', target: 'input[placeholder^="Enter a "]',
                }),
                step('Review before saving', 'Check that the AI-generated answer and distractors are correct. AI can make mistakes; you are responsible for final questions.', {
                    starts: '/teacher/courses/', target: 'button[type="submit"]',
                }),
            ],
        },
        {
            id: 'teacher-material',
            icon: 'file',
            title: 'Generate quiz from material',
            description: 'Use your own PDF or presentation.',
            keywords: 'pdf pptx upload material generator ai',
            steps: [
                step('Pick a course', 'Open Questions for the course that should receive the generated questions.', {
                    at: '/dashboard', go: '/dashboard', target: 'a[href*="/questions"]', contains: 'Questions',
                }),
                step('Open Material Generator', 'On the Questions page, select the Material Generator button.', {
                    starts: '/teacher/courses/', target: 'a[href*="/material-generator"]',
                }),
                step('Upload a supported file', 'Choose a PDF or PPTX. Review the generated questions carefully before confirming Save.', {
                    starts: '/teacher/courses/', target: 'input[type="file"]',
                }),
            ],
        },
        {
            id: 'teacher-live',
            icon: 'users',
            title: 'Host a live quiz',
            description: 'Create a room and share its join code.',
            keywords: 'teacher room host start end session',
            steps: [
                step('Open Live Classrooms', 'Click Live Classrooms on your teacher dashboard.', {
                    at: '/dashboard', go: '/dashboard', target: 'a[href*="/teacher/live-quiz-rooms"]',
                }),
                step('Name the session', 'Fill in the session details and choose the questions for your live quiz.', {
                    at: '/teacher/live-quiz-rooms', go: '/teacher/live-quiz-rooms', target: 'input[placeholder="DBMS Class Quiz"]',
                }),
                step('Create the room', 'After creating the room, share its join code with students. Start and end the session yourself when ready.', {
                    at: '/teacher/live-quiz-rooms', go: '/teacher/live-quiz-rooms', target: 'button[type="submit"]',
                }),
            ],
        },
        {
            id: 'teacher-monitor',
            icon: 'shield',
            title: 'Review suspicious attempts',
            description: 'Find the monitoring page and understand flags.',
            keywords: 'cheating tab switching suspicious flags',
            steps: [
                step('Go to Attempt Monitoring', 'Click Attempt Monitoring in your teacher dashboard.', {
                    at: '/dashboard', go: '/dashboard', target: 'a[href*="/teacher/suspicious-attempts"]',
                }),
                step('Review each flagged attempt', 'Check the available context before drawing conclusions. A suspicious flag alone does not prove dishonesty.', {
                    at: '/teacher/suspicious-attempts', go: '/teacher/suspicious-attempts', target: 'h2',
                }),
            ],
        },
    ],
    admin: [
        {
            id: 'admin-overview',
            icon: 'compass',
            title: 'Explore admin dashboard',
            description: 'Understand statistics and account lists.',
            keywords: 'overview users admin statistics',
            steps: [
                step('Welcome, administrator', 'This dashboard shows account statistics and teacher access management.', {
                    at: '/admin/dashboard', go: '/admin/dashboard', target: 'h1',
                }),
                step('Pending teacher requests', 'Select Pending Requests to see applications awaiting manual review.', {
                    at: '/admin/dashboard', go: '/admin/dashboard', target: 'button[role="tab"]', contains: 'Pending',
                }),
                step('Approved teachers', 'Select Approved Teachers to review active teacher accounts.', {
                    at: '/admin/dashboard', go: '/admin/dashboard', target: 'button[role="tab"]', contains: 'Approved',
                }),
                step('Inactive teachers', 'Select Rejected / Revoked to review accounts whose teacher access is disabled.', {
                    at: '/admin/dashboard', go: '/admin/dashboard', target: 'button[role="tab"]', contains: 'Rejected',
                }),
            ],
        },
        {
            id: 'admin-approve',
            icon: 'check',
            title: 'Review a teacher request',
            description: 'Safely approve or reject an application.',
            keywords: 'pending approve reject applicant teacher',
            steps: [
                step('Open Pending Requests', 'Select Pending Requests. You will only see a request if someone has registered as a teacher.', {
                    at: '/admin/dashboard', go: '/admin/dashboard', target: 'button[role="tab"]', contains: 'Pending',
                }),
                step('Find the applicant', 'Review the name and email. Verify teacher identity against trusted institutional records before taking action.', {
                    at: '/admin/dashboard', go: '/admin/dashboard', target: 'input[placeholder="Search by name or email..."]',
                }),
                step('Approve or reject yourself', 'Use Approve only for a verified teacher, otherwise Reject. This assistant NEVER clicks either button automatically.', {
                    at: '/admin/dashboard', go: '/admin/dashboard', target: 'button', contains: 'Approve',
                }),
            ],
        },
        {
            id: 'admin-revoke',
            icon: 'lock',
            title: 'Revoke teacher access',
            description: 'Find the control without removing course data.',
            keywords: 'revoke disable remove teacher permission',
            steps: [
                step('Select Approved Teachers', 'Open Approved Teachers to find the account whose access you intend to change.', {
                    at: '/admin/dashboard', go: '/admin/dashboard', target: 'button[role="tab"]', contains: 'Approved',
                }),
                step('Identify the correct account', 'Check the person’s name and email carefully. Revoking access is a consequential action.', {
                    at: '/admin/dashboard', go: '/admin/dashboard', target: 'input[placeholder="Search by name or email..."]',
                }),
                step('Revoke only if authorized', 'Use the Revoke button for the correct account. The account loses teacher access while previous course data remains stored.', {
                    at: '/admin/dashboard', go: '/admin/dashboard', target: 'button', contains: 'Revoke',
                }),
            ],
        },
    ],
    applicant: [
        {
            id: 'applicant-status',
            icon: 'clock',
            title: 'Understand my application',
            description: 'Pending, rejected and revoked statuses.',
            keywords: 'teacher approval wait account request',
            steps: [
                step('Check your current status', 'Your Dashboard explains whether your teacher application is Pending, Rejected or Revoked.', {
                    at: '/dashboard', go: '/dashboard', target: 'h1, h2',
                }),
                step('What happens next?', 'Pending requests are manually reviewed by an administrator. Teacher features remain unavailable until approval.', {
                    at: '/dashboard', go: '/dashboard', target: 'main',
                }),
                step('Open Profile', 'Use Profile from the top navigation to manage your account details.', {
                    target: 'a[href*="/profile"]', go: '/profile',
                }),
            ],
        },
    ],
};
