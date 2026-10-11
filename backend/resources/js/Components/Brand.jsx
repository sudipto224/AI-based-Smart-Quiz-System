import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Brand({
    logoClassName = 'w-10 h-10',
    textClassName = 'text-xl',
    className = '',
    light = false,
    hideTaglineOnMobile = false,
}) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <ApplicationLogo
                className={`shrink-0 ${logoClassName}`}
            />

            <div
                className={`font-bold tracking-tight whitespace-nowrap ${textClassName}`}
            >
                <span
                    className={
                        light
                            ? 'text-indigo-300'
                            : 'text-indigo-600'
                    }
                >
                    Quizora
                </span>

                <span
                    className={`
                        ${light ? 'text-white' : 'text-gray-800'}
                        ${hideTaglineOnMobile ? 'hidden sm:inline' : ''}
                    `}
                >
                    {' '}– AI-Based Smart Quiz
                </span>
            </div>
        </div>
    );
}