<?php

namespace App\Http\Controllers\CotizacionAntamina;

use App\Http\Controllers\Controller;
use App\Models\CotizacionesAntamina;
use App\Models\DetalleCotizacionAntamina;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Barryvdh\DomPDF\Facade\Pdf;

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

    /**
     * Descargar plantilla Excel para importación de cotizaciones
     */
    public function descargarPlantillaExcel()
    {
        try {
            $spreadsheet = new Spreadsheet();

            // Hoja 1: Plantilla para datos
            $sheet = $spreadsheet->getActiveSheet();
            $sheet->setTitle('Cotización');

            // Campo de Proveedor
            $sheet->setCellValue('A1', 'PROVEEDOR:');
            $sheet->setCellValue('B1', '');
            $sheet->mergeCells('B1:E1');

            $proveedorStyle = [
                'font' => [
                    'bold' => true,
                    'size' => 12
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'FFC000']
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_LEFT,
                    'vertical' => Alignment::VERTICAL_CENTER
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_MEDIUM,
                        'color' => ['rgb' => '000000']
                    ]
                ]
            ];

            $sheet->getStyle('A1')->applyFromArray($proveedorStyle);
            $sheet->getStyle('B1:E1')->applyFromArray([
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'FFF2CC']
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_MEDIUM,
                        'color' => ['rgb' => '000000']
                    ]
                ]
            ]);

            // Espacio
            $sheet->setCellValue('A2', '');

            // Encabezados de productos
            $headers = [
                'A3' => 'Nombre Producto',
                'B3' => 'Cantidad',
                'C3' => 'Precio Unitario',
                'D3' => 'Subtotal'
            ];

            foreach ($headers as $cell => $value) {
                $sheet->setCellValue($cell, $value);
            }

            // Estilo de encabezados
            $headerStyle = [
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => 'FFFFFF'],
                    'size' => 12
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '4472C4']
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => ['rgb' => '000000']
                    ]
                ]
            ];

            $sheet->getStyle('A3:D3')->applyFromArray($headerStyle);

            // Ajustar ancho de columnas
            $sheet->getColumnDimension('A')->setWidth(40);
            $sheet->getColumnDimension('B')->setWidth(15);
            $sheet->getColumnDimension('C')->setWidth(18);
            $sheet->getColumnDimension('D')->setWidth(18);

            // Datos de ejemplo
            $ejemplos = [
                ['Cemento Portland Tipo I x 42.5kg', 50, 28.50],
                ['Arena Gruesa m3', 100, 45.00],
                ['Ladrillos King Kong 18 huecos', 500, 0.85],
                ['Fierro Corrugado 1/2" x 9m', 200, 32.50],
                ['Tubo PVC 2" x 3m', 75, 12.00]
            ];

            $row = 4;
            foreach ($ejemplos as $ejemplo) {
                $sheet->setCellValue('A' . $row, $ejemplo[0]);
                $sheet->setCellValue('B' . $row, $ejemplo[1]);
                $sheet->setCellValue('C' . $row, $ejemplo[2]);
                // Fórmula para calcular subtotal automáticamente
                $sheet->setCellValue('D' . $row, "=B{$row}*C{$row}");
                $row++;
            }

            // Estilo para filas de ejemplo
            $exampleStyle = [
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'E7E6E6']
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => ['rgb' => 'CCCCCC']
                    ]
                ]
            ];

            $sheet->getStyle('A4:D8')->applyFromArray($exampleStyle);

            // Fila de TOTAL
            $sheet->setCellValue('A10', 'TOTAL:');
            $sheet->setCellValue('D10', '=SUM(D4:D100)');

            $totalStyle = [
                'font' => [
                    'bold' => true,
                    'size' => 12
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '92D050']
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_MEDIUM,
                        'color' => ['rgb' => '000000']
                    ]
                ]
            ];

            $sheet->getStyle('A10')->applyFromArray($totalStyle);
            $sheet->getStyle('D10')->applyFromArray($totalStyle);

            // Formato de moneda para columnas de precio
            $sheet->getStyle('C4:D100')->getNumberFormat()->setFormatCode('#,##0.00');

            // Hoja 2: Instrucciones
            $instructionsSheet = $spreadsheet->createSheet();
            $instructionsSheet->setTitle('Instrucciones');

            $instructions = [
                ['INSTRUCCIONES PARA IMPORTAR COTIZACIONES'],
                [''],
                ['1. Formato del archivo:'],
                ['   - Ingrese el nombre del PROVEEDOR en la celda B1'],
                ['   - Ingrese la lista de productos a partir de la fila 4'],
                ['   - No modifique los nombres de las columnas'],
                ['   - Puede eliminar las filas de ejemplo (4-8) antes de importar'],
                [''],
                ['2. Columnas:'],
                ['   - Nombre Producto: Nombre del producto (obligatorio)'],
                ['   - Cantidad: Cantidad a cotizar (obligatorio, número entero)'],
                ['   - Precio Unitario: Precio por unidad (obligatorio, número decimal)'],
                ['   - Subtotal: Se calcula automáticamente (Cantidad × Precio Unitario)'],
                [''],
                ['3. Cálculos automáticos:'],
                ['   - El SUBTOTAL se calcula automáticamente con la fórmula: =B*C'],
                ['   - El TOTAL se calcula automáticamente sumando todos los subtotales'],
                ['   - NO modifique las fórmulas en la columna Subtotal'],
                [''],
                ['4. Validaciones:'],
                ['   - El proveedor es obligatorio (celda B1)'],
                ['   - El nombre del producto es obligatorio'],
                ['   - La cantidad debe ser un número entero mayor a 0'],
                ['   - El precio unitario debe ser un número mayor o igual a 0'],
                [''],
                ['5. Consejos:'],
                ['   - Una cotización = Un proveedor con múltiples productos'],
                ['   - Si necesita cotizar a otro proveedor, cree otro archivo Excel'],
                ['   - Use el formato de ejemplo como referencia'],
                ['   - El sistema buscará productos por nombre en la base de datos'],
            ];

            $rowNum = 1;
            foreach ($instructions as $instruction) {
                $instructionsSheet->setCellValue('A' . $rowNum, $instruction[0]);
                $rowNum++;
            }

            // Estilo para título de instrucciones
            $instructionsSheet->getStyle('A1')->applyFromArray([
                'font' => [
                    'bold' => true,
                    'size' => 14,
                    'color' => ['rgb' => '4472C4']
                ]
            ]);

            $instructionsSheet->getColumnDimension('A')->setWidth(80);

            // Hoja 3: Productos disponibles
            $productosSheet = $spreadsheet->createSheet();
            $productosSheet->setTitle('Productos Disponibles');

            $productosSheet->setCellValue('A1', 'Nombre Producto');
            $productosSheet->setCellValue('B1', 'Categoría');

            $productosSheet->getStyle('A1:B1')->applyFromArray($headerStyle);
            $productosSheet->getColumnDimension('A')->setWidth(50);
            $productosSheet->getColumnDimension('B')->setWidth(30);

            // Obtener productos
            $productos = DB::table('productos')
                ->join('categorias', 'productos.fk_id_categoria', '=', 'categorias.id_categoria')
                ->select('productos.nombre', 'categorias.nombre as categoria')
                ->orderBy('productos.nombre')
                ->limit(1000) // Limitar para no exceder tamaño
                ->get();

            $rowProd = 2;
            foreach ($productos as $producto) {
                $productosSheet->setCellValue('A' . $rowProd, $producto->nombre);
                $productosSheet->setCellValue('B' . $rowProd, $producto->categoria);
                $rowProd++;
            }

            $spreadsheet->setActiveSheetIndex(0);

            // Generar archivo
            $writer = new Xlsx($spreadsheet);
            $fileName = 'plantilla_cotizaciones_antamina_' . date('Y-m-d') . '.xlsx';
            $tempFile = tempnam(sys_get_temp_dir(), 'excel');

            $writer->save($tempFile);

            return response()->download($tempFile, $fileName, [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ])->deleteFileAfterSend(true);
        } catch (\Exception $e) {
            Log::error('Error al generar plantilla Excel: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al generar la plantilla Excel',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function importarExcel(Request $request)
    {
        try {
            Log::info('=== INICIO IMPORTACIÓN EXCEL COTIZACIONES ===');

            // Validar archivo
            $validator = Validator::make($request->all(), [
                'file' => 'required|file|mimes:xlsx,xls|max:5120'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Archivo inválido',
                    'errors' => $validator->errors()
                ], 422);
            }

            $file = $request->file('file');
            $spreadsheet = IOFactory::load($file->getPathname());
            $sheet = $spreadsheet->getSheet(0);
            $rows = $sheet->toArray();

            if (empty($rows)) {
                return response()->json([
                    'success' => false,
                    'message' => 'El archivo está vacío'
                ], 422);
            }

            // Obtener proveedor de la celda B1
            $proveedor = trim($rows[0][1] ?? '');

            if (empty($proveedor)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Debe ingresar el nombre del proveedor en la celda B1'
                ], 422);
            }

            Log::info('Proveedor: ' . $proveedor);

            // Validar encabezados (están en la fila 3, índice 2)
            if (count($rows) < 3) {
                return response()->json([
                    'success' => false,
                    'message' => 'El archivo no tiene el formato correcto'
                ], 422);
            }

            $expectedHeaders = ['Nombre Producto', 'Cantidad', 'Precio Unitario', 'Subtotal'];
            $headers = array_map('trim', array_slice($rows[2], 0, 4));

            $headersMatch = true;
            foreach ($expectedHeaders as $index => $expectedHeader) {
                if (!isset($headers[$index]) || strcasecmp(trim($headers[$index]), $expectedHeader) !== 0) {
                    $headersMatch = false;
                    break;
                }
            }

            if (!$headersMatch) {
                return response()->json([
                    'success' => false,
                    'message' => 'Los encabezados del archivo no coinciden con la plantilla',
                    'esperados' => $expectedHeaders,
                    'encontrados' => $headers
                ], 422);
            }

            // Procesar filas
            $detalles = [];
            $errores = [];
            $filasProcesadas = 0;

            // Obtener todos los productos para validación (búsqueda por nombre)
            $productosMap = DB::table('productos')
                ->select('id_producto', 'nombre')
                ->get()
                ->keyBy(function ($item) {
                    return strtoupper(trim($item->nombre));
                });

            Log::info('Productos en base de datos: ' . $productosMap->count());

            // Comenzar desde la fila 4 (índice 3)
            for ($i = 3; $i < count($rows); $i++) {
                $row = $rows[$i];
                $filasProcesadas++;

                // Saltar filas vacías o la fila de TOTAL
                if (empty(array_filter($row)) || stripos($row[0] ?? '', 'TOTAL') !== false) {
                    continue;
                }

                $nombreProducto = trim($row[0] ?? '');
                $cantidad = trim($row[1] ?? '');
                $precioUnitario = trim($row[2] ?? '');

                // Limpiar formato de números (eliminar comas, espacios y símbolos de moneda)
                $cantidad = str_replace([',', ' ', '$', 'S/', 'S/.'], '', $cantidad);
                $precioUnitario = str_replace([',', ' ', '$', 'S/', 'S/.'], '', $precioUnitario);

                // Validaciones
                if (empty($nombreProducto)) {
                    $errores[] = "Fila " . ($i + 1) . ": El nombre del producto es obligatorio";
                    continue;
                }

                // Buscar producto por nombre (case-insensitive)
                $nombreProductoUpper = strtoupper($nombreProducto);
                if (!$productosMap->has($nombreProductoUpper)) {
                    $errores[] = "Fila " . ($i + 1) . ": El producto '$nombreProducto' no existe en la base de datos";
                    continue;
                }

                if (!is_numeric($cantidad) || $cantidad < 1) {
                    $errores[] = "Fila " . ($i + 1) . ": La cantidad debe ser un número entero mayor a 0";
                    continue;
                }

                if (!is_numeric($precioUnitario) || $precioUnitario < 0) {
                    $errores[] = "Fila " . ($i + 1) . ": El precio unitario de {$nombreProducto} debe ser un número mayor o igual a 0";
                    continue;
                }

                $producto = $productosMap->get($nombreProductoUpper);
                $cantidad = (int)$cantidad;
                $precioUnitario = (float)$precioUnitario;
                $subTotal = $cantidad * $precioUnitario;

                $detalles[] = [
                    'fk_id_producto' => $producto->id_producto,
                    'cantidad' => $cantidad,
                    'precio_unitario' => $precioUnitario,
                    'sub_total' => $subTotal,
                    'marca' => '' // Sin marca en el nuevo formato
                ];

                Log::info("Fila " . ($i + 1) . " procesada: Producto {$producto->nombre}, Cantidad: $cantidad");
            }

            // Validar que haya detalles
            if (empty($detalles)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se encontraron productos válidos para importar',
                    'errores' => $errores
                ], 422);
            }

            // Insertar cotización
            DB::beginTransaction();

            try {
                // Calcular costo total
                $costoTotal = array_sum(array_column($detalles, 'sub_total'));

                // Generar número de cotización único
                $ultimaCot = CotizacionesAntamina::orderBy('idcotizaciones_antamina', 'desc')->first();
                $numero = $ultimaCot ? (int)substr($ultimaCot->numero_cot, 4) + 1 : 1;
                $numeroCot = 'COT-' . str_pad($numero, 6, '0', STR_PAD_LEFT);

                // Insertar cotización
                $cotizacionId = DB::table('cotizaciones_antamina')->insertGetId([
                    'fecha_cot' => date('Y-m-d'),
                    'numero_cot' => $numeroCot,
                    'cliente' => $proveedor,
                    'descripcion' => 'Cotización importada desde Excel',
                    'costo_total' => $costoTotal
                ]);

                // Insertar detalles
                foreach ($detalles as $detalle) {
                    DB::table('detalle_cotizacion_antamina')->insert([
                        'fk_idcotizaciones_antamina' => $cotizacionId,
                        'fk_id_producto' => $detalle['fk_id_producto'],
                        'cantidad' => $detalle['cantidad'],
                        'precio_unitario' => $detalle['precio_unitario'],
                        'sub_total' => $detalle['sub_total'],
                        'marca' => $detalle['marca']
                    ]);
                }

                DB::commit();

                Log::info("=== IMPORTACIÓN COMPLETADA: Cotización $numeroCot creada para proveedor: $proveedor ===");

                return response()->json([
                    'success' => true,
                    'message' => "Cotización importada exitosamente",
                    'insertados' => 1,
                    'numero_cotizacion' => $numeroCot,
                    'proveedor' => $proveedor,
                    'total_productos' => count($detalles),
                    'costo_total' => $costoTotal,
                    'errores' => $errores,
                    'debug' => [
                        'total_filas_procesadas' => $filasProcesadas,
                        'productos_importados' => count($detalles),
                        'total_errores' => count($errores)
                    ]
                ], 200);
            } catch (\Exception $e) {
                DB::rollBack();
                Log::error('Error al insertar cotizaciones: ' . $e->getMessage());
                throw $e;
            }
        } catch (\Exception $e) {
            Log::error('Error en importación Excel: ' . $e->getMessage());
            Log::error($e->getTraceAsString());

            return response()->json([
                'success' => false,
                'message' => 'Error al procesar el archivo Excel',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exportar lista de cotizaciones a Excel
     */
    public function exportarExcel()
    {
        try {
            $cotizaciones = CotizacionesAntamina::with('detalles.producto')
                ->orderBy('fecha_cot', 'desc')
                ->get();

            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $sheet->setTitle('Cotizaciones');

            // Encabezados
            $headers = [
                'A1' => 'N° Cotización',
                'B1' => 'Fecha',
                'C1' => 'Proveedor/Cliente',
                'D1' => 'Descripción',
                'E1' => 'Productos',
                'F1' => 'Cantidad Total',
                'G1' => 'Costo Total'
            ];

            foreach ($headers as $cell => $value) {
                $sheet->setCellValue($cell, $value);
            }

            // Estilo de encabezados
            $headerStyle = [
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => 'FFFFFF'],
                    'size' => 12
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '4472C4']
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => ['rgb' => '000000']
                    ]
                ]
            ];

            $sheet->getStyle('A1:G1')->applyFromArray($headerStyle);

            // Ajustar ancho de columnas
            $sheet->getColumnDimension('A')->setWidth(20);
            $sheet->getColumnDimension('B')->setWidth(15);
            $sheet->getColumnDimension('C')->setWidth(30);
            $sheet->getColumnDimension('D')->setWidth(40);
            $sheet->getColumnDimension('E')->setWidth(15);
            $sheet->getColumnDimension('F')->setWidth(15);
            $sheet->getColumnDimension('G')->setWidth(18);

            // Datos
            $row = 2;
            foreach ($cotizaciones as $cotizacion) {
                $cantidadTotal = $cotizacion->detalles->sum('cantidad');
                $totalProductos = $cotizacion->detalles->count();

                $sheet->setCellValue('A' . $row, $cotizacion->numero_cot);
                $sheet->setCellValue('B' . $row, date('d/m/Y', strtotime($cotizacion->fecha_cot)));
                $sheet->setCellValue('C' . $row, $cotizacion->cliente);
                $sheet->setCellValue('D' . $row, $cotizacion->descripcion);
                $sheet->setCellValue('E' . $row, $totalProductos);
                $sheet->setCellValue('F' . $row, $cantidadTotal);
                $sheet->setCellValue('G' . $row, number_format($cotizacion->costo_total, 2));

                // Bordes
                $sheet->getStyle('A' . $row . ':G' . $row)->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                            'color' => ['rgb' => 'CCCCCC']
                        ]
                    ]
                ]);

                $row++;
            }

            // Formato de moneda para columna G
            $sheet->getStyle('G2:G' . ($row - 1))->getNumberFormat()->setFormatCode('#,##0.00');

            // Generar archivo
            $writer = new Xlsx($spreadsheet);
            $fileName = 'cotizaciones_antamina_' . date('Y-m-d_His') . '.xlsx';
            $tempFile = tempnam(sys_get_temp_dir(), 'excel');

            $writer->save($tempFile);

            return response()->download($tempFile, $fileName, [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ])->deleteFileAfterSend(true);
        } catch (\Exception $e) {
            Log::error('Error al exportar Excel: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al generar el archivo Excel',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exportar lista de cotizaciones a PDF
     */
    public function exportarPDF()
    {
        try {
            $cotizaciones = CotizacionesAntamina::with('detalles.producto')
                ->orderBy('fecha_cot', 'desc')
                ->get();

            $data = [
                'cotizaciones' => $cotizaciones,
                'fecha_generacion' => date('d/m/Y H:i:s')
            ];

            $pdf = Pdf::loadView('reportes.cotizaciones-lista', $data);
            $pdf->setPaper('a4', 'landscape');

            return $pdf->download('cotizaciones_antamina_' . date('Y-m-d_His') . '.pdf');
        } catch (\Exception $e) {
            Log::error('Error al exportar PDF: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al generar el PDF',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exportar una cotización específica a Excel con todos sus detalles
     */
    public function exportarCotizacionExcel($id)
    {
        try {
            $cotizacion = CotizacionesAntamina::with('detalles.producto.categoria')
                ->find($id);

            if (!$cotizacion) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cotización no encontrada'
                ], 404);
            }

            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $sheet->setTitle('Cotización');

            // Encabezado de la cotización
            $sheet->setCellValue('A1', 'COTIZACIÓN ANTAMINA');
            $sheet->mergeCells('A1:E1');
            $sheet->getStyle('A1')->applyFromArray([
                'font' => [
                    'bold' => true,
                    'size' => 16,
                    'color' => ['rgb' => 'FFFFFF']
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '4472C4']
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER
                ]
            ]);
            $sheet->getRowDimension(1)->setRowHeight(30);

            // Información de la cotización
            $row = 3;
            $infoStyle = [
                'font' => ['bold' => true, 'size' => 11],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'E7E6E6']
                ]
            ];

            $sheet->setCellValue('A' . $row, 'N° Cotización:');
            $sheet->setCellValue('B' . $row, $cotizacion->numero_cot);
            $sheet->getStyle('A' . $row)->applyFromArray($infoStyle);
            $row++;

            $sheet->setCellValue('A' . $row, 'Fecha:');
            $sheet->setCellValue('B' . $row, date('d/m/Y', strtotime($cotizacion->fecha_cot)));
            $sheet->getStyle('A' . $row)->applyFromArray($infoStyle);
            $row++;

            $sheet->setCellValue('A' . $row, 'Proveedor/Cliente:');
            $sheet->setCellValue('B' . $row, $cotizacion->cliente);
            $sheet->getStyle('A' . $row)->applyFromArray($infoStyle);
            $row++;

            $sheet->setCellValue('A' . $row, 'Descripción:');
            $sheet->setCellValue('B' . $row, $cotizacion->descripcion ?: '-');
            $sheet->getStyle('A' . $row)->applyFromArray($infoStyle);
            $row += 2;

            // Encabezados de productos
            $headers = [
                'A' => 'Producto',
                'B' => 'Categoría',
                'C' => 'Cantidad',
                'D' => 'Precio Unitario',
                'E' => 'Subtotal'
            ];

            foreach ($headers as $col => $value) {
                $sheet->setCellValue($col . $row, $value);
            }

            $headerStyle = [
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => 'FFFFFF'],
                    'size' => 11
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '4472C4']
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => ['rgb' => '000000']
                    ]
                ]
            ];

            $sheet->getStyle('A' . $row . ':E' . $row)->applyFromArray($headerStyle);
            $row++;

            // Datos de productos
            $startDataRow = $row;
            foreach ($cotizacion->detalles as $detalle) {
                $sheet->setCellValue('A' . $row, $detalle->producto->nombre);
                $sheet->setCellValue('B' . $row, $detalle->producto->categoria->nombre ?? '-');
                $sheet->setCellValue('C' . $row, $detalle->cantidad);
                $sheet->setCellValue('D' . $row, $detalle->precio_unitario);
                $sheet->setCellValue('E' . $row, $detalle->sub_total);

                // Estilo para datos
                $sheet->getStyle('A' . $row . ':E' . $row)->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                            'color' => ['rgb' => 'CCCCCC']
                        ]
                    ]
                ]);

                $row++;
            }

            // Fila de TOTAL
            $sheet->setCellValue('A' . $row, 'TOTAL:');
            $sheet->mergeCells('A' . $row . ':D' . $row);
            $sheet->setCellValue('E' . $row, $cotizacion->costo_total);

            $totalStyle = [
                'font' => [
                    'bold' => true,
                    'size' => 12,
                    'color' => ['rgb' => 'FFFFFF']
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '2d7a2d']
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_RIGHT,
                    'vertical' => Alignment::VERTICAL_CENTER
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_MEDIUM,
                        'color' => ['rgb' => '000000']
                    ]
                ]
            ];

            $sheet->getStyle('A' . $row . ':E' . $row)->applyFromArray($totalStyle);

            // Ajustar anchos de columna
            $sheet->getColumnDimension('A')->setWidth(40);
            $sheet->getColumnDimension('B')->setWidth(25);
            $sheet->getColumnDimension('C')->setWidth(12);
            $sheet->getColumnDimension('D')->setWidth(18);
            $sheet->getColumnDimension('E')->setWidth(18);

            // Formato de moneda
            $sheet->getStyle('D' . $startDataRow . ':E' . $row)->getNumberFormat()->setFormatCode('#,##0.00');

            // Generar archivo
            $writer = new Xlsx($spreadsheet);
            $fileName = 'cotizacion_' . $cotizacion->numero_cot . '_' . date('Y-m-d') . '.xlsx';
            $tempFile = tempnam(sys_get_temp_dir(), 'excel');

            $writer->save($tempFile);

            return response()->download($tempFile, $fileName, [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ])->deleteFileAfterSend(true);
        } catch (\Exception $e) {
            Log::error('Error al exportar cotización a Excel: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al generar el archivo Excel',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exportar una cotización específica a PDF con todos sus detalles
     */
    public function exportarCotizacionPDF($id)
    {
        try {
            $cotizacion = CotizacionesAntamina::with('detalles.producto.categoria')
                ->find($id);

            if (!$cotizacion) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cotización no encontrada'
                ], 404);
            }

            $data = [
                'cotizacion' => $cotizacion,
                'fecha_generacion' => date('d/m/Y H:i:s')
            ];

            $pdf = Pdf::loadView('reportes.cotizacion-detalle', $data);
            $pdf->setPaper('a4', 'portrait');

            return $pdf->download('cotizacion_' . $cotizacion->numero_cot . '_' . date('Y-m-d') . '.pdf');
        } catch (\Exception $e) {
            Log::error('Error al exportar cotización a PDF: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al generar el PDF',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
