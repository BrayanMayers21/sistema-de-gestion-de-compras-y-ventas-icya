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
        Schema::table('requerimientos', function (Blueprint $table) {
            $table->foreign(['fk_id_proveedor'], 'fk_proveedores2')->references(['id_proveedor'])->on('proveedores')->onUpdate('no action')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('requerimientos', function (Blueprint $table) {
            $table->dropForeign('fk_proveedores2');
        });
    }
};
