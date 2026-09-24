<?php

namespace App\Providers;

use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureGates();
    }

    /**
     * Configure RBAC and Ownership Gates for the application.
     */
    protected function configureGates(): void
    {
        Gate::define('admin', fn (User $user) => $user->isAdmin());
        Gate::define('petugas', fn (User $user) => $user->isPetugas());
        Gate::define('pengguna', fn (User $user) => $user->isPengguna());
        Gate::define('manage-accounts', fn (User $user) => $user->isAdmin());
        Gate::define('has-institutional-identity', fn (User $user) => $user->hasInstitutionalIdentity());
        Gate::define('owns', fn (User $user, mixed $model, string $foreignKey = 'user_id') => $user->owns($model, $foreignKey));
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
