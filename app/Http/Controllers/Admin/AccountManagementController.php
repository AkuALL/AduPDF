<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class AccountManagementController extends Controller
{
    /**
     * Display Petugas and Pengguna accounts (GAL-06).
     */
    public function index(): Response
    {
        $users = User::query()
            ->whereIn('role', ['petugas', 'pengguna'])
            ->orderByDesc('created_at')
            ->paginate(15);

        return Inertia::render('admin/accounts/index', compact('users'));
    }

    /**
     * Legacy route fallback / redirect for verification queue.
     */
    public function verifications(): RedirectResponse|Response
    {
        return redirect()->route('admin.users.index');
    }

    /**
     * Show the form for creating a new Petugas account (FR-15, US-13, GAL-06).
     */
    public function createPetugas(): Response
    {
        return Inertia::render('admin/accounts/create-petugas');
    }

    /**
     * Store a newly created Petugas account in storage (FR-15, US-13, GAL-06).
     */
    public function storePetugas(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:100', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'nama.required' => 'Nama Petugas wajib diisi.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format alamat email tidak valid.',
            'email.unique' => 'Alamat email ini sudah terdaftar di sistem.',
            'password.required' => 'Kata sandi wajib diisi.',
            'password.min' => 'Kata sandi minimal harus 8 karakter.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
        ]);

        User::create([
            'nama' => $validated['nama'],
            'name' => $validated['nama'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'petugas',
            'email_verified_at' => now(),
        ]);

        return redirect()->route('admin.users.index')->with('success', 'Akun Petugas ('.$validated['nama'].') berhasil dibuat.');
    }

    /**
     * Show the form for creating a new Pengguna account directly by Admin (FR-16, US-14, GAL-06).
     */
    public function createPengguna(): Response
    {
        return Inertia::render('admin/accounts/create-pengguna');
    }

    /**
     * Store a newly created Pengguna account directly by Admin (FR-16, US-14, GAL-06).
     */
    public function storePengguna(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:100', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'nama.required' => 'Nama Pengguna wajib diisi.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format alamat email tidak valid.',
            'email.unique' => 'Alamat email ini sudah terdaftar di sistem.',
            'password.required' => 'Kata sandi wajib diisi.',
            'password.min' => 'Kata sandi minimal harus 8 karakter.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
        ]);

        User::create([
            'nama' => $validated['nama'],
            'name' => $validated['nama'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'pengguna',
            'email_verified_at' => now(),
        ]);

        return redirect()->route('admin.users.index')->with(
            'success',
            'Akun Pengguna ('.$validated['nama'].') berhasil dibuat langsung oleh Admin.'
        );
    }

    /**
     * Soft-delete an account of any role (FR-16, BR-26, GAL-06).
     * Prevents deletion of the last Admin account.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        // BR-26 & FR-16: Sistem harus mencegah penghapusan Admin terakhir
        if ($user->isAdmin() && User::where('role', 'admin')->count() <= 1) {
            return back()->with('error', 'Admin terakhir tidak dapat dihapus.');
        }

        $nama = $user->nama ?? $user->name ?? $user->email;
        $user->delete();

        return redirect()->route('admin.users.index')->with(
            'success',
            'Akun '.$nama.' berhasil dihapus (soft-delete).'
        );
    }
}
