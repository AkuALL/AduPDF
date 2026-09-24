<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectAdminAndPetugasFromFacilities
{
    /**
     * Redirect Admin and Petugas to their dashboards from facility pages.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user?->isAdmin() || $user?->isPetugas()) {
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}
