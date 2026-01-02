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
        Schema::create('capacitaciones', function (Blueprint $table) {
            $table->integer('id_capacitacion')->autoIncrement()->primary();
            $table->string('codigo', 50)->unique();
            $table->date('fecha_capacitacion');
            $table->string('tema_capacitacion', 255);
            $table->string('capacitador', 255);
            $table->integer('fk_idempleados');
            $table->text('observaciones')->nullable();
            $table->timestamps();

            // Foreign key
            $table->foreign('fk_idempleados', 'fk_capacitaciones_empleados')
                ->references('idempleados')->on('empleados')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            // Index
            $table->index('fk_idempleados', 'fk_capacitaciones_empleados_idx');
            $table->index('fecha_capacitacion', 'idx_fecha_capacitacion');
            $table->index('codigo', 'idx_codigo_capacitacion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('capacitaciones');
    }
};
