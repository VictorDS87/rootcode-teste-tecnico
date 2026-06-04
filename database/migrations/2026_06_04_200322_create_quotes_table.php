<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quotes', function (Blueprint $table) {
            $table->id();
            $table->string('destino');
            $table->date('data_inicio');
            $table->date('data_fim');
            $table->unsignedSmallInteger('dias_cobrados');
            $table->json('request_payload');
            $table->json('viajantes');
            $table->json('avisos');
            $table->unsignedTinyInteger('desconto_grupo_percentual');
            $table->decimal('total_final', 12, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quotes');
    }
};
