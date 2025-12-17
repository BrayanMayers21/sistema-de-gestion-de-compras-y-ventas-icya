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
        Schema::create('descuentos_asistencias', function (Blueprint $table) {
            $table->integer('iddescuentos_asistencias')->autoIncrement()->primary();
            $table->tinyInteger('mes');
            $table->year('anio');
            $table->integer('dias_trabajados');
            $table->integer('dias_faltados');
            $table->integer('dias_justificados');
            $table->integer('dias_laborables');
            $table->decimal('sueldo_base', 10, 2);
            $table->decimal('monto_descuento', 10, 2);
            $table->decimal('sueldo_final', 10, 2);
            $table->date('fecha_calculo');
            $table->string('observaciones', 45)->nullable();
            $table->integer('fk_idempleados');

            $table->index('fk_idempleados', 'fk_empleados2_idx');
            $table->foreign('fk_idempleados', 'fk_empleados2')
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
        Schema::dropIfExists('descuentos_asistencias');
    }
};
