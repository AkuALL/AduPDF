<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureHasInstitutionalIdentity
{
    /**
     * Handle an incoming request to verify that the user has an institutional identity (NIM/NIP/No. Pegawai).
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->isPengguna() && ! $user->hasInstitutionalIdentity()) {
            return redirect()->route('profile.edit')->with(
                'warning',
                'Silakan lengkapi identitas institusional (NIM, NIP, atau No. Pegawai) pada profil Anda terlebih dahulu sebelum melakukan reservasi.'
            );
        }

        return $next($request);
    }
}
