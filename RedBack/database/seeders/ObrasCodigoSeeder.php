<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ObrasCodigoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Definimos los IDs de las Obras (1 al 5 según tus datos)
        $obrasIds = [1, 2, 3, 4, 5];

        // Definimos los IDs de los Códigos Contables (1 al 15 según tus datos)
        $codigosIds = range(1, 15); // Esto crea un array [1, 2, ..., 15]

        $data = [];

        // Fecha fija según tus datos (o puedes usar Carbon::now() para la fecha actual)
        $fechaRegistro = '2025-11-22';

        // Creamos la combinación de TODAS las obras con TODOS los códigos
        foreach ($obrasIds as $idObra) {
            foreach ($codigosIds as $idCodigo) {
                $data[] = [
                    'fecha_registro'         => $fechaRegistro,
                    'fk_idcodigos_contables' => $idCodigo,
                    'fk_idobras'             => $idObra,
                    // Si tienes timestamps (created_at/updated_at) descomenta la línea de abajo:
                    // 'created_at' => Carbon::now(), 'updated_at' => Carbon::now(),
                ];
            }
        }

        // Insertamos los datos en lotes (batch insert) para mayor velocidad
        DB::table('obras_codigos')->insert($data);
    }
}
