<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Provision the single initial Admin account as required by BR-18 & GAL-01.
     */
    public function run(): void
    {
        // Ensure only one Admin exists
        if (! User::where('role', 'admin')->exists()) {
            User::create([
                'nama' => 'Administrator AduPDF',
                'name' => 'Administrator AduPDF',
                'email' => 'admin@adupdf.ac.id',
                'password' => Hash::make('Admin123!'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]);
        }
    }
}
