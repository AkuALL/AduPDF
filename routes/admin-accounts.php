<?php

use App\Http\Controllers\Admin\AccountManagementController;
use App\Http\Controllers\Admin\PasswordController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Account Management Routes (Owned by Galang)
|--------------------------------------------------------------------------
| Handles user creation, account deactivation/reactivation, and Admin password per SRS.
*/

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/users', [AccountManagementController::class, 'index'])->name('users.index');

    // GAL-06: Create Petugas (FR-15, US-13)
    Route::get('/users/petugas/create', [AccountManagementController::class, 'createPetugas'])->name('users.petugas.create');
    Route::post('/users/petugas', [AccountManagementController::class, 'storePetugas'])->name('users.petugas.store');

    // GAL-06: Create Pengguna directly by Admin (FR-16, US-14)
    Route::get('/users/pengguna/create', [AccountManagementController::class, 'createPengguna'])->name('users.pengguna.create');
    Route::post('/users/pengguna', [AccountManagementController::class, 'storePengguna'])->name('users.pengguna.store');

    Route::patch('/users/{user}/approve', [AccountManagementController::class, 'approve'])->name('users.approve');

    // GAL-06: Account lifecycle (FR-16, BR-26, SRS 12.5)
    Route::patch('/users/{user}/deactivate', [AccountManagementController::class, 'deactivate'])->name('users.deactivate');
    Route::patch('/users/{user}/activate', [AccountManagementController::class, 'activate'])->name('users.activate');

    // GAL-07: Admin Change Password (BR-18)
    Route::get('/change-password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('/change-password', [PasswordController::class, 'update'])->name('password.update');

    // Legacy fallback route for verifications
    Route::get('/verifications', [AccountManagementController::class, 'verifications'])->name('verifications.index');
});
