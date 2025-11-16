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
        Schema::create('recepciones', function (Blueprint $table) {
            $table->integer('id_recepcion', true);
            $table->string('numero_recepcion', 50)->unique('numero_recepcion');
            $table->date('fecha_recepcion')->index('idx_fecha');
            $table->string('responsable_recepcion', 150)->nullable();
            $table->string('guia_remision', 50)->nullable();
            $table->text('observaciones')->nullable();
            $table->enum('estado', ['Completa', 'Parcial', 'Con Observaciones'])->nullable()->default('Completa');
            $table->string('usuario_registro', 100)->nullable();
            $table->dateTime('fecha_registro')->nullable()->useCurrent();
            $table->integer('fk_id_orden')->index('fk_ordenes_compra1_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recepciones');
    }
};
