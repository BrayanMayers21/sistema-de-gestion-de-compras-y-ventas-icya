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
        Schema::table('detalle_cotizacion_antamina', function (Blueprint $table) {
            $table->foreign('fk_idcotizaciones_antamina', 'fk_cotizaciones_antamina1')
                ->references('idcotizaciones_antamina')
                ->on('cotizaciones_antamina')
                ->onDelete('no action')
                ->onUpdate('no action');

            $table->foreign('fk_id_producto', 'fk_productos4')
                ->references('id_producto')
                ->on('productos')
                ->onDelete('no action')
                ->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('detalle_cotizacion_antamina', function (Blueprint $table) {
            $table->dropForeign('fk_cotizaciones_antamina1');
            $table->dropForeign('fk_productos4');
        });
    }
};
