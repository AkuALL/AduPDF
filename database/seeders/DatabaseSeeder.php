<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

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
            ['nama' => 'Demo Pengguna', 'email' => 'user@com', 'password' => \Illuminate\Support\Facades\Hash::make('12345678'), 'role' => 'pengguna'],
            ['nama' => 'Demo Admin', 'email' => 'admin@com', 'password' => \Illuminate\Support\Facades\Hash::make('12345678'), 'role' => 'admin'],
            ['nama' => 'Demo Petugas', 'email' => 'petugas@com', 'password' => \Illuminate\Support\Facades\Hash::make('12345678'), 'role' => 'petugas'],
        ];

        foreach ($demoUsers as $user) {
            $model = \App\Models\User::firstOrNew(['email' => $user['email']]);
            if (!$model->exists) {
                $model->fill($user);
                $model->forceFill(['approved_at' => now()])->save();
            }
        }
    }
}
