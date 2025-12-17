<?php

namespace App\Http\Controllers\Orden;

use App\Http\Controllers\Controller;
use App\Models\Archivo;
use App\Models\Obra;
use App\Models\OrdenDetalle;
use App\Models\OrdenesCompra;
use App\Models\TipoOrden;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;

class OrdenControllers extends Controller
{
    // Lista de órdenes
    public function listarOrdenesCompra(Request $request)
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
            $q = DB::table('ordenes_compra as oc')
                ->join('tipo_orden as t', 't.idtipo_orden', '=', 'oc.fk_idtipo_orden')
                ->join('obras as o', 'o.idobras', '=', 'oc.fk_idobras')
                ->join('proveedores as p', 'p.id_proveedor', '=', 'oc.fk_id_proveedor')
                ->select(
                    'oc.id_orden',
                    'oc.numero_orden',
                    'oc.fecha_emision',
                    'oc.fecha_entrega',
                    'oc.lugar_entrega',
                    'o.codigo',
                    'o.nom_obra',
                    'oc.estado',
                    'p.ruc',
                    'p.razon_social',
                    'p.contacto_telefono',
                    'oc.subtotal',
                    'oc.igv',
                    'oc.adelanto',
                    'oc.total',
                    'oc.fk_idtipo_orden',
                    't.nom_orden as tipo_orden'
                )
                ->orderBy('oc.id_orden', 'desc');
            // ->get(); // Descomenta esto si quieres obtener los resultados aquí mismo

            // Filtro de búsqueda
            if (!empty($validated['Buscar'])) {
                $buscar = trim($validated['Buscar']);
                $q->where(function ($w) use ($buscar) {
                    $w->where('oc.numero_orden', 'like', "%{$buscar}%")
                        ->orWhere('p.ruc', 'like', "%{$buscar}%")
                        ->orWhere('p.razon_social', 'like', "%{$buscar}%")
                        ->orWhere('o.codigo', 'like', "%{$buscar}%")
                        ->orWhere('o.nom_obra', 'like', "%{$buscar}%")
                        ->orWhere('oc.estado', 'like', "%{$buscar}%")
                        ->orWhere('oc.lugar_entrega', 'like', "%{$buscar}%");
                });
            }

            // Total antes de paginar
            $total = $q->count();

            // Paginación por offset/limit
            $data = $q->offset($validated['Limite_inferior'])
                ->limit($validated['Limite_Superior'])
                ->get();

            // Agregar información de archivos y porcentaje de completitud para cada orden
            $data = $data->map(function ($orden) {
                // Obtener archivos de la orden
                $archivos = DB::table('archivos')
                    ->where('fk_id_orden', $orden->id_orden)
                    ->select('tipo_archivo')
                    ->get()
                    ->pluck('tipo_archivo')
                    ->toArray();

                // Definir documentos requeridos según el tipo de orden
                // Para órdenes de COMPRA: cotización, guía, factura
                // Para órdenes de SERVICIO: cotización, reporte servicio, factura
                $tipoOrden = strtoupper($orden->tipo_orden ?? '');

                $documentosRequeridos = [];
                if ($tipoOrden === 'COMPRA') {
                    $documentosRequeridos = ['cotizacion', 'guia', 'factura'];
                } else if ($tipoOrden === 'SERVICIO') {
                    $documentosRequeridos = ['acta de contrato', 'reporte servicio', 'factura'];
                } else {
                    // Por defecto para cualquier otro tipo
                    $documentosRequeridos = ['cotizacion', 'factura', 'guia'];
                }

                // Calcular documentos presentes y faltantes
                $documentosPresentes = array_intersect($documentosRequeridos, $archivos);
                $documentosFaltantes = array_diff($documentosRequeridos, $archivos);

                // Calcular porcentaje
                $totalRequeridos = count($documentosRequeridos);
                $totalPresentes = count($documentosPresentes);
                $porcentaje = $totalRequeridos > 0
                    ? round(($totalPresentes / $totalRequeridos) * 100)
                    : 0;

                // Agregar información al objeto orden
                $orden->documentos_info = [
                    'requeridos' => $documentosRequeridos,
                    'presentes' => array_values($documentosPresentes),
                    'faltantes' => array_values($documentosFaltantes),
                    'porcentaje' => $porcentaje,
                    'completo' => $porcentaje === 100,
                ];

                return $orden;
            });

