import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpenIcon, PencilSquareIcon, ClipboardDocumentListIcon, ChatBubbleLeftRightIcon, UserGroupIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { auth, recentBlogs, recentActivity, userBlogStats, classStats } = usePage<SharedData & {
        recentBlogs: any[];
        recentActivity: any[];
        userBlogStats: {
            total_blogs: number;
            published_blogs: number;
            draft_blogs: number;
            total_views: number;
        };
        classStats: {
            total_students: number;
            total_teachers: number;
            total_blogs: number;
            total_comments: number;
        };
    }>().props;

    // Helper function to get border colors for blog posts
    const getBorderColor = (index: number) => {
        const colors = ['border-blue-500', 'border-green-500', 'border-purple-500', 'border-orange-500', 'border-pink-500'];
        return colors[index % colors.length];
    };

    // Helper function to get avatar background colors
    const getAvatarColor = (index: number) => {
        const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
        return colors[index % colors.length];
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - ClassWeb" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
                    <h1 className="text-2xl font-bold mb-2">Welcome back, {auth.user?.name}!</h1>
                    <p className="text-blue-100">Ready to continue your learning journey? Check out what's new in your classroom.</p>
                    
                    {/* User Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold">{userBlogStats.total_blogs}</div>
                            <div className="text-blue-200 text-sm">Total Posts</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">{userBlogStats.published_blogs}</div>
                            <div className="text-blue-200 text-sm">Published</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">{userBlogStats.draft_blogs}</div>
                            <div className="text-blue-200 text-sm">Drafts</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">{userBlogStats.total_views}</div>
                            <div className="text-blue-200 text-sm">Total Views</div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link href="/blogs/create" className="group">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow group-hover:border-blue-300 dark:group-hover:border-blue-600">
                            <div className="flex items-center">
                                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                                    <PencilSquareIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="ml-4 flex-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Write Blog</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Create new post</p>
                                </div>
                            </div>
                        </div>
                    </Link>

                    <Link href="/blogs" className="group">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow group-hover:border-green-300 dark:group-hover:border-green-600">
                            <div className="flex items-center">
                                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                                    <BookOpenIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="ml-4 flex-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Browse Blogs</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{classStats.total_blogs} posts</p>
                                </div>
                            </div>
                        </div>
                    </Link>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer hover:border-purple-300 dark:hover:border-purple-600">
                        <div className="flex items-center">
                            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                                <ClipboardDocumentListIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="ml-4 flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Tasks</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Coming soon</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer hover:border-orange-300 dark:hover:border-orange-600">
                        <div className="flex items-center">
                            <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg">
                                <UserGroupIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div className="ml-4 flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Class</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{classStats.total_students + classStats.total_teachers} members</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Blog Posts */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Blog Posts</h2>
                                <Link href="/blogs" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                    View all
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {recentBlogs.length > 0 ? (
                                    recentBlogs.map((blog, index) => (
                                        <div key={blog.id} className={`border-l-4 ${getBorderColor(index)} pl-4 py-2`}>
                                            <Link href={`/blogs/${blog.id}`}>
                                                <h3 className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                                                    {blog.title}
                                                </h3>
                                            </Link>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                by {blog.author.name} • {blog.created_at}
                                            </p>
                                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                                                {blog.excerpt}
                                            </p>
                                            {blog.categories.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {blog.categories.map((category: string) => (
                                                        <span key={category} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                                            {category}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No blog posts yet</h3>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating your first blog post.</p>
                                        <div className="mt-6">
                                            <Link
                                                href="/blogs/create"
                                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                            >
                                                <PencilSquareIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                                Write your first post
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Class Overview */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Class Overview</h2>
                                <UserGroupIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <div>
                                        <p className="font-medium text-blue-800 dark:text-blue-300">Students</p>
                                        <p className="text-sm text-blue-600 dark:text-blue-400">Active learners</p>
                                    </div>
                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{classStats.total_students}</div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <div>
                                        <p className="font-medium text-green-800 dark:text-green-300">Educators</p>
                                        <p className="text-sm text-green-600 dark:text-green-400">Teachers & admins</p>
                                    </div>
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{classStats.total_teachers}</div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <div>
                                        <p className="font-medium text-purple-800 dark:text-purple-300">Total Comments</p>
                                        <p className="text-sm text-purple-600 dark:text-purple-400">Class discussions</p>
                                    </div>
                                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{classStats.total_comments}</div>
                                </div>
                            </div>
                        </div>

                        {/* Class Activity */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Class Activity</h2>
                                <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="space-y-3">
                                {recentActivity.length > 0 ? (
                                    recentActivity.map((activity, index) => (
                                        <div key={index} className="flex items-start space-x-3">
                                            <div className={`w-8 h-8 ${getAvatarColor(index)} rounded-full flex items-center justify-center text-white text-sm font-medium`}>
                                                {activity.user.initials}
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-900 dark:text-white">
                                                    {activity.user.name} {activity.description}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{activity.created_at}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4">
                                        <ChatBubbleLeftRightIcon className="mx-auto h-8 w-8 text-gray-400" />
                                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No recent activity</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
