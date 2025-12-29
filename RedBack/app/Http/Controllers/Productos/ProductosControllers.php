<?php

namespace App\Http\Controllers\Productos;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductosControllers extends Controller
{
    /**
     * Genera un código único para el producto basado en su nombre
     */
    private function generarCodigoUnico($nombre)
    {
        // Limpiar y extraer las primeras 3 letras del nombre
        $nombre = strtoupper(trim($nombre));
        $prefijo = substr(preg_replace('/[^A-Z]/', '', $nombre), 0, 3);

        // Si no hay suficientes letras, completar con 'XXX'
        if (strlen($prefijo) < 3) {
            $prefijo = str_pad($prefijo, 3, 'X');
        }

        // Buscar el último código con ese prefijo
        $ultimoCodigo = DB::table('productos')
            ->where('codigo', 'like', $prefijo . '%')
            ->orderBy('codigo', 'desc')
            ->value('codigo');

        // Generar el nuevo número secuencial
        if ($ultimoCodigo) {
            // Extraer el número del último código
            $numero = intval(substr($ultimoCodigo, 3)) + 1;
        } else {
            $numero = 1;
        }

        // Formatear el código: PREFIJO + número con padding de 3 dígitos
        return $prefijo . str_pad($numero, 3, '0', STR_PAD_LEFT);
    }

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
                    'p.ruta_imagen',
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
                    'p.ruta_imagen',
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
                'nombre'         => 'required|string|max:255',
                'descripcion'    => 'nullable|string',
                'unidad_medida'  => 'required|string|max:100',
                'imagen'         => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
                'fk_id_categoria' => 'required|integer|exists:categorias,id_categoria',
            ], [
                'nombre.required'          => 'El nombre es obligatorio.',
                'unidad_medida.required'   => 'La unidad de medida es obligatoria.',
                'imagen.image'             => 'El archivo debe ser una imagen.',
                'imagen.mimes'             => 'La imagen debe ser de tipo: jpeg, png, jpg, gif o webp.',
                'imagen.max'               => 'La imagen no debe pesar más de 2MB.',
                'fk_id_categoria.required' => 'La categoría es obligatoria.',
                'fk_id_categoria.exists'   => 'La categoría seleccionada no existe.',
            ]);

            // Generar código único automáticamente
            $codigoUnico = $this->generarCodigoUnico($validated['nombre']);

            // Manejar la carga de imagen
            $rutaImagen = null;
            if ($request->hasFile('imagen')) {
                $imagen = $request->file('imagen');
                $nombreImagen = $codigoUnico . '_' . time() . '.' . $imagen->getClientOriginalExtension();

                // Guardar en storage/app/public/productos
                $path = $imagen->storeAs('public/productos', $nombreImagen);

                // Guardar la ruta relativa para acceso público
                $rutaImagen = 'storage/productos/' . $nombreImagen;
            }

            // Insertar el nuevo producto
            DB::table('productos')->insert([
                'codigo'          => $codigoUnico,
                'nombre'          => $validated['nombre'],
                'descripcion'     => $validated['descripcion'] ?? null,
                'unidad_medida'   => $validated['unidad_medida'],
                'ruta_imagen'     => $rutaImagen,
                'fk_id_categoria' => $validated['fk_id_categoria'],
            ]);

            return response()->json([
                'message'     => 'Producto creado correctamente.',
                'codigo'      => $codigoUnico,
                'ruta_imagen' => $rutaImagen,
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
                'imagen'         => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
                'fk_id_categoria' => 'required|integer|exists:categorias,id_categoria',
            ], [
                'nombre.required'          => 'El nombre es obligatorio.',
                'unidad_medida.required'   => 'La unidad de medida es obligatoria.',
                'imagen.image'             => 'El archivo debe ser una imagen.',
                'imagen.mimes'             => 'La imagen debe ser de tipo: jpeg, png, jpg, gif o webp.',
                'imagen.max'               => 'La imagen no debe pesar más de 2MB.',
                'fk_id_categoria.required' => 'La categoría es obligatoria.',
                'fk_id_categoria.exists'   => 'La categoría seleccionada no existe.',
            ]);

            // Obtener el producto actual para acceder al código y la imagen antigua
            $productoActual = DB::table('productos')->where('id_producto', '=', $id)->first();

            if (!$productoActual) {
                return response()->json([
                    'error' => 'Producto no encontrado.',
                ], 404);
            }

            // Preparar datos para actualizar
            $datosActualizar = [
                'nombre'          => $validated['nombre'],
                'descripcion'     => $validated['descripcion'] ?? null,
                'unidad_medida'   => $validated['unidad_medida'],
                'fk_id_categoria' => $validated['fk_id_categoria'],
            ];

            // Manejar la actualización de imagen
            if ($request->hasFile('imagen')) {
                // Eliminar imagen anterior si existe
                if ($productoActual->ruta_imagen) {
                    $rutaAntigua = public_path($productoActual->ruta_imagen);
                    if (file_exists($rutaAntigua)) {
                        unlink($rutaAntigua);
                    }
                }

                // Guardar nueva imagen
                $imagen = $request->file('imagen');
                $nombreImagen = $productoActual->codigo . '_' . time() . '.' . $imagen->getClientOriginalExtension();
                $path = $imagen->storeAs('public/productos', $nombreImagen);
                $datosActualizar['ruta_imagen'] = 'storage/productos/' . $nombreImagen;
            }

            // Actualizar el producto
            $updated = DB::table('productos')
                ->where('id_producto', '=', $id)
                ->update($datosActualizar);

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

    /**
     * Obtener imagen de producto con autenticación
     * Este endpoint sirve las imágenes de productos de forma segura
     */
    public function obtenerImagen($id)
    {
        try {
            // Buscar el producto
            $producto = Producto::where('id_producto', $id)->first();

            if (!$producto) {
                return response()->json([
                    'error' => 'Producto no encontrado.',
                    'id' => $id
                ], 404);
            }

            // Verificar si tiene imagen
            if (!$producto->ruta_imagen) {
                return response()->json([
                    'error' => 'El producto no tiene imagen.',
                    'producto_id' => $id
                ], 404);
            }

            // La ruta guardada viene como 'storage/productos/nombrearchivo.ext'
            // Extraer solo el nombre del archivo
            $nombreArchivo = basename($producto->ruta_imagen);

            // Buscar en múltiples ubicaciones posibles
            $posiblesRutas = [
                // Ubicación correcta: storage/app/public/productos
                storage_path('app' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'productos' . DIRECTORY_SEPARATOR . $nombreArchivo),
                // Ubicación con symlink: public/storage/productos
                public_path('storage' . DIRECTORY_SEPARATOR . 'productos' . DIRECTORY_SEPARATOR . $nombreArchivo),
                // Ubicación antigua (por error de configuración): storage/app/private/public/productos
                storage_path('app' . DIRECTORY_SEPARATOR . 'private' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'productos' . DIRECTORY_SEPARATOR . $nombreArchivo),
            ];

            // Buscar el archivo en las ubicaciones posibles
            $rutaCompleta = null;
            foreach ($posiblesRutas as $ruta) {
                if (file_exists($ruta)) {
                    $rutaCompleta = $ruta;
                    break;
                }
            }

            // Verificar que el archivo existe
            if (!$rutaCompleta) {
                return response()->json([
                    'error' => 'La imagen no existe en el servidor. Debe volver a subir la imagen.',
                    'ruta_guardada' => $producto->ruta_imagen,
                    'nombre_archivo' => $nombreArchivo,
                    'rutas_buscadas' => $posiblesRutas,
                    'producto_codigo' => $producto->codigo
                ], 404);
            }

            // Obtener el tipo MIME del archivo
            $mimeType = mime_content_type($rutaCompleta);

            // Retornar la imagen con los headers correctos
            return response()->file($rutaCompleta, [
                'Content-Type' => $mimeType,
                'Cache-Control' => 'public, max-age=31536000',
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Error al obtener la imagen: ' . $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    /**
     * Descargar plantilla Excel para importación masiva
     */
    public function descargarPlantillaExcel()
    {
        try {
            $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();

            // Configurar encabezados
            $headers = ['Código', 'Nombre', 'Descripción', 'Unidad de Medida', 'Categoría'];
            $sheet->fromArray($headers, null, 'A1');

            // Estilizar encabezados
            $headerStyle = [
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => 'FFFFFF'],
                    'size' => 12,
                ],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '4472C4'],
                ],
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                    'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                ],
            ];
            $sheet->getStyle('A1:E1')->applyFromArray($headerStyle);

            // Ajustar anchos de columna
            $sheet->getColumnDimension('A')->setWidth(15);
            $sheet->getColumnDimension('B')->setWidth(30);
            $sheet->getColumnDimension('C')->setWidth(40);
            $sheet->getColumnDimension('D')->setWidth(20);
            $sheet->getColumnDimension('E')->setWidth(25);

            // Agregar ejemplos
            $ejemplos = [
                ['MAT001', 'Cemento Portland', 'Cemento tipo I de 42.5kg', 'Bolsa', 'Materiales de Construcción'],
                ['HER001', 'Martillo', 'Martillo de acero con mango de madera', 'Unidad', 'Herramientas'],
                ['PIN001', 'Pintura Blanca', 'Pintura latex interior blanca 5 galones', 'Galón', 'Pinturas'],
            ];
            $sheet->fromArray($ejemplos, null, 'A2');

            // Agregar bordes a toda la tabla
            $styleArray = [
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        'color' => ['rgb' => '000000'],
                    ],
                ],
            ];
            $sheet->getStyle('A1:E' . (count($ejemplos) + 1))->applyFromArray($styleArray);

            // Agregar instrucciones en una hoja separada
            $instructionsSheet = $spreadsheet->createSheet();
            $instructionsSheet->setTitle('Instrucciones');
            $instructions = [
                ['INSTRUCCIONES PARA IMPORTAR PRODUCTOS'],
                [''],
                ['1. Complete los datos en la hoja "Sheet" (primera hoja)'],
                ['2. Código: Puede dejarlo en blanco y se generará automáticamente, o especificar uno único'],
                ['3. Nombre: Obligatorio. Nombre del producto o material'],
                ['4. Descripción: Opcional. Descripción detallada del producto'],
                ['5. Unidad de Medida: Obligatorio. Ej: Unidad, Bolsa, Galón, Metro, Kilo, etc.'],
                ['6. Categoría: Obligatorio. Debe coincidir exactamente con una categoría existente en el sistema'],
                [''],
                ['IMPORTANTE:'],
                ['- No modifique los encabezados de las columnas'],
                ['- Los códigos duplicados serán omitidos'],
                ['- Si la categoría no existe, ese producto será omitido'],
                ['- Puede copiar y pegar los ejemplos para guiarse'],
                [''],
                ['CATEGORÍAS DISPONIBLES EN EL SISTEMA:'],
            ];

            // Obtener categorías del sistema
            $categorias = DB::table('categorias')
                ->select('nombre', 'descripcion')
                ->orderBy('nombre')
                ->get();

            foreach ($categorias as $cat) {
                $instructions[] = ["- {$cat->nombre}" . ($cat->descripcion ? " ({$cat->descripcion})" : '')];
            }

            $instructionsSheet->fromArray($instructions, null, 'A1');
            $instructionsSheet->getColumnDimension('A')->setWidth(80);

            // Estilizar título de instrucciones
            $instructionsSheet->getStyle('A1')->applyFromArray([
                'font' => [
                    'bold' => true,
                    'size' => 14,
                    'color' => ['rgb' => '4472C4'],
                ],
            ]);

            // Volver a la primera hoja como activa
            $spreadsheet->setActiveSheetIndex(0);

            // Generar el archivo
            $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
            $fileName = 'plantilla_productos_' . date('YmdHis') . '.xlsx';
            $tempFile = storage_path('app/temp/' . $fileName);

            // Crear directorio temp si no existe
            if (!file_exists(storage_path('app/temp'))) {
                mkdir(storage_path('app/temp'), 0755, true);
            }

            $writer->save($tempFile);

            return response()->download($tempFile, $fileName)->deleteFileAfterSend(true);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Error al generar la plantilla: ' . $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    /**
     * Importar productos desde archivo Excel
     */
    public function importarExcel(Request $request)
    {
        try {
            // Validar que se envió un archivo
            $request->validate([
                'archivo' => 'required|file|mimes:xlsx,xls|max:5120', // máx 5MB
            ]);

            $file = $request->file('archivo');

            // Cargar el archivo Excel
            $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($file->getRealPath());
            $sheet = $spreadsheet->getActiveSheet();
            $rows = $sheet->toArray();

            // Validar que tenga datos
            if (count($rows) < 2) {
                return response()->json([
                    'error' => 'El archivo no contiene datos para importar'
                ], 400);
            }

            // Obtener encabezados (primera fila)
            $headers = array_map('trim', $rows[0]);

            // Validar encabezados requeridos
            $requiredHeaders = ['Código', 'Nombre', 'Unidad de Medida', 'Categoría'];
            foreach ($requiredHeaders as $required) {
                if (!in_array($required, $headers)) {
                    return response()->json([
                        'error' => "Falta el encabezado requerido: {$required}"
                    ], 400);
                }
            }

            // Obtener índices de columnas
            $colCodigo = array_search('Código', $headers);
            $colNombre = array_search('Nombre', $headers);
            $colDescripcion = array_search('Descripción', $headers);
            $colUnidadMedida = array_search('Unidad de Medida', $headers);
            $colCategoria = array_search('Categoría', $headers);

            // Obtener todas las categorías - con búsqueda case-insensitive
            $categorias = DB::table('categorias')
                ->select('id_categoria', 'nombre')
                ->get();

            // Crear un mapa de categorías normalizado para búsqueda case-insensitive
            $categoriasMap = [];
            foreach ($categorias as $cat) {
                $categoriasMap[strtolower(trim($cat->nombre))] = $cat;
            }

            $insertados = 0;
            $omitidos = 0;
            $errores = [];

            // Log para debug
            Log::info('Iniciando importación de productos', [
                'total_filas' => count($rows),
                'categorias_disponibles' => array_keys($categoriasMap)
            ]);

            // Procesar cada fila (omitiendo la primera que son los encabezados)
            for ($i = 1; $i < count($rows); $i++) {
                $row = $rows[$i];

                // Saltar filas vacías
                if (empty(array_filter($row))) {
                    continue;
                }

                try {
                    $codigo = trim($row[$colCodigo] ?? '');
                    $nombre = trim($row[$colNombre] ?? '');
                    $descripcion = trim($row[$colDescripcion] ?? '');
                    $unidadMedida = trim($row[$colUnidadMedida] ?? '');
                    $categoriaNombre = trim($row[$colCategoria] ?? '');

                    // Log de cada fila
                    Log::info("Procesando fila " . ($i + 1), [
                        'nombre' => $nombre,
                        'categoria' => $categoriaNombre,
                        'unidad_medida' => $unidadMedida
                    ]);

                    // Validar datos obligatorios
                    if (empty($nombre)) {
                        $errores[] = "Fila " . ($i + 1) . ": El nombre es obligatorio";
                        $omitidos++;
                        continue;
                    }

                    if (empty($unidadMedida)) {
                        $errores[] = "Fila " . ($i + 1) . ": La unidad de medida es obligatoria";
                        $omitidos++;
                        continue;
                    }

                    if (empty($categoriaNombre)) {
                        $errores[] = "Fila " . ($i + 1) . ": La categoría es obligatoria";
                        $omitidos++;
                        continue;
                    }

                    // Buscar categoría (case-insensitive)
                    $categoriaKey = strtolower(trim($categoriaNombre));
                    if (!isset($categoriasMap[$categoriaKey])) {
                        $errores[] = "Fila " . ($i + 1) . ": Categoría '{$categoriaNombre}' no encontrada. Categorías disponibles: " . implode(', ', array_keys($categoriasMap));
                        $omitidos++;
                        continue;
                    }

                    $fkIdCategoria = $categoriasMap[$categoriaKey]->id_categoria;

                    // Generar código si está vacío
                    if (empty($codigo)) {
                        $codigo = $this->generarCodigoUnico($nombre);
                    }

                    // Verificar si el código ya existe
                    $existe = DB::table('productos')
                        ->where('codigo', $codigo)
                        ->exists();

                    if ($existe) {
                        $errores[] = "Fila " . ($i + 1) . ": Código '{$codigo}' ya existe";
                        $omitidos++;
                        continue;
                    }

                    // Insertar el producto (sin created_at/updated_at porque la tabla no los tiene)
                    DB::table('productos')->insert([
                        'codigo' => $codigo,
                        'nombre' => $nombre,
                        'descripcion' => !empty($descripcion) ? $descripcion : null,
                        'unidad_medida' => $unidadMedida,
                        'fk_id_categoria' => $fkIdCategoria,
                        'ruta_imagen' => null,
                    ]);

                    Log::info("Producto insertado exitosamente", [
                        'codigo' => $codigo,
                        'nombre' => $nombre,
                        'fila' => ($i + 1)
                    ]);

                    $insertados++;
                } catch (\Throwable $e) {
                    $errorMsg = "Fila " . ($i + 1) . ": " . $e->getMessage();
                    $errores[] = $errorMsg;
                    Log::error("Error al insertar producto", [
                        'fila' => ($i + 1),
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ]);
                    $omitidos++;
                }
            }

            // Log final
            Log::info('Importación completada', [
                'insertados' => $insertados,
                'omitidos' => $omitidos,
                'total_errores' => count($errores)
            ]);

            // Preparar mensaje de respuesta
            $mensaje = "Importación completada: {$insertados} productos insertados";
            if ($omitidos > 0) {
                $mensaje .= ", {$omitidos} omitidos";
            }

            return response()->json([
                'message' => $mensaje,
                'insertados' => $insertados,
                'omitidos' => $omitidos,
                'errores' => $errores,
                'debug' => [
                    'total_filas_procesadas' => count($rows) - 1,
                    'categorias_disponibles' => array_values(array_map(function ($cat) {
                        return $cat->nombre;
                    }, $categorias->toArray())),
                    'encabezados_encontrados' => $headers
                ]
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Error al importar el archivo: ' . $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
}
