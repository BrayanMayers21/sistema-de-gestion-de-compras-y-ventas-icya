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
        Schema::create('requerimientos_obra_detalle', function (Blueprint $table) {
            $table->id('id_detalle');

            // Relaciones
            $table->unsignedBigInteger('fk_id_requerimiento_obra')->comment('Requerimiento al que pertenece');
            $table->integer('fk_id_producto')->comment('Producto solicitado');

            // Cantidad y unidad
            $table->decimal('cantidad', 10, 2)->comment('Cantidad solicitada');

            // Especificaciones técnicas del producto
            $table->string('marca', 100)->nullable()->comment('Marca del producto');
            $table->string('color', 100)->nullable()->comment('Color del producto');
            $table->string('tipo', 100)->nullable()->comment('Tipo de producto');
            $table->string('calidad', 100)->nullable()->comment('Calidad del producto');
            $table->string('medida', 100)->nullable()->comment('Medidas específicas del producto');

            // Observaciones específicas del producto
            $table->text('observaciones')->nullable()->comment('Observaciones específicas del producto (ej: Para preparación de material afirmado)');

            // Estado y cantidad entregada
            $table->enum('estado', ['pendiente', 'entregado', 'cancelado'])
                ->default('pendiente')
                ->comment('Estado del producto en el requerimiento');
            $table->decimal('cantidad_entregada', 10, 2)->nullable()->comment('Cantidad real entregada del producto');
            $table->date('fecha_entrega')->nullable()->comment('Fecha en que se entregó el producto');

            $table->timestamps();

            // Índices
            $table->index('fk_id_requerimiento_obra', 'idx_detalle_requerimiento');
            $table->index('fk_id_producto', 'idx_detalle_producto');
            $table->index('estado', 'idx_detalle_estado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requerimientos_obra_detalle');
    }
};