            return response()->json([
                'message' => 'Lista de órdenes de compra obtenida correctamente.',
                'data'    => $data,
                'total'   => $total,
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Error al listar las órdenes de compra: ' . $e->getMessage(),
            ], 500);
        }
    }
    // Obtener una orden específica con sus detalles
    public function DetalleOrden($id)
    {
        try {
            $orden = DB::table('ordenes_compra as oc')
                ->join('tipo_orden as t', 't.idtipo_orden', '=', 'oc.fk_idtipo_orden')
                ->join('orden_detalle as od', 'od.fk_id_orden', '=', 'oc.id_orden')
                ->join('productos as pro', 'pro.id_producto', '=', 'od.fk_id_producto')
                ->join('obras as o', 'o.idobras', '=', 'oc.fk_idobras')
                ->join('proveedores as p', 'p.id_proveedor', '=', 'oc.fk_id_proveedor')
                ->select(
                    'oc.id_orden',
                    'oc.numero_orden',
                    'oc.fecha_emision',
                    'oc.fecha_entrega',
                    'oc.lugar_entrega',
                    'o.codigo',
                    'o.nom_obra',
                    'oc.estado',
                    'p.ruc',
                    'p.razon_social',
                    'p.contacto_telefono',
                    'oc.subtotal',
                    'oc.igv',
                    'oc.adelanto',
                    'oc.total',
                    'od.id_detalle',
                    'od.cantidad',
                    'od.precio_unitario',
                    DB::raw('od.subtotal as subtotal_detalle'),
                    DB::raw('t.nom_orden as tipo_orden'),
                    DB::raw('pro.nombre as nombre_producto'),
                    DB::raw('pro.codigo as codigo_producto'),
                    'pro.unidad_medida'
                )
                ->where('oc.id_orden', $id)
                ->orderBy('oc.id_orden', 'desc')
                ->orderBy('od.id_detalle', 'asc')
                ->get();


            return response()->json([
                'success' => true,
                'data' => $orden
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener la orden: ' . $e->getMessage()
            ], 404);
        }
    }

    // create order
    public function createOrder(Request $request)
    {
        $request->validate([
            // ORDEN **********
            'fecha_emision' => 'required|date',
            'fecha_entrega' => 'required|date',
            'lugar_entrega' => 'required|string',
            'estado' => 'required|in:pendiente,pagado,rechazado',
            'subtotal' => 'required|numeric',
            'igv' => 'required|numeric',
            'adelanto' => 'required|numeric',
            'total' => 'required|numeric',
            'observaciones' => 'nullable|string',
            'fk_idobras' => 'required|integer',
            'fk_idtipo_orden' => 'required|integer',
            'fk_id_proveedor' => 'required|integer',

            //  DETALLE ORDEN ********** (Array de detalles)
            'detalles' => 'required|array|min:1',
            'detalles.*.cantidad' => 'required|numeric|min:0',
            'detalles.*.precio_unitario' => 'required|numeric|min:0',
            'detalles.*.subtotal_detalle' => 'required|numeric|min:0',
            'detalles.*.fk_id_producto' => 'required|integer|exists:productos,id_producto',

            // Archivos adjuntos (opcional) - Array de archivos con sus tipos
            'archivos' => 'sometimes|array',
            'archivos.*.archivo' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048', // Máximo 2MB por archivo
            'archivos.*.tipo_archivo' => 'required|in:cotizacion,factura,guia,reporte servicio,acta de contrato',
            'archivos.*.fecha_archivo' => 'nullable|date', // Fecha opcional, por defecto será hoy

        ]);
        $tipoOrden = TipoOrden::select('nom_orden')->where('idtipo_orden', $request->fk_idtipo_orden)->first();

        if ($tipoOrden->nom_orden == 'SERVICIO') {
            $year = date('Y');
            // Obtener la mayor secuencia existente para el año actual en el formato S-YYYY-XXXX
            $lastSeq = DB::table('ordenes_compra')
                ->where('numero_orden', 'like', "S-{$year}-%")
                ->selectRaw('MAX(CAST(SUBSTRING_INDEX(numero_orden, "-", -1) AS UNSIGNED)) as max')
                ->value('max');

            $lastSeq = (int) $lastSeq;
            $next = $lastSeq + 1;

            // Generar número de orden: S-AÑO-0001 (4 dígitos, relleno con ceros)
            $numeroOrden = sprintf('S-%s-%04d', $year, $next);
        } else {
            $year = date('Y');
            // Obtener la mayor secuencia existente para el año actual en el formato C-YYYY-XXXX
            $lastSeq = DB::table('ordenes_compra')
                ->where('numero_orden', 'like', "C-{$year}-%")
                ->selectRaw('MAX(CAST(SUBSTRING_INDEX(numero_orden, "-", -1) AS UNSIGNED)) as max')
                ->value('max');

            $lastSeq = (int) $lastSeq;
            $next = $lastSeq + 1;

            // Generar número de orden: C-AÑO-0001 (4 dígitos, relleno con ceros)
            $numeroOrden = sprintf('C-%s-%04d', $year, $next);
        }

        // Usar transacción para asegurar integridad de datos
        DB::beginTransaction();

        try {
            $orden = OrdenesCompra::create([
                'numero_orden' => $numeroOrden,
                'fecha_emision' => $request->fecha_emision,
                'fecha_entrega' => $request->fecha_entrega,
                'lugar_entrega' => $request->lugar_entrega,
                'estado' => $request->estado,
                'subtotal' => $request->subtotal,
                'igv' => $request->igv,
                'adelanto' => $request->adelanto,
                'total' => $request->total,
                'observaciones' => $request->observaciones,
                'usuario_registro' => Auth::user()->nomusu ?? 'Sistema',
                'fk_idobras' => $request->fk_idobras,
                'fk_idtipo_orden' => $request->fk_idtipo_orden,
                'fk_id_proveedor' => $request->fk_id_proveedor,
            ]);

            // Crear múltiples detalles de orden
            foreach ($request->detalles as $detalle) {
                OrdenDetalle::create([
                    'fecha_registro' => now(),
                    'cantidad' => $detalle['cantidad'],
                    'precio_unitario' => $detalle['precio_unitario'],
                    'subtotal' => $detalle['subtotal_detalle'],
                    'fk_id_orden' => $orden->id_orden,
                    'fk_id_producto' => $detalle['fk_id_producto'],
                ]);
            }

            // Procesar archivos adjuntos si existen
            if ($request->has('archivos') && is_array($request->archivos)) {
                foreach ($request->archivos as $archivoData) {
                    // Validar que el archivo y el tipo estén presentes
                    if (isset($archivoData['archivo']) && isset($archivoData['tipo_archivo'])) {
                        $archivo = $archivoData['archivo'];

                        // Generar nombre único para el archivo
                        $nombreOriginal = $archivo->getClientOriginalName();
                        $extension = $archivo->getClientOriginalExtension();
                        $nombreArchivo = time() . '_' . uniqid() . '_' . $nombreOriginal;

                        // Guardar el archivo en storage/app/public/ordenes_archivos
                        $rutaArchivo = $archivo->storeAs(
                            'ordenes_archivos/' . $orden->id_orden,
                            $nombreArchivo,
                            'public'
                        );

                        // Crear registro en la base de datos
                        Archivo::create([
                            'fecha_archivo' => $archivoData['fecha_archivo'] ?? now(),
                            'tipo_archivo' => $archivoData['tipo_archivo'],
                            'ruta_archivo' => $rutaArchivo,
                            'fk_id_orden' => $orden->id_orden,
                        ]);
                    }
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Orden creada exitosamente',
                'data' => [
                    'orden' => $orden,
                    'numero_orden' => $numeroOrden
                ]
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al crear la orden: ' . $e->getMessage()
            ], 500);
        }
    }

    // update order
    public function updateOrder(Request $request, $id)
    {
        $request->validate([
            // ORDEN **********
            'fecha_emision' => 'sometimes|required|date',
            'fecha_entrega' => 'sometimes|required|date',
            'lugar_entrega' => 'sometimes|required|string',
            'estado' => 'sometimes|required|in:servicio,reporte,factura',
            'subtotal' => 'sometimes|required|numeric',
            'igv' => 'sometimes|required|numeric',
            'total' => 'sometimes|required|numeric',
            'observaciones' => 'nullable|string',
            'usuario_registro' => 'sometimes|required|string|max:100',
            'fk_idobras' => 'sometimes|required|integer',
            'fk_idtipo_orden' => 'sometimes|required|integer',
            'fk_id_proveedor' => 'sometimes|required|integer',

            //  DETALLE ORDEN ********** (Array de detalles)
            'detalles' => 'sometimes|array|min:1',
            'detalles.*.id_detalle' => 'sometimes|integer|exists:orden_detalle,id_detalle',
            'detalles.*.cantidad' => 'required|numeric|min:0',
            'detalles.*.precio_unitario' => 'required|numeric|min:0',
            'detalles.*.subtotal_detalle' => 'required|numeric|min:0',
            'detalles.*.fk_id_producto' => 'required|integer|exists:productos,id_producto',

            // Archivos adjuntos (opcional) - Array de archivos con sus tipos
            'archivos' => 'sometimes|array',
            'archivos.*.archivo' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'archivos.*.tipo_archivo' => 'required|in:cotizacion,factura,guia,reporte servicio,acta de contrato',
            'archivos.*.fecha_archivo' => 'nullable|date',
        ]);

        DB::beginTransaction();

        try {
            $orden = OrdenesCompra::findOrFail($id);

            // Actualizar datos de la orden
            $orden->update($request->only([
                'fecha_emision',
                'fecha_entrega',
                'lugar_entrega',
                'estado',
                'subtotal',
                'igv',
                'adelanto',
                'total',
                'observaciones',
                'fk_idobras',
                'fk_idtipo_orden',
                'fk_id_proveedor'
            ]));

            // Si se envían detalles, actualizarlos
            if ($request->has('detalles')) {
                // Eliminar detalles existentes que no están en la nueva lista
                $nuevosIds = collect($request->detalles)
                    ->pluck('id_detalle')
                    ->filter()
                    ->toArray();

                if (!empty($nuevosIds)) {
                    $orden->orden_detalles()
                        ->whereNotIn('id_detalle', $nuevosIds)
                        ->delete();
                }

                foreach ($request->detalles as $detalle) {
                    if (isset($detalle['id_detalle'])) {
                        // Actualizar detalle existente
                        OrdenDetalle::where('id_detalle', $detalle['id_detalle'])
                            ->update([
                                'cantidad' => $detalle['cantidad'],
                                'precio_unitario' => $detalle['precio_unitario'],
                                'subtotal' => $detalle['subtotal_detalle'],
                                'fk_id_producto' => $detalle['fk_id_producto'],
                            ]);
                    } else {
                        // Crear nuevo detalle
                        OrdenDetalle::create([
                            'fecha_registro' => now(),
                            'cantidad' => $detalle['cantidad'],
                            'precio_unitario' => $detalle['precio_unitario'],
                            'subtotal' => $detalle['subtotal_detalle'],
                            'fk_id_orden' => $orden->id_orden,
                            'fk_id_producto' => $detalle['fk_id_producto'],
                        ]);
                    }
                }
            }

            // Procesar nuevos archivos adjuntos si existen
            if ($request->has('archivos') && is_array($request->archivos)) {
                foreach ($request->archivos as $archivoData) {
                    if (isset($archivoData['archivo']) && isset($archivoData['tipo_archivo'])) {
                        $archivo = $archivoData['archivo'];

                        $nombreOriginal = $archivo->getClientOriginalName();
                        $extension = $archivo->getClientOriginalExtension();
                        $nombreArchivo = time() . '_' . uniqid() . '_' . $nombreOriginal;

                        $rutaArchivo = $archivo->storeAs(
                            'ordenes_archivos/' . $orden->id_orden,
                            $nombreArchivo,
                            'public'
                        );

                        Archivo::create([
                            'fecha_archivo' => $archivoData['fecha_archivo'] ?? now(),
                            'tipo_archivo' => $archivoData['tipo_archivo'],
                            'ruta_archivo' => $rutaArchivo,
                            'fk_id_orden' => $orden->id_orden,
                        ]);
                    }
                }
            }


            DB::commit();

            // Cargar la orden actualizada con sus detalles
            $orden->load('orden_detalles.producto');

            return response()->json([
                'success' => true,
                'message' => 'Orden actualizada exitosamente',
                'data' => $orden
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la orden: ' . $e->getMessage()
            ], 500);
        }
    }

    // delete order
    public function deleteOrder($id)
    {
        DB::beginTransaction();

        try {
            $orden = OrdenesCompra::findOrFail($id);

            // Eliminar archivos físicos asociados a la orden
            $archivos = $orden->archivos;
            foreach ($archivos as $archivo) {
                if (Storage::disk('public')->exists($archivo->ruta_archivo)) {
                    Storage::disk('public')->delete($archivo->ruta_archivo);
                }
                $archivo->delete();
            }

            // Eliminar todos los detalles de la orden
            $orden->orden_detalles()->delete();

            // Eliminar la orden
            $orden->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Orden eliminada exitosamente'
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la orden: ' . $e->getMessage()
            ], 500);
        }
    }

    // ********************* MÉTODOS PARA OBTENER OPCIONES DE SELECTS ********************* //

    /**
     * Listar proveedores para el select
     */
    public function listarProveedores()
    {
        try {
            $proveedores = DB::table('proveedores')
                ->select('id_proveedor', 'ruc', 'razon_social', 'contacto_telefono')
                ->where('estado', '!=', 'inactivo') // Filtrar solo proveedores activos
                ->orderBy('razon_social')
                ->get();

            return response()->json([
                'message' => 'Proveedores obtenidos correctamente.',
                'data' => $proveedores,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al obtener proveedores: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Listar tipos de orden para el select
     */
    public function listarTiposOrden()
    {
        try {
            $tipos = DB::table('tipo_orden')
                ->select('idtipo_orden', 'nom_orden')
                ->orderBy('nom_orden')
                ->get();

            return response()->json([
                'message' => 'Tipos de orden obtenidos correctamente.',
                'data' => $tipos,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al obtener tipos de orden: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Listar productos para el select
     */
    public function listarProductos()
    {
        try {
            $productos = DB::table('productos')
                ->select('id_producto', 'codigo', 'nombre', 'descripcion')
                ->orderBy('nombre')
                ->get();

            return response()->json([
                'message' => 'Productos obtenidos correctamente.',
                'data' => $productos,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al obtener productos: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Listar códigos contables para el select
     */
    public function listarCodigosContables()
    {
        try {
            $codigos = Obra::all();
            return response()->json([
                'message' => 'Códigos contables obtenidos correctamente.',
                'data' => $codigos,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al obtener códigos contables: ' . $e->getMessage(),
            ], 500);
        }
    }

    // ********************* MÉTODOS PARA GESTIÓN DE ARCHIVOS ********************* //

    /**
     * Listar archivos de una orden específica
     */
    public function listarArchivosOrden($id)
    {
        try {
            $archivos = DB::table('archivos')
                ->where('fk_id_orden', $id)
                ->select('idarchivos', 'fecha_archivo', 'tipo_archivo', 'ruta_archivo')
                ->orderBy('fecha_archivo', 'desc')
                ->get();

            // Agregar URLs públicas para cada archivo
            $archivos = $archivos->map(function ($archivo) {
                $archivo->url = Storage::url($archivo->ruta_archivo);
                return $archivo;
            });

            return response()->json([
                'success' => true,
                'message' => 'Archivos obtenidos correctamente.',
                'data' => $archivos,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener archivos: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Eliminar un archivo específico de una orden
     */
    public function eliminarArchivoOrden($idArchivo)
    {
        DB::beginTransaction();

        try {
            $archivo = Archivo::findOrFail($idArchivo);

            // Eliminar archivo físico del storage
            if (Storage::disk('public')->exists($archivo->ruta_archivo)) {
                Storage::disk('public')->delete($archivo->ruta_archivo);
            }

            // Eliminar registro de la base de datos
            $archivo->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Archivo eliminado exitosamente'
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el archivo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Descargar un archivo específico
     */
    public function descargarArchivo($idArchivo)
    {
        try {
            $archivo = Archivo::findOrFail($idArchivo);

            // Verificar que el archivo existe en el storage
            if (!Storage::disk('public')->exists($archivo->ruta_archivo)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Archivo no encontrado en el servidor'
                ], 404);
            }

            // Obtener la ruta completa del archivo
            $rutaCompleta = Storage::disk('public')->path($archivo->ruta_archivo);
            $nombreOriginal = basename($archivo->ruta_archivo);

            // Descargar el archivo
            return response()->download($rutaCompleta, $nombreOriginal);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al descargar el archivo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generar PDF de la orden de compra/servicio
     */
    public function generarPdfOrden(Request $request, $id)
    {
        try {
            // Obtener la orden con todas sus relaciones
            $orden = DB::table('ordenes_compra as oc')
                ->join('tipo_orden as t', 't.idtipo_orden', '=', 'oc.fk_idtipo_orden')
                ->join('obras as o', 'o.idobras', '=', 'oc.fk_idobras')
                ->join('proveedores as p', 'p.id_proveedor', '=', 'oc.fk_id_proveedor')
                ->where('oc.id_orden', $id)
                ->select(
                    'oc.*',
                    't.nom_orden as tipo_orden',
                    'o.codigo as codigo_obra',
                    'o.nom_obra',
                    'p.ruc as proveedor_ruc',
                    'p.razon_social as proveedor_razon_social',
                    'p.contacto_telefono as proveedor_telefono'
                )
                ->first();

            if (!$orden) {
                return response()->json([
                    'error' => 'Orden no encontrada'
                ], 404);
            }

            // Obtener los detalles de la orden
            $detalles = DB::table('orden_detalle as od')
                ->join('productos as p', 'p.id_producto', '=', 'od.fk_id_producto')
                ->where('od.fk_id_orden', $id)
                ->select(
                    'od.*',
                    'p.codigo as producto_codigo',
                    'p.nombre as producto_nombre',
                    'p.descripcion as producto_descripcion'
                )
                ->get();

            // Determinar el tipo de documento
            $tipoDocumento = strtoupper($orden->tipo_orden);
            $tituloDocumento = $tipoDocumento === 'SERVICIO' ? 'ORDEN DE SERVICIO' : 'ORDEN DE COMPRA';

            $data = [
                'orden' => $orden,
                'detalles' => $detalles,
                'tipoDocumento' => $tipoDocumento,
                'tituloDocumento' => $tituloDocumento
            ];

            $pdf = PDF::loadView('pdf.orden-compra', $data);
            $pdf->setPaper('A4', 'portrait');

            $nombreArchivo = strtolower($tipoDocumento) . '_' . $orden->numero_orden . '.pdf';

            return $pdf->download($nombreArchivo);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al generar el PDF: ' . $e->getMessage()
            ], 500);
        }
    }
}
