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
        Schema::table('obras_codigos', function (Blueprint $table) {
            $table->foreign(['fk_idcodigos_contables'], 'fk_codigos_contables2')->references(['idcodigos_contables'])->on('codigos_contables')->onUpdate('no action')->onDelete('no action');
            $table->foreign(['fk_idobras'], 'fk_obras1')->references(['idobras'])->on('obras')->onUpdate('no action')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('obras_codigos', function (Blueprint $table) {
            $table->dropForeign('fk_codigos_contables2');
            $table->dropForeign('fk_obras1');
        });
    }
};
