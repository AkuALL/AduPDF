<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        if (! empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        if (! empty($validated['nama']) && empty($validated['name'])) {
            $validated['name'] = $validated['nama'];
        } elseif (! empty($validated['name']) && empty($validated['nama'])) {
            $validated['nama'] = $validated['name'];
        }

        $user = $request->user();
        $user->fill($validated);
        $user->save();

        $message = 'Profil berhasil diperbarui.';

        Inertia::flash('toast', ['type' => 'success', 'message' => $message]);

        return to_route('profile.edit')->with('status', 'profile-updated')->with('success', $message);
    }
}
