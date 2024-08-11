import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import PrimaryButton from '@/Components/PrimaryButton';
import { Sprout } from 'lucide-react';
import ChatLayout from '@/Layouts/ChatLayout';
import { ReactNode } from 'react';
import { usePage } from '@inertiajs/react';

const Home = () => {
    const page = usePage();
    return (
        <div className="py-12">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                    <div className="flex flex-col gap-4 p-6 text-gray-900 dark:text-gray-100">
                        You're logged in!
                        <Button className="inline-flex h-fit w-fit items-center rounded-sm border border-transparent bg-green-700 px-10 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-green-600 focus:bg-green-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-green-900 dark:bg-gray-200 dark:text-gray-800 dark:hover:bg-white dark:focus:bg-white dark:focus:ring-offset-gray-800 dark:active:bg-green-300">
                            <Sprout className="mr-2 h-4 w-4" />
                            Button
                        </Button>
                        <PrimaryButton className="w-fit">Button</PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

Home.layout = (page: ReactNode) => (
    <AuthenticatedLayout user={page.props.auth.user}>
        <ChatLayout>{page}</ChatLayout>
    </AuthenticatedLayout>
);

export default Home;
