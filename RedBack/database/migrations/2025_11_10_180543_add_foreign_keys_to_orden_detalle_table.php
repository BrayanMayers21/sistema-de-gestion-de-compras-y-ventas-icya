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
        Schema::table('orden_detalle', function (Blueprint $table) {
            $table->foreign(['fk_id_orden'], 'fk_ordenes_compra2')->references(['id_orden'])->on('ordenes_compra')->onUpdate('no action')->onDelete('no action');
            $table->foreign(['fk_id_producto'], 'fk_productos1')->references(['id_producto'])->on('productos')->onUpdate('no action')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orden_detalle', function (Blueprint $table) {
            $table->dropForeign('fk_ordenes_compra2');
            $table->dropForeign('fk_productos1');
        });
    }
};
