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
        Schema::table('detalles_requerimientos', function (Blueprint $table) {
            $table->foreign(['fk_id_producto'], 'fk_productos3')->references(['id_producto'])->on('productos')->onUpdate('no action')->onDelete('no action');
            $table->foreign(['fk_idrequerimientos'], 'fk_requerimientos1')->references(['idrequerimientos'])->on('requerimientos')->onUpdate('no action')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('detalles_requerimientos', function (Blueprint $table) {
            $table->dropForeign('fk_productos3');
            $table->dropForeign('fk_requerimientos1');
        });
    }
};
