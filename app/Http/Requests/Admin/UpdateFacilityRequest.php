<?php

namespace App\Http\Requests\Admin;

use App\Enums\FacilityCondition;
use App\Enums\FacilityType;
use App\Models\Facility;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateFacilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::enum(FacilityType::class)],
            'location' => ['required', 'string', 'max:255'],
            'capacity' => ['required', 'integer', 'min:0'],
            'description' => ['nullable', 'string', 'max:5000'],
            'condition' => ['required', Rule::enum(FacilityCondition::class)],
            'parent_facility_id' => ['nullable', 'integer', 'exists:facilities,id'],
        ];
    }

    /**
     * @return array<int, callable(Validator): void>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                /** @var Facility $facility */
                $facility = $this->route('facility');
                $newType = FacilityType::tryFrom($this->string('type')->toString());
                $parentId = $this->input('parent_facility_id');

                if ($facility->childTools()->exists() && ! $newType->canContainTools()) {
                    $validator->errors()->add('type', 'Tipe fasilitas tidak dapat diubah karena masih memiliki peralatan yang terdaftar di ruangan ini.');

                    return;
                }

                if ($newType === FacilityType::Equipment) {
                    if (empty($parentId)) {
                        $validator->errors()->add('parent_facility_id', 'Fasilitas bertipe alat wajib memiliki ruangan induk.');

                        return;
                    }

                    if ((int) $parentId === (int) $facility->id) {
                        $validator->errors()->add('parent_facility_id', 'Fasilitas tidak dapat menjadi ruangan induk bagi dirinya sendiri.');

                        return;
                    }

                    $parent = Facility::find($parentId);
                    if (! $parent || ! $parent->isRoom()) {
                        $validator->errors()->add('parent_facility_id', 'Ruangan induk alat harus bertipe ruang kelas, aula, atau laboratorium.');
                    }
                } else {
                    if (! empty($parentId)) {
                        $validator->errors()->add('parent_facility_id', 'Hanya fasilitas bertipe alat yang dapat memiliki ruangan induk.');
                    }
                }
            },
        ];
    }
}
