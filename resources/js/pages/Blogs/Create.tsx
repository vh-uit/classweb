import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { FormEvent, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MarkdownEditor from '@/components/EnhancedMarkdownEditor';

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
    title: 'Create Blog',
    href: '/blogs/create',
  },
];

export default function Create() {
  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    content: '',
    image: null as File | null,
    format_type: 'markdown',
    status: 'draft',
    allow_comments: true as boolean,
    meta_description: '',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post('/blogs', {
      forceFormData: true,
      onSuccess: () => {
        reset();
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      },
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setData('image', file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Blog" />
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/blogs" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4">
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Blogs
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Blog Post</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Share your thoughts, tutorials, and insights with the community</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-lg font-semibold text-gray-900 dark:text-white">
                Title *
              </Label>
              <Input
                id="title"
                type="text"
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                placeholder="Enter an engaging title for your blog post"
                className={`text-lg h-12 ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              />
              {errors.title && <p className="text-red-500 text-sm flex items-center mt-1">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.title}
              </p>}
            </div>

            {/* Meta Description */}
            <div className="space-y-2">
              <Label htmlFor="meta_description" className="text-lg font-semibold text-gray-900 dark:text-white">
                Description
              </Label>
              <textarea
                id="meta_description"
                value={data.meta_description}
                onChange={(e) => setData('meta_description', e.target.value)}
                placeholder="Brief description of your blog post (optional, used for SEO and previews)"
                rows={3}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              {errors.meta_description && <p className="text-red-500 text-sm">{errors.meta_description}</p>}
            </div>

            {/* Featured Image */}
            <div className="space-y-2">
              <Label htmlFor="image" className="text-lg font-semibold text-gray-900 dark:text-white">
                Featured Image
              </Label>
              <div className="space-y-4">
                <Input
                  id="image"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className={`${errors.image ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                />
                {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}

                {imagePreview && (
                  <div className="relative max-w-md">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="rounded-lg max-h-64 object-cover shadow-md border border-gray-200 dark:border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setData('image', null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content" className="text-lg font-semibold text-gray-900 dark:text-white">
                Content *
              </Label>
              <MarkdownEditor
                value={data.content}
                onChange={(val) => setData('content', val || '')}
                error={errors.content}
                placeholder="Write your blog content here. You can use Markdown formatting, including code blocks, tables, and math equations."
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You can use Markdown formatting, including code blocks, tables, and math equations.
              </p>
            </div>

            {/* Settings */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Post Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status" className="font-medium text-gray-900 dark:text-white">
                    Status
                  </Label>
                  <select
                    id="status"
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                  >
                    <option value="draft">Save as Draft</option>
                    <option value="published">Publish Now</option>
                  </select>
                </div>

                {/* Allow Comments */}
                <div className="space-y-2">
                  <Label htmlFor="allow_comments" className="font-medium text-gray-900 dark:text-white">
                    Comments
                  </Label>
                  <div className="flex items-center space-x-3 mt-3">
                    <input
                      id="allow_comments"
                      type="checkbox"
                      checked={data.allow_comments}
                      onChange={(e) => setData('allow_comments', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="allow_comments" className="text-sm font-medium text-gray-900 dark:text-white">
                      Allow comments on this post
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end border-t border-gray-200 dark:border-gray-700 pt-6">
              <Link href="/blogs">
                <Button type="button" variant="outline" className="w-full sm:w-auto">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={processing}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
              >
                {processing ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {data.status === 'published' ? 'Publishing...' : 'Saving...'}
                  </div>
                ) : (
                  data.status === 'published' ? 'Publish Post' : 'Save Draft'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
