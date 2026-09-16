<?php

namespace App\Models;

use App\Enums\FacilityCondition;
use App\Enums\FacilityType;
use Database\Factories\FacilityFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use LogicException;

/**
 * @property int $id
 * @property string $name
 * @property FacilityType $type
 * @property string $location
 * @property int $capacity
 * @property string|null $description
 * @property FacilityCondition $condition
 * @property int|null $parent_facility_id
 */
#[Fillable(['name', 'type', 'location', 'capacity', 'description', 'condition', 'parent_facility_id'])]
class Facility extends Model
{
    /** @use HasFactory<FacilityFactory> */
    use HasFactory;

    protected static function booted(): void
    {
        static::saving(function (Facility $facility): void {
            $facility->ensureValidHierarchy();
        });
    }

    /**
     * Get the room that contains this tool.
     *
     * @return BelongsTo<Facility, $this>
     */
    public function parentFacility(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_facility_id');
    }

    /**
     * Get the tools contained in this room.
     *
     * @return HasMany<Facility, $this>
     */
    public function childTools(): HasMany
    {
        return $this->hasMany(self::class, 'parent_facility_id');
    }

    public function isRoom(): bool
    {
        return $this->type->canContainTools();
    }

    public function isTool(): bool
    {
        return $this->type === FacilityType::Equipment;
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => FacilityType::class,
            'condition' => FacilityCondition::class,
        ];
    }

    private function ensureValidHierarchy(): void
    {
        if ($this->isTool() && $this->parent_facility_id === null) {
            throw new LogicException('Fasilitas bertipe alat wajib memiliki ruangan induk.');
        }

        if (! $this->isTool() && $this->parent_facility_id !== null) {
            throw new LogicException('Hanya fasilitas bertipe alat yang dapat memiliki ruangan induk.');
        }

        if ($this->parent_facility_id !== null && ! $this->parentFacility()->firstOrFail()->isRoom()) {
            throw new LogicException('Ruangan induk alat harus bertipe ruang kelas, aula, atau laboratorium.');
        }

        if ($this->exists && $this->type === FacilityType::Field && $this->childTools()->exists()) {
            throw new LogicException('Lapangan tidak dapat memiliki alat.');
        }
    }
}
