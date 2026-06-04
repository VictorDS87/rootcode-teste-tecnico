<?php

namespace App\Http\Requests;

use App\Enums\Adicional;
use App\Enums\Destino;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreQuoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'destino' => ['required', 'string', Rule::enum(Destino::class)],
            'data_inicio' => ['required', 'date', 'date_format:Y-m-d'],
            'data_fim' => ['required', 'date', 'date_format:Y-m-d', 'after_or_equal:data_inicio'],
            'viajantes' => ['required', 'array', 'min:1'],
            'viajantes.*.nome' => ['required', 'string'],
            'viajantes.*.data_nascimento' => ['required', 'date', 'date_format:Y-m-d'],
            'viajantes.*.adicionais' => ['nullable', 'array'],
            'viajantes.*.adicionais.*' => ['string', Rule::enum(Adicional::class)],
        ];
    }
}
