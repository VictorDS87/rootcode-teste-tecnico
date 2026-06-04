<?php 

namespace App\Enums;

enum Destino: string
{
  case NACIONAL = 'NACIONAL';
  case AMERICAS = "AMERICAS";
  case EUROPA = "EUROPA";

  public function tarifaDiaria(): float
  {
    return match($this) {
      self::NACIONAL => 10.00,
      self::AMERICAS => 16.00,
      self::EUROPA => 22.00,
    };
  }

}