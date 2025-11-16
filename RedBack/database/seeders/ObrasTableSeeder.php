<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ObrasTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

    public function run(): void
    {
        DB::table('obras')->insert([
            ['nom_obra' => 'MEJORAMIENTO DE CAPACIDAD DE ALMACENAMIENTO DE AGUA PAR RIEGO EN LA CC DE HUAMBO, PAMPAS CHICO - RECUAY - ANCASH', 'codigo' => 'OB-0101'],

            ['nom_obra' => 'MEJORAMIENTO DE LOS SERVICIOS DE EDUCACION PRIMARIA  PAMPAS DE FLORES',         'codigo' => 'OB-0102'],

            ['nom_obra' => 'AMPLIACIÓN DEL SERVICIO DE AGUA DEL SISTEMA DE CONDUCCIÓN DE RIEGO HUARCO CURAN EN LA LOCALIDAD DE CAJACAY', 'codigo' => 'OB-0103'],

            ['nom_obra' => 'RECUPERACIÓN DEL SERVICIO EDUCATIVO DE LA INSTITUCIÓN EDUCATIVA UNITARIA N° 32432 DEL CASERÍO DE MORCA', 'codigo' => 'OB-0104'],

            ['nom_obra' => 'MEJORAMIENTO DE LOS SERVICIOS DE EDUCACIÓN PRIMARIA DE LA I.E. N° 32392, EN EL CENTRO POBLADO DE SAN CRISTÓBAL', 'codigo' => 'OB-0105'],
        ]);
    }
}
