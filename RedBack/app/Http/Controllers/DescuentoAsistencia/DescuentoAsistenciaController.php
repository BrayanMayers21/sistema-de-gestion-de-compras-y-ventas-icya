<?php

namespace App\Http\Controllers\DescuentoAsistencia;

use App\Http\Controllers\Controller;
use App\Models\DescuentoAsistencia;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class DescuentoAsistenciaController extends Controller
{
    /**
     * Listar todos los descuentos
     */
    public function index(): JsonResponse
    {
        try {
            $descuentos = DescuentoAsistencia::with('empleado')->get();
            return response()->json([
                'success' => true,
                'data' => $descuentos
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los descuentos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mostrar un descuento específico
     */
    public function show($id): JsonResponse
    {
        try {
            $descuento = DescuentoAsistencia::with('empleado')->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $descuento
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Descuento no encontrado',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Crear un nuevo descuento
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'mes' => 'required|integer|min:1|max:12',
                'anio' => 'required|integer|min:2000|max:2100',
                'dias_trabajados' => 'required|integer|min:0',
                'dias_faltados' => 'required|integer|min:0',
                'dias_justificados' => 'required|integer|min:0',
                'dias_laborables' => 'required|integer|min:1',
                'sueldo_base' => 'required|numeric|min:0',
                'monto_descuento' => 'required|numeric|min:0',
                'sueldo_final' => 'required|numeric|min:0',
                'fecha_calculo' => 'required|date',
                'observaciones' => 'nullable|string|max:45',
                'fk_idempleados' => 'required|integer|exists:empleados,idempleados'
            ]);

            $descuento = DescuentoAsistencia::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Descuento registrado exitosamente',
                'data' => $descuento
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
                'message' => 'Error al registrar el descuento',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar un descuento
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $descuento = DescuentoAsistencia::findOrFail($id);

            $validated = $request->validate([
                'mes' => 'sometimes|required|integer|min:1|max:12',
                'anio' => 'sometimes|required|integer|min:2000|max:2100',
                'dias_trabajados' => 'sometimes|required|integer|min:0',
                'dias_faltados' => 'sometimes|required|integer|min:0',
                'dias_justificados' => 'sometimes|required|integer|min:0',
                'dias_laborables' => 'sometimes|required|integer|min:1',
                'sueldo_base' => 'sometimes|required|numeric|min:0',
                'monto_descuento' => 'sometimes|required|numeric|min:0',
                'sueldo_final' => 'sometimes|required|numeric|min:0',
                'fecha_calculo' => 'sometimes|required|date',
                'observaciones' => 'nullable|string|max:45',
                'fk_idempleados' => 'sometimes|required|integer|exists:empleados,idempleados'
            ]);

            $descuento->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Descuento actualizado exitosamente',
                'data' => $descuento
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
                'message' => 'Error al actualizar el descuento',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar un descuento
     */
    public function destroy($id): JsonResponse
    {
        try {
            $descuento = DescuentoAsistencia::findOrFail($id);
            $descuento->delete();

            return response()->json([
                'success' => true,
                'message' => 'Descuento eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el descuento',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener descuentos por empleado
     */
    public function porEmpleado($idEmpleado): JsonResponse
    {
        try {
            $descuentos = DescuentoAsistencia::where('fk_idempleados', $idEmpleado)
                ->orderBy('anio', 'desc')
                ->orderBy('mes', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $descuentos
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los descuentos del empleado',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener descuentos por período
     */
    public function porPeriodo(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'mes' => 'required|integer|min:1|max:12',
                'anio' => 'required|integer|min:2000|max:2100',
                'fk_idempleados' => 'nullable|integer|exists:empleados,idempleados'
            ]);

            $query = DescuentoAsistencia::where('mes', $validated['mes'])
                ->where('anio', $validated['anio']);

            if (isset($validated['fk_idempleados'])) {
                $query->where('fk_idempleados', $validated['fk_idempleados']);
            }

            $descuentos = $query->with('empleado')->get();

            return response()->json([
                'success' => true,
                'data' => $descuentos
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
                'message' => 'Error al obtener los descuentos',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
