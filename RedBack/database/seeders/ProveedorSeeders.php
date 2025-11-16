<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProveedorSeeders extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('proveedores')->insert([
            [
                'ruc' => '12345678901',
                'razon_social' => 'Proveedor Ejemplo S.A.C.',
                'nombre_comercial' => 'Proveedor Ejemplo',
                'direccion' => 'Av. Ejemplo 123',
                'telefono' => '912358645',
                'email' => 'ejemplo@correo.com',
                'estado' => 'Activo'

            ],
            [
                'nom_genero' => 'Femenino',

            ],
            [
                'nom_genero' => 'No binario',

            ],
            [
                'nom_genero' => 'Otro',

            ]
        ]);
    }
}
