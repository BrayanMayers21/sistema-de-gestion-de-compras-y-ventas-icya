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
        Schema::create('orden_detalle', function (Blueprint $table) {
            $table->integer('id_detalle', true);
            $table->dateTime('fecha_registro')->useCurrent();
            $table->decimal('cantidad', 10);
            $table->decimal('precio_unitario', 10);
            $table->decimal('subtotal', 12);
            $table->integer('fk_id_orden')->index('fk_ordenes_compra2_idx');
            $table->integer('fk_id_producto')->index('fk_productos1_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orden_detalle');
    }
};
