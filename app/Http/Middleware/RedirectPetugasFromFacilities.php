<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectPetugasFromFacilities
{
    /**
     * Redirect Petugas away from public facility pages.
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()?->isPetugas()) {
            return redirect()->route('petugas.dashboard');
        }

        return $next($request);
    }
}
