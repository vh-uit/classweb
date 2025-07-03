<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('blogs', function (Blueprint $table) {
            // Post format type
            $table->string('format_type')->default('standard'); // standard, tutorial, announcement, event

            // Status for drafts & publishing
            $table->string('status')->default('published'); // published, draft

            // SEO metadata
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('slug')->unique()->nullable();

            // View count for analytics
            $table->unsignedInteger('view_count')->default(0);

            // Version tracking
            $table->unsignedInteger('version')->default(1);

            // Featured/pinned status
            $table->boolean('is_featured')->default(false);

            // Allow comments
            $table->boolean('allow_comments')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('blogs', function (Blueprint $table) {
            $table->dropColumn([
                'format_type',
                'status',
                'meta_title',
                'meta_description',
                'slug',
                'view_count',
                'version',
                'is_featured',
                'allow_comments',
            ]);
        });
    }
};
