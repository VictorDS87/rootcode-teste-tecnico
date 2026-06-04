<?php

use App\Services\QuotePricingService;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/teste-cotacao', function (QuotePricingService $service) {
    

    $viajantes = [
        [
            'nome' => 'Ana',
            'data_nascimento' => '1990-03-15',
            'adicionais' => ['BAGAGEM', 'ESPORTES_AVENTURA']
        ],
        [
            'nome' => 'João',
            'data_nascimento' => '1948-11-02',
            'adicionais' => ['ESPORTES_AVENTURA', 'BAGAGEM']
        ]
    ];

    $resultado = $service->calculate(
        [ 
            'destino' => 'EUROPA',
            'data_inicio' => '2026-07-10',
            'data_fim' => '2026-07-20',
            'viajantes' => $viajantes
        ]
    );

    return response()->json($resultado);
});