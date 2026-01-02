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
        Schema::table('capacitaciones', function (Blueprint $table) {
            // Datos del empleador
            $table->string('razon_social', 255)->nullable()->after('codigo');
            $table->string('ruc', 11)->nullable()->after('razon_social');
            $table->text('domicilio')->nullable()->after('ruc');
            $table->string('actividad_economica', 255)->nullable()->after('domicilio');
            $table->integer('num_trabajadores')->nullable()->after('actividad_economica');

            // Tipo de actividad
            $table->enum('tipo_actividad', ['induccion', 'capacitacion', 'entrenamiento', 'charla', 'simulacro', 'otros'])->default('capacitacion')->after('num_trabajadores');

            // Número de horas y lugar
            $table->decimal('num_horas', 5, 2)->nullable()->after('capacitador');
            $table->string('lugar_capacitacion', 255)->nullable()->after('num_horas');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('capacitaciones', function (Blueprint $table) {
            $table->dropColumn([
                'razon_social',
                'ruc',
                'domicilio',
                'actividad_economica',
                'num_trabajadores',
                'tipo_actividad',
                'num_horas',
                'lugar_capacitacion'
            ]);
        });
    }
};
