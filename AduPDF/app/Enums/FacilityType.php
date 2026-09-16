<?php

namespace App\Enums;

enum FacilityType: string
{
    case Classroom = 'ruang_kelas';
    case Hall = 'aula';
    case Laboratory = 'laboratorium';
    case Equipment = 'alat';
    case Field = 'lapangan';

    public function canContainTools(): bool
    {
        return match ($this) {
            self::Classroom, self::Hall, self::Laboratory => true,
            self::Equipment, self::Field => false,
        };
    }
}
