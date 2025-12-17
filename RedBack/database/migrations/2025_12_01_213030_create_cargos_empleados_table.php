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
        Schema::create('cargos_empleados', function (Blueprint $table) {
            $table->integer('idcargos_empleados')->autoIncrement()->primary();
            $table->string('nom_cargo_empleado', 55);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cargos_empleados');
    }
};
