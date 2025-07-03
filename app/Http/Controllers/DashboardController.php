<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with real data.
     */
    public function index()
    {
        $user = Auth::user();
        
        // Get recent blog posts (latest 5)
        $recentBlogs = Blog::with(['user', 'categories', 'tags'])
            ->where('status', 'published')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($blog) {
                return [
                    'id' => $blog->id,
                    'title' => $blog->title,
                    'slug' => $blog->slug,
                    'excerpt' => $this->getExcerpt($blog->content),
                    'author' => [
                        'name' => $blog->user->name,
                        'avatar' => $blog->user->avatar ?? null,
                    ],
                    'created_at' => $blog->created_at->diffForHumans(),
                    'view_count' => $blog->view_count,
                    'categories' => $blog->categories->pluck('name'),
                    'tags' => $blog->tags->pluck('name'),
                ];
            });

        // Get user's recent activity (comments, likes, etc.)
        $recentActivity = collect();
        
        // Add recent comments by other users
        $recentComments = Comment::with(['user', 'blog'])
            ->where('blog_id', '!=', null)
            ->whereHas('blog', function ($query) {
                $query->where('status', 'published');
            })
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($comment) {
                return [
                    'type' => 'comment',
                    'user' => [
                        'name' => $comment->user->name,
                        'avatar' => $comment->user->avatar ?? null,
                        'initials' => $this->getInitials($comment->user->name),
                    ],
                    'description' => 'commented on "' . Str::limit($comment->blog->title, 30) . '"',
                    'created_at' => $comment->created_at->diffForHumans(),
                ];
            });

        // Add recent blog posts by other users
        $recentBlogActivity = Blog::with('user')
            ->where('status', 'published')
            ->where('user_id', '!=', $user->id)
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($blog) {
                return [
                    'type' => 'blog_published',
                    'user' => [
                        'name' => $blog->user->name,
                        'avatar' => $blog->user->avatar ?? null,
                        'initials' => $this->getInitials($blog->user->name),
                    ],
                    'description' => 'published "' . Str::limit($blog->title, 30) . '"',
                    'created_at' => $blog->created_at->diffForHumans(),
                ];
            });

        // Combine and sort activities
        $recentActivity = $recentComments->concat($recentBlogActivity)
            ->sortByDesc('created_at')
            ->take(6)
            ->values();

        // Get user's blog statistics
        $userBlogStats = [
            'total_blogs' => Blog::where('user_id', $user->id)->count(),
            'published_blogs' => Blog::where('user_id', $user->id)->where('status', 'published')->count(),
            'draft_blogs' => Blog::where('user_id', $user->id)->where('status', 'draft')->count(),
            'total_views' => Blog::where('user_id', $user->id)->sum('view_count'),
        ];

        // Get class statistics
        $classStats = [
            'total_students' => User::where('role', 'student')->count(),
            'total_teachers' => User::whereIn('role', ['teacher', 'admin', 'core_member'])->count(),
            'total_blogs' => Blog::where('status', 'published')->count(),
            'total_comments' => Comment::count(),
        ];

        return Inertia::render('dashboard', [
            'recentBlogs' => $recentBlogs,
            'recentActivity' => $recentActivity,
            'userBlogStats' => $userBlogStats,
            'classStats' => $classStats,
        ]);
    }

    /**
     * Get excerpt from content.
     */
    private function getExcerpt($content, $length = 100)
    {
        return Str::limit(strip_tags($content), $length);
    }

    /**
     * Get initials from name.
     */
    private function getInitials($name)
    {
        $words = explode(' ', $name);
        $initials = '';
        foreach (array_slice($words, 0, 2) as $word) {
            $initials .= strtoupper(substr($word, 0, 1));
        }
        return $initials;
    }
}
