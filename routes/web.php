<?php

use App\Services\QuotePricingService;
use Illuminate\Support\Facades\Route;

Route::view('/{any?}', 'app')->where('any', '.*');