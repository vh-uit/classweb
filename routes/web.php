<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    Route::resource('blogs', \App\Http\Controllers\BlogController::class);
    
    // Blog comment and like routes
    Route::post('blogs/{blog}/comments', [\App\Http\Controllers\BlogController::class, 'storeComment'])->name('blogs.comments.store');
    Route::post('blogs/{blog}/like', [\App\Http\Controllers\BlogController::class, 'toggleLike'])->name('blogs.like');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
