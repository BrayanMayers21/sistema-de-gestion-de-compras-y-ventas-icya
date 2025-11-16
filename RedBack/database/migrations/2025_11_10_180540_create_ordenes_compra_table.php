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
        Schema::create('ordenes_compra', function (Blueprint $table) {
            $table->integer('id_orden', true);
            $table->string('numero_orden', 50)->index('idx_numero_orden');
            $table->date('fecha_emision')->index('idx_fecha_emision');
            $table->date('fecha_entrega')->nullable();
            $table->text('lugar_entrega')->nullable();
            $table->enum('estado', ['factura', 'reporte', 'servicio'])->index('idx_estado');
            $table->decimal('subtotal', 12)->default(0);
            $table->decimal('igv', 12)->default(0);
            $table->decimal('adelanto', 12)->default(0);
            $table->decimal('total', 12)->default(0);
            $table->text('observaciones')->nullable();
            $table->integer('fk_idcodigos_contables')->index('fk_codigos_contables1_idx');
            $table->integer('fk_idtipo_orden')->index('fk_tipo_orden1_idx');
            $table->integer('fk_id_proveedor')->index('fk_proveedores1_idx');

            $table->unique(['numero_orden'], 'numero_orden');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ordenes_compra');
    }
};
