<?php

namespace App\Http\Controllers;

use App\Models\Capacitacion;
use App\Models\CapacitacionAsistente;
use App\Models\Empleado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class CapacitacionController extends Controller
{
    /**
     * Listar todas las capacitaciones con sus asistentes
     */
    public function index(Request $request)
    {
        try {
            $query = Capacitacion::with(['empleado.persona', 'empleado.cargoEmpleado', 'asistentes.empleado.persona']);

            // Filtros opcionales
            if ($request->has('tipo_actividad')) {
                $query->where('tipo_actividad', $request->tipo_actividad);
            }

            if ($request->has('fecha_desde') && $request->has('fecha_hasta')) {
                $query->whereBetween('fecha_capacitacion', [
                    $request->fecha_desde,
                    $request->fecha_hasta
                ]);
            }

            if ($request->has('capacitador')) {
                $query->where('capacitador', 'like', '%' . $request->capacitador . '%');
            }

            if ($request->has('tema')) {
                $query->where('tema_capacitacion', 'like', '%' . $request->tema . '%');
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('codigo', 'like', "%{$search}%")
                        ->orWhere('tema_capacitacion', 'like', "%{$search}%")
                        ->orWhere('capacitador', 'like', "%{$search}%")
                        ->orWhere('razon_social', 'like', "%{$search}%");
                });
            }

            // Ordenar por fecha más reciente
            $query->orderBy('fecha_capacitacion', 'desc');

            $capacitaciones = $query->get();

            // Transformar datos
            $capacitaciones->transform(function ($capacitacion) {
                return [
                    'id_capacitacion' => $capacitacion->id_capacitacion,
                    'codigo' => $capacitacion->codigo,
                    'razon_social' => $capacitacion->razon_social,
                    'ruc' => $capacitacion->ruc,
                    'domicilio' => $capacitacion->domicilio,
                    'actividad_economica' => $capacitacion->actividad_economica,
                    'num_trabajadores' => $capacitacion->num_trabajadores,
                    'tipo_actividad' => $capacitacion->tipo_actividad,
                    'fecha_capacitacion' => $capacitacion->fecha_capacitacion->format('Y-m-d'),
                    'tema_capacitacion' => $capacitacion->tema_capacitacion,
                    'capacitador' => $capacitacion->capacitador,
                    'num_horas' => $capacitacion->num_horas,
                    'lugar_capacitacion' => $capacitacion->lugar_capacitacion,
                    'fk_idempleados' => $capacitacion->fk_idempleados,
                    'observaciones' => $capacitacion->observaciones,
                    'total_asistentes' => $capacitacion->asistentes->count(),
                    'created_at' => $capacitacion->created_at?->format('Y-m-d H:i:s'),
                    'updated_at' => $capacitacion->updated_at?->format('Y-m-d H:i:s'),
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $capacitaciones,
                'total' => $capacitaciones->count()
            ]);
        } catch (\Exception $e) {
            Log::error('Error al listar capacitaciones: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al listar las capacitaciones',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mostrar una capacitación específica con sus asistentes
     */
    public function show($id)
    {
        try {
            $capacitacion = Capacitacion::with([
                'empleado.persona',
                'empleado.cargoEmpleado',
                'asistentes.empleado.persona',
                'asistentes.empleado.cargoEmpleado'
            ])->findOrFail($id);

            $asistentes = $capacitacion->asistentes->map(function ($asistente) {
                return [
                    'id_asistente' => $asistente->id_asistente,
                    'fk_idempleados' => $asistente->fk_idempleados,
                    'nombre_completo' => $asistente->nombre_completo,
                    'dni' => $asistente->empleado->persona->dni ?? 'N/A',
                    'area' => $asistente->area,
                    'asistio' => $asistente->asistio,
                    'observaciones_asistente' => $asistente->observaciones_asistente,
                    'cargo' => $asistente->empleado->cargoEmpleado->nom_cargos_empleados ?? 'N/A'
                ];
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'id_capacitacion' => $capacitacion->id_capacitacion,
                    'codigo' => $capacitacion->codigo,
                    'razon_social' => $capacitacion->razon_social,
                    'ruc' => $capacitacion->ruc,
                    'domicilio' => $capacitacion->domicilio,
                    'actividad_economica' => $capacitacion->actividad_economica,
                    'num_trabajadores' => $capacitacion->num_trabajadores,
                    'tipo_actividad' => $capacitacion->tipo_actividad,
                    'fecha_capacitacion' => $capacitacion->fecha_capacitacion->format('Y-m-d'),
                    'tema_capacitacion' => $capacitacion->tema_capacitacion,
                    'capacitador' => $capacitacion->capacitador,
                    'num_horas' => $capacitacion->num_horas,
                    'lugar_capacitacion' => $capacitacion->lugar_capacitacion,
                    'fk_idempleados' => $capacitacion->fk_idempleados,
                    'observaciones' => $capacitacion->observaciones,
                    'asistentes' => $asistentes,
                    'created_at' => $capacitacion->created_at?->format('Y-m-d H:i:s'),
                    'updated_at' => $capacitacion->updated_at?->format('Y-m-d H:i:s'),
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error al mostrar capacitación: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Capacitación no encontrada',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Generar código único automático para capacitación
     */
    private function generarCodigoUnico()
    {
        $fecha = now()->format('Ymd');
        $ultimaCapacitacion = Capacitacion::whereDate('created_at', now())
            ->orderBy('id_capacitacion', 'desc')
            ->first();

        if ($ultimaCapacitacion && preg_match('/CAP-(\d{8})-(\d{3})/', $ultimaCapacitacion->codigo, $matches)) {
            $numero = intval($matches[2]) + 1;
        } else {
            $numero = 1;
        }

        return 'CAP-' . $fecha . '-' . str_pad($numero, 3, '0', STR_PAD_LEFT);
    }

    /**
     * Crear una nueva capacitación con asistentes
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'codigo' => 'nullable|string|max:50|unique:capacitaciones,codigo',
                'razon_social' => 'nullable|string|max:255',
                'ruc' => 'nullable|string|max:11',
                'domicilio' => 'nullable|string',
                'actividad_economica' => 'nullable|string|max:255',
                'num_trabajadores' => 'nullable|integer',
                'tipo_actividad' => 'required|in:induccion,capacitacion,entrenamiento,charla,simulacro,otros',
                'fecha_capacitacion' => 'required|date',
                'tema_capacitacion' => 'required|string|max:255',
                'capacitador' => 'required|string|max:255',
                'num_horas' => 'nullable|numeric',
                'lugar_capacitacion' => 'nullable|string|max:255',
                'fk_idempleados' => 'required|integer|exists:empleados,idempleados',
                'observaciones' => 'nullable|string',
                'asistentes' => 'required|array|min:1',
                'asistentes.*.fk_idempleados' => 'required|integer|exists:empleados,idempleados',
                'asistentes.*.area' => 'nullable|string|max:100',
                'asistentes.*.asistio' => 'boolean',
                'asistentes.*.observaciones_asistente' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            // Generar código automático si no se proporciona
            $capacitacionData = $request->except('asistentes');
            if (empty($capacitacionData['codigo'])) {
                $capacitacionData['codigo'] = $this->generarCodigoUnico();
            }

            // Calcular número de trabajadores automáticamente
            $capacitacionData['num_trabajadores'] = count($request->asistentes);

            // Crear capacitación
            $capacitacion = Capacitacion::create($capacitacionData);

            // Crear asistentes
            foreach ($request->asistentes as $asistenteData) {
                $asistenteData['fk_id_capacitacion'] = $capacitacion->id_capacitacion;
                CapacitacionAsistente::create($asistenteData);
            }

            DB::commit();

            $capacitacion->load(['asistentes.empleado.persona']);

            return response()->json([
                'success' => true,
                'message' => 'Capacitación creada exitosamente',
                'data' => $capacitacion
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al crear capacitación: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la capacitación',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar una capacitación existente con sus asistentes
     */
    public function update(Request $request, $id)
    {
        try {
            $capacitacion = Capacitacion::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'codigo' => 'sometimes|required|string|max:50|unique:capacitaciones,codigo,' . $id . ',id_capacitacion',
                'razon_social' => 'nullable|string|max:255',
                'ruc' => 'nullable|string|max:11',
                'domicilio' => 'nullable|string',
                'actividad_economica' => 'nullable|string|max:255',
                'num_trabajadores' => 'nullable|integer',
                'tipo_actividad' => 'sometimes|required|in:induccion,capacitacion,entrenamiento,charla,simulacro,otros',
                'fecha_capacitacion' => 'sometimes|required|date',
                'tema_capacitacion' => 'sometimes|required|string|max:255',
                'capacitador' => 'sometimes|required|string|max:255',
                'num_horas' => 'nullable|numeric',
                'lugar_capacitacion' => 'nullable|string|max:255',
                'fk_idempleados' => 'sometimes|required|integer|exists:empleados,idempleados',
                'observaciones' => 'nullable|string',
                'asistentes' => 'sometimes|array',
                'asistentes.*.id_asistente' => 'nullable|integer|exists:capacitaciones_asistentes,id_asistente',
                'asistentes.*.fk_idempleados' => 'required|integer|exists:empleados,idempleados',
                'asistentes.*.area' => 'nullable|string|max:100',
                'asistentes.*.asistio' => 'boolean',
                'asistentes.*.observaciones_asistente' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            // Actualizar capacitación
            $capacitacionData = $request->except('asistentes');

            // Actualizar número de trabajadores si se enviaron asistentes
            if ($request->has('asistentes')) {
                $capacitacionData['num_trabajadores'] = count($request->asistentes);
            }

            $capacitacion->update($capacitacionData);

            // Actualizar asistentes si se enviaron
            if ($request->has('asistentes')) {
                // Obtener IDs actuales
                $idsEnviados = collect($request->asistentes)
                    ->pluck('id_asistente')
                    ->filter()
                    ->toArray();

                // Eliminar asistentes que ya no están
                CapacitacionAsistente::where('fk_id_capacitacion', $id)
                    ->whereNotIn('id_asistente', $idsEnviados)
                    ->delete();

                // Actualizar o crear asistentes
                foreach ($request->asistentes as $asistenteData) {
                    if (isset($asistenteData['id_asistente'])) {
                        // Actualizar existente
                        $asistente = CapacitacionAsistente::find($asistenteData['id_asistente']);
                        if ($asistente) {
                            $asistente->update($asistenteData);
                        }
                    } else {
                        // Crear nuevo
                        $asistenteData['fk_id_capacitacion'] = $capacitacion->id_capacitacion;
                        CapacitacionAsistente::create($asistenteData);
                    }
                }
            }

            DB::commit();

            $capacitacion->load(['asistentes.empleado.persona']);

            return response()->json([
                'success' => true,
                'message' => 'Capacitación actualizada exitosamente',
                'data' => $capacitacion
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al actualizar capacitación: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la capacitación',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar una capacitación (eliminará también sus asistentes por cascade)
     */
    public function destroy($id)
    {
        try {
            $capacitacion = Capacitacion::findOrFail($id);
            $capacitacion->delete();

            return response()->json([
                'success' => true,
                'message' => 'Capacitación eliminada exitosamente'
            ]);
        } catch (\Exception $e) {
            Log::error('Error al eliminar capacitación: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la capacitación',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener lista de empleados para el select
     */
    public function obtenerEmpleados()
    {
        try {
            $empleados = Empleado::with(['persona', 'cargoEmpleado'])
                ->get()
                ->map(function ($empleado) {
                    $nombreCompleto = '';
                    $dni = '';
                    if ($empleado->persona) {
                        // Formato: APELLIDOS NOMBRES - DNI
                        $apellidos = trim(($empleado->persona->primer_apell ?? '') . ' ' . ($empleado->persona->segundo_apell ?? ''));
                        $nombres = trim($empleado->persona->nombres ?? '');
                        $dni = $empleado->persona->dni ?? '';

                        $nombreCompleto = strtoupper(trim($apellidos . ' ' . $nombres)) . ' - ' . $dni;
                    }

                    return [
                        'idempleados' => $empleado->idempleados,
                        'nombre_completo' => $nombreCompleto,
                        'dni' => $dni,
                        'cargo' => $empleado->cargoEmpleado->nom_cargos_empleados ?? 'N/A'
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $empleados
            ]);
        } catch (\Exception $e) {
            Log::error('Error al obtener empleados: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener la lista de empleados',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generar reporte PDF de la capacitación
     */
    public function generarPDF($id)
    {
        try {
            Log::info('=== INICIO GENERACIÓN PDF CAPACITACIÓN ===', ['id' => $id]);

            $capacitacion = Capacitacion::with([
                'empleado.persona',
                'asistentes' => function ($query) {
                    $query->orderBy('id_asistente');
                },
                'asistentes.empleado.persona'
            ])->findOrFail($id);

            Log::info('Capacitación encontrada', [
                'codigo' => $capacitacion->codigo,
                'tema' => $capacitacion->tema_capacitacion,
                'asistentes_count' => $capacitacion->asistentes->count()
            ]);

            $pdf = Pdf::loadView('reportes.capacitacion', [
                'capacitacion' => $capacitacion
            ]);

            $pdf->setPaper('a4', 'portrait');

            $nombreArchivo = 'Capacitacion_' . $capacitacion->codigo . '_' . date('Ymd') . '.pdf';

            Log::info('PDF generado exitosamente', ['archivo' => $nombreArchivo]);

            return $pdf->download($nombreArchivo);
        } catch (\Exception $e) {
            Log::error('Error al generar PDF de capacitación', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al generar el PDF',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener tipos de actividad disponibles
     */
    public function obtenerTiposActividad()
    {
        return response()->json([
            'success' => true,
            'data' => [
                ['value' => 'induccion', 'label' => 'Inducción'],
                ['value' => 'capacitacion', 'label' => 'Capacitación'],
                ['value' => 'entrenamiento', 'label' => 'Entrenamiento'],
                ['value' => 'charla', 'label' => 'Charla'],
                ['value' => 'simulacro', 'label' => 'Simulacro de Emergencia'],
                ['value' => 'otros', 'label' => 'Otros']
            ]
        ]);
    }
}
