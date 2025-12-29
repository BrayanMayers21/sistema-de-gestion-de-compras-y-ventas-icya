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
        Schema::create('detalle_cotizacion_antamina', function (Blueprint $table) {
            $table->integer('iddetalle_cotizacion_antamina')->autoIncrement()->primary();
            $table->double('cantidad');
            $table->double('precio_unitario');
            $table->double('sub_total');
            $table->string('marca', 255);
            $table->integer('fk_idcotizaciones_antamina');
            $table->integer('fk_id_producto');

            $table->index('fk_idcotizaciones_antamina', 'fk_cotizaciones_antamina1_idx');
            $table->index('fk_id_producto', 'fk_productos4_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalle_cotizacion_antamina');
    }
};
