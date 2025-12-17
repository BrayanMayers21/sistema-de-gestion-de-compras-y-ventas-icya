<?php

namespace App\Http\Controllers\Empleados;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EmpleadosController extends Controller
{
    //lista de empleados
    public function listaEmpleados(Request $request)
    {
        try {
            // 1. Validación de entradas
            $validated = $request->validate([
                'Limite_inferior' => 'required|integer|min:0',
                'Limite_Superior' => 'required|integer|min:1',
                'Buscar'          => 'nullable|string|max:255',
            ], [
                'Limite_inferior.required' => 'El límite inferior es obligatorio.',
                'Limite_Superior.required' => 'El límite superior es obligatorio.',
                'Limite_inferior.integer'  => 'El límite inferior debe ser un número entero.',
                'Limite_Superior.integer'  => 'El límite superior debe ser un número entero.',
            ]);

            // 2. Construcción de la consulta base
            $q = DB::table('empleados as e')
                ->join('personas as p', 'p.idpersonas', '=', 'e.fk_idpersonas')
                ->join('generos as g', 'g.idgeneros', '=', 'p.fk_idgeneros')
                // Nota: Completé este join asumiendo que la FK es 'fk_idcargos_empleados' en la tabla 'e'
                ->join('cargos_empleados as ce', 'ce.idcargos_empleados', '=', 'e.fk_idcargos_empleados')
                ->select(
                    'e.idempleados',
                    'e.fecha_registro_empleado',
                    'e.sueldo',
                    'e.cuenta_bcp',
                    'p.nombres',
                    'p.primer_apell',
                    'p.segundo_apell',
                    'g.nom_genero',
                    'ce.nom_cargo_empleado'
                )
                ->orderBy('e.idempleados', 'desc'); // Ordenar por el ID del empleado

            // 3. Filtro de búsqueda inteligente
            // Buscamos por nombre, apellidos o cargo
            if (!empty($validated['Buscar'])) {
                $buscar = trim($validated['Buscar']);
                $q->where(function ($w) use ($buscar) {
                    $w->where('p.nombres', 'like', "%{$buscar}%")
                        ->orWhere('p.primer_apell', 'like', "%{$buscar}%")
                        ->orWhere('p.segundo_apell', 'like', "%{$buscar}%")
                        ->orWhere('ce.nom_cargo_empleado', 'like', "%{$buscar}%");
                });
            }

            // 4. Total de registros (antes de cortar para la página)
            $total = (clone $q)->count();

            // 5. Paginación eficiente (Offset / Limit)
            $data = $q->offset($validated['Limite_inferior'])
                ->limit($validated['Limite_Superior'])
                ->get();

            // 6. Respuesta JSON exitosa
            return response()->json([
                'success' => true,
                'message' => 'Lista de empleados obtenida correctamente.',
                'data'    => $data,
                'total'   => $total,
            ], 200);
        } catch (\Throwable $e) {
            // 7. Manejo de errores
            return response()->json([
                'success' => false,
                'error'   => 'Error al listar los empleados: ' . $e->getMessage(),
                'data'    => [],
                'total'   => 0
            ], 500);
        }
    }

