import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  PencilIcon, 
  TrashIcon, 
  ArrowLeftIcon, 
  EyeIcon, 
  CalendarIcon, 
  ClockIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
  ShareIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useState, FormEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface Category {
  id: number;
  name: string;
  color?: string;
}

interface Tag {
  id: number;
  name: string;
}

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user: User;
  replies?: Comment[];
}

interface Blog {
  id: number;
  title: string;
  content: string;
  image_path: string | null;
  created_at: string;
  updated_at: string;
  user_id: number;
  user: User;
  view_count?: number;
  status?: string;
  categories?: Category[];
  tags?: Tag[];
  comments?: Comment[];
  likes_count?: number;
  is_liked?: boolean;
  allow_comments?: boolean;
  meta_description?: string;
}

interface Props {
  blog: Blog;
  auth: {
    user: User;
  };
}

export default function Show({ blog, auth }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiked, setIsLiked] = useState(blog.is_liked || false);
  const [likesCount, setLikesCount] = useState(blog.likes_count || 0);

  const { data, setData, post, processing, errors, reset } = useForm({
    content: '',
    parent_id: null as number | null,
  });

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
    },
    {
      title: 'Blogs',
      href: '/blogs',
    },
    {
      title: blog.title,
      href: `/blogs/${blog.id}`,
    },
  ];

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this blog?')) {
      setIsDeleting(true);
      router.delete(`/blogs/${blog.id}`);
    }
  };

  const handleLike = () => {
    router.post(`/blogs/${blog.id}/like`, {}, {
      preserveScroll: true,
      onSuccess: () => {
        setIsLiked(!isLiked);
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
      }
    });
  };

  const handleCommentSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(`/blogs/${blog.id}/comments`, {
      preserveScroll: true,
      onSuccess: () => {
        reset();
      }
    });
  };

  const isOwner = auth.user.id === blog.user_id;

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  const formatTime = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.meta_description || `Check out this blog post: ${blog.title}`,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing or error occurred
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        // You could add a toast notification here
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
      }
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={blog.title} />
      
      <div className="container max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-6 px-6">
          <Link href="/blogs" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Blogs
          </Link>

          {isOwner && (
            <div className="flex gap-2">
              <Link href={`/blogs/${blog.id}/edit`}>
                <Button variant="outline" className="flex items-center">
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <Card className="overflow-hidden">
          {/* Hero Image */}
          {blog.image_path && (
            <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
              <img
                src={`/storage/${blog.image_path}`}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          )}

          <CardContent className="p-8 lg:p-12">
            {/* Categories */}
            {blog.categories && blog.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant="secondary"
                    className="gap-1"
                  >
                    <TagIcon className="w-3 h-3" />
                    {category.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={blog.user.avatar} alt={blog.user.name} />
                  <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">
                    {blog.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{blog.user.name}</p>
                  <p className="text-xs">Author</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2" />
                <span>{formatDate(blog.created_at)}</span>
              </div>
              
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-2" />
                <span>{formatTime(blog.created_at)}</span>
              </div>
              
              {blog.view_count !== undefined && (
                <div className="flex items-center">
                  <EyeIcon className="w-4 h-4 mr-2" />
                  <span>{blog.view_count} views</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeRaw]}
                components={{
                  img: ({ src, alt, ...props }) => (
                    <img
                      src={src}
                      alt={alt}
                      className="rounded-lg shadow-md"
                      {...props}
                    />
                  ),
                }}
              >
                {blog.content}
              </ReactMarkdown>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      #{tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
                    isLiked
                      ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  )}
                >
                  {isLiked ? (
                    <HeartSolidIcon className="w-5 h-5" />
                  ) : (
                    <HeartIcon className="w-5 h-5" />
                  )}
                  {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
                </button>
                
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <ChatBubbleLeftIcon className="w-5 h-5" />
                  <span>{blog.comments?.length || 0} Comments</span>
                </div>
              </div>
              
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <ShareIcon className="w-5 h-5" />
                Share
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        {blog.allow_comments !== false && (
          <Card className="mt-8">
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Comments ({blog.comments?.length || 0})
              </h2>
            </CardHeader>
            <CardContent>
              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <div className="flex gap-4">
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">
                      {auth.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <textarea
                      value={data.content}
                      onChange={(e) => setData('content', e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full min-h-[100px] p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      required
                    />
                    {errors.content && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.content}</p>
                    )}
                    <div className="flex justify-end mt-3">
                      <Button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {processing ? 'Posting...' : 'Post Comment'}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Comments List */}
              {blog.comments && blog.comments.length > 0 ? (
                <div className="space-y-6">
                  {blog.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarFallback className="bg-gray-400 text-white text-sm font-medium">
                          {comment.user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {comment.user.name}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(comment.created_at)}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ChatBubbleLeftIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No comments yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Be the first to share your thoughts!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
