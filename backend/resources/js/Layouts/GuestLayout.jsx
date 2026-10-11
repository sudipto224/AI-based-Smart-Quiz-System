import Brand from '@/Components/Brand';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">

            <div>
                <Link href="/">
                    <Brand
                        logoClassName="w-12 h-12"
                        textClassName="text-lg"
                        className="justify-center"
                    />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>

        </div>
    );
}