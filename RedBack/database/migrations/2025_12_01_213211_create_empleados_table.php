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
        Schema::create('empleados', function (Blueprint $table) {
            $table->integer('idempleados')->autoIncrement()->primary();
            $table->dateTime('fecha_registro_empleado');
            $table->double('sueldo');
            $table->string('cuenta_bcp', 45)->nullable();
            $table->integer('fk_idpersonas');
            $table->integer('fk_idcargos_empleados');

            // Foreign keys
            $table->foreign('fk_idpersonas', 'fk_empleados_personas1')
                ->references('idpersonas')->on('personas')
                ->onDelete('no action')
                ->onUpdate('no action');

            $table->foreign('fk_idcargos_empleados', 'fk_empleados_cargos_empleados1')
                ->references('idcargos_empleados')->on('cargos_empleados')
                ->onDelete('no action')
                ->onUpdate('no action');

            // Indexes
            $table->index('fk_idpersonas', 'fk_empleados_personas1_idx');
            $table->index('fk_idcargos_empleados', 'fk_empleados_cargos_empleados1_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('empleados');
    }
};
