<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CodigosContablesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //obra 1
        $today = Carbon::today()->toDateString();

        $rows = [
            // --- 0101xx ---
            ['fecha_registro_contable' => $today, 'codigo_contable' => '01', 'nombre_contable' => 'Mano de obra', 'descripcion' => 'Operarios, oficiales, peones, operadores, técnicos de campo.'],

            ['fecha_registro_contable' => $today, 'codigo_contable' => '02', 'nombre_contable' => 'Agregados', 'descripcion' => 'Arena, grava, piedra chancada, afirmado, hormigón.'],

            ['fecha_registro_contable' => $today, 'codigo_contable' => '03', 'nombre_contable' => 'Materiales de ferretería', 'descripcion' => 'Cemento, acero, clavos, varillas, anclajes, pintura, selladores, pegamentos, cables, etc.'],

            ['fecha_registro_contable' => $today, 'codigo_contable' => '04', 'nombre_contable' => 'Encofrado y madera', 'descripcion' => 'Madera tornillo, triplay, planchas, contrazócalos, reglas, molduras.'],

            ['fecha_registro_contable' => $today, 'codigo_contable' => '05', 'nombre_contable' => 'Herramientas, equipos y maquinarias', 'descripcion' => 'Equipos topográficos, máquinas de soldar, grupo electrógeno, UPS, retroexcavadora, camión volquete, andamios.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '06', 'nombre_contable' => 'Tuberías y accesorios', 'descripcion' => 'PVC, HDPE, accesorios, uniones, tees, válvulas.'],

            ['fecha_registro_contable' => $today, 'codigo_contable' => '07', 'nombre_contable' => 'Elementos metálicos', 'descripcion' => 'Tubos, mallas, canaletas, ángulos, etc.'],

            ['fecha_registro_contable' => $today, 'codigo_contable' => '08', 'nombre_contable' => 'Cerramientos y accesos', 'descripcion' => 'Puertas, ventanas, compuertas, rejillas, cerraduras, bisagras.'],

            ['fecha_registro_contable' => $today, 'codigo_contable' => '09', 'nombre_contable' => 'Vidrio y cristales', 'descripcion' => 'Vidrios templados, fibraforte, UPVC, láminas traslúcidas.'],

            ['fecha_registro_contable' => $today, 'codigo_contable' => '10', 'nombre_contable' => 'Seguridad y salud ocupacional', 'descripcion' => 'Extintores, señalización, EPP, botiquines, barandas de seguridad.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '11', 'nombre_contable' => 'Transporte y disposición', 'descripcion' => 'Transporte de residuos, traslado de materiales, camiones, cisternas.'],

            ['fecha_registro_contable' => $today, 'codigo_contable' => '12', 'nombre_contable' => 'Prefabricados', 'descripcion' => 'Ladrillos, drywall, bloques de concreto, techos prefabricados, fibrocemento.'],

            ['fecha_registro_contable' => $today, 'codigo_contable' => '13', 'nombre_contable' => 'Equipamiento', 'descripcion' => 'Mesas, sillas, cámaras de seguridad, servidores, routers, gabinetes.'],

            ['fecha_registro_contable' => $today, 'codigo_contable' => '14', 'nombre_contable' => 'Subcontratos', 'descripcion' => 'Pintado de fachada, soldado de puertas, concreto premezclado, etc.'],

            ['fecha_registro_contable' => $today, 'codigo_contable' => '15', 'nombre_contable' => 'Gastos Generales', 'descripcion' => 'Planillas administrativas, garantías, seguros, control de calidad, oficina técnica.'],
        ];

        // Si tu DB_DATABASE es "gestion_compras", usa la tabla simple:
        DB::table('codigos_contables')->upsert(
            $rows,
            ['codigo_contable'],
            ['nombre_contable', 'descripcion', 'fecha_registro_contable']
        );
    }
}
