<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Blog extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'content',
        'image_path',
        'format_type',
        'status',
        'meta_title',
        'meta_description',
        'slug',
        'view_count',
        'version',
        'is_featured',
        'allow_comments',
    ];

    /**
     * Get the user that owns the blog.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the categories for the blog.
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'blog_category');
    }

    /**
     * Get the tags for the blog.
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'blog_tag');
    }

    /**
     * Get the comments for the blog.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Get the likes for the blog.
     */
    public function likes(): HasMany
    {
        return $this->hasMany(Like::class);
    }
}
