<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    protected $fillable = [
        'destino',
        'data_inicio',
        'data_fim',
        'dias_cobrados',
        'request_payload',
        'viajantes',
        'avisos',
        'desconto_grupo_percentual',
        'total_final',
    ];

    protected function casts(): array
    {
        return [
            'data_inicio' => 'date',
            'data_fim' => 'date',
            'request_payload' => 'array',
            'viajantes' => 'array',
            'avisos' => 'array',
            'total_final' => 'decimal:2',
        ];
    }
}
