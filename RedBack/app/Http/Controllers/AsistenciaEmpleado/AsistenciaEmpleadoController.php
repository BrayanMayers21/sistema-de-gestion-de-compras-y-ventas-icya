<?php

namespace App\Http\Controllers\AsistenciaEmpleado;

use App\Exports\AsistenciaMensualExport;
use App\Http\Controllers\Controller;
use App\Models\AsistenciaEmpleado;
use App\Models\Empleado;
use Carbon\Carbon;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Maatwebsite\Excel\Facades\Excel;

class AsistenciaEmpleadoController extends Controller
{
    /**
     * Listar todas las asistencias
     */
    public function ListaAsistencia(Request $request)
    {
        try {
            // 1. Validación de entradas (Igual que en listaEmpleados)
            $validated = $request->validate([
                'Limite_inferior' => 'required|integer|min:0',
                'Limite_Superior' => 'required|integer|min:1',
                'Buscar'          => 'nullable|string|max:255',
            ], [
                'Limite_inferior.required' => 'El límite inferior es obligatorio.',
                'Limite_Superior.required' => 'El límite superior es obligatorio.',
            ]);

            // 2. Construcción de la consulta base con los JOINs de tu SQL
            $q = DB::table('asistencias_empleados as ae')
                ->join('empleados as e', 'e.idempleados', '=', 'ae.fk_idempleados')
                ->join('personas as p', 'p.idpersonas', '=', 'e.fk_idpersonas')
                ->join('generos as g', 'g.idgeneros', '=', 'p.fk_idgeneros')
                // Completé este join asumiendo que la relación está en empleados
                ->join('cargos_empleados as ce', 'ce.idcargos_empleados', '=', 'e.fk_idcargos_empleados')
                ->select(
                    'ae.idasistencias_empleados',
                    'e.sueldo',
                    'e.cuenta_bcp',
                    'p.nombres',
                    'p.primer_apell',
                    'p.segundo_apell',
                    'g.nom_genero',
                    'ce.nom_cargo_empleado',
                    'ae.fecha_asistio',
                    'ae.estado'
                )
                // Ordenamos por fecha de asistencia descendente (lo más reciente primero)
                ->orderBy('ae.fecha_asistio', 'desc');

            // 3. Filtro de búsqueda inteligente
            // Permite buscar por nombre del empleado o apellido dentro de la asistencia
            if (!empty($validated['Buscar'])) {
                $buscar = trim($validated['Buscar']);
                $q->where(function ($w) use ($buscar) {
                    $w->where('p.nombres', 'like', "%{$buscar}%")
                        ->orWhere('p.primer_apell', 'like', "%{$buscar}%")
                        ->orWhere('p.segundo_apell', 'like', "%{$buscar}%")
                        ->orWhere('ce.nom_cargo_empleado', 'like', "%{$buscar}%");
                });
            }

            // 4. Total de registros (para la paginación en el frontend)
            $total = (clone $q)->count();

            // 5. Paginación eficiente (Offset / Limit)
            $data = $q->offset($validated['Limite_inferior'])
                ->limit($validated['Limite_Superior'])
                ->get();

            // 6. Respuesta JSON exitosa
            return response()->json([
                'success' => true,
                'message' => 'Lista de asistencias obtenida correctamente.',
                'data'    => $data,
                'total'   => $total,
            ], 200);
        } catch (\Throwable $e) {
            // 7. Manejo de errores
            return response()->json([
                'success' => false,
                'message' => 'Error al listar las asistencias',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mostrar una asistencia específica con detalles completos
     */
    public function DetalleAsistencia($id): JsonResponse
    {
        try {
            // Consulta con todos los detalles relacionados
            $asistencia = DB::table('asistencias_empleados as ae')
                ->join('empleados as e', 'e.idempleados', '=', 'ae.fk_idempleados')
                ->join('personas as p', 'p.idpersonas', '=', 'e.fk_idpersonas')
                ->join('generos as g', 'g.idgeneros', '=', 'p.fk_idgeneros')
                ->join('cargos_empleados as ce', 'ce.idcargos_empleados', '=', 'e.fk_idcargos_empleados')
                ->select(
                    'ae.idasistencias_empleados',
                    'ae.fecha_asistio',
                    'ae.estado',
                    'ae.observacion',
                    'e.idempleados',
                    'e.sueldo',
                    'e.cuenta_bcp',
                    'p.nombres',
                    'p.primer_apell',
                    'p.segundo_apell',
                    'p.dni',
                    'p.correo',
                    'p.celular',
                    'g.nom_genero',
                    'ce.nom_cargo_empleado'
                )
                ->where('ae.idasistencias_empleados', $id)
                ->first();

            if (!$asistencia) {
                return response()->json([
                    'success' => false,
                    'message' => 'Asistencia no encontrada'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $asistencia
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener la asistencia',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Crear una nueva asistencia (individual o masiva)
     */
    public function registrarAsistencia(Request $request): JsonResponse
    {
        try {
            // Validar el request
            $validated = $request->validate([
                // Para registro individual
                'fecha_asistio' => 'required_without:fecha_inicio|date',
                'estado' => 'required|in:ASISTIO,FALTA,TARDANZA,JUSTIFICADO',
                'observacion' => 'nullable|string',
                'fk_idempleados' => 'required_without:empleados|integer|exists:empleados,idempleados',

                // Para registro masivo por rango de fechas
                'fecha_inicio' => 'required_without:fecha_asistio|date',
                'fecha_fin' => 'required_with:fecha_inicio|date|after_or_equal:fecha_inicio',
                'empleados' => 'required_without:fk_idempleados|array|min:1',
                'empleados.*' => 'integer|exists:empleados,idempleados'
            ]);

            // Determinar si es registro individual o masivo
            if (isset($validated['fecha_asistio']) && isset($validated['fk_idempleados'])) {
                // REGISTRO INDIVIDUAL
                $asistencia = AsistenciaEmpleado::create([
                    'fecha_asistio' => $validated['fecha_asistio'],
                    'estado' => $validated['estado'],
                    'observacion' => $validated['observacion'] ?? null,
                    'fk_idempleados' => $validated['fk_idempleados']
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Asistencia registrada exitosamente',
                    'data' => $asistencia
                ], 201);
            } else {
                // REGISTRO MASIVO POR RANGO DE FECHAS
                $fechaInicio = new \DateTime($validated['fecha_inicio']);
                $fechaFin = new \DateTime($validated['fecha_fin']);
                $empleados = $validated['empleados'];
                $estado = $validated['estado'];
                $observacion = $validated['observacion'] ?? null;

                // Log para depuración
                logger()->info('Registro masivo de asistencias', [
                    'fecha_inicio' => $fechaInicio->format('Y-m-d'),
                    'fecha_fin' => $fechaFin->format('Y-m-d'),
                    'empleados' => $empleados,
                    'estado' => $estado
                ]);

                $asistenciasCreadas = [];
                $yaExistentes = 0;
                $interval = new \DateInterval('P1D'); // Intervalo de 1 día

                // Crear una copia de la fecha fin y agregar un día para incluirla en el rango
                $fechaFinInclusiva = clone $fechaFin;
                $fechaFinInclusiva->modify('+1 day');

                $period = new \DatePeriod($fechaInicio, $interval, $fechaFinInclusiva);

                // Iterar por cada fecha en el rango
                foreach ($period as $fecha) {
                    // Iterar por cada empleado
                    foreach ($empleados as $idEmpleado) {
                        // Verificar si ya existe un registro para esta fecha y empleado
                        $existente = AsistenciaEmpleado::where('fecha_asistio', $fecha->format('Y-m-d'))
                            ->where('fk_idempleados', $idEmpleado)
                            ->first();

                        if (!$existente) {
                            $asistencia = AsistenciaEmpleado::create([
                                'fecha_asistio' => $fecha->format('Y-m-d'),
                                'estado' => $estado,
                                'observacion' => $observacion,
                                'fk_idempleados' => $idEmpleado
                            ]);
                            $asistenciasCreadas[] = $asistencia;
                        } else {
                            $yaExistentes++;
                        }
                    }
                }

                return response()->json([
                    'success' => true,
                    'message' => count($asistenciasCreadas) > 0
                        ? 'Asistencias registradas exitosamente'
                        : 'No se registraron asistencias nuevas (todas ya existían)',
                    'data' => [
                        'total_registradas' => count($asistenciasCreadas),
                        'ya_existentes' => $yaExistentes,
                        'asistencias' => $asistenciasCreadas
                    ]
                ], 201);
            }
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al registrar la asistencia',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Crear una lista de asistencias (Arbitraria)
     */
    public function registrarListaAsistencias(Request $request): JsonResponse
    {
        try {
            // Validar que se envíe un array de asistencias
            $validated = $request->validate([
                'asistencias' => 'required|array|min:1',
                'asistencias.*.fecha_asistio' => 'required|date',
                'asistencias.*.estado' => 'required|in:ASISTIO,FALTA,TARDANZA,JUSTIFICADO',
                'asistencias.*.fk_idempleados' => 'required|integer|exists:empleados,idempleados',
                'asistencias.*.observacion' => 'nullable|string'
            ]);

            $asistenciasData = $validated['asistencias'];
            $createdCount = 0;
            $updatedCount = 0;
            $errors = [];

            DB::beginTransaction();
            try {
                foreach ($asistenciasData as $index => $data) {
                    // Verificar si ya existe
                    $existing = AsistenciaEmpleado::where('fecha_asistio', $data['fecha_asistio'])
                        ->where('fk_idempleados', $data['fk_idempleados'])
                        ->first();

                    if ($existing) {
                        // Actualizar si ya existe (Opcional: podrías decidir ignorar)
                        $existing->update([
                            'estado' => $data['estado'],
                            'observacion' => $data['observacion'] ?? null
                        ]);
                        $updatedCount++;
                    } else {
                        // Crear nuevo
                        AsistenciaEmpleado::create([
                            'fecha_asistio' => $data['fecha_asistio'],
                            'estado' => $data['estado'],
                            'observacion' => $data['observacion'] ?? null,
                            'fk_idempleados' => $data['fk_idempleados']
                        ]);
                        $createdCount++;
                    }
                }
                DB::commit();
            } catch (\Exception $ex) {
                DB::rollBack();
                throw $ex;
            }

            return response()->json([
                'success' => true,
                'message' => 'Proceso completado',
                'data' => [
                    'created' => $createdCount,
                    'updated' => $updatedCount
                ]
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
             return response()->json([
                'success' => false,
                'message' => 'Error al registrar la lista de asistencias',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar una asistencia (individual o masiva)
     */
    public function ActualizarAsistencia(Request $request, $id = null): JsonResponse
    {
        try {
            // Validación del request
            $validated = $request->validate([
                // Para actualización individual (con $id)
                'fecha_asistio' => 'sometimes|required|date',
                'estado' => 'required|in:ASISTIO,FALTA,TARDANZA,JUSTIFICADO',
                'observacion' => 'nullable|string',
                'fk_idempleados' => 'sometimes|required|integer|exists:empleados,idempleados',

                // Para actualización masiva (sin $id)
                'fecha_inicio' => 'required_without:fecha_asistio|date',
                'fecha_fin' => 'required_with:fecha_inicio|date|after_or_equal:fecha_inicio',
                'empleados' => 'sometimes|array|min:1',
                'empleados.*' => 'integer|exists:empleados,idempleados'
            ]);

            // Determinar si es actualización individual o masiva
            if ($id !== null) {
                // ACTUALIZACIÓN INDIVIDUAL
                $asistencia = AsistenciaEmpleado::findOrFail($id);

                $dataToUpdate = [];
                if (isset($validated['fecha_asistio'])) {
                    $dataToUpdate['fecha_asistio'] = $validated['fecha_asistio'];
                }
                if (isset($validated['estado'])) {
                    $dataToUpdate['estado'] = $validated['estado'];
                }
                if (isset($validated['observacion'])) {
                    $dataToUpdate['observacion'] = $validated['observacion'];
                }
                if (isset($validated['fk_idempleados'])) {
                    $dataToUpdate['fk_idempleados'] = $validated['fk_idempleados'];
                }

                $asistencia->update($dataToUpdate);

                return response()->json([
                    'success' => true,
                    'message' => 'Asistencia actualizada exitosamente',
                    'data' => $asistencia
                ]);
            } else {
                // ACTUALIZACIÓN MASIVA POR RANGO DE FECHAS
                $fechaInicio = new \DateTime($validated['fecha_inicio']);
                $fechaFin = new \DateTime($validated['fecha_fin']);
                $empleados = $validated['empleados'] ?? [];
                $estado = $validated['estado'];
                $observacion = $validated['observacion'] ?? null;

                $asistenciasActualizadas = 0;
                $interval = new \DateInterval('P1D');
                $period = new \DatePeriod($fechaInicio, $interval, $fechaFin->modify('+1 day'));

                // Iterar por cada fecha en el rango
                foreach ($period as $fecha) {
                    if (!empty($empleados)) {
                        // Actualizar asistencias de empleados específicos
                        foreach ($empleados as $idEmpleado) {
                            $updated = AsistenciaEmpleado::where('fecha_asistio', $fecha->format('Y-m-d'))
                                ->where('fk_idempleados', $idEmpleado)
                                ->update([
                                    'estado' => $estado,
                                    'observacion' => $observacion
                                ]);
                            $asistenciasActualizadas += $updated;
                        }
                    } else {
                        // Actualizar todas las asistencias de esa fecha
                        $updated = AsistenciaEmpleado::where('fecha_asistio', $fecha->format('Y-m-d'))
                            ->update([
                                'estado' => $estado,
                                'observacion' => $observacion
                            ]);
                        $asistenciasActualizadas += $updated;
                    }
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Asistencias actualizadas exitosamente',
                    'data' => [
                        'total_actualizadas' => $asistenciasActualizadas
                    ]
                ]);
            }
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la asistencia',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar una asistencia
     */
    public function EliminarAsistencia($id): JsonResponse
    {
        try {
            $asistencia = AsistenciaEmpleado::findOrFail($id);
            $asistencia->delete();

            return response()->json([
                'success' => true,
                'message' => 'Asistencia eliminada exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la asistencia',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener asistencias por empleado con detalles completos
     */
    public function porEmpleado($idEmpleado): JsonResponse
    {
        try {
            // Consulta con joins para obtener información completa
            $asistencias = DB::table('asistencias_empleados as ae')
                ->join('empleados as e', 'e.idempleados', '=', 'ae.fk_idempleados')
                ->join('personas as p', 'p.idpersonas', '=', 'e.fk_idpersonas')
                ->join('generos as g', 'g.idgeneros', '=', 'p.fk_idgeneros')
                ->join('cargos_empleados as ce', 'ce.idcargos_empleados', '=', 'e.fk_idcargos_empleados')
                ->select(
                    'ae.idasistencias_empleados',
                    'ae.fecha_asistio',
                    'ae.estado',
                    'ae.observacion',
                    'e.idempleados',
                    'e.sueldo',
                    'e.cuenta_bcp',
                    'p.nombres',
                    'p.primer_apell',
                    'p.segundo_apell',
                    'p.dni',
                    'g.nom_genero',
                    'ce.nom_cargo_empleado'
                )
                ->where('ae.fk_idempleados', $idEmpleado)
                ->orderBy('ae.fecha_asistio', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $asistencias,
                'total' => $asistencias->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las asistencias del empleado',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener asistencias por rango de fechas con detalles completos
     */
    public function porFechas(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'fecha_inicio' => 'required|date',
                'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
                'fk_idempleados' => 'nullable|integer|exists:empleados,idempleados'
            ]);

            // Consulta con joins para obtener información completa
            $query = DB::table('asistencias_empleados as ae')
                ->join('empleados as e', 'e.idempleados', '=', 'ae.fk_idempleados')
                ->join('personas as p', 'p.idpersonas', '=', 'e.fk_idpersonas')
                ->join('generos as g', 'g.idgeneros', '=', 'p.fk_idgeneros')
                ->join('cargos_empleados as ce', 'ce.idcargos_empleados', '=', 'e.fk_idcargos_empleados')
                ->select(
                    'ae.idasistencias_empleados',
                    'ae.fecha_asistio',
                    'ae.estado',
                    'ae.observacion',
                    'e.idempleados',
                    'e.sueldo',
                    'e.cuenta_bcp',
                    'p.nombres',
                    'p.primer_apell',
                    'p.segundo_apell',
                    'p.dni',
                    'g.nom_genero',
                    'ce.nom_cargo_empleado'
                )
                ->whereBetween('ae.fecha_asistio', [
                    $validated['fecha_inicio'],
                    $validated['fecha_fin']
                ]);

            if (isset($validated['fk_idempleados'])) {
                $query->where('ae.fk_idempleados', $validated['fk_idempleados']);
            }

            $asistencias = $query->orderBy('ae.fecha_asistio', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => $asistencias,
                'total' => $asistencias->count()
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las asistencias',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    /**
     * Exportar reporte a Excel
     */
    public function exportExcel(Request $request)
    {
        try {
            $request->validate([
                'fecha_inicio' => 'required|date',
                'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            ]);

            $fechaInicio = $request->fecha_inicio;
            $fechaFin = $request->fecha_fin;
            $fileName = 'asistencias_' . $fechaInicio . '_al_' . $fechaFin . '.xlsx';

            return Excel::download(new AsistenciaMensualExport($fechaInicio, $fechaFin), $fileName);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al generar Excel',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exportar reporte a PDF
     */
    public function exportPdf(Request $request)
    {
        try {
            $request->validate([
                'fecha_inicio' => 'required|date',
                'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            ]);

            $fechaInicio = Carbon::parse($request->fecha_inicio);
            $fechaFin = Carbon::parse($request->fecha_fin);

            // 1. Obtener todos los empleados activos
            $empleados = DB::table('empleados as e')
                ->join('personas as p', 'p.idpersonas', '=', 'e.fk_idpersonas')
                ->join('cargos_empleados as ce', 'ce.idcargos_empleados', '=', 'e.fk_idcargos_empleados')
                ->select(
                    'e.idempleados',
                    DB::raw("CONCAT(p.nombres, ' ', p.primer_apell) as nombre_completo"),
                    'ce.nom_cargo_empleado'
                )
                ->orderBy('p.primer_apell', 'asc')
                ->get();

            // 2. Obtener asistencias en el rango
            $asistenciasDB = DB::table('asistencias_empleados')
                ->whereBetween('fecha_asistio', [$fechaInicio->format('Y-m-d'), $fechaFin->format('Y-m-d')])
                ->get();

            // 3. Mapear asistencias [idempleado][fecha] = estado
            $asistenciasMap = [];
            foreach ($asistenciasDB as $asistencia) {
                $fecha = substr($asistencia->fecha_asistio, 0, 10);
                $asistenciasMap[$asistencia->fk_idempleados][$fecha] = $asistencia->estado;
            }

            // 4. Generar rango de fechas
            $periodo = new \DatePeriod(
                $fechaInicio,
                new \DateInterval('P1D'),
                $fechaFin->copy()->addDay()
            );

            $dias = [];
            foreach ($periodo as $date) {
                $dias[] = Carbon::instance($date);
            }

            $fileName = 'reporte_asistencias_' . $fechaInicio->format('Y-m-d') . '.pdf';

            // Generar HTML
            $html = view('reports.asistencia_mensual', compact('empleados', 'asistenciasMap', 'dias', 'fechaInicio', 'fechaFin'))->render();

            // Configurar DomPDF
            $options = new Options();
            $options->set('defaultFont', 'Arial');
            $options->set('isRemoteEnabled', true); 
            
            $dompdf = new Dompdf($options);
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'landscape'); // Matrix view needs landscape
            $dompdf->render();

            return response($dompdf->output(), 200)
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'attachment; filename="' . $fileName . '"');

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al generar PDF',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
