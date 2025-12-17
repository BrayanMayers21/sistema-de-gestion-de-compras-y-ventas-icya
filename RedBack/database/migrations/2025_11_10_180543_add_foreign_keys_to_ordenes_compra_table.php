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
        Schema::table('ordenes_compra', function (Blueprint $table) {
            $table->foreign(['fk_idobras'], 'fk_ordenes_compra_obras')->references(['idobras'])->on('obras')->onUpdate('no action')->onDelete('no action');
            $table->foreign(['fk_id_proveedor'], 'fk_proveedores1')->references(['id_proveedor'])->on('proveedores')->onUpdate('no action')->onDelete('no action');
            $table->foreign(['fk_idtipo_orden'], 'fk_tipo_orden1')->references(['idtipo_orden'])->on('tipo_orden')->onUpdate('no action')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ordenes_compra', function (Blueprint $table) {
            $table->dropForeign('fk_ordenes_compra_obras');
            $table->dropForeign('fk_proveedores1');
            $table->dropForeign('fk_tipo_orden1');
        });
    }
};
