<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cotizaciones_antamina', function (Blueprint $table) {
            $table->integer('idcotizaciones_antamina')->autoIncrement()->primary();
            $table->date('fecha_cot');
            $table->string('numero_cot', 45);
            $table->string('cliente', 255);
            $table->text('descripcion')->nullable();
            $table->double('costo_total');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cotizaciones_antamina');
    }
};
