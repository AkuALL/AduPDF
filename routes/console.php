<?php

use App\Enums\ReservationStatus;
use App\Models\Reservation;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('reservations:expire', function () {
    $count = Reservation::query()
        ->where('status', ReservationStatus::Pending->value)
        ->where('start_time', '<=', now())
        ->update(['status' => ReservationStatus::Expired]);

    $this->info("{$count} pending reservations expired.");
})->purpose('Expire pending reservations when their start time arrives');
