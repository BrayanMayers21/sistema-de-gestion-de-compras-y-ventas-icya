<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TipoOrdenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tipo_orden')->insert([
            [
                'nom_orden' => 'SERVICIO',
            ],
            [
                'nom_orden' => 'COMPRA',
            ],
            [
                'nom_orden' => 'OTRO',
            ],

        ]);
    }
}
