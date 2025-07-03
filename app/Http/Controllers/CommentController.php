<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $request->validate([
            'blog_id' => 'required|exists:blogs,id',
        ]);

        $comments = Comment::with('user')
            ->where('blog_id', $request->blog_id)
            ->whereNull('parent_id') // Get only top-level comments
            ->orderBy('created_at', 'desc')
            ->get();

        // Load replies for each comment
        $comments->load('replies.user');

        return response()->json([
            'comments' => $comments,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'blog_id' => 'required|exists:blogs,id',
            'parent_id' => 'nullable|exists:comments,id',
            'content' => 'required|string',
        ]);

        $blog = Blog::findOrFail($validated['blog_id']);

        // Check if comments are allowed on this blog
        if (!$blog->allow_comments) {
            return redirect()->back()->with('error', 'Comments are not allowed on this blog post.');
        }

        $comment = Comment::create([
            'user_id' => Auth::id(),
            'blog_id' => $validated['blog_id'],
            'parent_id' => $validated['parent_id'] ?? null,
            'content' => $validated['content'],
            'is_approved' => true, // Auto-approve for now, could be changed based on moderation settings
        ]);

        return redirect()->back()->with('success', 'Comment added successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $comment = Comment::findOrFail($id);

        // Check if the user is authorized to update this comment
        if ($comment->user_id !== Auth::id() && !Auth::user()->isModerator()) {
            return redirect()->back()->with('error', 'You are not authorized to update this comment.');
        }

        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $comment->content = $validated['content'];
        $comment->save();

        return redirect()->back()->with('success', 'Comment updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $comment = Comment::findOrFail($id);

        // Check if the user is authorized to delete this comment
        if ($comment->user_id !== Auth::id() && !Auth::user()->isModerator()) {
            return redirect()->back()->with('error', 'You are not authorized to delete this comment.');
        }

        $comment->delete();

        return redirect()->back()->with('success', 'Comment deleted successfully.');
    }
}
