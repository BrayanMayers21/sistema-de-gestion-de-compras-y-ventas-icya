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
        Schema::create('codigos_contables', function (Blueprint $table) {
            $table->integer('idcodigos_contables', true);
            $table->date('fecha_registro_contable');
            $table->string('codigo_contable', 55);
            $table->string('nombre_contable', 55);
            $table->string('descripcion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('codigos_contables');
    }
};
