<?php

namespace App\Enums;

enum ReportStatus: string
{
    case New = 'baru';
    case Processing = 'diproses';
    case Completed = 'selesai';
    case Rejected = 'ditolak';
}
