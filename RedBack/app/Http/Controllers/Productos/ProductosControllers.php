<?php

namespace App\Http\Controllers\Productos;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductosControllers extends Controller
{
    //lista de productos
    public function listarProductos(Request $request)
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
            $q = DB::table('productos as p')
                ->join('categorias as c', 'c.id_categoria', '=', 'p.fk_id_categoria')
                ->select(
                    'p.id_producto',
                    'p.codigo',
                    'p.nombre as producto',
                    'p.descripcion',
                    'p.unidad_medida',
                    'p.fk_id_categoria',
                    'c.nombre as categoria'
                )
                ->orderBy('p.codigo', 'asc'); // ajusta si prefieres otro campo

            // Filtro de búsqueda
            if (!empty($validated['Buscar'])) {
                $buscar = trim($validated['Buscar']);
                $q->where(function ($w) use ($buscar) {
                    $w->where('p.codigo', 'like', "%{$buscar}%")
                        ->orWhere('p.nombre', 'like', "%{$buscar}%")
                        ->orWhere('p.descripcion', 'like', "%{$buscar}%")
                        ->orWhere('p.unidad_medida', 'like', "%{$buscar}%")
                        ->orWhere('c.nombre', 'like', "%{$buscar}%");
                });
            }

            // Total antes de paginar
            $total = (clone $q)->count();

            // Paginación por offset/limit
            $data = $q->offset($validated['Limite_inferior'])
                ->limit($validated['Limite_Superior'])
                ->get();

            return response()->json([
                'message' => 'Lista de productos obtenida correctamente.',
                'data'    => $data,
                'total'   => $total,
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Error al listar los productos: ' . $e->getMessage(),
            ], 500);
        }
    }

    // lista especifico de producto
    public function mostrarProducto($id)
    {
        try {
            $producto = DB::table('productos as p')
                ->join('categorias as c', 'c.id_categoria', '=', 'p.fk_id_categoria')
                ->select(
                    'p.id_producto',
                    'p.codigo',
                    'p.nombre as producto',
                    'p.descripcion',
                    'p.unidad_medida',
                    'p.fk_id_categoria',
                    'c.nombre as categoria'
                )
                ->where('p.id_producto', '=', $id)
                ->first();

            if (!$producto) {
                return response()->json([
                    'error' => 'Producto no encontrado.',
                ], 404);
            }
            return response()->json([
                'message' => 'Detalle del producto obtenido correctamente.',
                'data'    => $producto,
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Error al obtener el detalle del producto: ' . $e->getMessage(),
            ], 500);
        }
    }

    // crear producto
    public function crearProducto(Request $request)
    {
        try {
            // Validación de entradas
            $validated = $request->validate([
                'codigo'         => 'required|string|max:50|unique:productos,codigo',
                'nombre'         => 'required|string|max:255',
                'descripcion'    => 'nullable|string',
                'unidad_medida'  => 'required|string|max:100',
                'fk_id_categoria' => 'required|integer|exists:categorias,id_categoria',
            ], [
                'codigo.required'          => 'El código es obligatorio.',
                'codigo.unique'            => 'El código ya existe.',
                'nombre.required'          => 'El nombre es obligatorio.',
                'unidad_medida.required'   => 'La unidad de medida es obligatoria.',
                'fk_id_categoria.required' => 'La categoría es obligatoria.',
                'fk_id_categoria.exists'   => 'La categoría seleccionada no existe.',
            ]);

            // Insertar el nuevo producto
            DB::table('productos')->insert([
                'codigo'          => $validated['codigo'],
                'nombre'          => $validated['nombre'],
                'descripcion'     => $validated['descripcion'] ?? null,
                'unidad_medida'   => $validated['unidad_medida'],
                'fk_id_categoria' => $validated['fk_id_categoria'],
            ]);

            return response()->json([
                'message' => 'Producto creado correctamente.',
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Error al crear el producto: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function editarProducto(Request $request, $id)
    {
        try {
            // Validación de entradas
            $validated = $request->validate([
                'nombre'         => 'required|string|max:255',
                'descripcion'    => 'nullable|string',
                'unidad_medida'  => 'required|string|max:100',
                'fk_id_categoria' => 'required|integer|exists:categorias,id_categoria',
            ], [
                'nombre.required'          => 'El nombre es obligatorio.',
                'unidad_medida.required'   => 'La unidad de medida es obligatoria.',
                'fk_id_categoria.required' => 'La categoría es obligatoria.',
                'fk_id_categoria.exists'   => 'La categoría seleccionada no existe.',
            ]);

            // Actualizar el producto
            $updated = DB::table('productos')
                ->where('id_producto', '=', $id)
                ->update([
                    'nombre'          => $validated['nombre'],
                    'descripcion'     => $validated['descripcion'] ?? null,
                    'unidad_medida'   => $validated['unidad_medida'],
                    'fk_id_categoria' => $validated['fk_id_categoria'],
                ]);

            if ($updated === 0) {
                return response()->json([
                    'error' => 'Producto no encontrado o sin cambios.',
                ], 404);
            }

            return response()->json([
                'message' => 'Producto actualizado correctamente.',
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Error al actualizar el producto: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function eliminarProducto($id)
    {
        try {
            // Eliminar el producto
            $deleted = DB::table('productos')
                ->where('id_producto', '=', $id)
                ->delete();

            if ($deleted === 0) {
                return response()->json([
                    'error' => 'Producto no encontrado.',
                ], 404);
            }

            return response()->json([
                'message' => 'Producto eliminado correctamente.',
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Error al eliminar el producto: ' . $e->getMessage(),
            ], 500);
        }
    }



    // listar categorias
    public function listarCategorias()
    {
        try {
            $categorias = DB::table('categorias')
                ->select('id_categoria', 'nombre', 'descripcion')
                ->orderBy('nombre', 'asc')
                ->get();

            return response()->json([
                'message'    => 'Lista de categorías obtenida correctamente.',
                'categorias' => $categorias,
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Error al listar las categorías: ' . $e->getMessage(),
            ], 500);
        }
    }
}
