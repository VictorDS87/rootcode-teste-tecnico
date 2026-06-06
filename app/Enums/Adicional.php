<?php 

namespace App\Enums;

enum Adicional: string
{
    case BAGAGEM = 'BAGAGEM';
    case ESPORTES_AVENTURA = 'ESPORTES_AVENTURA';
    case PET = 'PET';

    public function calcularAcrescimo(float $subtotalAtual, int $diasCobrados): float
    {
      return match($this) {
        self::ESPORTES_AVENTURA => $subtotalAtual * 0.25,
        self::BAGAGEM => 3.00 * $diasCobrados,
        self::PET => 80.00
      };
    }
}