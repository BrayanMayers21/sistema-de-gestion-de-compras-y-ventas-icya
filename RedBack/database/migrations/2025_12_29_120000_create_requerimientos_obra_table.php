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
        Schema::create('requerimientos_obra', function (Blueprint $table) {
            $table->id('id_requerimiento_obra');

            // Relación con obra
            $table->integer('fk_idobras')->comment('Obra que solicita');

            // Datos básicos del requerimiento
            $table->string('numero_requerimiento', 50)->unique()->comment('N° de ICA o N° de requerimiento');
            $table->date('fecha_requerimiento')->comment('Fecha de requerimiento');
            $table->date('fecha_atencion')->nullable()->comment('Fecha de atención programada');
            $table->string('lugar_entrega')->nullable()->comment('Lugar de entrega (ej: PAMPAS DE FLORES)');
            $table->string('residente_obra', 200)->comment('Nombre del residente de obra');
            $table->text('justificacion')->nullable()->comment('Justificación del requerimiento');

            // Estado del requerimiento
            $table->enum('estado', ['pendiente', 'aprobado', 'en_proceso', 'atendido', 'cancelado'])
                ->default('pendiente')
                ->comment('Estado del requerimiento');

            $table->timestamps();

            // Índices
            $table->index('fk_idobras', 'idx_requerimiento_obra');
            $table->index('numero_requerimiento', 'idx_numero_requerimiento');
            $table->index('fecha_requerimiento', 'idx_fecha_requerimiento');
            $table->index('estado', 'idx_estado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requerimientos_obra');
    }
};
