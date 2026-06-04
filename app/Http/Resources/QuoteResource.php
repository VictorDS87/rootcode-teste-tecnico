<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuoteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'destino' => $this->destino,
            'data_inicio' => $this->data_inicio->format('Y-m-d'),
            'data_fim' => $this->data_fim->format('Y-m-d'),
            'dias_cobrados' => $this->dias_cobrados,
            'viajantes' => $this->viajantes,
            'avisos' => $this->avisos,
            'desconto_grupo_percentual' => $this->desconto_grupo_percentual,
            'total_final' => (float) $this->total_final,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}