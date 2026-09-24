<?php

use App\Http\Controllers\Admin\AccountManagementController;
use App\Http\Controllers\Admin\PasswordController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Account Management Routes (Owned by Galang)
|--------------------------------------------------------------------------
| Handles user creation (Petugas/Pengguna), soft-delete, and Admin password per SRS V2.
*/

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/users', [AccountManagementController::class, 'index'])->name('users.index');

    // GAL-06: Create Petugas (FR-15, US-13)
    Route::get('/users/petugas/create', [AccountManagementController::class, 'createPetugas'])->name('users.petugas.create');
    Route::post('/users/petugas', [AccountManagementController::class, 'storePetugas'])->name('users.petugas.store');

    // GAL-06: Create Pengguna directly by Admin (FR-16, US-14)
    Route::get('/users/pengguna/create', [AccountManagementController::class, 'createPengguna'])->name('users.pengguna.create');
    Route::post('/users/pengguna', [AccountManagementController::class, 'storePengguna'])->name('users.pengguna.store');

    // GAL-06: Soft-delete account of any role (FR-16, BR-26, SRS 12.5)
    Route::patch('/users/{user}/deactivate', [AccountManagementController::class, 'destroy'])->name('users.deactivate');
    Route::delete('/users/{user}', [AccountManagementController::class, 'destroy'])->name('users.destroy');

    // GAL-07: Admin Change Password (BR-18)
    Route::get('/change-password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('/change-password', [PasswordController::class, 'update'])->name('password.update');

    // Legacy fallback route for verifications
    Route::get('/verifications', [AccountManagementController::class, 'verifications'])->name('verifications.index');
});
