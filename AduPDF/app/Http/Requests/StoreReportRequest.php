<?php

namespace App\Http\Requests;

use App\Models\Report;
use Illuminate\Foundation\Http\FormRequest;

class StoreReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isPengguna() ?? false;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'facility_id' => ['required', 'integer', 'exists:facilities,id'],
            'kategori' => ['required', 'string', 'max:100'],
            'deskripsi' => ['required', 'string', 'max:65535'],
            'attachments' => ['required', 'array', 'min:1', 'max:'.Report::MAX_ATTACHMENTS],
            'attachments.*' => ['required', 'file', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'attachments.required' => 'Lampirkan minimal satu foto pendukung.',
            'attachments.min' => 'Lampirkan minimal satu foto pendukung.',
            'attachments.max' => 'Satu laporan dapat memiliki maksimal :max foto.',
            'attachments.*.image' => 'Setiap lampiran harus berupa gambar.',
            'attachments.*.mimes' => 'Foto harus berformat JPG, JPEG, atau PNG.',
            'attachments.*.max' => 'Ukuran setiap foto maksimal 2 MB.',
        ];
    }
}
