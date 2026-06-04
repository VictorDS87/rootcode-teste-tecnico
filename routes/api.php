<?php

use App\Http\Controllers\Api\QuoteController;
use Illuminate\Support\Facades\Route;

Route::get('/quotes', [QuoteController::class, 'index']);
Route::post('/quotes', [QuoteController::class, 'store']);