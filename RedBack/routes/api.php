<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\ValidateController;
use App\Http\Controllers\AsistenciaEmpleado\AsistenciaEmpleadoController;
use App\Http\Controllers\Categorias\CategoriaControllers;
use App\Http\Controllers\CotizacionAntamina\CotizacionAntaminaControllers;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Empleados\EmpleadosController;
use App\Http\Controllers\Obras\ObrasControllers;
use App\Http\Controllers\Orden\OrdenControllers;
use App\Http\Controllers\Productos\ProductosControllers;
use App\Http\Controllers\Requerimientos\RequerimientosControllers;
use App\Http\Controllers\RequerimientoObraController;
use App\Http\Controllers\Traduccion\TraduccionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

route::post('/login', [LoginController::class, 'login']);
// Traducción pública
Route::post('/traduccion', [TraduccionController::class, 'traducir']);

// PDF público (con token en query param)
Route::get('/ordenCompra-pdf-public/{id}', [OrdenControllers::class, 'generarPdfOrden']);

Route::middleware(['check.jwt'])->group(function () {



    Route::post('/verificar-token', [ValidateController::class, 'verificarToken']);
    Route::post('/renovar-token', [ValidateController::class, 'renovarToken']);

    Route::post('/logout', [ValidateController::class, 'LogOut']);
    Route::get('/user', function () {
        return response()->json(['message' => 'Usuario listados correctamente.']);
    });

    Route::middleware(['check.permission:usuarios.view'])->group(function () {

        Route::get('/usuarios', function () {
            return response()->json(['message' => 'Usuarios listados correctamente.']);
        });
    });

    // ********************* ORDENES DE COMPRA ********************* //
    Route::get('/ordenCompra-listar', [OrdenControllers::class, 'listarOrdenesCompra']);
    Route::get('/ordenCompra-mostrar/{id}', [OrdenControllers::class, 'DetalleOrden']);
    Route::post('/ordenCompra-create', [OrdenControllers::class, 'createOrder']);
    Route::put('/ordenCompra-update/{id}', [OrdenControllers::class, 'updateOrder']);
    Route::delete('/ordenCompra-eliminar/{id}', [OrdenControllers::class, 'deleteOrder']);
    Route::get('/ordenCompra-pdf/{id}', [OrdenControllers::class, 'generarPdfOrden']);

    // Rutas para gestión de archivos de órdenes
    Route::get('/ordenCompra-archivos/{id}', [OrdenControllers::class, 'listarArchivosOrden']);
    Route::delete('/ordenCompra-archivo-eliminar/{idArchivo}', [OrdenControllers::class, 'eliminarArchivoOrden']);
    Route::get('/ordenCompra-archivo-descargar/{idArchivo}', [OrdenControllers::class, 'descargarArchivo']);

    // Rutas para obtener opciones de selects
    Route::get('/proveedores-listar', [OrdenControllers::class, 'listarProveedores']);
    Route::get('/tipos-orden-listar', [OrdenControllers::class, 'listarTiposOrden']);
    Route::get('/productos-listar', [OrdenControllers::class, 'listarProductos']);
    Route::get('/contables-listar', [OrdenControllers::class, 'listarCodigosContables']);


    // ******************************** CATEGORIAS ******************************** //
    Route::middleware(['check.permission:categorias.view'])->group(function () {
        Route::get('/categorias-mostrar/{id}', [CategoriaControllers::class, 'mostrarCategoria']);
        Route::get('/categorias-listar', [CategoriaControllers::class, 'listarCategorias']);
    });
    Route::middleware(['check.permission:categorias.create'])->group(function () {
        Route::post('/categorias-crear', [CategoriaControllers::class, 'crearCategoria']);
    });

    Route::middleware(['check.permission:categorias.update'])->group(function () {
        Route::put('/categorias-actualizar/{id}', [CategoriaControllers::class, 'actualizarCategoria']);
    });
    Route::middleware(['check.permission:categorias.delete'])->group(function () {
        Route::delete('/categorias-eliminar/{id}', [CategoriaControllers::class, 'eliminarCategoria']);
    });

    // ********************* PRODUCTOS ********************* //
    Route::middleware(['check.permission:productos.view'])->group(function () {
        Route::get('/productos-mostrar/{id}', [ProductosControllers::class, 'mostrarProducto']);
        Route::get('/productos-materiales', [ProductosControllers::class, 'listarProductos']);
        Route::get('/productos-categorias', [ProductosControllers::class, 'listarCategorias']);
        Route::get('/productos/imagen/{id}', [ProductosControllers::class, 'obtenerImagen']);
        Route::get('/productos-plantilla-excel', [ProductosControllers::class, 'descargarPlantillaExcel']);
    });

    Route::middleware(['check.permission:productos.create'])->group(function () {
        Route::post('/productos-crear', [ProductosControllers::class, 'crearProducto']);
        Route::post('/productos-importar-excel', [ProductosControllers::class, 'importarExcel']);
    });

    Route::middleware(['check.permission:productos.update'])->group(function () {
        Route::put('/productos-actualizar/{id}', [ProductosControllers::class, 'editarProducto']);
    });
    Route::middleware(['check.permission:productos.delete'])->group(function () {
        Route::delete('/productos-eliminar/{id}', [ProductosControllers::class, 'eliminarProducto']);
    });

    // ********************* OBRAS ********************* //
    Route::middleware(['check.permission:productos.view'])->group(function () {
        Route::get('/obras-listar', [ObrasControllers::class, 'ListarObras']);
    });

    Route::middleware(['check.permission:productos.create'])->group(function () {
        Route::post('/obras-crear', [ObrasControllers::class, 'CrearObra']);
    });

    Route::middleware(['check.permission:productos.update'])->group(function () {
        Route::put('/obras-actualizar', [ObrasControllers::class, 'ActualizarObra']);
    });

    Route::middleware(['check.permission:productos.delete'])->group(function () {
        Route::delete('/obras-eliminar/{id}', [ObrasControllers::class, 'eliminarObra']);
    });

    // ********************* REQUERIMIENTOS ********************* //

    Route::get('/requerimientos-listar', [RequerimientosControllers::class, 'listarRequerimientos']);
    Route::post('/requerimientos-crear', [RequerimientosControllers::class, 'crearRequerimiento']);
    Route::delete('/requerimientos-eliminar/{id}', [RequerimientosControllers::class, 'eliminarRequerimiento']);
    Route::get('/requerimientos-pdf/{id}', [RequerimientosControllers::class, 'generarReportePDF']);
    Route::get('/requerimientos-ver-pdf/{id}', [RequerimientosControllers::class, 'verReportePDF']);

    // ********************* COTIZACIONES ANTAMINA ********************* //
    Route::get('/cotizacion-antamina/list', [CotizacionAntaminaControllers::class, 'listCotizaciones']);
    Route::post('/cotizacion-antamina/create', [CotizacionAntaminaControllers::class, 'createCotizacion']);
    Route::get('/cotizacion-antamina/show/{id}', [CotizacionAntaminaControllers::class, 'showCotizacion']);
    Route::put('/cotizacion-antamina/update/{id}', [CotizacionAntaminaControllers::class, 'updateCotizacion']);
    Route::delete('/cotizacion-antamina/delete/{id}', [CotizacionAntaminaControllers::class, 'deleteCotizacion']);

    // Excel Import/Export para Cotizaciones Antamina
    Route::get('/cotizacion-antamina/plantilla-excel', [CotizacionAntaminaControllers::class, 'descargarPlantillaExcel']);
    Route::post('/cotizacion-antamina/importar-excel', [CotizacionAntaminaControllers::class, 'importarExcel']);
    Route::get('/cotizacion-antamina/exportar-excel', [CotizacionAntaminaControllers::class, 'exportarExcel']);
    Route::get('/cotizacion-antamina/exportar-pdf', [CotizacionAntaminaControllers::class, 'exportarPDF']);

    // Exportar cotización individual
    Route::get('/cotizacion-antamina/exportar-excel/{id}', [CotizacionAntaminaControllers::class, 'exportarCotizacionExcel']);
    Route::get('/cotizacion-antamina/exportar-pdf/{id}', [CotizacionAntaminaControllers::class, 'exportarCotizacionPDF']);

    // ********************* EMPLEADOS ********************* //
    Route::middleware(['check.permission:productos.view'])->group(function () {
        Route::get('/empleados-listar', [EmpleadosController::class, 'listaEmpleados']);
        Route::get('/empleados-mostrar/{id}', [EmpleadosController::class, 'show']);
    });

    Route::middleware(['check.permission:productos.create'])->group(function () {
        Route::post('/empleados-crear', [EmpleadosController::class, 'create']);
    });

    Route::middleware(['check.permission:productos.update'])->group(function () {
        Route::put('/empleados-actualizar/{id}', [EmpleadosController::class, 'edit']);
    });

    Route::middleware(['check.permission:productos.delete'])->group(function () {
        Route::delete('/empleados-eliminar/{id}', [EmpleadosController::class, 'destroy']);
    });

    // Rutas para obtener opciones de selects de empleados
    Route::get('/empleados-generos', [EmpleadosController::class, 'listarGeneros']);
    Route::get('/empleados-cargos', [EmpleadosController::class, 'listarCargos']);

    // ********************* ASISTENCIAS ********************* //
    Route::middleware(['check.permission:productos.view'])->group(function () {
        Route::get('/asistencias-listar', [AsistenciaEmpleadoController::class, 'ListaAsistencia']);
        Route::get('/asistencias-mostrar/{id}', [AsistenciaEmpleadoController::class, 'DetalleAsistencia']);
        Route::get('/asistencias-por-empleado/{idEmpleado}', [AsistenciaEmpleadoController::class, 'porEmpleado']);
        Route::get('/asistencias-por-fechas', [AsistenciaEmpleadoController::class, 'porFechas']);
    });

    Route::middleware(['check.permission:productos.create'])->group(function () {
        Route::post('/asistencias-registrar', [AsistenciaEmpleadoController::class, 'registrarAsistencia']);
        Route::post('/asistencias-registrar-lista', [AsistenciaEmpleadoController::class, 'registrarListaAsistencias']);
        Route::get('/asistencias-export-excel', [AsistenciaEmpleadoController::class, 'exportExcel']);
        Route::get('/asistencias-export-pdf', [AsistenciaEmpleadoController::class, 'exportPdf']);
    });

    Route::middleware(['check.permission:productos.update'])->group(function () {
        Route::put('/asistencias-actualizar/{id}', [AsistenciaEmpleadoController::class, 'ActualizarAsistencia']);
        Route::put('/asistencias-actualizar-masivo', [AsistenciaEmpleadoController::class, 'ActualizarAsistencia']);
    });

    Route::middleware(['check.permission:productos.delete'])->group(function () {
        Route::delete('/asistencias-eliminar/{id}', [AsistenciaEmpleadoController::class, 'EliminarAsistencia']);
    });
});

















