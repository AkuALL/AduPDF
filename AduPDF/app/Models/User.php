<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property string|null $institutional_id
 * @property string|null $identity_type
 * @property string|null $whatsapp
 * @property Carbon|null $deleted_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['nama', 'name', 'email', 'password', 'role', 'institutional_id', 'identity_type', 'whatsapp'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable, SoftDeletes;

    protected static function booted(): void
    {
        static::saving(function (User $user) {
            if (empty($user->name) && ! empty($user->nama)) {
                $user->name = $user->nama;
            } elseif (empty($user->nama) && ! empty($user->name)) {
                $user->nama = $user->name;
            }
        });
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    public function getNameAttribute(): ?string
    {
        return $this->attributes['nama'] ?? $this->attributes['name'] ?? null;
    }

    public function setNameAttribute(?string $value): void
    {
        $this->attributes['name'] = $value;
        if (! isset($this->attributes['nama']) || empty($this->attributes['nama'])) {
            $this->attributes['nama'] = $value;
        }
    }

    public function isPengguna(): bool
    {
        return $this->role === 'pengguna';
    }

    public function isPetugas(): bool
    {
        return $this->role === 'petugas';
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function hasInstitutionalIdentity(): bool
    {
        return ! empty($this->institutional_id) && ! empty($this->identity_type);
    }

    public function isApproved(): bool
    {
        return ! $this->trashed();
    }

    public function isPending(): bool
    {
        return false;
    }

    public function isRejected(): bool
    {
        return false;
    }

    /**
     * Ownership check helper for resources.
     */
    public function owns(mixed $model, string $foreignKey = 'user_id'): bool
    {
        if (is_object($model) && isset($model->{$foreignKey})) {
            return (int) $model->{$foreignKey} === (int) $this->id;
        }

        return false;
    }

    /**
     * Get reservations made by the user (SRS 12.3).
     *
     * @return HasMany<Reservation, $this>
     */
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    /**
     * Get damage reports made by the user (SRS 12.3).
     *
     * @return HasMany<Report, $this>
     */
    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }
}
