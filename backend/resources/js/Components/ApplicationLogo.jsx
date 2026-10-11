export default function ApplicationLogo({ className = '', ...props }) {
    return (
        <svg
            {...props}
            className={className}
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Quizora logo"
        >
            {/* Background */}
            <rect
                x="4"
                y="4"
                width="56"
                height="56"
                rx="16"
                fill="#4F46E5"
            />

            {/* Q */}
            <circle
                cx="29"
                cy="29"
                r="15"
                fill="none"
                stroke="white"
                strokeWidth="5"
            />

            {/* Q Tail */}
            <path
                d="M39 39 L48 48"
                fill="none"
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
            />

            {/* Correct answer check */}
            <path
                d="M21 29 L27 35 L38 22"
                fill="none"
                stroke="#C7D2FE"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* AI Spark */}
            <circle
                cx="47"
                cy="17"
                r="4"
                fill="#FBBF24"
            />
        </svg>
    );
}