    // registrar empleado
    public function create(Request $request)
    {
        try {
            // 1. Validación de entradas
            $validated = $request->validate([
                // Datos de persona
                'dni'              => 'required|string|max:8|unique:personas,dni',
                'fecha_nacimiento' => 'required|date|before:today',
                'primer_apell'     => 'required|string|max:45',
                'segundo_apell'    => 'required|string|max:45',
                'nombres'          => 'required|string|max:45',
                'correo'           => 'nullable|email|max:100',
                'telefono'         => 'nullable|string|max:15',
                'direccion'        => 'nullable|string',
                'fotografia'       => 'nullable|string',
                'fk_idgeneros'     => 'required|integer|exists:generos,idgeneros',

                // Datos de empleado
                'sueldo'                   => 'required|numeric|min:0',
                'cuenta_bcp'               => 'nullable|string|max:45',
                'fk_idcargos_empleados'    => 'required|integer|exists:cargos_empleados,idcargos_empleados',
            ], [
                'dni.required'              => 'El DNI es obligatorio.',
                'dni.unique'                => 'El DNI ya está registrado.',
                'fecha_nacimiento.required' => 'La fecha de nacimiento es obligatoria.',
                'fecha_nacimiento.before'   => 'La fecha de nacimiento debe ser anterior a hoy.',
                'primer_apell.required'     => 'El primer apellido es obligatorio.',
                'segundo_apell.required'    => 'El segundo apellido es obligatorio.',
                'nombres.required'          => 'Los nombres son obligatorios.',
                'fk_idgeneros.required'     => 'El género es obligatorio.',
                'fk_idgeneros.exists'       => 'El género seleccionado no existe.',
                'sueldo.required'           => 'El sueldo es obligatorio.',
                'sueldo.numeric'            => 'El sueldo debe ser un número válido.',
                'fk_idcargos_empleados.required' => 'El cargo es obligatorio.',
                'fk_idcargos_empleados.exists'   => 'El cargo seleccionado no existe.',
            ]);

            // 2. Usar transacción para garantizar integridad
            DB::beginTransaction();

            // 3. Insertar en tabla personas
            $idpersona = DB::table('personas')->insertGetId([
                'dni'              => $validated['dni'],
                'fecha_nacimiento' => $validated['fecha_nacimiento'],
                'primer_apell'     => $validated['primer_apell'],
                'segundo_apell'    => $validated['segundo_apell'],
                'nombres'          => $validated['nombres'],
                'correo'           => $validated['correo'] ?? null,
                'telefono'         => $validated['telefono'] ?? null,
                'direccion'        => $validated['direccion'] ?? null,
                'fotografia'       => $validated['fotografia'] ?? null,
                'fk_idgeneros'     => $validated['fk_idgeneros'],
            ]);

            // 4. Insertar en tabla empleados
            $idempleado = DB::table('empleados')->insertGetId([
                'fecha_registro_empleado' => now(),
                'sueldo'                  => $validated['sueldo'],
                'cuenta_bcp'              => $validated['cuenta_bcp'] ?? null,
                'fk_idpersonas'           => $idpersona,
                'fk_idcargos_empleados'   => $validated['fk_idcargos_empleados'],
            ]);

            // 5. Confirmar transacción
            DB::commit();

            // 6. Respuesta JSON exitosa
            return response()->json([
                'success' => true,
                'message' => 'Empleado registrado correctamente.',
                'data'    => [
                    'idempleado' => $idempleado,
                    'idpersona'  => $idpersona,
                ],
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Rollback en caso de error de validación
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error de validación.',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            // 7. Rollback en caso de error
            DB::rollBack();
            return response()->json([
                'success' => false,
                'error'   => 'Error al registrar el empleado: ' . $e->getMessage(),
            ], 500);
        }
    }

    // editar empleado
    public function edit(Request $request, $id)
    {
        try {
            // 1. Validación de entradas
            $validated = $request->validate([
                // Datos de persona
                'dni'              => 'required|string|max:8',
                'fecha_nacimiento' => 'required|date|before:today',
                'primer_apell'     => 'required|string|max:45',
                'segundo_apell'    => 'required|string|max:45',
                'nombres'          => 'required|string|max:45',
                'correo'           => 'nullable|email|max:100',
                'telefono'         => 'nullable|string|max:15',
                'direccion'        => 'nullable|string',
                'fotografia'       => 'nullable|string',
                'fk_idgeneros'     => 'required|integer|exists:generos,idgeneros',

                // Datos de empleado
                'sueldo'                   => 'required|numeric|min:0',
                'cuenta_bcp'               => 'nullable|string|max:45',
                'fk_idcargos_empleados'    => 'required|integer|exists:cargos_empleados,idcargos_empleados',
            ], [
                'dni.required'              => 'El DNI es obligatorio.',
                'dni.unique'                => 'El DNI ya está registrado.',
                'fecha_nacimiento.required' => 'La fecha de nacimiento es obligatoria.',
                'fecha_nacimiento.before'   => 'La fecha de nacimiento debe ser anterior a hoy.',
                'primer_apell.required'     => 'El primer apellido es obligatorio.',
                'segundo_apell.required'    => 'El segundo apellido es obligatorio.',
                'nombres.required'          => 'Los nombres son obligatorios.',
                'fk_idgeneros.required'     => 'El género es obligatorio.',
                'fk_idgeneros.exists'       => 'El género seleccionado no existe.',
                'sueldo.required'           => 'El sueldo es obligatorio.',
                'sueldo.numeric'            => 'El sueldo debe ser un número válido.',
                'fk_idcargos_empleados.required' => 'El cargo es obligatorio.',
                'fk_idcargos_empleados.exists'   => 'El cargo seleccionado no existe.',
            ]);

            // 2. Verificar que el empleado existe
            $empleado = DB::table('empleados')
                ->where('idempleados', $id)
                ->first();

            if (!$empleado) {
                return response()->json([
                    'success' => false,
                    'message' => 'Empleado no encontrado.',
                ], 404);
            }

            // 3. Usar transacción para garantizar integridad
            DB::beginTransaction();

            // 4. Actualizar tabla personas
            DB::table('personas')
                ->where('idpersonas', $empleado->fk_idpersonas)
                ->update([
                    'dni'              => $validated['dni'],
                    'fecha_nacimiento' => $validated['fecha_nacimiento'],
                    'primer_apell'     => $validated['primer_apell'],
                    'segundo_apell'    => $validated['segundo_apell'],
                    'nombres'          => $validated['nombres'],
                    'correo'           => $validated['correo'] ?? null,
                    'telefono'         => $validated['telefono'] ?? null,
                    'direccion'        => $validated['direccion'] ?? null,
                    'fotografia'       => $validated['fotografia'] ?? null,
                    'fk_idgeneros'     => $validated['fk_idgeneros'],
                ]);

            // 5. Actualizar tabla empleados
            DB::table('empleados')
                ->where('idempleados', $id)
                ->update([
                    'sueldo'                  => $validated['sueldo'],
                    'cuenta_bcp'              => $validated['cuenta_bcp'] ?? null,
                    'fk_idcargos_empleados'   => $validated['fk_idcargos_empleados'],
                ]);

            // 6. Confirmar transacción
            DB::commit();

            // 7. Respuesta JSON exitosa
            return response()->json([
                'success' => true,
                'message' => 'Empleado actualizado correctamente.',
                'data'    => [
                    'idempleado' => $id,
                ],
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Rollback en caso de error de validación
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error de validación.',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            // Rollback en caso de error
            DB::rollBack();
            return response()->json([
                'success' => false,
                'error'   => 'Error al actualizar el empleado: ' . $e->getMessage(),
            ], 500);
        }
    }

    // ver detalles del empleado
    public function show($id)
    {
        try {
            // 1. Consultar empleado con sus relaciones
            $empleado = DB::table('empleados as e')
                ->join('personas as p', 'p.idpersonas', '=', 'e.fk_idpersonas')
                ->join('generos as g', 'g.idgeneros', '=', 'p.fk_idgeneros')
                ->join('cargos_empleados as ce', 'ce.idcargos_empleados', '=', 'e.fk_idcargos_empleados')
                ->select(
                    'e.idempleados',
                    'e.fecha_registro_empleado',
                    'e.sueldo',
                    'e.cuenta_bcp',
                    'p.idpersonas',
                    'p.dni',
                    'p.nombres',
                    'p.primer_apell',
                    'p.segundo_apell',
                    'p.fecha_nacimiento',
                    'p.correo',
                    'p.telefono',
                    'p.direccion',
                    'p.fotografia',
                    'g.idgeneros',
                    'g.nom_genero',
                    'ce.idcargos_empleados',
                    'ce.nom_cargo_empleado'
                )
                ->where('e.idempleados', $id)
                ->first();

            // 2. Verificar si existe
            if (!$empleado) {
                return response()->json([
                    'success' => false,
                    'message' => 'Empleado no encontrado.',
                ], 404);
            }

            // 3. Respuesta JSON exitosa
            return response()->json([
                'success' => true,
                'message' => 'Detalles del empleado obtenidos correctamente.',
                'data'    => $empleado,
            ], 200);
        } catch (\Throwable $e) {
            // 4. Manejo de errores
            return response()->json([
                'success' => false,
                'error'   => 'Error al obtener los detalles del empleado: ' . $e->getMessage(),
            ], 500);
        }
    }

    // eliminar empleado
    public function destroy($id)
    {
        try {
            // 1. Verificar que el empleado existe
            $empleado = DB::table('empleados')
                ->where('idempleados', $id)
                ->first();

            if (!$empleado) {
                return response()->json([
                    'success' => false,
                    'message' => 'Empleado no encontrado.',
                ], 404);
            }

            // 2. Guardar el ID de la persona antes de eliminar
            $idpersona = $empleado->fk_idpersonas;

            // 3. Usar transacción para garantizar integridad
            DB::beginTransaction();

            // 4. Eliminar primero el empleado (por la FK)
            DB::table('empleados')
                ->where('idempleados', $id)
                ->delete();

            // 5. Eliminar la persona asociada
            DB::table('personas')
                ->where('idpersonas', $idpersona)
                ->delete();

            // 6. Confirmar transacción
            DB::commit();

            // 7. Respuesta JSON exitosa
            return response()->json([
                'success' => true,
                'message' => 'Empleado eliminado correctamente.',
            ], 200);
        } catch (\Throwable $e) {
            // 8. Rollback en caso de error
            DB::rollBack();
            return response()->json([
                'success' => false,
                'error'   => 'Error al eliminar el empleado: ' . $e->getMessage(),
            ], 500);
        }
    }

    // listar géneros para el select
    public function listarGeneros()
    {
        try {
            $generos = DB::table('generos')
                ->select('idgeneros', 'nom_genero')
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Géneros obtenidos correctamente.',
                'data'    => $generos,
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'error'   => 'Error al obtener los géneros: ' . $e->getMessage(),
            ], 500);
        }
    }

    // listar cargos para el select
    public function listarCargos()
    {
        try {
            $cargos = DB::table('cargos_empleados')
                ->select('idcargos_empleados', 'nom_cargo_empleado')
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Cargos obtenidos correctamente.',
                'data'    => $cargos,
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'error'   => 'Error al obtener los cargos: ' . $e->getMessage(),
            ], 500);
        }
    }
}
