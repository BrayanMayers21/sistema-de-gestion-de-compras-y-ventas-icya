<?php

namespace App\Http\Controllers\Obras;

use App\Http\Controllers\Controller;
use App\Models\Obra;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ObrasControllers extends Controller
{
    // lista de obtras
    public function ListarObras(Request $request)
    {
        try {
            // 1. Validación de entradas (Igual que tu ejemplo)
            $validated = $request->validate([
                'Limite_inferior' => 'required|integer|min:0',
                'Limite_Superior' => 'required|integer|min:1',
                'Buscar'          => 'nullable|string|max:255',
            ], [
                'Limite_inferior.required' => 'El límite inferior es obligatorio.',
                'Limite_Superior.required' => 'El límite superior es obligatorio.',
                'Limite_inferior.integer'  => 'El límite inferior debe ser un número entero.',
                'Limite_Superior.integer'  => 'El límite superior debe ser un número entero.',
            ]);


            $q = DB::table('obras as o')

                ->select(
                    'o.idobras',              // o id_obra
                    'o.codigo',
                    'o.nom_obra'
                )
                ->orderBy('o.idobras', 'desc'); // Ordenar por ID descendente (lo más nuevo primero)

            // 3. Filtro de búsqueda inteligente
            if (!empty($validated['Buscar'])) {
                $buscar = trim($validated['Buscar']);
                $q->where(function ($w) use ($buscar) {
                    $w->where('o.codigo', 'like', "%{$buscar}%")
                        ->orWhere('o.nom_obra', 'like', "%{$buscar}%");
                });
            }

            // 4. Total de registros (antes de cortar para la página)
            $total = (clone $q)->count();

            // 5. Paginación eficiente (Offset / Limit)
            $data = $q->offset($validated['Limite_inferior'])
                ->limit($validated['Limite_Superior'])
                ->get();

            // 6. Respuesta JSON exitosa
            return response()->json([
                'success' => true,
                'message' => 'Lista de obras obtenida correctamente.',
                'data'    => $data,
                'total'   => $total,
            ], 200);
        } catch (\Throwable $e) {
            // 7. Manejo de errores
            return response()->json([
                'success' => false,
                'error'   => 'Error al listar las obras: ' . $e->getMessage(),
                'data'    => [],
                'total'   => 0
            ], 500);
        }
    }
    // crear obra
    public function CrearObra(Request $request)
    {

        $request->validate([
            'nom_obra' => 'required|string|max:255',
            'codigo'   => 'required|string|max:45|unique:obras,codigo',
        ], [
            'nom_obra.required' => 'El nombre de la obra es obligatorio.',
            'nom_obra.max'      => 'El nombre no puede exceder los 255 caracteres.',
            'codigo.required'   => 'El código es obligatorio.',
            'codigo.max'        => 'El código no puede exceder los 45 caracteres.',
            'codigo.unique'     => 'El código ingresado ya existe en otra obra.',
        ]);

        $obra = Obra::create([
            'nom_obra' => $request->nom_obra,
            'codigo'   => $request->codigo,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Obra creada correctamente',
            'data'    => $obra,
        ], 201);
    }

    // actualizar obra
    public function ActualizarObra(Request $request)
    {
        $request->validate([
            'idobras'  => 'required|integer|exists:obras,idobras', // Verifica que el ID exista
            'nom_obra' => 'required|string|max:255',
            'codigo'   => 'required|string|max:45|unique:obras,codigo,' . $request->idobras . ',idobras',
        ], [
            'idobras.required'  => 'El ID de la obra es obligatorio.',
            'idobras.exists'    => 'La obra seleccionada no existe.',
            'nom_obra.required' => 'El nombre de la obra es obligatorio.',
            'codigo.required'   => 'El código es obligatorio.',
            'codigo.unique'     => 'El código ya está siendo usado por otra obra.',
        ]);

        $obra = Obra::find($request->idobras);
        $obra->nom_obra = $request->nom_obra;
        $obra->codigo   = $request->codigo;
        $obra->save();
        return response()->json([
            'success' => true,
            'message' => 'Obra actualizada correctamente',
            'data'    => $obra,
        ], 200);
    }
    // eliminar obra
    public function eliminarObra($id)
    {
        try {
            // 1. Validación: Verificamos que el ID exista en la BD
            $obra = Obra::find($id);

            if (!$obra) {
                return response()->json([
                    'success' => false,
                    'error'   => 'La obra que intentas eliminar no existe en la base de datos.',
                ], 404);
            }

            // 2. Proceso de eliminación
            $deleted = $obra->delete();

            // 3. Respuesta
            return response()->json([
                'success' => true,
                'message' => 'Obra eliminada correctamente.',
                'id_eliminado' => $id
            ], 200);
        } catch (\Illuminate\Database\QueryException $e) {

            if ($e->getCode() === '23000') {
                return response()->json([
                    'success' => false,
                    'error'   => 'No se puede eliminar esta obra porque está vinculada a otros registros (quizás materiales o reportes).',
                ], 409); // 409 Conflict
            }
            return response()->json([
                'success' => false,
                'error'   => 'Error de base de datos: ' . $e->getMessage(),
            ], 500);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'error'   => 'Error inesperado al eliminar: ' . $e->getMessage(),
            ], 500);
        }
    }
}
