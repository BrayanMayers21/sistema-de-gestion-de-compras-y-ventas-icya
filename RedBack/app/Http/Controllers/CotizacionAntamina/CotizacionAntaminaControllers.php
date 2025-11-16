<?php

namespace App\Http\Controllers\CotizacionAntamina;

use App\Http\Controllers\Controller;
use App\Models\CotizacionesAntamina;
use App\Models\DetalleCotizacionAntamina;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CotizacionAntaminaControllers extends Controller
{
    //listado de cotizaciones de antamina
    public function listCotizaciones()
    {
        try {
            $cotizaciones = CotizacionesAntamina::with('detalles.producto')
                ->orderBy('fecha_cot', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $cotizaciones
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al listar las cotizaciones',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // creacion de cotizaciones de antamina
    public function createCotizacion(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'cliente' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'detalles' => 'required|array|min:1',
            'detalles.*.cantidad' => 'required|integer|min:1',
            'detalles.*.precio_unitario' => 'required|numeric|min:0',
            'detalles.*.marca' => 'nullable|string|max:100',
            'detalles.*.fk_id_producto' => 'required|integer|exists:productos,id_producto'
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
            // Generar número de cotización automático
            $ultimaCotizacion = CotizacionesAntamina::orderBy('idcotizaciones_antamina', 'desc')->first();

            if ($ultimaCotizacion && $ultimaCotizacion->numero_cot) {
                // Extraer el número de la última cotización (COT-ANTA-000001)
                preg_match('/COT-ANTA-(\d+)/', $ultimaCotizacion->numero_cot, $matches);
                $ultimoNumero = isset($matches[1]) ? intval($matches[1]) : 0;
                $nuevoNumero = $ultimoNumero + 1;
            } else {
                $nuevoNumero = 1;
            }

            // Formatear el número con ceros a la izquierda (6 dígitos)
            $numeroCotizacion = 'COT-ANTA-' . str_pad($nuevoNumero, 6, '0', STR_PAD_LEFT);

            // Calcular el costo total de la cotización
            $costoTotal = 0;
            foreach ($request->detalles as $detalle) {
                $costoTotal += $detalle['cantidad'] * $detalle['precio_unitario'];
            }

            // Crear la cotización
            $cotizacion = CotizacionesAntamina::create([
                'fecha_cot' => now(),
                'numero_cot' => $numeroCotizacion,
                'cliente' => $request->cliente,
                'descripcion' => $request->descripcion,
                'costo_total' => $costoTotal
            ]);

            // Crear los detalles de la cotización
            foreach ($request->detalles as $detalle) {
                $subTotal = $detalle['cantidad'] * $detalle['precio_unitario'];

                DetalleCotizacionAntamina::create([
                    'cantidad' => $detalle['cantidad'],
                    'precio_unitario' => $detalle['precio_unitario'],
                    'sub_total' => $subTotal,
                    'marca' => $detalle['marca'] ?? '',
                    'fk_idcotizaciones_antamina' => $cotizacion->idcotizaciones_antamina,
                    'fk_id_producto' => $detalle['fk_id_producto']
                ]);
            }

            DB::commit();

            // Cargar la cotización con sus detalles
            $cotizacion->load('detalles.producto');

            return response()->json([
                'success' => true,
                'message' => 'Cotización creada exitosamente',
                'data' => $cotizacion
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la cotización',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    //  actualizacion de cotizaciones de antamina
    public function updateCotizacion(Request $request, $id)
    {
        $cotizacion = CotizacionesAntamina::find($id);

        if (!$cotizacion) {
            return response()->json([
                'success' => false,
                'message' => 'Cotización no encontrada'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'fecha_cot' => 'required|date',
            'numero_cot' => 'required|string|max:45|unique:cotizaciones_antamina,numero_cot,' . $id . ',idcotizaciones_antamina',
            'cliente' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'detalles' => 'required|array|min:1',
            'detalles.*.iddetalle_cotizacion_antamina' => 'nullable|integer|exists:detalle_cotizacion_antamina,iddetalle_cotizacion_antamina',
            'detalles.*.cantidad' => 'required|integer|min:1',
            'detalles.*.precio_unitario' => 'required|numeric|min:0',
            'detalles.*.marca' => 'nullable|string|max:100',
            'detalles.*.fk_id_producto' => 'required|integer|exists:productos,id_producto'
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
            // Calcular el nuevo costo total
            $costoTotal = 0;
            foreach ($request->detalles as $detalle) {
                $costoTotal += $detalle['cantidad'] * $detalle['precio_unitario'];
            }

            // Actualizar la cotización
            $cotizacion->update([
                'fecha_cot' => $request->fecha_cot,
                'numero_cot' => $request->numero_cot,
                'cliente' => $request->cliente,
                'descripcion' => $request->descripcion,
                'costo_total' => $costoTotal
            ]);

            // Obtener IDs de detalles que se mantienen
            $detallesIdsEnviar = collect($request->detalles)
                ->pluck('iddetalle_cotizacion_antamina')
                ->filter()
                ->toArray();

            // Eliminar detalles que no están en el request
            DetalleCotizacionAntamina::where('fk_idcotizaciones_antamina', $id)
                ->whereNotIn('iddetalle_cotizacion_antamina', $detallesIdsEnviar)
                ->delete();

            // Actualizar o crear detalles
            foreach ($request->detalles as $detalle) {
                $subTotal = $detalle['cantidad'] * $detalle['precio_unitario'];

                if (isset($detalle['iddetalle_cotizacion_antamina'])) {
                    // Actualizar detalle existente
                    DetalleCotizacionAntamina::where('iddetalle_cotizacion_antamina', $detalle['iddetalle_cotizacion_antamina'])
                        ->update([
                            'cantidad' => $detalle['cantidad'],
                            'precio_unitario' => $detalle['precio_unitario'],
                            'sub_total' => $subTotal,
                            'marca' => $detalle['marca'] ?? '',
                            'fk_id_producto' => $detalle['fk_id_producto']
                        ]);
                } else {
                    // Crear nuevo detalle
                    DetalleCotizacionAntamina::create([
                        'cantidad' => $detalle['cantidad'],
                        'precio_unitario' => $detalle['precio_unitario'],
                        'sub_total' => $subTotal,
                        'marca' => $detalle['marca'] ?? '',
                        'fk_idcotizaciones_antamina' => $cotizacion->idcotizaciones_antamina,
                        'fk_id_producto' => $detalle['fk_id_producto']
                    ]);
                }
            }

            DB::commit();

            // Cargar la cotización actualizada con sus detalles
            $cotizacion->load('detalles.producto');

            return response()->json([
                'success' => true,
                'message' => 'Cotización actualizada exitosamente',
                'data' => $cotizacion
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la cotización',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Obtener una cotización específica con sus detalles
    public function showCotizacion($id)
    {
        try {
            $cotizacion = CotizacionesAntamina::with('detalles.producto')
                ->find($id);

            if (!$cotizacion) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cotización no encontrada'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $cotizacion
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener la cotización',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Eliminar una cotización
    public function deleteCotizacion($id)
    {
        DB::beginTransaction();
        try {
            $cotizacion = CotizacionesAntamina::find($id);

            if (!$cotizacion) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cotización no encontrada'
                ], 404);
            }

            // Eliminar detalles asociados
            DetalleCotizacionAntamina::where('fk_idcotizaciones_antamina', $id)->delete();

            // Eliminar cotización
            $cotizacion->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Cotización eliminada exitosamente'
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la cotización',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
