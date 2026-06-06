<?php

namespace App\Services;

use App\Enums\Destino;
use App\Enums\Adicional;
use Carbon\Carbon;

class QuotePricingService
{
  private const MIN_DIAS = 5;
  private const DESCONTO_GRUPO_MIN_VIAJANTES = 8;
  private const DESCONTO_GRUPO_PERCENTUAL = 0.15;    

  public function calculate(array $data): array
  {
    $dataInicio = Carbon::parse($data['data_inicio']);
    $dataFim = Carbon::parse($data['data_fim']);
    $destino = Destino::from($data['destino']);
    $dias = $dataInicio->diffInDays($dataFim) + 1;
    
    $diasCobrados = (int) max(
      self::MIN_DIAS,
      $dias
    );

    $tarifa = $destino->tarifaDiaria() * $diasCobrados;

    $viajantesResult = [];
    $avisos = [];
    $totalGrupo = 0.0;

    foreach ($data['viajantes'] as $viajante) {
      $result = $this->calculateTraveler(
        $viajante,
        $dataInicio,
        $diasCobrados,
        $tarifa,
        $avisos,
        $destino
      );

      $viajantesResult[] = $result['traveler'];
      $totalGrupo += $result['subtotal_raw'];
    }
    
    $temDescontoGrupo = count($data['viajantes']) >= self::DESCONTO_GRUPO_MIN_VIAJANTES;

    $descontoPercentual = $temDescontoGrupo
      ? (int) (self::DESCONTO_GRUPO_PERCENTUAL * 100)
      : 0;

    $totalFinal = round(
      $totalGrupo * (1 - ($descontoPercentual / 100)),
      2,
      PHP_ROUND_HALF_UP
    );

    return [
      'dias_cobrados' => $diasCobrados,
      'viajantes' => $viajantesResult,
      'avisos' => $avisos,
      'desconto_grupo_percentual' => $descontoPercentual,
      'total_final' => $totalFinal
    ];
  }

  private function calculateTraveler(
    array $viajante,
    Carbon $dataInicio,
    int $diasCobrados,
    float $tarifa,
    array &$avisos,
    Destino $destino
  ): array {
    $idade = (int) Carbon::parse($viajante['data_nascimento'])->diffInYears($dataInicio);
    $multiplicador = $this->getAgeMultiplier($idade);

    $subtotal = $tarifa * $multiplicador;

    $adicionaisSolicitados = $viajante['adicionais'] ?? [];

    $resultAdicionais = $this->applyAdicionais(
      $adicionaisSolicitados, 
      $idade, 
      $subtotal, 
      $diasCobrados, 
      $viajante['nome'], 
      $destino
    );

    $subtotal = $resultAdicionais['subtotal'];
    $avisos = array_merge($avisos, $resultAdicionais['avisos']);

    return [
      'subtotal_raw' => $subtotal,
      'traveler' => [
        'nome' => $viajante['nome'],
        'idade' => $idade,
        'subtotal' =>round($subtotal, 2, PHP_ROUND_HALF_UP),
        'adicionais_aplicados' => $resultAdicionais['aplicados']
      ],
    ];
  }

  private function applyAdicionais(
    array $solicitados,
    int $idade,
    float $subtotal,
    int $diasCobrados,
    string $nomeViajante,
    Destino $destino
  ): array {
    $aplicados = [];
    $avisosLocal = [];

    $temEsportes = in_array(Adicional::ESPORTES_AVENTURA->value, $solicitados, true);
    $temBagagem = in_array(Adicional::BAGAGEM->value, $solicitados, true);
    $temPet = in_array(Adicional::PET->value, $solicitados, true);

    if ($temEsportes) {
      if ($idade >= 18 && $idade <= 64) {
        $subtotal += Adicional::ESPORTES_AVENTURA->calcularAcrescimo($subtotal, $diasCobrados);
        $aplicados[] = Adicional::ESPORTES_AVENTURA->value;
      } else {
        $avisosLocal[] = "ESPORTES_AVENTURA não aplicado para {$nomeViajante}: fora da faixa etária permitida (18-64).";
      }
    }

    if ($temPet) {
      if ($destino === Destino::NACIONAL) {
        $subtotal += Adicional::PET->calcularAcrescimo($subtotal, $diasCobrados);
        $aplicados[] = Adicional::PET->value;
      } else {
        $avisosLocal[] = "PET não aplicado para {$nomeViajante}: adicional disponível apenas para destino NACIONAL.";
      }
    }

    if ($temBagagem) {
      $subtotal += Adicional::BAGAGEM->calcularAcrescimo($subtotal, $diasCobrados);
      $aplicados[] = Adicional::BAGAGEM->value;
    }

    return [
      'subtotal' => $subtotal,
      'aplicados' => $aplicados,
      'avisos' => $avisosLocal
    ];
  }

  private function getAgeMultiplier (int $idade): float
  {
    if ($idade <= 17) {
      return 0.5;
    }

    if ($idade <= 64) {
      return 1.0;
    }

    return 2.0;
  }
}