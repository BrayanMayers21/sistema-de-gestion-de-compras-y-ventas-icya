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
        Schema::create('asistencias_empleados', function (Blueprint $table) {
            $table->integer('idasistencias_empleados')->autoIncrement()->primary();
            $table->date('fecha_asistio');
            $table->enum('estado', ['ASISTIO', 'FALTA', 'TARDANZA', 'JUSTIFICADO']);
            $table->text('observacion')->nullable();
            $table->integer('fk_idempleados');

            $table->index('fk_idempleados', 'fk_empleados1_idx');
            $table->foreign('fk_idempleados', 'fk_empleados1')
                ->references('idempleados')
                ->on('empleados')
                ->onDelete('no action')
                ->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asistencias_empleados');
    }
};
