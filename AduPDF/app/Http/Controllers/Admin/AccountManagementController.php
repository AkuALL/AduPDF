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
     * Display the verification queue and account management list (FR-17, US-15).
     */
    public function verifications(Request $request): Response
    {
        $status = $request->query('status', 'pending');

        $query = User::where('role', 'pengguna');

        if (in_array($status, ['pending', 'approved', 'rejected'], true)) {
            $query->where('verification_status', $status);
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(15)->withQueryString();

        $counts = [
            'pending' => User::where('role', 'pengguna')->where('verification_status', 'pending')->count(),
            'approved' => User::where('role', 'pengguna')->where('verification_status', 'approved')->count(),
            'rejected' => User::where('role', 'pengguna')->where('verification_status', 'rejected')->count(),
        ];

        return Inertia::render('admin/accounts/verifications', compact('users', 'status', 'counts'));
    }

    /**
     * Approve a pending Pengguna account (FR-17, US-15).
     */
    public function verify(Request $request, User $user): RedirectResponse
    {
        if (! $user->isPengguna()) {
            return back()->with('error', 'Hanya akun Pengguna yang dapat diverifikasi.');
        }

        // SRS 7.1: Cegah state transition tidak valid jika sudah approved/rejected
        if (! $user->isPending()) {
            return back()->with('error', 'Hanya akun berstatus "Menunggu Verifikasi" yang dapat disetujui.');
        }

        $user->update([
            'verification_status' => 'approved',
        ]);

        return back()->with('success', 'Akun Pengguna ('.$user->nama.') berhasil disetujui. Pengguna kini dapat login.');
    }

    /**
     * Reject a pending Pengguna account (FR-17, US-15).
     */
    public function reject(Request $request, User $user): RedirectResponse
    {
        if (! $user->isPengguna()) {
            return back()->with('error', 'Hanya akun Pengguna yang dapat ditolak.');
        }

        // SRS 7.1: Cegah state transition tidak valid jika sudah approved/rejected
        if (! $user->isPending()) {
            return back()->with('error', 'Hanya akun berstatus "Menunggu Verifikasi" yang dapat ditolak.');
        }

        $user->update([
            'verification_status' => 'rejected',
        ]);

        return back()->with('success', 'Pendaftaran akun Pengguna ('.$user->nama.') telah ditolak.');
    }

    /**
     * Show the form for creating a new Petugas account (FR-15, US-13).
     */
    public function createPetugas(): Response
    {
        return Inertia::render('admin/accounts/create-petugas');
    }

    /**
     * Store a newly created Petugas account in storage (FR-15, US-13).
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
            'verification_status' => 'approved',
            'email_verified_at' => now(),
        ]);

        return redirect()->route('admin.verifications.index')->with('success', 'Akun Petugas ('.$validated['nama'].') berhasil dibuat.');
    }

    /**
     * Show the form for creating a new Pengguna account directly by Admin (FR-16, US-14).
     */
    public function createPengguna(): Response
    {
        return Inertia::render('admin/accounts/create-pengguna');
    }

    /**
     * Store a newly created Pengguna account directly by Admin (FR-16, US-14).
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
            'verification_status' => 'approved',
            'email_verified_at' => now(),
        ]);

        return redirect()->route('admin.verifications.index', ['status' => 'approved'])->with(
            'success',
            'Akun Pengguna ('.$validated['nama'].') berhasil dibuat langsung oleh Admin dengan status terverifikasi.'
        );
    }
}
