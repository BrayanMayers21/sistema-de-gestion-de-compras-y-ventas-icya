<?php

namespace App\Http\Controllers;

use App\Models\RequerimientoObra;
use App\Models\RequerimientoObraDetalle;
use App\Models\Obra;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Exception;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\RequerimientoObraExport;

class RequerimientoObraController extends Controller
{
    /**
     * Listar todos los requerimientos de obra
     */
    public function index(Request $request)
    {
        try {
            $query = RequerimientoObra::with(['obra', 'detalles.producto']);

            // Filtros opcionales
            if ($request->has('fk_idobras')) {
                $query->where('fk_idobras', $request->fk_idobras);
            }

            if ($request->has('estado')) {
                $query->where('estado', $request->estado);
            }

            if ($request->has('fecha_desde')) {
                $query->where('fecha_requerimiento', '>=', $request->fecha_desde);
            }

            if ($request->has('fecha_hasta')) {
                $query->where('fecha_requerimiento', '<=', $request->fecha_hasta);
            }

            // Búsqueda por número de requerimiento o residente
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('numero_requerimiento', 'like', "%{$search}%")
                        ->orWhere('residente_obra', 'like', "%{$search}%");
                });
            }

            $requerimientos = $query->orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => $requerimientos
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los requerimientos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener un requerimiento específico
     */
    public function show($id)
    {
        try {
            $requerimiento = RequerimientoObra::with(['obra', 'detalles.producto'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $requerimiento
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Requerimiento no encontrado',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Crear un nuevo requerimiento de obra
     */
    public function store(Request $request)
    {
        // Validación
        $validator = Validator::make($request->all(), [
            'fk_idobras' => 'required|integer|exists:obras,idobras',
            'numero_requerimiento' => 'required|string|max:50|unique:requerimientos_obra,numero_requerimiento',
            'fecha_requerimiento' => 'required|date',
            'fecha_atencion' => 'nullable|date',
            'lugar_entrega' => 'nullable|string|max:255',
            'residente_obra' => 'required|string|max:200',
            'justificacion' => 'nullable|string',
            'detalles' => 'required|array|min:1',
            'detalles.*.fk_id_producto' => 'required|integer|exists:productos,id_producto',
            'detalles.*.cantidad' => 'required|numeric|min:0.01',
            'detalles.*.marca' => 'nullable|string|max:100',
            'detalles.*.color' => 'nullable|string|max:100',
            'detalles.*.tipo' => 'nullable|string|max:100',
            'detalles.*.calidad' => 'nullable|string|max:100',
            'detalles.*.medida' => 'nullable|string|max:100',
            'detalles.*.observaciones' => 'nullable|string',
        ], [
            'fk_idobras.required' => 'Debe seleccionar una obra',
            'fk_idobras.exists' => 'La obra seleccionada no existe',
            'numero_requerimiento.required' => 'El número de requerimiento es obligatorio',
            'numero_requerimiento.unique' => 'Este número de requerimiento ya existe',
            'fecha_requerimiento.required' => 'La fecha de requerimiento es obligatoria',
            'residente_obra.required' => 'El residente de obra es obligatorio',
            'detalles.required' => 'Debe agregar al menos un producto',
            'detalles.min' => 'Debe agregar al menos un producto',
            'detalles.*.fk_id_producto.required' => 'Debe seleccionar un producto',
            'detalles.*.fk_id_producto.exists' => 'El producto seleccionado no existe',
            'detalles.*.cantidad.required' => 'La cantidad es obligatoria',
            'detalles.*.cantidad.min' => 'La cantidad debe ser mayor a 0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Errores de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Crear el requerimiento principal
            $requerimiento = RequerimientoObra::create([
                'fk_idobras' => $request->fk_idobras,
                'numero_requerimiento' => $request->numero_requerimiento,
                'fecha_requerimiento' => $request->fecha_requerimiento,
                'fecha_atencion' => $request->fecha_atencion,
                'lugar_entrega' => $request->lugar_entrega,
                'residente_obra' => $request->residente_obra,
                'justificacion' => $request->justificacion,
                'estado' => 'pendiente'
            ]);

            // Crear los detalles
            foreach ($request->detalles as $detalle) {
                RequerimientoObraDetalle::create([
                    'fk_id_requerimiento_obra' => $requerimiento->id_requerimiento_obra,
                    'fk_id_producto' => $detalle['fk_id_producto'],
                    'cantidad' => $detalle['cantidad'],
                    'marca' => $detalle['marca'] ?? null,
                    'color' => $detalle['color'] ?? null,
                    'tipo' => $detalle['tipo'] ?? null,
                    'calidad' => $detalle['calidad'] ?? null,
                    'medida' => $detalle['medida'] ?? null,
                    'observaciones' => $detalle['observaciones'] ?? null,
                    'estado' => 'pendiente'
                ]);
            }

            DB::commit();

            // Cargar las relaciones para la respuesta
            $requerimiento->load(['obra', 'detalles.producto']);

            return response()->json([
                'success' => true,
                'message' => 'Requerimiento creado exitosamente',
                'data' => $requerimiento
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el requerimiento',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar un requerimiento de obra
     */
    public function update(Request $request, $id)
    {
        // Validación
        $validator = Validator::make($request->all(), [
            'fk_idobras' => 'required|integer|exists:obras,idobras',
            'numero_requerimiento' => 'required|string|max:50|unique:requerimientos_obra,numero_requerimiento,' . $id . ',id_requerimiento_obra',
            'fecha_requerimiento' => 'required|date',
            'fecha_atencion' => 'nullable|date',
            'lugar_entrega' => 'nullable|string|max:255',
            'residente_obra' => 'required|string|max:200',
            'justificacion' => 'nullable|string',
            'estado' => 'nullable|in:pendiente,aprobado,en_proceso,atendido,cancelado',
            'detalles' => 'required|array|min:1',
            'detalles.*.fk_id_producto' => 'required|integer|exists:productos,id_producto',
            'detalles.*.cantidad' => 'required|numeric|min:0.01',
            'detalles.*.marca' => 'nullable|string|max:100',
            'detalles.*.color' => 'nullable|string|max:100',
            'detalles.*.tipo' => 'nullable|string|max:100',
            'detalles.*.calidad' => 'nullable|string|max:100',
            'detalles.*.medida' => 'nullable|string|max:100',
            'detalles.*.observaciones' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Errores de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            $requerimiento = RequerimientoObra::findOrFail($id);

            // Actualizar el requerimiento principal
            $requerimiento->update([
                'fk_idobras' => $request->fk_idobras,
                'numero_requerimiento' => $request->numero_requerimiento,
                'fecha_requerimiento' => $request->fecha_requerimiento,
                'fecha_atencion' => $request->fecha_atencion,
                'lugar_entrega' => $request->lugar_entrega,
                'residente_obra' => $request->residente_obra,
                'justificacion' => $request->justificacion,
                'estado' => $request->estado ?? $requerimiento->estado
            ]);

            // Eliminar detalles anteriores
            $requerimiento->detalles()->delete();

            // Crear los nuevos detalles
            foreach ($request->detalles as $detalle) {
                RequerimientoObraDetalle::create([
                    'fk_id_requerimiento_obra' => $requerimiento->id_requerimiento_obra,
                    'fk_id_producto' => $detalle['fk_id_producto'],
                    'cantidad' => $detalle['cantidad'],
                    'marca' => $detalle['marca'] ?? null,
                    'color' => $detalle['color'] ?? null,
                    'tipo' => $detalle['tipo'] ?? null,
                    'calidad' => $detalle['calidad'] ?? null,
                    'medida' => $detalle['medida'] ?? null,
                    'observaciones' => $detalle['observaciones'] ?? null,
                    'estado' => $detalle['estado'] ?? 'pendiente'
                ]);
            }

            DB::commit();

            // Cargar las relaciones para la respuesta
            $requerimiento->load(['obra', 'detalles.producto']);

            return response()->json([
                'success' => true,
                'message' => 'Requerimiento actualizado exitosamente',
                'data' => $requerimiento
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el requerimiento',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar un requerimiento de obra
     */
    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $requerimiento = RequerimientoObra::findOrFail($id);

            // Los detalles se eliminan automáticamente por cascade
            $requerimiento->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Requerimiento eliminado exitosamente'
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el requerimiento',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cambiar el estado de un requerimiento
     */
    public function cambiarEstado(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'estado' => 'required|in:pendiente,aprobado,en_proceso,atendido,cancelado'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Estado inválido',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $requerimiento = RequerimientoObra::findOrFail($id);
            $requerimiento->update(['estado' => $request->estado]);

            return response()->json([
                'success' => true,
                'message' => 'Estado actualizado exitosamente',
                'data' => $requerimiento
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cambiar el estado',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Marcar detalle como entregado
     */
    public function marcarDetalleEntregado(Request $request, $idDetalle)
    {
        $validator = Validator::make($request->all(), [
            'cantidad_entregada' => 'required|numeric|min:0.01',
            'fecha_entrega' => 'nullable|date'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $detalle = RequerimientoObraDetalle::findOrFail($idDetalle);
            $detalle->marcarEntregado(
                $request->cantidad_entregada,
                $request->fecha_entrega ?? now()
            );

            return response()->json([
                'success' => true,
                'message' => 'Producto marcado como entregado',
                'data' => $detalle
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al marcar como entregado',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener obras para el select
     */
    public function obtenerObras()
    {
        try {
            $obras = Obra::select('idobras', 'nom_obra', 'codigo')
                ->orderBy('nom_obra')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $obras
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las obras',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener productos para el select
     */
    public function obtenerProductos()
    {
        try {
            $productos = Producto::select('id_producto', 'codigo', 'nombre', 'descripcion', 'unidad_medida')
                ->orderBy('nombre')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $productos
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los productos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generar reporte PDF del requerimiento de obra
     */
    public function generarPDF($id)
    {
        try {

            $existe = DB::table('requerimientos_obra')
                ->where('id_requerimiento_obra', $id)
                ->exists();
            if (!$existe) {
                return response()->json([
                    'success' => false,
                    'message' => 'Requerimiento no encontrado en la base de datos',
                    'error' => 'No existe requerimiento con ID: ' . $id
                ], 404);
            }

            // Usar el nombre completo del modelo para evitar conflictos
            $requerimiento = RequerimientoObra::with([
                'obra' => function ($query) {
                    $query->select('idobras', 'nom_obra', 'codigo');
                },
                'detalles' => function ($query) {
                    $query->with(['producto' => function ($q) {
                        $q->select('id_producto', 'nombre', 'codigo', 'unidad_medida');
                    }]);
                }
            ])->find($id);

            if (!$requerimiento) {

                return response()->json([
                    'success' => false,
                    'message' => 'Error al cargar el requerimiento',
                    'error' => 'El registro existe pero no se pudo cargar con el modelo'
                ], 500);
            }
            // Calcular totales y porcentajes
            $totalProductos = $requerimiento->detalles->count();
            $totalSolicitado = $requerimiento->detalles->sum('cantidad');
            $totalEntregado = $requerimiento->detalles->sum('cantidad_entregada');
            $porcentajeAvance = $totalSolicitado > 0 ? ($totalEntregado / $totalSolicitado) * 100 : 0;

            $data = [
                'requerimiento' => $requerimiento,
                'totalProductos' => $totalProductos,
                'totalSolicitado' => $totalSolicitado,
                'totalEntregado' => $totalEntregado,
                'porcentajeAvance' => round($porcentajeAvance, 2),
                'fecha_generacion' => now()->format('d/m/Y H:i:s')
            ];


            $pdf = Pdf::loadView('reportes.requerimiento-obra', $data);
            $pdf->setPaper('a4', 'portrait');

            $nombreArchivo = 'Requerimiento_' . $requerimiento->numero_requerimiento . '.pdf';


            return $pdf->download($nombreArchivo);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {

            return response()->json([
                'success' => false,
                'message' => 'Requerimiento de obra no encontrado',
                'error' => 'No se encontró el requerimiento con ID: ' . $id
            ], 404);
        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Error al generar el PDF',
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    /**
     * Generar reporte Excel del requerimiento de obra
     */
    public function generarExcel($id)
    {
        try {
            // Usar el nombre completo del modelo para evitar conflictos
            $requerimiento = RequerimientoObra::with([
                'obra' => function ($query) {
                    $query->select('idobras', 'nom_obra', 'codigo');
                },
                'detalles' => function ($query) {
                    $query->with(['producto' => function ($q) {
                        $q->select('id_producto', 'nombre', 'codigo', 'unidad_medida');
                    }]);
                }
            ])->findOrFail($id);

            $nombreArchivo = 'Requerimiento_' . $requerimiento->numero_requerimiento . '.xlsx';

            return Excel::download(new RequerimientoObraExport($requerimiento), $nombreArchivo);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Requerimiento de obra no encontrado',
                'error' => 'No se encontró el requerimiento con ID: ' . $id
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al generar el Excel',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
