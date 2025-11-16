<?php

namespace Database\Seeders;

use App\Models\Usuario;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Log;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $personasPermissions = [
            'personas.view',
            'personas.create',
            'personas.update',
            'personas.delete',
        ];
        // 5. GESTIÓN DE USUARIOS
        $usuariosPermissions = [
            'usuarios.view',
            'usuarios.create',
            'usuarios.update',
            'usuarios.delete',
            'usuarios.activate',
            'usuarios.deactivate',
        ];

        $categoriasPermissions = [
            'categorias.view',
            'categorias.create',
            'categorias.update',
            'categorias.delete',
            'categorias.reporte',
        ];

        $productosPermissions = [
            'productos.view',
            'productos.create',
            'productos.update',
            'productos.delete',
            'productos.reporte',
        ];








        // 14. CONFIGURACIÓN DEL SISTEMA
        $configuracionPermissions = [
            'config.view',
            'config.update',
            'config.generos',
            'config.profesiones',
            'config.actividades',
            'config.estados_civiles',
            'config.grados_instruccion',
            'config.departamentos',
            'config.provincias',
            'config.distritos',
            'config.direcciones',
            'config.tipos_reunion',
            'config.metodos_pago',
            'config.conceptos_pago',
            'config.frecuencias_pago',
            'config.cargos',
            'config.tipos_familiares',
            'config.conceptos_cambio',
        ];




        // ===============================
        // CREAR TODOS LOS PERMISOS
        // ===============================
        $allPermissions = array_merge(
            $personasPermissions,
            $usuariosPermissions,
            $categoriasPermissions,
            $productosPermissions,
            $configuracionPermissions,
        );

        foreach ($allPermissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // ===============================
        // CREAR ROLES Y ASIGNAR PERMISOS
        // ===============================

        // 1. SUPERADMIN - Acceso total
        $superAdmin = Role::create(['name' => 'superadmin']);
        $superAdmin->givePermissionTo($allPermissions);

        // 2. PRESIDENTE - Acceso completo excepto configuración crítica del sistema
        $presidente = Role::create(['name' => 'presidente']);
        $presidentePermissions = array_merge(
            $personasPermissions,
            $categoriasPermissions,
            $productosPermissions,

            [
                'usuarios.view',
                'usuarios.create',
                'usuarios.update',
                'config.view',
                'config.generos',
                'config.profesiones',
                'config.actividades',
                'config.estados_civiles',
                'config.grados_instruccion',
                'config.direcciones',
                'config.tipos_reunion',
                'config.metodos_pago',
                'config.conceptos_pago',
                'config.frecuencias_pago',
                'config.cargos',
                'config.tipos_familiares',
                'config.conceptos_cambio',
            ]
        );
        $presidente->givePermissionTo($presidentePermissions);

        // 3. TESORERO - Enfoque en finanzas y pagos
        $tesorero = Role::create(['name' => 'tesorero']);
        $tesoreroPermissions = array_merge(
            [
                'categorias.view',
                'personas.view',

            ],

            [
                'config.view',
                'config.metodos_pago',
                'config.conceptos_pago',
                'config.frecuencias_pago',
            ]
        );
        $tesorero->givePermissionTo($tesoreroPermissions);

        // 4. SECRETARIO - Enfoque en documentos, actas y reuniones
        $secretario = Role::create(['name' => 'secretario']);
        $secretarioPermissions = array_merge(
            [
                'personas.view',
            ],


            [
                'config.view',
                'config.tipos_reunion',
            ]
        );
        $secretario->givePermissionTo($secretarioPermissions);

        // 5. VOCAL - Solo visualización de información general
        $vocal = Role::create(['name' => 'vocal']);
        $vocalPermissions = [
            'personas.view',
            'config.view',
        ];
        $vocal->givePermissionTo($vocalPermissions);

        // 6. ADMINISTRADOR - Gestión técnica del sistema
        $administrador = Role::create(['name' => 'administrador']);
        $administradorPermissions = array_merge(
            $usuariosPermissions,
            $configuracionPermissions,
            [
                'personas.view',
            ]
        );
        $administrador->givePermissionTo($administradorPermissions);

        // 7. OPERADOR - Personal operativo para registro diario
        $operador = Role::create(['name' => 'operador']);
        $operadorPermissions = [
            'personas.view',
            'personas.create',
            'personas.update',
            'categorias.view',
            'config.view',
        ];
        $operador->givePermissionTo($operadorPermissions);

        // 8. CONTADOR - Rol especializado en finanzas y contabilidad
        $contador = Role::create(['name' => 'contador']);
        $contadorPermissions = array_merge(
            [

                'personas.view',

            ],

            [
                'categorias.view',
                'config.view',
            ]
        );
        $contador->givePermissionTo($contadorPermissions);
    }
}
