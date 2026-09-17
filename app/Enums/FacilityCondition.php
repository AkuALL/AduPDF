<?php

namespace App\Enums;

enum FacilityCondition: string
{
    case Active = 'aktif';
    case UnderRepair = 'dalam_perbaikan';
    case Inactive = 'nonaktif';
}
