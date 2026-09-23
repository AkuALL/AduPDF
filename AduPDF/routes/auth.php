<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Authentication Routes (Owned by Galang)
|--------------------------------------------------------------------------
| Handles user registration, login, logout, and profile management (GAL-02, GAL-03, GAL-05).
*/

Route::middleware('guest')->group(function () {
    // GAL-02: Self Registration Pengguna (FR-17, BR-05, BR-06)
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);

    // GAL-03: Login (FR-17, BR-06, SRS 5.1, 7.1)
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    // GAL-03: Logout
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::get('/confirm-password', fn () => redirect()->route('login'))->name('password.confirm');

    // GAL-05: Profile & Institutional Identity (FR-17, SRS 12.5)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile');
    Route::patch('/profile', [ProfileController::class, 'update']);
    Route::delete('/profile', [ProfileController::class, 'destroy']);
    Route::get('/settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

if (file_exists(__DIR__.'/settings.php')) {
    require __DIR__.'/settings.php';
}
