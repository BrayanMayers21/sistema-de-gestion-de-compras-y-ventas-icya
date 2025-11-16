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
        Schema::create('archivos', function (Blueprint $table) {
            $table->integer('idarchivos', true);
            $table->date('fecha_archivo');
            $table->enum('tipo_archivo', ['cotizacion', 'factura', 'guia', 'reporte servicio', 'acta de contrato']);
            $table->text('ruta_archivo');
            $table->integer('fk_id_orden')->index('fk_ordenes_compra3_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('archivos');
    }
};
