<?php

namespace App\Models;

use Database\Factories\ReportAttachmentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use LogicException;

/**
 * @property int $id
 * @property int $report_id
 * @property string $file_path
 * @property string $original_name
 * @property string $mime_type
 * @property int $file_size
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['report_id', 'file_path', 'original_name', 'mime_type', 'file_size'])]
class ReportAttachment extends Model
{
    /** @use HasFactory<ReportAttachmentFactory> */
    use HasFactory;

    protected static function booted(): void
    {
        static::creating(function (ReportAttachment $attachment): void {
            if ($attachment->report()->firstOrFail()->hasReachedAttachmentLimit()) {
                throw new LogicException('Satu laporan hanya dapat memiliki maksimal 8 lampiran.');
            }
        });
    }

    /**
     * Get the report this attachment supports.
     *
     * @return BelongsTo<Report, $this>
     */
    public function report(): BelongsTo
    {
        return $this->belongsTo(Report::class);
    }
}