// rutas que no sirve son de prueba para el modulo de obras contables
Route::prefix('obras-contables')->group(function () {
    Route::get('/reporte', [App\Http\Controllers\ObrasContables\ObrasContablesControllers::class, 'index']);
    Route::get('/export/excel', [App\Http\Controllers\ObrasContables\ObrasContablesControllers::class, 'exportExcel']);
    Route::get('/export/excel-grouped', [App\Http\Controllers\ObrasContables\ObrasContablesControllers::class, 'exportExcelGrouped']);
    Route::get('/export/pdf', [App\Http\Controllers\ObrasContables\ObrasContablesControllers::class, 'exportPdf']);
    Route::get('/preview', [App\Http\Controllers\ObrasContables\ObrasContablesControllers::class, 'preview']);
    Route::post('/reporte-por-fechas', [App\Http\Controllers\ObrasContables\ObrasContablesControllers::class, 'reportByDateRange']);
    Route::get('/stats', [App\Http\Controllers\ObrasContables\ObrasContablesControllers::class, 'getStats']);
});

// ********************* DASHBOARD ********************* //
Route::get('/dashboard/obras', [DashboardController::class, 'getObras']);
Route::post('/dashboard/productos-por-obra', [DashboardController::class, 'getProductosPorObra']);
Route::post('/dashboard/detalle-producto', [DashboardController::class, 'getDetalleProducto']);

