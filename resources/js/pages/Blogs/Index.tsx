import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusIcon, ChatBubbleLeftIcon, EyeIcon, CalendarIcon, UserIcon, TagIcon } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/solid';

interface Category {
  id: number;
  name: string;
  color?: string;
}

interface Tag {
  id: number;
  name: string;
}

interface Blog {
  id: number;
  title: string;
  content: string;
  image_path: string | null;
  created_at: string;
  updated_at: string;
  view_count?: number;
  status?: string;
  excerpt?: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  categories?: Category[];
  tags?: Tag[];
  comments_count?: number;
  likes_count?: number;
}

interface Props {
  blogs: Blog[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Blogs',
    href: '/blogs',
  },
];

export default function Index({ blogs }: Props) {
  // Helper function to get excerpt from markdown content
  const getExcerpt = (content: string, length: number = 150) => {
    // Remove markdown formatting for preview
    const plainText = content
      .replace(/[#*_~`]/g, '') // Remove basic markdown chars
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to just text
      .replace(/\n/g, ' ') // Replace newlines with spaces
      .trim();
    
    return plainText.length > length 
      ? plainText.substring(0, length) + '...' 
      : plainText;
  };

  // Helper function to get category colors
  const getCategoryColor = (index: number) => {
    const colors = [
      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    ];
    return colors[index % colors.length];
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Blogs" />
      <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 sm:p-6 overflow-x-auto max-w-none">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Discover insights, tutorials, and thoughts from our community
            </p>
          </div>
          <Link href="/blogs/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <PlusIcon className="h-5 w-5 mr-2" />
              Write New Post
            </Button>
          </Link>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto max-w-md">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No blog posts yet</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Get started by creating your first blog post and sharing your ideas with the community.
              </p>
              <div className="mt-6">
                <Link href="/blogs/create">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create Your First Post
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {blogs.map((blog, index) => (
              <Link key={blog.id} href={`/blogs/${blog.id}`} className="group block">
                <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 group-hover:-translate-y-1">
                  {blog.image_path && (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={`/storage/${blog.image_path}`}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    {/* Categories */}
                    {blog.categories && blog.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {blog.categories.slice(0, 2).map((category, catIndex) => (
                          <span
                            key={category.id}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(catIndex)}`}
                          >
                            <TagIcon className="w-3 h-3 mr-1" />
                            {category.name}
                          </span>
                        ))}
                        {blog.categories.length > 2 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                            +{blog.categories.length - 2} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {blog.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                      {blog.excerpt || getExcerpt(blog.content)}
                    </p>

                    {/* Meta information */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <UserIcon className="w-4 h-4 mr-1" />
                          <span>{blog.user.name}</span>
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          <span>{new Date(blog.created_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {blog.view_count !== undefined && (
                          <div className="flex items-center">
                            <EyeIcon className="w-4 h-4 mr-1" />
                            <span>{blog.view_count}</span>
                          </div>
                        )}
                        {blog.comments_count !== undefined && (
                          <div className="flex items-center">
                            <ChatBubbleLeftIcon className="w-4 h-4 mr-1" />
                            <span>{blog.comments_count}</span>
                          </div>
                        )}
                        {blog.likes_count !== undefined && (
                          <div className="flex items-center text-red-500">
                            <HeartIcon className="w-4 h-4 mr-1" />
                            <span>{blog.likes_count}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                          >
                            #{tag.name}
                          </span>
                        ))}
                        {blog.tags.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                            +{blog.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
