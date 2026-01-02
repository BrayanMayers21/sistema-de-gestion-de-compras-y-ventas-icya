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
        Schema::table('requerimientos_obra', function (Blueprint $table) {
            // Foreign key a obras
            $table->foreign('fk_idobras', 'fk_requerimiento_obra_obra')
                ->references('idobras')
                ->on('obras')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('requerimientos_obra', function (Blueprint $table) {
            $table->dropForeign('fk_requerimiento_obra_obra');
        });
    }
};
