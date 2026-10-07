<?php

namespace App\Enums;

enum ReservationStatus: string
{
    case Pending = 'menunggu';
    case Approved = 'disetujui';
    case Rejected = 'ditolak';
    case Cancelled = 'dibatalkan';
}
