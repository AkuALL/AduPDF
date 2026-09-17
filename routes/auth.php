<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Authentication Routes (Owned by Galang)
|--------------------------------------------------------------------------
| Handles user registration, login, and logout.
*/

Route::middleware('guest')->group(function () {
    // GAL-02: Self Registration Pengguna (FR-17, BR-05, BR-06)
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);

    // GAL-03: Login (FR-17, BR-06, SRS 5.1, 7.1)
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

// GAL-03: Logout
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');
