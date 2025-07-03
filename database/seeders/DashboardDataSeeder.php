<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Blog;
use App\Models\Comment;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DashboardDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create some sample users if they don't exist
        $users = collect();
        
        if (User::count() < 5) {
            $users->push(User::create([
                'name' => 'Sarah Johnson',
                'email' => 'sarah@example.com',
                'password' => bcrypt('password'),
                'role' => 'student',
                'email_verified_at' => now(),
            ]));

            $users->push(User::create([
                'name' => 'Mike Chen',
                'email' => 'mike@example.com',
                'password' => bcrypt('password'),
                'role' => 'student',
                'email_verified_at' => now(),
            ]));

            $users->push(User::create([
                'name' => 'Emily Davis',
                'email' => 'emily@example.com',
                'password' => bcrypt('password'),
                'role' => 'teacher',
                'email_verified_at' => now(),
            ]));

            $users->push(User::create([
                'name' => 'John Smith',
                'email' => 'john@example.com',
                'password' => bcrypt('password'),
                'role' => 'student',
                'email_verified_at' => now(),
            ]));
        } else {
            $users = User::take(4)->get();
        }

        // Create some categories
        $categories = collect();
        $categoryData = [
            ['name' => 'Programming', 'slug' => 'programming'],
            ['name' => 'Machine Learning', 'slug' => 'machine-learning'],
            ['name' => 'Web Development', 'slug' => 'web-development'],
            ['name' => 'Data Science', 'slug' => 'data-science'],
            ['name' => 'UI/UX', 'slug' => 'ui-ux'],
        ];
        
        foreach ($categoryData as $data) {
            $category = Category::firstOrCreate(['slug' => $data['slug']], $data);
            $categories->push($category);
        }

        // Create some tags
        $tags = collect();
        $tagData = [
            ['name' => 'React', 'slug' => 'react'],
            ['name' => 'PHP', 'slug' => 'php'],
            ['name' => 'Laravel', 'slug' => 'laravel'],
            ['name' => 'JavaScript', 'slug' => 'javascript'],
            ['name' => 'Python', 'slug' => 'python'],
            ['name' => 'AI', 'slug' => 'ai'],
            ['name' => 'Tutorial', 'slug' => 'tutorial'],
            ['name' => 'Tips', 'slug' => 'tips'],
        ];
        
        foreach ($tagData as $data) {
            $tag = Tag::firstOrCreate(['slug' => $data['slug']], $data);
            $tags->push($tag);
        }

        // Create sample blog posts
        $blogPosts = [
            [
                'title' => 'Introduction to Machine Learning',
                'content' => '# Introduction to Machine Learning

Machine Learning is a subset of artificial intelligence that enables computers to learn and make decisions without being explicitly programmed. In this post, we\'ll explore the fundamentals of ML algorithms and their applications in real-world scenarios.

## Key Concepts

- **Supervised Learning**: Learning with labeled data
- **Unsupervised Learning**: Finding patterns in unlabeled data  
- **Reinforcement Learning**: Learning through interaction and rewards

## Popular Algorithms

1. Linear Regression
2. Decision Trees
3. Neural Networks
4. Support Vector Machines

Let\'s dive deeper into each of these concepts...',
                'slug' => 'introduction-to-machine-learning',
                'status' => 'published',
                'format_type' => 'markdown',
                'meta_title' => 'Introduction to Machine Learning - Learn the Basics',
                'meta_description' => 'A comprehensive introduction to machine learning concepts, algorithms, and applications.',
                'view_count' => rand(50, 200),
                'allow_comments' => true,
            ],
            [
                'title' => 'React Best Practices for 2025',
                'content' => '# React Best Practices for 2025

React continues to evolve, and staying up-to-date with best practices is crucial for building maintainable applications. Here are the key patterns and practices you should follow in 2025.

## Component Architecture

### Use Functional Components
```jsx
const MyComponent = ({ title, children }) => {
  return (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  );
};
```

### Custom Hooks for Logic Reuse
```jsx
const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  const setStoredValue = (value) => {
    setValue(value);
    localStorage.setItem(key, JSON.stringify(value));
  };

  return [value, setStoredValue];
};
```

## Performance Optimization

- Use `React.memo()` for expensive components
- Implement proper key props for lists
- Leverage `useMemo()` and `useCallback()` wisely',
                'slug' => 'react-best-practices-2025',
                'status' => 'published',
                'format_type' => 'markdown',
                'meta_title' => 'React Best Practices for 2025',
                'meta_description' => 'Learn the latest React best practices and patterns for building modern applications.',
                'view_count' => rand(30, 150),
                'allow_comments' => true,
            ],
            [
                'title' => 'Data Visualization with D3.js',
                'content' => '# Data Visualization with D3.js

Creating compelling visualizations is essential for data storytelling. D3.js provides powerful tools for building interactive and dynamic visualizations.

## Getting Started

D3.js (Data-Driven Documents) is a JavaScript library for producing dynamic, interactive data visualizations in web browsers.

### Basic Setup
```html
<script src="https://d3js.org/d3.v7.min.js"></script>
```

### Creating Your First Chart
```javascript
const data = [10, 20, 30, 40, 50];

d3.select("body")
  .selectAll("div")
  .data(data)
  .enter()
  .append("div")
  .style("height", d => d + "px")
  .style("background-color", "steelblue");
```

## Advanced Techniques

- SVG manipulation
- Transitions and animations
- Interactive elements
- Responsive designs

The power of D3.js lies in its flexibility and the ability to create custom visualizations tailored to your specific needs.',
                'slug' => 'data-visualization-d3js',
                'status' => 'published',
                'format_type' => 'markdown',
                'meta_title' => 'Master Data Visualization with D3.js',
                'meta_description' => 'Learn how to create stunning data visualizations using D3.js with practical examples.',
                'view_count' => rand(40, 180),
                'allow_comments' => true,
            ],
            [
                'title' => 'Building Scalable APIs with Laravel',
                'content' => '# Building Scalable APIs with Laravel

Laravel provides excellent tools for building robust and scalable APIs. In this tutorial, we\'ll explore best practices for API development.

## API Design Principles

### RESTful Routes
```php
Route::apiResource("posts", PostController::class);
```

### API Resources
```php
class PostResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            "id" => $this->id,
            "title" => $this->title,
            "content" => $this->content,
            "author" => new UserResource($this->user),
            "created_at" => $this->created_at,
        ];
    }
}
```

## Authentication & Authorization

- API tokens with Sanctum
- Rate limiting
- Permission-based access control

## Performance Optimization

- Eager loading relationships
- Database indexing
- Response caching
- Pagination strategies',
                'slug' => 'building-scalable-apis-laravel',
                'status' => 'published',
                'format_type' => 'markdown',
                'meta_title' => 'Building Scalable APIs with Laravel',
                'meta_description' => 'Learn how to build robust and scalable APIs using Laravel framework.',
                'view_count' => rand(60, 220),
                'allow_comments' => true,
            ],
            [
                'title' => 'Modern CSS Grid Layout Techniques',
                'content' => '# Modern CSS Grid Layout Techniques

CSS Grid has revolutionized how we approach web layouts. Let\'s explore advanced techniques for creating responsive and flexible designs.

## Grid Fundamentals

### Basic Grid Setup
```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
```

### Named Grid Lines
```css
.grid {
  grid-template-columns: [start] 1fr [content-start] 3fr [content-end] 1fr [end];
  grid-template-rows: [header] auto [main] 1fr [footer] auto;
}
```

## Advanced Patterns

### Responsive Grid Areas
```css
.layout {
  display: grid;
  grid-template-areas: 
    "header header"
    "sidebar main"
    "footer footer";
}

@media (max-width: 768px) {
  .layout {
    grid-template-areas:
      "header"
      "main"
      "sidebar"
      "footer";
  }
}
```

CSS Grid opens up possibilities for creative and functional layouts that were previously difficult to achieve.',
                'slug' => 'modern-css-grid-layout-techniques',
                'status' => 'published',
                'format_type' => 'markdown',
                'meta_title' => 'Modern CSS Grid Layout Techniques',
                'meta_description' => 'Master CSS Grid with advanced layout techniques and responsive design patterns.',
                'view_count' => rand(25, 120),
                'allow_comments' => true,
            ],
        ];

        foreach ($blogPosts as $index => $postData) {
            $user = $users->random();
            
            $blog = Blog::create(array_merge($postData, [
                'user_id' => $user->id,
                'created_at' => now()->subDays(rand(0, 7))->subHours(rand(0, 23)),
            ]));

            // Attach random categories and tags
            $blog->categories()->attach($categories->random(rand(1, 2))->pluck('id'));
            $blog->tags()->attach($tags->random(rand(2, 4))->pluck('id'));

            // Create some comments for each blog post
            $commentCount = rand(2, 6);
            for ($i = 0; $i < $commentCount; $i++) {
                $commenter = $users->random();
                Comment::create([
                    'blog_id' => $blog->id,
                    'user_id' => $commenter->id,
                    'content' => $this->generateComment(),
                    'created_at' => now()->subDays(rand(0, 5))->subHours(rand(0, 23)),
                ]);
            }
        }
    }

    private function generateComment(): string
    {
        $comments = [
            'Great article! This really helped me understand the concept better.',
            'Thanks for sharing this. The examples are very clear and practical.',
            'I\'ve been looking for something like this. Excellent explanation!',
            'This is exactly what I needed for my current project. Thank you!',
            'Very well written and informative. Looking forward to more content like this.',
            'Fantastic tutorial! The step-by-step approach makes it easy to follow.',
            'This helped me solve a problem I\'ve been struggling with. Much appreciated!',
            'Excellent work! The code examples are particularly helpful.',
            'Thank you for taking the time to write this detailed explanation.',
            'This is going straight to my bookmarks. Very useful resource!',
        ];

        return $comments[array_rand($comments)];
    }
}
