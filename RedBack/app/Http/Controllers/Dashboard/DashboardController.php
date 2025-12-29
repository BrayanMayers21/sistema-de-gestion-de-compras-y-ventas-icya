<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Obra;
use App\Models\Producto;
use App\Models\OrdenesCompra;
use App\Models\OrdenDetalle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Display dashboard data.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        return response()->json([
            'message' => 'Dashboard data',
            'data' => []
        ]);
    }

    /**
     * Get all obras for selection.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getObras()
    {
        try {
            $obras = Obra::select('idobras', 'nom_obra', 'codigo')
                ->orderBy('nom_obra', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Obras obtenidas exitosamente',
                'data' => $obras
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las obras',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get products summary by obra with purchase quantities and images.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getProductosPorObra(Request $request)
    {
        try {
            $request->validate([
                'id_obra' => 'required|integer|exists:obras,idobras'
            ]);

            $idObra = $request->id_obra;

            // Obtener productos con sus cantidades compradas para esta obra
            $productos = Producto::select(
                'productos.id_producto',
                'productos.codigo',
                'productos.nombre',
                'productos.descripcion',
                'productos.unidad_medida',
                'productos.ruta_imagen',
                DB::raw('SUM(orden_detalle.cantidad) as total_comprado'),
                DB::raw('COUNT(DISTINCT ordenes_compra.id_orden) as total_ordenes'),
                DB::raw('SUM(orden_detalle.subtotal) as total_gastado')
            )
                ->join('orden_detalle', 'productos.id_producto', '=', 'orden_detalle.fk_id_producto')
                ->join('ordenes_compra', 'orden_detalle.fk_id_orden', '=', 'ordenes_compra.id_orden')
                ->where('ordenes_compra.fk_idobras', $idObra)
                ->groupBy(
                    'productos.id_producto',
                    'productos.codigo',
                    'productos.nombre',
                    'productos.descripcion',
                    'productos.unidad_medida',
                    'productos.ruta_imagen'
                )
                ->orderBy('total_comprado', 'desc')
                ->get();

            // Obtener estadísticas adicionales
            $totalOrdenes = OrdenesCompra::where('fk_idobras', $idObra)->count();
            $ordenesPendientes = OrdenesCompra::where('fk_idobras', $idObra)
                ->where('estado', 'Pendiente')
                ->count();
            $ordenesAprobadas = OrdenesCompra::where('fk_idobras', $idObra)
                ->where('estado', 'Aprobado')
                ->count();

            $totalGastado = OrdenesCompra::where('fk_idobras', $idObra)
                ->where('estado', 'Aprobado')
                ->sum('total');

            $totalPendiente = OrdenesCompra::where('fk_idobras', $idObra)
                ->where('estado', 'Pendiente')
                ->sum('total');

            // Obtener datos históricos por fecha (últimos 30 días)
            $gastosTemporales = OrdenesCompra::select(
                DB::raw('DATE(fecha_emision) as fecha'),
                DB::raw('SUM(CASE WHEN estado = "Aprobado" THEN total ELSE 0 END) as pagado'),
                DB::raw('SUM(CASE WHEN estado = "Pendiente" THEN total ELSE 0 END) as pendiente')
            )
                ->where('fk_idobras', $idObra)
                ->where('fecha_emision', '>=', DB::raw('DATE_SUB(NOW(), INTERVAL 30 DAY)'))
                ->groupBy(DB::raw('DATE(fecha_emision)'))
                ->orderBy('fecha', 'asc')
                ->get();

            // Formatear la respuesta
            $productosFormateados = $productos->map(function ($producto) {
                // Construir la URL completa de la imagen
                $imagenUrl = null;
                if ($producto->ruta_imagen) {
                    // Si la ruta ya es una URL completa, usarla directamente
                    if (filter_var($producto->ruta_imagen, FILTER_VALIDATE_URL)) {
                        $imagenUrl = $producto->ruta_imagen;
                    } else {
                        // Si es una ruta relativa, construir la URL
                        $imagenUrl = url('storage/' . $producto->ruta_imagen);
                    }
                }

                return [
                    'id_producto' => $producto->id_producto,
                    'codigo' => $producto->codigo,
                    'nombre' => $producto->nombre,
                    'descripcion' => $producto->descripcion,
                    'unidad_medida' => $producto->unidad_medida,
                    'imagen' => $imagenUrl,
                    'total_comprado' => floatval($producto->total_comprado),
                    'total_unidades' => floatval($producto->total_comprado), // Agregar total_unidades
                    'total_ordenes' => intval($producto->total_ordenes),
                    'total_gastado' => floatval($producto->total_gastado)
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Productos obtenidos exitosamente',
                'data' => $productosFormateados,
                'estadisticas' => [
                    'total_ordenes' => $totalOrdenes,
                    'ordenes_pendientes' => $ordenesPendientes,
                    'ordenes_aprobadas' => $ordenesAprobadas,
                    'total_gastado' => floatval($totalGastado),
                    'total_pendiente' => floatval($totalPendiente),
                ],
                'gastos_temporales' => $gastosTemporales->map(function ($item) {
                    return [
                        'fecha' => $item->fecha,
                        'pagado' => floatval($item->pagado),
                        'pendiente' => floatval($item->pendiente)
                    ];
                })
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los productos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get detailed summary of a specific product by obra.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDetalleProducto(Request $request)
    {
        try {
            $request->validate([
                'id_obra' => 'required|integer|exists:obras,idobras',
                'id_producto' => 'required|integer|exists:productos,id_producto'
            ]);

            $idObra = $request->id_obra;
            $idProducto = $request->id_producto;

            // Obtener información del producto
            $producto = Producto::with('categoria')->find($idProducto);

            // Obtener el resumen de compras
            $resumenCompras = OrdenDetalle::select(
                'ordenes_compra.numero_orden',
                'ordenes_compra.fecha_emision',
                'ordenes_compra.estado',
                'orden_detalle.cantidad',
                'orden_detalle.precio_unitario',
                'orden_detalle.subtotal'
            )
                ->join('ordenes_compra', 'orden_detalle.fk_id_orden', '=', 'ordenes_compra.id_orden')
                ->where('orden_detalle.fk_id_producto', $idProducto)
                ->where('ordenes_compra.fk_idobras', $idObra)
                ->orderBy('ordenes_compra.fecha_emision', 'desc')
                ->get();

            $totalComprado = $resumenCompras->sum('cantidad');
            $totalGastado = $resumenCompras->sum('subtotal');

            return response()->json([
                'success' => true,
                'message' => 'Detalle del producto obtenido exitosamente',
                'data' => [
                    'producto' => [
                        'id_producto' => $producto->id_producto,
                        'codigo' => $producto->codigo,
                        'nombre' => $producto->nombre,
                        'descripcion' => $producto->descripcion,
                        'unidad_medida' => $producto->unidad_medida,
                        'imagen' => $producto->ruta_imagen ? asset('storage/' . $producto->ruta_imagen) : null,
                        'categoria' => $producto->categoria ? $producto->categoria->nombre : null
                    ],
                    'resumen' => [
                        'total_comprado' => floatval($totalComprado),
                        'total_gastado' => floatval($totalGastado),
                        'total_ordenes' => $resumenCompras->count()
                    ],
                    'historial_compras' => $resumenCompras
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el detalle del producto',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get dashboard statistics.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function statistics()
    {
        return response()->json([
            'statistics' => []
        ]);
    }
}
