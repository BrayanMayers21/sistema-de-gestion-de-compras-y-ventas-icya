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
        Schema::create('productos', function (Blueprint $table) {
            $table->integer('id_producto', true);
            $table->dateTime('fecha_registro')->useCurrent();
            $table->string('unidad_medida', 45);
            $table->string('codigo', 50)->unique('codigo');
            $table->string('nombre', 200)->index('idx_nombre');
            $table->text('descripcion')->nullable();
            $table->integer('fk_id_categoria')->index('fk_categorias1_idx');

            $table->index(['codigo'], 'idx_codigo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};
