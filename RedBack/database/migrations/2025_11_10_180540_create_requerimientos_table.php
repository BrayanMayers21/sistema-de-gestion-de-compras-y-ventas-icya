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
        Schema::create('requerimientos', function (Blueprint $table) {
            $table->integer('idrequerimientos', true);
            $table->date('fecha_requerimiento');
            $table->string('numero_requerimiento', 45);
            $table->text('observaciones')->nullable();
            $table->integer('fk_id_proveedor')->index('fk_proveedores2_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requerimientos');
    }
};
