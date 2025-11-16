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
        $today = Carbon::today()->toDateString();

        // Mapea obra_id => prefijo de codigo_contable
        $map = [
            1 => '0101',
            2 => '0102',
            3 => '0103',
            4 => '0104',
            5 => '0105',
        ];

        DB::transaction(function () use ($map, $today) {
            foreach ($map as $obraId => $prefijo) {
                // Verifica que exista la obra
                $obraExists = DB::table('obras')->where('idobras', $obraId)->exists();
                if (!$obraExists) {
                    // Si falta la obra, salta este grupo (o lanza excepción si prefieres)
                    continue;
                }

                // IDs de codigos_contables que coinciden con el prefijo (exactamente 6 dígitos: 0101__)
                $contableIds = DB::table('codigos_contables')
                    ->where('codigo_contable', 'like', $prefijo . '__')
                    ->pluck('idcodigos_contables')
                    ->all();

                if (empty($contableIds)) {
                    continue;
                }

                // Evita duplicados sin necesidad de índice único:
                $yaVinculados = DB::table('obras_codigos')
                    ->where('fk_idobras', $obraId)
                    ->whereIn('fk_idcodigos_contables', $contableIds)
                    ->pluck('fk_idcodigos_contables')
                    ->all();

                $faltantes = array_values(array_diff($contableIds, $yaVinculados));

                if (!empty($faltantes)) {
                    $rows = array_map(fn($cid) => [
                        'fecha_registro' => $today,
                        'fk_idcodigos_contables' => $cid,
                        'fk_idobras' => $obraId,
                    ], $faltantes);

                    DB::table('obras_codigos')->insert($rows);
                }
            }
        });
    }
}
