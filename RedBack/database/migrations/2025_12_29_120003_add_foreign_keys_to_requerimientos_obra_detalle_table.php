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
        Schema::table('requerimientos_obra_detalle', function (Blueprint $table) {
            // Foreign key a requerimientos_obra
            $table->foreign('fk_id_requerimiento_obra', 'fk_detalle_requerimiento')
                ->references('id_requerimiento_obra')
                ->on('requerimientos_obra')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            // Foreign key a productos
            $table->foreign('fk_id_producto', 'fk_detalle_producto')
                ->references('id_producto')
                ->on('productos')
                ->onDelete('restrict')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('requerimientos_obra_detalle', function (Blueprint $table) {
            $table->dropForeign('fk_detalle_requerimiento');
            $table->dropForeign('fk_detalle_producto');
        });
    }
};