// ********************* REQUERIMIENTOS DE OBRA ********************* //
// Opciones para selects
Route::get('/requerimientos-obra/opciones/obras', [RequerimientoObraController::class, 'obtenerObras']);
Route::get('/requerimientos-obra/opciones/productos', [RequerimientoObraController::class, 'obtenerProductos']);

// Reportes
Route::get('/requerimientos-obra/{id}/pdf', [RequerimientoObraController::class, 'generarPDF']);
Route::get('/requerimientos-obra/{id}/excel', [RequerimientoObraController::class, 'generarExcel']);

// CRUD de requerimientos de obra
Route::get('/requerimientos-obra', [RequerimientoObraController::class, 'index']);
Route::post('/requerimientos-obra', [RequerimientoObraController::class, 'store']);
Route::get('/requerimientos-obra/{id}', [RequerimientoObraController::class, 'show']);
Route::put('/requerimientos-obra/{id}', [RequerimientoObraController::class, 'update']);
Route::delete('/requerimientos-obra/{id}', [RequerimientoObraController::class, 'destroy']);

// Cambiar estado del requerimiento
Route::patch('/requerimientos-obra/{id}/estado', [RequerimientoObraController::class, 'cambiarEstado']);

// Marcar detalle como entregado
Route::post('/requerimientos-obra/detalle/{idDetalle}/entregar', [RequerimientoObraController::class, 'marcarDetalleEntregado']);

// ********************* CAPACITACIONES ********************* //
// Opciones para selects
Route::get('/capacitaciones/opciones/empleados', [App\Http\Controllers\CapacitacionController::class, 'obtenerEmpleados']);
Route::get('/capacitaciones/opciones/tipos-actividad', [App\Http\Controllers\CapacitacionController::class, 'obtenerTiposActividad']);

// Reportes
Route::get('/capacitaciones/{id}/pdf', [App\Http\Controllers\CapacitacionController::class, 'generarPDF']);

// Consultas específicas
Route::get('/capacitaciones/empleado/{empleadoId}', [App\Http\Controllers\CapacitacionController::class, 'capacitacionesPorEmpleado']);

// CRUD de capacitaciones
Route::get('/capacitaciones', [App\Http\Controllers\CapacitacionController::class, 'index']);
Route::post('/capacitaciones', [App\Http\Controllers\CapacitacionController::class, 'store']);
Route::get('/capacitaciones/{id}', [App\Http\Controllers\CapacitacionController::class, 'show']);
Route::put('/capacitaciones/{id}', [App\Http\Controllers\CapacitacionController::class, 'update']);
Route::delete('/capacitaciones/{id}', [App\Http\Controllers\CapacitacionController::class, 'destroy']);
