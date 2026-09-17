<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        // Support comma-separated roles e.g. 'admin,petugas'
        $allowedRoles = [];
        foreach ($roles as $roleArg) {
            foreach (explode(',', $roleArg) as $r) {
                $allowedRoles[] = trim($r);
            }
        }

        if (! in_array($user->role, $allowedRoles, true)) {
            abort(403, 'Akses tidak diizinkan. Peran Anda ('.$user->role.') tidak memiliki akses ke halaman ini.');
        }

        return $next($request);
    }
}
