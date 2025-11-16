<?php

namespace App\Http\Controllers\Requerimientos;

use App\Http\Controllers\Controller;
use App\Models\DetallesRequerimiento;
use App\Models\Requerimiento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Barryvdh\DomPDF\Facade\Pdf;

class RequerimientosControllers extends Controller
{
    // lista de requerimientos
    public function listarRequerimientos(Request $request)
    {
        try {
            // Validación de entradas
            $validated = $request->validate([
                'Limite_inferior' => 'required|integer|min:0',
                'Limite_Superior' => 'required|integer|min:1',
                'Buscar'          => 'nullable|string|max:255',
            ], [
                'Limite_inferior.required' => 'El límite inferior es obligatorio.',
                'Limite_Superior.required' => 'El límite superior es obligatorio.',
                'Limite_inferior.integer'  => 'Debe ser un número entero.',
                'Limite_Superior.integer'  => 'Debe ser un número entero.',
            ]);

            // Base de la consulta (equivalente a tu SQL)
            $q = DB::table('requerimientos as r')
                ->join('detalles_requerimientos as dr', 'dr.fk_idrequerimientos', '=', 'r.idrequerimientos')
                ->join('productos as p', 'p.id_producto', '=', 'dr.fk_id_producto')
                ->join('proveedores as pro', 'pro.id_proveedor', '=', 'r.fk_id_proveedor')
                ->select(
                    'r.idrequerimientos as id',
                    'p.nombre as producto',
                    'p.unidad_medida',
                    'p.descripcion as descripcion_producto',
                    'dr.cantidad',
                    'r.observaciones',
                    'pro.razon_social as proveedor'
                )
                ->orderBy('r.idrequerimientos', 'desc');

            // Filtro de búsqueda
            if (!empty($validated['Buscar'])) {
                $buscar = trim($validated['Buscar']);
                $q->where(function ($w) use ($buscar) {
                    $w->where('r.idrequerimientos', 'like', "%{$buscar}%")
                        ->orWhere('p.nombre', 'like', "%{$buscar}%")
                        ->orWhere('p.unidad_medida', 'like', "%{$buscar}%")
                        ->orWhere('p.descripcion', 'like', "%{$buscar}%")
                        ->orWhere('r.observaciones', 'like', "%{$buscar}%")
                        ->orWhere('pro.razon_social', 'like', "%{$buscar}%");
                    // Si deseas permitir buscar por cantidad (numérico):
                    // ->orWhereRaw('CAST(dr.cantidad AS CHAR) LIKE ?', ["%{$buscar}%"]);
                });
            }

            // Total antes de paginar (cuenta líneas de detalle que cumplen filtros)
            $total = (clone $q)->count();

            // Paginación por offset/limit
            $data = $q->offset($validated['Limite_inferior'])
                ->limit($validated['Limite_Superior'])
                ->get();

            return response()->json([
                'message' => 'Lista de requerimientos (detalle) obtenida correctamente.',
                'data'    => $data,
                'total'   => $total,
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Error al listar los requerimientos: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Genera un número de requerimiento secuencial con formato COT YYYY-NNNNN
     */
    private function generarNumeroRequerimiento()
    {
        $anioActual = date('Y');
        $prefijo = "COT {$anioActual}-";

        // Buscar el último número de requerimiento del año actual
        $ultimoRequerimiento = DB::table('requerimientos')
            ->where('numero_requerimiento', 'LIKE', "{$prefijo}%")
            ->orderBy('numero_requerimiento', 'desc')
            ->first();

        if ($ultimoRequerimiento) {
            // Extraer el número secuencial del último requerimiento
            $ultimoNumero = str_replace($prefijo, '', $ultimoRequerimiento->numero_requerimiento);
            $siguienteNumero = intval($ultimoNumero) + 1;
        } else {
            // Si no hay requerimientos del año actual, empezar en 1
            $siguienteNumero = 1;
        }

        // Formatear el número con 5 dígitos (00001, 00002, etc.)
        $numeroFormateado = str_pad($siguienteNumero, 5, '0', STR_PAD_LEFT);

        return $prefijo . $numeroFormateado;
    }
    // crear requerimiento
    public function crearRequerimiento(Request $request)
    {
        try {
            $validated = $request->validate([
                'fk_id_proveedor'            => 'required|integer|exists:proveedores,id_proveedor',
                'observaciones'              => 'nullable|string|max:500',

                // Array de detalles
                'detalles'                   => 'required|array|min:1',
                'detalles.*.fk_id_producto'  => 'required|integer|exists:productos,id_producto',
                'detalles.*.cantidad'        => 'required|numeric|min:1',
                'detalles.*.observaciones'   => 'nullable|string|max:500',
            ], [
                'fk_id_proveedor.required' => 'El proveedor es obligatorio.',
                'fk_id_proveedor.exists'   => 'El proveedor seleccionado no existe.',
                'detalles.required'        => 'Debe enviar al menos un detalle.',
                'detalles.array'           => 'Los detalles deben venir en formato de arreglo.',
                'detalles.*.fk_id_producto.required' => 'El producto es obligatorio.',
                'detalles.*.fk_id_producto.exists'   => 'El producto seleccionado no existe.',
                'detalles.*.cantidad.required'       => 'La cantidad es obligatoria.',
                'detalles.*.cantidad.numeric'        => 'La cantidad debe ser un número.',
                'detalles.*.cantidad.min'            => 'La cantidad debe ser mayor a 0.',
                'observaciones.max'                  => 'Las observaciones no pueden exceder 500 caracteres.',
            ]);

            return DB::transaction(function () use ($validated) {
                // Cabecera
                $requerimiento = Requerimiento::create([
                    'fecha_requerimiento'  => now()->toDateString(),
                    'numero_requerimiento' => $this->generarNumeroRequerimiento(),
                    'fk_id_proveedor'      => $validated['fk_id_proveedor'],
                    'observaciones'        => $validated['observaciones'] ?? null,
                ]);

                // Mapear e insertar los detalles (bulk insert)
                $rows = collect($validated['detalles'])->map(function ($d) use ($requerimiento) {
                    return [
                        'fecha_detalle'        => now()->toDateString(),
                        'cantidad'             => $d['cantidad'],
                        'observaciones'        => $d['observaciones'] ?? null,
                        'fk_idrequerimientos'  => $requerimiento->idrequerimientos, // OJO: nombre de columna tal cual tu BD
                        'fk_id_producto'       => $d['fk_id_producto'],
                    ];
                })->all();

                DetallesRequerimiento::insert($rows);

                // Recargar el requerimiento con sus detalles y productos
                $requerimiento->load(['detalles.producto']);

                return response()->json([
                    'message' => 'Requerimiento creado correctamente.',
                    'data' => [
                        'id'                   => $requerimiento->idrequerimientos,
                        'numero'               => $requerimiento->numero_requerimiento,
                        'fk_id_proveedor'      => $requerimiento->fk_id_proveedor,
                        'observaciones'        => $requerimiento->observaciones,
                        'detalles'             => $requerimiento->detalles->map(function ($det) {
                            return [
                                'id_detalle'          => $det->iddetalles_requerimientos,
                                'fk_id_producto'      => $det->fk_id_producto,
                                'cantidad'            => $det->cantidad,
                                'observaciones'       => $det->observaciones,
                                'producto'            => [
                                    'id'              => $det->producto->id_producto,
                                    'codigo'          => $det->producto->codigo,
                                    'nombre'          => $det->producto->nombre,
                                    'unidad_medida'   => $det->producto->unidad_medida,
                                ]
                            ];
                        }),
                    ],
                ], 201);
            });
        } catch (ValidationException $e) {
            return response()->json([
                'error'  => 'Datos de validación incorrectos.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Error al crear el requerimiento: ' . $e->getMessage(),
            ], 500);
        }
    }

    // ACTUALIZAR Y ELIMINAR REQUERIMIENTOS PENDIENTES...
    public function actualizarRequerimiento(Request $request, $id)
    {
        //
    }

    public function eliminarRequerimiento($id)
    {
        try {
            return DB::transaction(function () use ($id) {
                // Buscar el requerimiento
                $requerimiento = Requerimiento::findOrFail($id);

                // Eliminar detalles asociados
                DetallesRequerimiento::where('fk_idrequerimientos', $requerimiento->idrequerimientos)->delete();

                // Eliminar el requerimiento
                $requerimiento->delete();

                return response()->json([
                    'message' => 'Requerimiento eliminado correctamente.',
                ], 200);
            });
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Error al eliminar el requerimiento: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener precio estimado para un producto (puedes personalizar esta lógica)
     */
    private function obtenerPrecioEstimado($producto)
    {
        // Aquí puedes implementar tu lógica para obtener precios reales
        // Por ejemplo, desde una tabla de precios, cotizaciones anteriores, etc.

        // Por ahora, asignamos precios estimados basados en palabras clave del producto
        $nombre = strtolower($producto->nombre);
        $descripcion = strtolower($producto->descripcion ?? '');

        // Obtener precios desde configuración
        $preciosEstimados = config('reportes_pdf.precios_estimados');

        foreach ($preciosEstimados as $keyword => $precio) {
            if (
                $keyword !== 'por_defecto' &&
                (strpos($nombre, $keyword) !== false || strpos($descripcion, $keyword) !== false)
            ) {
                return $precio;
            }
        }

        // Precio por defecto desde configuración
        return $preciosEstimados['por_defecto'];
    }
    /**
     * Generar reporte PDF de solicitud de cotización
     */
    public function generarReportePDF($id)
    {
        try {
            // Obtener el requerimiento con sus relaciones
            $requerimiento = Requerimiento::with([
                'proveedore',
                'detalles.producto'
            ])->findOrFail($id);

            // Calcular subtotal e impuestos
            $subtotal = 0;
            $detallesConPrecios = $requerimiento->detalles->map(function ($detalle) use (&$subtotal) {
                // Precio unitario estimado - puedes obtener de una tabla de precios o usar valores por defecto
                // Por ahora usamos valores estimados basados en el tipo de producto
                $precioUnitario = $this->obtenerPrecioEstimado($detalle->producto);
                $total = $detalle->cantidad * $precioUnitario;
                $subtotal += $total;

                return [
                    'cantidad' => $detalle->cantidad,
                    'descripcion' => $detalle->producto->nombre,
                    'unidad_medida' => $detalle->producto->unidad_medida,
                    'observaciones' => $detalle->observaciones,
                    'precio_unitario' => number_format($precioUnitario, 0, ',', '.'),
                    'total' => number_format($total, 0, ',', '.'),
                ];
            });

            $impuesto = $subtotal * config('reportes_pdf.impuestos.iva', 0.19);
            $totalAPagar = $subtotal + $impuesto;

            $datos = [
                'requerimiento' => $requerimiento,
                'proveedor' => $requerimiento->proveedore,
                'detalles' => $detallesConPrecios,
                'subtotal' => number_format($subtotal, 0, ',', '.'),
                'impuesto' => number_format($impuesto, 0, ',', '.'),
                'total_a_pagar' => number_format($totalAPagar, 0, ',', '.'),
                'fecha_actual' => now()->format('d/m/Y'),
            ];

            // Generar PDF
            $plantilla = config('reportes_pdf.archivos.plantilla', 'reportes.solicitud_cotizacion');
            $pdf = Pdf::loadView($plantilla, $datos);

            $papel = config('reportes_pdf.pdf.papel', 'A4');
            $orientacion = config('reportes_pdf.pdf.orientacion', 'portrait');
            $pdf->setPaper($papel, $orientacion);

            // Nombre del archivo
            $prefijo = config('reportes_pdf.archivos.prefijo_nombre', 'solicitud_cotizacion_');
            $sufijo = config('reportes_pdf.archivos.sufijo_nombre', '');
            $nombreArchivo = $prefijo . $requerimiento->numero_requerimiento . $sufijo . '.pdf';

            return $pdf->download($nombreArchivo);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Error al generar el reporte PDF: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Ver reporte PDF en el navegador (sin descargar)
     */
    public function verReportePDF($id)
    {
        try {
            // Obtener el requerimiento con sus relaciones
            $requerimiento = Requerimiento::with([
                'proveedore',
                'detalles.producto'
            ])->findOrFail($id);

            // Calcular subtotal e impuestos
            $subtotal = 0;
            $detallesConPrecios = $requerimiento->detalles->map(function ($detalle) use (&$subtotal) {
                $precioUnitario = $this->obtenerPrecioEstimado($detalle->producto);
                $total = $detalle->cantidad * $precioUnitario;
                $subtotal += $total;

                return [
                    'cantidad' => $detalle->cantidad,
                    'descripcion' => $detalle->producto->nombre,
                    'unidad_medida' => $detalle->producto->unidad_medida,
                    'precio_unitario' => number_format($precioUnitario, 0, ',', '.'),
                    'total' => number_format($total, 0, ',', '.'),
                ];
            });

            $impuesto = $subtotal * config('reportes_pdf.impuestos.iva', 0.19);
            $totalAPagar = $subtotal + $impuesto;

            $datos = [
                'requerimiento' => $requerimiento,
                'proveedor' => $requerimiento->proveedore,
                'detalles' => $detallesConPrecios,
                'subtotal' => number_format($subtotal, 0, ',', '.'),
                'impuesto' => number_format($impuesto, 0, ',', '.'),
                'total_a_pagar' => number_format($totalAPagar, 0, ',', '.'),
                'fecha_actual' => now()->format('d/m/Y'),
            ];

            // Generar PDF y mostrar en navegador
            $plantilla = config('reportes_pdf.archivos.plantilla', 'reportes.solicitud_cotizacion');
            $pdf = Pdf::loadView($plantilla, $datos);

            $papel = config('reportes_pdf.pdf.papel', 'A4');
            $orientacion = config('reportes_pdf.pdf.orientacion', 'portrait');
            $pdf->setPaper($papel, $orientacion);

            return $pdf->stream('solicitud_cotizacion_' . $requerimiento->numero_requerimiento . '.pdf');
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Error al mostrar el reporte PDF: ' . $e->getMessage(),
            ], 500);
        }
    }
}
