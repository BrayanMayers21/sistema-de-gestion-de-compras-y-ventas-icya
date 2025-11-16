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
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010101', 'nombre_contable' => 'Mano de obra', 'descripcion' => 'Operarios, oficiales, peones, operadores, técnicos de campo.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010102', 'nombre_contable' => 'Agregados', 'descripcion' => 'Arena, grava, piedra chancada, afirmado, hormigón.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010103', 'nombre_contable' => 'Materiales de ferretería', 'descripcion' => 'Cemento, acero, clavos, varillas, anclajes, pintura, selladores, pegamentos, cables, etc.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010104', 'nombre_contable' => 'Encofrado y madera', 'descripcion' => 'Madera tornillo, triplay, planchas, contrazócalos, reglas, molduras.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010105', 'nombre_contable' => 'Herramientas, equipos y maquinarias', 'descripcion' => 'Equipos topográficos, máquinas de soldar, grupo electrógeno, UPS, retroexcavadora, camión volquete, andamios.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010106', 'nombre_contable' => 'Tuberías y accesorios', 'descripcion' => 'PVC, HDPE, accesorios, uniones, tees, válvulas.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010107', 'nombre_contable' => 'Elementos metálicos', 'descripcion' => 'Tubos, mallas, canaletas, ángulos, etc.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010108', 'nombre_contable' => 'Cerramientos y accesos', 'descripcion' => 'Puertas, ventanas, compuertas, rejillas, cerraduras, bisagras.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010109', 'nombre_contable' => 'Vidrio y cristales', 'descripcion' => 'Vidrios templados, fibraforte, UPVC, láminas traslúcidas.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010110', 'nombre_contable' => 'Seguridad y salud ocupacional', 'descripcion' => 'Extintores, señalización, EPP, botiquines, barandas de seguridad.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010111', 'nombre_contable' => 'Transporte y disposición', 'descripcion' => 'Transporte de residuos, traslado de materiales, camiones, cisternas.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010112', 'nombre_contable' => 'Prefabricados', 'descripcion' => 'Ladrillos, drywall, bloques de concreto, techos prefabricados, fibrocemento.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010113', 'nombre_contable' => 'Equipamiento', 'descripcion' => 'Mesas, sillas, cámaras de seguridad, servidores, routers, gabinetes.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010114', 'nombre_contable' => 'Subcontratos', 'descripcion' => 'Pintado de fachada, soldado de puertas, concreto premezclado, etc.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010115', 'nombre_contable' => 'Gastos Generales', 'descripcion' => 'Planillas administrativas, garantías, seguros, control de calidad, oficina técnica.'],

            // --- 0102xx ---
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010201', 'nombre_contable' => 'Mano de obra', 'descripcion' => 'Operarios, oficiales, peones, operadores, técnicos de campo.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010202', 'nombre_contable' => 'Agregados', 'descripcion' => 'Arena, grava, piedra chancada, afirmado, hormigón.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010203', 'nombre_contable' => 'Materiales de ferretería', 'descripcion' => 'Cemento, acero, clavos, varillas, anclajes, pintura, selladores, pegamentos, cables, etc.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010204', 'nombre_contable' => 'Encofrado y madera', 'descripcion' => 'Madera tornillo, triplay, planchas, contrazócalos, reglas, molduras.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010205', 'nombre_contable' => 'Herramientas, equipos y maquinarias', 'descripcion' => 'Equipos topográficos, máquinas de soldar, grupo electrógeno, UPS, retroexcavadora, camión volquete, andamios.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010206', 'nombre_contable' => 'Tuberías y accesorios', 'descripcion' => 'PVC, HDPE, accesorios, uniones, tees, válvulas.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010207', 'nombre_contable' => 'Elementos metálicos', 'descripcion' => 'Tubos, mallas, canaletas, ángulos, etc.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010208', 'nombre_contable' => 'Cerramientos y accesos', 'descripcion' => 'Puertas, ventanas, compuertas, rejillas, cerraduras, bisagras.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010209', 'nombre_contable' => 'Vidrio y cristales', 'descripcion' => 'Vidrios templados, fibraforte, UPVC, láminas traslúcidas.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010210', 'nombre_contable' => 'Seguridad y salud ocupacional', 'descripcion' => 'Extintores, señalización, EPP, botiquines, barandas de seguridad.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010211', 'nombre_contable' => 'Transporte y disposición', 'descripcion' => 'Transporte de residuos, traslado de materiales, camiones, cisternas.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010212', 'nombre_contable' => 'Prefabricados', 'descripcion' => 'Ladrillos, drywall, bloques de concreto, techos prefabricados.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010213', 'nombre_contable' => 'Equipamiento', 'descripcion' => 'Mesas, sillas, cámaras de seguridad, servidores, routers, gabinetes.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010214', 'nombre_contable' => 'Subcontratos', 'descripcion' => 'Pintado de fachada, soldado de puertas, concreto premezclado, etc.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010215', 'nombre_contable' => 'Gastos Generales', 'descripcion' => 'Planillas administrativas, garantías, seguros, control de calidad, oficina técnica.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010216', 'nombre_contable' => 'Certificaciones, autorizaciones', 'descripcion' => 'Trámites en entidades CIRA, IGA, ANA, etc.'],

            // --- 0103xx ---
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010301', 'nombre_contable' => 'Mano de obra', 'descripcion' => 'Operarios, oficiales, peones, operadores, técnicos de campo.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010302', 'nombre_contable' => 'Agregados', 'descripcion' => 'Arena, grava, piedra chancada, afirmado, hormigón.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010303', 'nombre_contable' => 'Materiales de ferretería', 'descripcion' => 'Cemento, acero, clavos, varillas, anclajes, pintura, selladores, pegamentos, cables, etc.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010304', 'nombre_contable' => 'Encofrado y madera', 'descripcion' => 'Madera tornillo, triplay, planchas, contrazócalos, reglas, molduras.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010305', 'nombre_contable' => 'Herramientas, equipos y maquinarias', 'descripcion' => 'Equipos topográficos, máquinas de soldar, grupo electrógeno, UPS, retroexcavadora, camión volquete, andamios.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010306', 'nombre_contable' => 'Tuberías y accesorios', 'descripcion' => 'PVC, HDPE, accesorios, uniones, tees, válvulas.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010307', 'nombre_contable' => 'Elementos metálicos', 'descripcion' => 'Tubos, mallas, canaletas, ángulos, etc.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010308', 'nombre_contable' => 'Cerramientos y accesos', 'descripcion' => 'Puertas, ventanas, compuertas, rejillas, cerraduras, bisagras.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010309', 'nombre_contable' => 'Vidrio y cristales', 'descripcion' => 'Vidrios templados, fibraforte, UPVC, láminas traslúcidas.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010310', 'nombre_contable' => 'Seguridad y salud ocupacional', 'descripcion' => 'Extintores, señalización, EPP, botiquines, barandas de seguridad.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010311', 'nombre_contable' => 'Transporte y disposición', 'descripcion' => 'Transporte de residuos, traslado de materiales, camiones, cisternas.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010312', 'nombre_contable' => 'Prefabricados', 'descripcion' => 'Ladrillos, drywall, bloques de concreto, techos prefabricados.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010313', 'nombre_contable' => 'Equipamiento', 'descripcion' => 'Mesas, sillas, cámaras de seguridad, servidores, routers, gabinetes.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010314', 'nombre_contable' => 'Subcontratos', 'descripcion' => 'Pintado de fachada, soldado de puertas, concreto premezclado, etc.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010315', 'nombre_contable' => 'Gastos Generales', 'descripcion' => 'Planillas administrativas, garantías, seguros, control de calidad, oficina técnica.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010316', 'nombre_contable' => 'Certificaciones, autorizaciones', 'descripcion' => 'Trámites en entidades CIRA, IGA, ANA, etc.'],

            // --- 0104xx ---
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010401', 'nombre_contable' => 'Mano de obra', 'descripcion' => 'Operarios, oficiales, peones, operadores, técnicos de campo.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010402', 'nombre_contable' => 'Agregados', 'descripcion' => 'Arena, grava, piedra chancada, afirmado, hormigón.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010403', 'nombre_contable' => 'Materiales de ferretería', 'descripcion' => 'Cemento, acero, clavos, varillas, anclajes, pintura, selladores, pegamentos, cables, etc.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010404', 'nombre_contable' => 'Encofrado y madera', 'descripcion' => 'Madera tornillo, triplay, planchas, contrazócalos, reglas, molduras.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010405', 'nombre_contable' => 'Herramientas, equipos y maquinarias', 'descripcion' => 'Equipos topográficos, máquinas de soldar, grupo electrógeno, UPS, retroexcavadora, camión volquete, andamios.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010406', 'nombre_contable' => 'Tuberías y accesorios', 'descripcion' => 'PVC, HDPE, accesorios, uniones, tees, válvulas.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010407', 'nombre_contable' => 'Elementos metálicos', 'descripcion' => 'Tubos, mallas, canaletas, ángulos, etc.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010408', 'nombre_contable' => 'Cerramientos y accesos', 'descripcion' => 'Puertas, ventanas, compuertas, rejillas, cerraduras, bisagras.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010409', 'nombre_contable' => 'Vidrio y cristales', 'descripcion' => 'Vidrios templados, fibraforte, UPVC, láminas traslúcidas.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010410', 'nombre_contable' => 'Seguridad y salud ocupacional', 'descripcion' => 'Extintores, señalización, EPP, botiquines, barandas de seguridad.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010411', 'nombre_contable' => 'Transporte y disposición', 'descripcion' => 'Transporte de residuos, traslado de materiales, camiones, cisternas.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010412', 'nombre_contable' => 'Prefabricados', 'descripcion' => 'Ladrillos, drywall, bloques de concreto, techos prefabricados.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010413', 'nombre_contable' => 'Equipamiento', 'descripcion' => 'Mesas, sillas, cámaras de seguridad, servidores, routers, gabinetes.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010414', 'nombre_contable' => 'Subcontratos', 'descripcion' => 'Pintado de fachada, soldado de puertas, concreto premezclado, etc.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010415', 'nombre_contable' => 'Gastos Generales', 'descripcion' => 'Planillas administrativas, garantías, seguros, control de calidad, oficina técnica.'],

            // --- 0105xx ---
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010501', 'nombre_contable' => 'Mano de obra', 'descripcion' => 'Operarios, oficiales, peones, operadores, técnicos de campo.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010502', 'nombre_contable' => 'Agregados', 'descripcion' => 'Arena, grava, piedra chancada, afirmado, hormigón.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010503', 'nombre_contable' => 'Materiales de ferretería', 'descripcion' => 'Cemento, acero, clavos, varillas, anclajes, pintura, selladores, pegamentos, cables, etc.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010504', 'nombre_contable' => 'Encofrado y madera', 'descripcion' => 'Madera tornillo, triplay, planchas, contrazócalos, reglas, molduras.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010505', 'nombre_contable' => 'Herramientas, equipos y maquinarias', 'descripcion' => 'Equipos topográficos, máquinas de soldar, grupo electrógeno, UPS, retroexcavadora, camión volquete, andamios.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010506', 'nombre_contable' => 'Tuberías y accesorios', 'descripcion' => 'PVC, HDPE, accesorios, uniones, tees, válvulas.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010507', 'nombre_contable' => 'Elementos metálicos', 'descripcion' => 'Tubos, mallas, canaletas, ángulos, etc.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010508', 'nombre_contable' => 'Cerramientos y accesos', 'descripcion' => 'Puertas, ventanas, compuertas, rejillas, cerraduras, bisagras.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010509', 'nombre_contable' => 'Vidrio y cristales', 'descripcion' => 'Vidrios templados, fibraforte, UPVC, láminas traslúcidas.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010510', 'nombre_contable' => 'Seguridad y salud ocupacional', 'descripcion' => 'Extintores, señalización, EPP, botiquines, barandas de seguridad.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010511', 'nombre_contable' => 'Transporte y disposición', 'descripcion' => 'Transporte de residuos, traslado de materiales, camiones, cisternas.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010512', 'nombre_contable' => 'Prefabricados', 'descripcion' => 'Ladrillos, drywall, bloques de concreto, techos prefabricados.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010513', 'nombre_contable' => 'Equipamiento', 'descripcion' => 'Mesas, sillas, cámaras de seguridad, servidores, routers, gabinetes.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010514', 'nombre_contable' => 'Subcontratos', 'descripcion' => 'Pintado de fachada, soldado de puertas, concreto premezclado, etc.'],
            ['fecha_registro_contable' => $today, 'codigo_contable' => '010515', 'nombre_contable' => 'Gastos Generales', 'descripcion' => 'Planillas administrativas, garantías, seguros, control de calidad, oficina técnica.'],
        ];

        // Si tu DB_DATABASE es "gestion_compras", usa la tabla simple:
        DB::table('codigos_contables')->upsert(
            $rows,
            ['codigo_contable'],
            ['nombre_contable', 'descripcion', 'fecha_registro_contable']
        );
    }
}
