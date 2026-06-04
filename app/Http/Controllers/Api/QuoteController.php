<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreQuoteRequest;
use App\Http\Resources\QuoteResource;
use App\Models\Quote;
use App\Services\QuotePricingService;
use Illuminate\Http\Resources\Json\ResourceCollection;

class QuoteController extends Controller
{
    public function __construct(
        private readonly QuotePricingService $pricingService
    ) {}

    public function index(): ResourceCollection
    {
        $quotes = Quote::query()->latest()->get();
        return QuoteResource::collection($quotes);
    }

    public function store(StoreQuoteRequest $request): QuoteResource
    {
        $payload = $request->validated();
        $quoteCalculated = $this->pricingService->calculate($payload);

        $saved = Quote::query()->create([
            'destino' => $payload['destino'],
            'data_inicio' => $payload['data_inicio'],
            'data_fim' => $payload['data_fim'],
            'dias_cobrados' => $quoteCalculated['dias_cobrados'],
            'request_payload' => $payload,
            'viajantes' => $quoteCalculated['viajantes'],
            'avisos' => $quoteCalculated['avisos'],
            'desconto_grupo_percentual' => $quoteCalculated['desconto_grupo_percentual'],
            'total_final' => $quoteCalculated['total_final'],
        ]);

        return new QuoteResource($saved);
    }
}