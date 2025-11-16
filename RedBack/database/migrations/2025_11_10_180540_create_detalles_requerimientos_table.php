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
        Schema::create('detalles_requerimientos', function (Blueprint $table) {
            $table->integer('iddetalles_requerimientos', true);
            $table->date('fecha_detalle');
            $table->integer('cantidad');
            $table->text('observaciones')->nullable();
            $table->integer('fk_idrequerimientos')->index('fk_requerimientos1_idx');
            $table->integer('fk_id_producto')->index('fk_productos3_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalles_requerimientos');
    }
};
