<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('auth/login');
    }

    /**
     * Handle an incoming authentication request (FR-17, BR-06, SRS 5.1, 7.1).
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ], [
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format alamat email tidak valid.',
            'password.required' => 'Kata sandi wajib diisi.',
        ]);

        $user = User::where('email', strtolower($request->email))->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => 'Email atau kata sandi yang Anda masukkan salah.',
            ]);
        }

        // Verification check for Pengguna role per SRS 5.1 & 7.1
        if ($user->isPengguna()) {
            if ($user->isPending()) {
                throw ValidationException::withMessages([
                    'email' => 'Akun Anda sedang menunggu verifikasi dari Admin sebelum dapat login.',
                ]);
            }

            if ($user->isRejected()) {
                throw ValidationException::withMessages([
                    'email' => 'Pendaftaran akun Anda telah ditolak oleh Admin. Akun tidak dapat digunakan.',
                ]);
            }
        }

        Auth::login($user, $request->boolean('remember'));

        $request->session()->regenerate();

        // Redirect based on role
        if ($user->isAdmin()) {
            return redirect()->intended(route('admin.verifications.index'));
        }

        if ($user->isPetugas()) {
            return redirect()->intended(url('/petugas/dashboard'));
        }

        return redirect()->intended(url('/facilities'));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
