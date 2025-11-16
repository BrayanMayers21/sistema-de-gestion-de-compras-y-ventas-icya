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
        Schema::create('proveedores', function (Blueprint $table) {
            $table->integer('id_proveedor', true);
            $table->string('ruc', 11)->nullable()->index('idx_ruc');
            $table->string('razon_social', 200)->index('idx_razon_social');
            $table->string('nombre_comercial', 200)->nullable();
            $table->text('direccion')->nullable();
            $table->string('telefono', 20)->nullable();
            $table->string('email', 100)->nullable();
            $table->string('contacto_telefono', 20)->nullable();
            $table->enum('estado', ['Activo', 'Inactivo'])->nullable()->default('Activo');
            $table->dateTime('fecha_registro')->nullable()->useCurrent();

            $table->unique(['ruc'], 'ruc');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proveedores');
    }
};
