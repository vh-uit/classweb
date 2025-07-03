<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Comment;
use App\Models\Like;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BlogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $query = Blog::with(['user', 'categories', 'tags'])
            ->withCount(['comments', 'likes'])
            ->select('blogs.*');

        // If user is not a moderator, only show published posts and their own drafts
        if (!$user->isModerator()) {
            $query->where(function($q) use ($user) {
                $q->where('status', 'published')
                  ->orWhere(function($q) use ($user) {
                      $q->where('status', 'draft')
                        ->where('user_id', $user->id);
                  });
            });
        }

        $blogs = $query->latest()->get()->map(function($blog) {
            // Create excerpt if not exists
            if (!$blog->excerpt) {
                $blog->excerpt = $this->createExcerpt($blog->content);
            }
            return $blog;
        });

        return Inertia::render('Blogs/Index', [
            'blogs' => $blogs,
            'userRole' => $user->role
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Blogs/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'format_type' => 'string|in:markdown,rich_text,html',
            'status' => 'string|in:draft,published',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'slug' => 'nullable|string|max:255|unique:blogs,slug',
            'allow_comments' => 'boolean',
        ]);

        $data = [
            'user_id' => Auth::id(),
            'title' => $validated['title'],
            'content' => $validated['content'],
            'format_type' => $validated['format_type'] ?? 'markdown',
            'status' => $validated['status'] ?? 'draft',
            'meta_title' => $validated['meta_title'] ?? null,
            'meta_description' => $validated['meta_description'] ?? null,
            'slug' => $validated['slug'] ?? null,
            'allow_comments' => $validated['allow_comments'] ?? true,
        ];

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('blogs', 'public');
            $data['image_path'] = $path;
        }

        $blog = Blog::create($data);

        $redirectRoute = $data['status'] === 'published'
            ? route('blogs.show', $blog->id)
            : route('blogs.index');

        return redirect($redirectRoute)->with('success', 'Blog ' . ($data['status'] === 'published' ? 'published' : 'saved as draft') . ' successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = Auth::user();
        
        $blog = Blog::with([
            'user', 
            'categories', 
            'tags',
            'comments' => function($query) {
                $query->whereNull('parent_id')
                      ->with(['user', 'replies.user'])
                      ->where('is_approved', true)
                      ->orderBy('created_at', 'desc');
            }
        ])
        ->withCount(['likes', 'comments'])
        ->findOrFail($id);

        // Check if the user is authorized to view this blog if it's a draft
        if ($blog->status === 'draft' && $blog->user_id !== $user->id && !$user->isModerator()) {
            return redirect()->route('blogs.index')->with('error', 'You are not authorized to view this draft blog post.');
        }

        // Increment view count if not the author
        if ($blog->user_id !== $user->id) {
            $blog->increment('view_count');
        }

        // Check if current user liked this blog
        $isLiked = $blog->likes()->where('user_id', $user->id)->exists();

        return Inertia::render('Blogs/Show', [
            'blog' => array_merge($blog->toArray(), [
                'is_liked' => $isLiked,
            ]),
            'userRole' => $user->role,
            'canEdit' => $blog->user_id === $user->id || $user->isModerator(),
            'canDelete' => $blog->user_id === $user->id || $user->isModerator(),
            'canComment' => $blog->allow_comments
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $blog = Blog::findOrFail($id);

        // Check if the user is authorized to edit this blog
        if ($blog->user_id !== Auth::id() && !Auth::user()->isModerator()) {
            return redirect()->route('blogs.index')->with('error', 'You are not authorized to edit this blog.');
        }

        return Inertia::render('Blogs/Edit', [
            'blog' => $blog
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $blog = Blog::findOrFail($id);

        // Check if the user is authorized to update this blog
        if ($blog->user_id !== Auth::id() && !Auth::user()->isModerator()) {
            return redirect()->route('blogs.index')->with('error', 'You are not authorized to update this blog.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'format_type' => 'string|in:markdown,rich_text,html',
            'status' => 'string|in:draft,published',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'slug' => 'nullable|string|max:255|unique:blogs,slug,' . $id,
            'allow_comments' => 'boolean',
        ]);

        $blog->title = $validated['title'];
        $blog->content = $validated['content'];
        $blog->format_type = $validated['format_type'] ?? 'markdown';
        $blog->status = $validated['status'] ?? 'draft';
        $blog->meta_title = $validated['meta_title'] ?? null;
        $blog->meta_description = $validated['meta_description'] ?? null;
        $blog->slug = $validated['slug'] ?? null;
        $blog->allow_comments = $validated['allow_comments'] ?? true;
        $blog->version = $blog->version + 1; // Increment version number

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($blog->image_path) {
                Storage::disk('public')->delete($blog->image_path);
            }

            $path = $request->file('image')->store('blogs', 'public');
            $blog->image_path = $path;
        }

        $blog->save();

        $redirectRoute = $blog->status === 'published'
            ? route('blogs.show', $blog->id)
            : route('blogs.index');

        return redirect($redirectRoute)->with('success', 'Blog ' . ($blog->status === 'published' ? 'published' : 'saved as draft') . ' successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $blog = Blog::findOrFail($id);

        // Check if the user is authorized to delete this blog
        if ($blog->user_id !== Auth::id() && !Auth::user()->isModerator()) {
            return redirect()->route('blogs.index')->with('error', 'You are not authorized to delete this blog.');
        }

        // Delete image if exists
        if ($blog->image_path) {
            Storage::disk('public')->delete($blog->image_path);
        }

        $blog->delete();

        return redirect()->route('blogs.index')->with('success', 'Blog deleted successfully.');
    }

    /**
     * Store a comment for the specified blog.
     */
    public function storeComment(Request $request, string $id)
    {
        $blog = Blog::findOrFail($id);

        if (!$blog->allow_comments) {
            return back()->with('error', 'Comments are disabled for this blog.');
        }

        $validated = $request->validate([
            'content' => 'required|string|max:1000',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        $comment = Comment::create([
            'user_id' => Auth::id(),
            'blog_id' => $blog->id,
            'content' => $validated['content'],
            'parent_id' => $validated['parent_id'] ?? null,
            'is_approved' => true, // Auto-approve for now
        ]);

        return back()->with('success', 'Comment posted successfully.');
    }

    /**
     * Toggle like for the specified blog.
     */
    public function toggleLike(string $id)
    {
        $blog = Blog::findOrFail($id);
        $userId = Auth::id();

        $like = Like::where('user_id', $userId)
                   ->where('blog_id', $blog->id)
                   ->first();

        if ($like) {
            $like->delete();
            $message = 'Like removed.';
        } else {
            Like::create([
                'user_id' => $userId,
                'blog_id' => $blog->id,
            ]);
            $message = 'Blog liked.';
        }

        return back()->with('success', $message);
    }

    /**
     * Create an excerpt from blog content.
     */
    private function createExcerpt(string $content, int $length = 150): string
    {
        // Remove markdown formatting for excerpt
        $plainText = preg_replace('/[#*_~`]/', '', $content);
        $plainText = preg_replace('/\[([^\]]+)\]\([^)]+\)/', '$1', $plainText);
        $plainText = preg_replace('/\n/', ' ', $plainText);
        $plainText = trim($plainText);

        return strlen($plainText) > $length 
            ? substr($plainText, 0, $length) . '...' 
            : $plainText;
    }
}
