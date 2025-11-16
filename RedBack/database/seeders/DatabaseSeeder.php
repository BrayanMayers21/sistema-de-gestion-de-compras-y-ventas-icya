<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            GenerosTableSeeder::class,
            PersonasTableSeeder::class,
            RolesAndPermissionsSeeder::class,
            UsuariosTableSeeder::class,
            IntalacionTableSeeder::class,

            CodigosContablesTableSeeder::class,
            ObrasTableSeeder::class,
            ObrasCodigoSeeder::class,
            CategoriasSeeder::class,
            ProductosSeeder::class,
            TipoOrdenSeeder::class,
        ]);
    }
}
