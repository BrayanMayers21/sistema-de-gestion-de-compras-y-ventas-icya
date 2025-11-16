<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\ValidateController;
use App\Http\Controllers\Categorias\CategoriaControllers;
use App\Http\Controllers\CotizacionAntamina\CotizacionAntaminaControllers;
use App\Http\Controllers\Orden\OrdenControllers;
use App\Http\Controllers\Productos\ProductosControllers;
use App\Http\Controllers\Requerimientos\RequerimientosControllers;
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
    });

    Route::middleware(['check.permission:productos.create'])->group(function () {
        Route::post('/productos-crear', [ProductosControllers::class, 'crearProducto']);
    });

    Route::middleware(['check.permission:productos.update'])->group(function () {
        Route::put('/productos-actualizar/{id}', [ProductosControllers::class, 'editarProducto']);
    });
    Route::middleware(['check.permission:productos.delete'])->group(function () {
        Route::delete('/productos-eliminar/{id}', [ProductosControllers::class, 'eliminarProducto']);
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
