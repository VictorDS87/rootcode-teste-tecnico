<?php

use App\Services\QuotePricingService;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});