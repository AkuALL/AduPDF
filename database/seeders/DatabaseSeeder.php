<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(AdminUserSeeder::class);
        $this->call(FacilitySeeder::class);

        // Akun Demo Cepat
        $demoUsers = [
            ['nama' => 'Demo Pengguna', 'email' => 'user@com', 'password' => Hash::make('12345678'), 'role' => 'pengguna'],
            ['nama' => 'Demo Admin', 'email' => 'admin@com', 'password' => Hash::make('12345678'), 'role' => 'admin'],
            ['nama' => 'Demo Petugas', 'email' => 'petugas@com', 'password' => Hash::make('12345678'), 'role' => 'petugas'],
        ];

        foreach ($demoUsers as $user) {
            $model = User::firstOrNew(['email' => $user['email']]);
            if (! $model->exists) {
                $model->fill($user);
                $model->forceFill(['approved_at' => now()])->save();
            }
        }
    }
}
