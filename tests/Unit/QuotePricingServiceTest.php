<?php

namespace Tests\Unit;

use App\Services\QuotePricingService;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class QuotePricingServiceTest extends TestCase
{
    
  private QuotePricingService $service;

  protected function setup(): void
  {
    parent::setup();
    $this->service = new QuotePricingService;
  }

  #[Test]
  public function minimum_billed_days_five(): void
  {
    $payload = [
      'destino' => 'NACIONAL',
      'data_inicio' => '2026-06-01',
      'data_fim' => '2026-06-01',
      'viajantes' => [
        [
          'nome' => 'Maria',
          'data_nascimento' => '1990-01-01',
          'adicionais' => []
        ],
      ]
    ];

    $result = $this->service->calculate($payload);
    
    $this->assertSame(5, $result['dias_cobrados']);
    $this->assertEquals(50.00, $result['viajantes'][0]['subtotal']);
  }

  #[Test]
  public function age_is_calculated_at_trip_start_date(): void
  {
    $payload = [
      'destino' => 'NACIONAL',
      'data_inicio' => '2026-06-01',
      'data_fim' => '2026-09-01',
      'viajantes' => [
        [
          'nome' => 'Viajante 1',
          'data_nascimento' => '1990-06-01',
          'adicionais' => []
        ],
        [
          'nome' => 'Viajante 2',
          'data_nascimento' => '1990-08-01',
          'adicionais' => []
        ],
        
        [
          'nome' => 'Viajante 3',
          'data_nascimento' => '2009-08-01',
          'adicionais' => []
        ]
      ]
    ];

    $result = $this->service->calculate($payload);

    $this->assertSame(36, $result['viajantes'][0]['idade']);

    $this->assertSame(35, $result['viajantes'][1]['idade']);

    $this->assertSame(16, $result['viajantes'][2]['idade']);
  }

  #[Test]
  public function esportes_aventura_denied_with_warning_for_ineligible_traveler(): void
  {
    $payload = [
      'destino' => 'EUROPA',
      'data_inicio' => '2026-06-10',
      'data_fim' => '2026-06-20',
      'viajantes' => [
        [
          'nome' => 'Viajante 1',
          'data_nascimento' => '1960-06-01',
          'adicionais' => ["ESPORTES_AVENTURA", "BAGAGEM"]
        ]
      ]
    ];

    $result = $this->service->calculate($payload);

    $this->assertCount(1, $result['avisos']);
    $this->assertStringContainsString('ESPORTES_AVENTURA não aplicado para Viajante 1', $result['avisos'][0]);
    $this->assertEquals(517.0, $result['viajantes'][0]['subtotal']);
    $this->assertEquals(517.0, $result['total_final']);
  }

  #[Test]
  public function group_discount_of_ten_percent_for_five_or_more_travelers(): void
  {
    $viajantes = array_fill(0, 5, [
      'nome' => 'Viajante',
      'data_nascimento' => '1990-01-01',
      'adicionais' => [],
    ]);

    $payload = [
      'destino' => 'EUROPA',
      'data_inicio' => '2026-06-10',
      'data_fim' => '2026-06-20',
      'viajantes' => $viajantes
    ];

    $result = $this->service->calculate($payload);

    $this->assertSame(10, $result['desconto_grupo_percentual']);
    $this->assertEquals(1089.0, $result['total_final']);
  }
 
  #[Test]
  public function full_scenario_with_multiple_travelers_and_addons(): void
  {
    $payload = [
      'destino' => 'EUROPA',
      'data_inicio' => '2026-07-10',
      'data_fim' => '2026-07-20',
      'viajantes' => [
        [
          'nome' => 'Ana',
          'data_nascimento' => '1990-03-15',
          'adicionais' => ['BAGAGEM', 'ESPORTES_AVENTURA'],
        ],
        [
          'nome' => 'João',
          'data_nascimento' => '1948-11-02',
          'adicionais' => ['ESPORTES_AVENTURA', 'BAGAGEM'],
        ],
      ],
    ];

    $result = $this->service->calculate($payload);

    $this->assertSame(11, $result['dias_cobrados']);
    $this->assertSame(36, $result['viajantes'][0]['idade']);
    $this->assertSame(77, $result['viajantes'][1]['idade']);
    $this->assertEquals(335.50, $result['viajantes'][0]['subtotal']);
    $this->assertEquals(517.00, $result['viajantes'][1]['subtotal']);
    $this->assertEqualsCanonicalizing(['BAGAGEM', 'ESPORTES_AVENTURA'], $result['viajantes'][0]['adicionais_aplicados']);
    $this->assertSame(['BAGAGEM'], $result['viajantes'][1]['adicionais_aplicados']);
    $this->assertCount(1, $result['avisos']);
    $this->assertSame(0, $result['desconto_grupo_percentual']);
    $this->assertEquals(852.50, $result['total_final']);
  }
}
