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
        Schema::create('obras_codigos', function (Blueprint $table) {
            $table->integer('idobras_codigos', true);
            $table->date('fecha_registro');
            $table->integer('fk_idcodigos_contables')->index('fk_codigos_contables2_idx');
            $table->integer('fk_idobras')->index('fk_obras1_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('obras_codigos');
    }
};
