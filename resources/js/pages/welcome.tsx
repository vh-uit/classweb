import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpenIcon, PencilSquareIcon, UserGroupIcon, ChatBubbleLeftRightIcon, ClipboardDocumentListIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="ClassWeb - Blog & Task Management">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                {/* Navigation */}
                <header className="w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center">
                                <AcademicCapIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">ClassWeb</span>
                            </div>
                            <nav className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
                            Welcome to <span className="text-blue-600 dark:text-blue-400">ClassWeb</span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                            Your comprehensive platform for classroom blogging and task management.
                            <br />
                            Share ideas, collaborate on projects, and stay organized with your class.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('register')}
                                        className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                    >
                                        Get started
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
                                    >
                                        Sign in <span aria-hidden="true">→</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="mt-16">
                        <div className="mx-auto max-w-2xl lg:text-center">
                            <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">Everything you need</h2>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                                Powerful tools for modern classrooms
                            </p>
                            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                                From collaborative blogging to task management, ClassWeb provides all the tools you need for an engaging and organized learning experience.
                            </p>
                        </div>
                        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                                <div className="flex flex-col">
                                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                                        <BookOpenIcon className="h-5 w-5 flex-none text-blue-600 dark:text-blue-400" aria-hidden="true" />
                                        Interactive Blogging
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                                        <p className="flex-auto">
                                            Create rich blog posts with markdown support, code highlighting, LaTeX formulas, and embedded media. Share your thoughts and collaborate with classmates.
                                        </p>
                                    </dd>
                                </div>
                                <div className="flex flex-col">
                                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                                        <ClipboardDocumentListIcon className="h-5 w-5 flex-none text-blue-600 dark:text-blue-400" aria-hidden="true" />
                                        Task Management
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                                        <p className="flex-auto">
                                            Stay organized with comprehensive task management. Track assignments, set deadlines, and monitor progress for both individual and group projects.
                                        </p>
                                    </dd>
                                </div>
                                <div className="flex flex-col">
                                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                                        <ChatBubbleLeftRightIcon className="h-5 w-5 flex-none text-blue-600 dark:text-blue-400" aria-hidden="true" />
                                        Collaborative Discussion
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                                        <p className="flex-auto">
                                            Engage in meaningful discussions with threaded comments, real-time notifications, and seamless communication between students and teachers.
                                        </p>
                                    </dd>
                                </div>
                                <div className="flex flex-col">
                                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                                        <UserGroupIcon className="h-5 w-5 flex-none text-blue-600 dark:text-blue-400" aria-hidden="true" />
                                        Role-Based Access
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                                        <p className="flex-auto">
                                            Secure platform with different access levels for students, teachers, and administrators. Maintain privacy and control over your classroom content.
                                        </p>
                                    </dd>
                                </div>
                                <div className="flex flex-col">
                                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                                        <PencilSquareIcon className="h-5 w-5 flex-none text-blue-600 dark:text-blue-400" aria-hidden="true" />
                                        Rich Content Creation
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                                        <p className="flex-auto">
                                            Advanced editor with real-time preview, syntax highlighting for code, mathematical formulas, and safe HTML embedding for multimedia content.
                                        </p>
                                    </dd>
                                </div>
                                <div className="flex flex-col">
                                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                                        <AcademicCapIcon className="h-5 w-5 flex-none text-blue-600 dark:text-blue-400" aria-hidden="true" />
                                        Learning-Focused
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                                        <p className="flex-auto">
                                            Designed specifically for educational environments with features that promote learning, creativity, and academic collaboration.
                                        </p>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {/* Getting Started Section */}
                    {!auth.user && (
                        <div className="mt-16 rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ready to get started?</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Join your classroom community today and start collaborating on blogs and managing tasks together.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href={route('register')}
                                    className="rounded-md bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                >
                                    Create Account
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="rounded-md border border-gray-300 px-6 py-3 text-center text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Class Statistics Section */}
                    <div className="mt-16">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl ring-1 ring-gray-200 dark:ring-gray-700">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Join Thousands of Students and Educators</h3>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">2,500+</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active Students</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">150+</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Educators</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">10,000+</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Blog Posts</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">25,000+</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Tasks Completed</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="mt-16 border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                © 2025 ClassWeb. Empowering education through collaboration.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
