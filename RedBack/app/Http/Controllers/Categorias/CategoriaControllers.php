<?php

namespace App\Http\Controllers\Categorias;

use App\Http\Controllers\Controller;
use App\Models\Categoria;
use Illuminate\Http\Request;

class CategoriaControllers extends Controller
{
    public function listarCategorias(Request $request)
    {
        try {
            // Validación de entradas (mismos nombres que tu ejemplo)
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

            // Base de la consulta
            $q = Categoria::query()
                ->select('id_categoria', 'nombre', 'descripcion', 'estado', 'fecha_registro')
                ->orderBy('id_categoria');

            // Filtro de búsqueda por nombre, descripción o estado
            if (!empty($validated['Buscar'])) {
                $buscar = trim($validated['Buscar']);
                $q->where(function ($qq) use ($buscar) {
                    $qq->where('nombre', 'like', "%{$buscar}%")
                        ->orWhere('descripcion', 'like', "%{$buscar}%")
                        ->orWhere('estado', 'like', "%{$buscar}%");
                });
            }

            // Total antes de paginar
            $total = $q->count();

            // Paginación por offset/limit
            $data = $q->offset($validated['Limite_inferior'])
                ->limit($validated['Limite_Superior'])
                ->get();

            return response()->json([
                'message' => 'Lista de categorías obtenida correctamente.',
                'data'    => $data,
                'total'   => $total,
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Error al listar las categorías: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function crearCategoria(Request $request)
    {
        // Validación de entradas
        $validated = $request->validate([
            'nombre'       => 'required|string|max:255',
            'descripcion'  => 'nullable|string|max:255',
            'estado'       => 'required|boolean',
        ], [
            'nombre.required'      => 'El nombre es obligatorio.',
            'estado.required'     => 'El estado es obligatorio.',
        ]);

        try {
            // Crear la categoría
            $categoria = Categoria::create($validated);

            return response()->json([
                'message' => 'Categoría registrada correctamente.',
                'data'    => $categoria,
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Error al registrar la categoría: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function mostrarCategoria($id)
    {
        try {
            // Encontrar la categoría
            $categoria = Categoria::findOrFail($id);

            return response()->json([
                'message' => 'Detalle de la categoría obtenido correctamente.',
                'data'    => $categoria,
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Error al obtener el detalle de la categoría: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function actualizarCategoria(Request $request, $id)
    {
        // Validación de entradas
        $validated = $request->validate([
            'nombre'       => 'required|string|max:255',
            'descripcion'  => 'nullable|string|max:255',
            'estado'       => 'required|boolean',
        ], [
            'nombre.required'      => 'El nombre es obligatorio.',
            'estado.required'     => 'El estado es obligatorio.',
        ]);

        try {
            // Encontrar la categoría
            $categoria = Categoria::findOrFail($id);

            // Actualizar la categoría
            $categoria->update($validated);

            return response()->json([
                'message' => 'Categoría actualizada correctamente.',
                'data'    => $categoria,
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Error al actualizar la categoría: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function eliminarCategoria($id)
    {
        try {
            // Encontrar la categoría
            $categoria = Categoria::findOrFail($id);

            // Eliminar la categoría
            $categoria->delete();

            return response()->json([
                'message' => 'Categoría eliminada correctamente.',
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Error al eliminar la categoría: ' . $e->getMessage(),
            ], 500);
        }
    }
}
