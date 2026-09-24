<?php

namespace App\Http\Controllers;

use App\Models\ReportAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportAttachmentController extends Controller
{
    public function __invoke(Request $request, ReportAttachment $attachment): StreamedResponse
    {
        $user = $request->user();
        $isOwner = $user?->isPengguna()
            && (int) $attachment->report->user_id === (int) $user->id;

        abort_unless($isOwner || $user?->isPetugas(), 403);

        $disk = Storage::disk('local');
        abort_unless($disk->exists($attachment->file_path), 404);

        return $disk->response(
            $attachment->file_path,
            $attachment->original_name,
            ['Content-Type' => $attachment->mime_type],
        );
    }
}
