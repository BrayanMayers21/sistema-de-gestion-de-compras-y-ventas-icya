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
        Schema::create('recepcion_detalle', function (Blueprint $table) {
            $table->integer('id_detalle', true);
            $table->integer('id_recepcion')->index('idx_recepcion');
            $table->decimal('cantidad_ordenada', 10);
            $table->decimal('cantidad_recibida', 10);
            $table->text('observaciones')->nullable();
            $table->dateTime('fecha_registro')->nullable()->useCurrent();
            $table->integer('fk_id_producto')->index('fk_productos2_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recepcion_detalle');
    }
};
