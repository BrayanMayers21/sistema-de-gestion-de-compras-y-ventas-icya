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
        Schema::create('capacitaciones_asistentes', function (Blueprint $table) {
            $table->integer('id_asistente')->autoIncrement()->primary();
            $table->integer('fk_id_capacitacion');
            $table->integer('fk_idempleados');
            $table->string('area', 100)->nullable();
            $table->boolean('asistio')->default(true);
            $table->text('observaciones_asistente')->nullable();
            $table->timestamps();

            // Foreign keys
            $table->foreign('fk_id_capacitacion', 'fk_asistentes_capacitacion')
                ->references('id_capacitacion')->on('capacitaciones')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->foreign('fk_idempleados', 'fk_asistentes_empleados')
                ->references('idempleados')->on('empleados')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            // Indexes
            $table->index('fk_id_capacitacion', 'idx_asistentes_capacitacion');
            $table->index('fk_idempleados', 'idx_asistentes_empleados');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('capacitaciones_asistentes');
    }
};
