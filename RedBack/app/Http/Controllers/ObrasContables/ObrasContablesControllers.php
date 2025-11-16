<?php

namespace App\Http\Controllers\ObrasContables;

use App\Http\Controllers\Controller;
use App\Models\ObrasCodigo;
use App\Exports\ObrasContablesExport;
use App\Exports\ObrasContablesGroupedExport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Dompdf\Dompdf;
use Dompdf\Options;
use Carbon\Carbon;

class ObrasContablesControllers extends Controller
{
    /**
     * Obtener datos para el reporte de obras contables
     */
    private function getObrasContablesData()
    {
        return ObrasCodigo::join('obras as o', 'o.idobras', '=', 'obras_codigos.fk_idobras')
            ->join('codigos_contables as cc', 'cc.idcodigos_contables', '=', 'obras_codigos.fk_idcodigos_contables')
            ->select([
                'obras_codigos.fecha_registro',
                'o.codigo as codigo_obra',
                'o.nom_obra',
                'cc.codigo_contable',
                'cc.nombre_contable',
                'cc.descripcion'
            ])
            ->orderBy('obras_codigos.fecha_registro', 'desc')
            ->get();
    }

    /**
     * Mostrar el listado de obras contables
     */
    public function index(Request $request)
    {
        try {
            $data = $this->getObrasContablesData();

            return response()->json([
                'success' => true,
                'data' => $data,
                'total' => $data->count(),
                'message' => 'Datos obtenidos correctamente'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los datos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exportar reporte a Excel (formato tradicional)
     */
    public function exportExcel(Request $request)
    {
        try {
            $fechaInicio = $request->get('fecha_inicio');
            $fechaFin = $request->get('fecha_fin');

            $fileName = 'reporte_obras_contables_' . Carbon::now()->format('Y-m-d_H-i-s') . '.xlsx';

            if ($fechaInicio && $fechaFin) {
                $fileName = 'reporte_obras_contables_' . Carbon::parse($fechaInicio)->format('Y-m-d') . '_al_' . Carbon::parse($fechaFin)->format('Y-m-d') . '.xlsx';
            }

            return Excel::download(new ObrasContablesExport($fechaInicio, $fechaFin), $fileName);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al generar el archivo Excel: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exportar reporte a Excel agrupado por obra
     */
    public function exportExcelGrouped(Request $request)
    {
        try {
            $fechaInicio = $request->get('fecha_inicio');
            $fechaFin = $request->get('fecha_fin');

            $fileName = 'reporte_obras_agrupado_' . Carbon::now()->format('Y-m-d_H-i-s') . '.xlsx';

            if ($fechaInicio && $fechaFin) {
                $fileName = 'reporte_obras_agrupado_' . Carbon::parse($fechaInicio)->format('Y-m-d') . '_al_' . Carbon::parse($fechaFin)->format('Y-m-d') . '.xlsx';
            }

            return Excel::download(new ObrasContablesGroupedExport($fechaInicio, $fechaFin), $fileName);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al generar el archivo Excel agrupado: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exportar reporte a PDF
     */
    public function exportPdf()
    {
        try {
            $data = $this->getObrasContablesData();
            $fileName = 'reporte_obras_contables_' . Carbon::now()->format('Y-m-d_H-i-s') . '.pdf';

            // Generar el HTML desde la vista
            $html = view('reports.obras_contables', compact('data'))->render();

            // Configurar opciones de DomPDF
            $options = new Options();
            $options->set('defaultFont', 'Arial');
            $options->set('isPhpEnabled', true);
            $options->set('isRemoteEnabled', true);
            $options->set('defaultMediaType', 'print');
            $options->set('isFontSubsettingEnabled', true);

            // Crear instancia de DomPDF
            $dompdf = new Dompdf($options);
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'landscape');
            $dompdf->render();

            // Retornar respuesta con PDF
            return response($dompdf->output(), 200)
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'attachment; filename="' . $fileName . '"');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al generar el archivo PDF: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Vista previa del reporte (opcional)
     */
    public function preview()
    {
        try {
            $data = $this->getObrasContablesData();

            return view('reports.obras_contables', compact('data'));
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al generar la vista previa: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reporte filtrado por fechas
     */
    public function reportByDateRange(Request $request)
    {
        try {
            $request->validate([
                'fecha_inicio' => 'required|date',
                'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
                'formato' => 'required|in:excel,pdf'
            ]);

            $fechaInicio = Carbon::parse($request->fecha_inicio)->startOfDay();
            $fechaFin = Carbon::parse($request->fecha_fin)->endOfDay();

            $data = ObrasCodigo::join('obras as o', 'o.idobras', '=', 'obras_codigos.fk_idobras')
                ->join('codigos_contables as cc', 'cc.idcodigos_contables', '=', 'obras_codigos.fk_idcodigos_contables')
                ->select([
                    'obras_codigos.fecha_registro',
                    'o.codigo as codigo_obra',
                    'o.nom_obra',
                    'cc.codigo_contable',
                    'cc.nombre_contable',
                    'cc.descripcion'
                ])
                ->whereBetween('obras_codigos.fecha_registro', [$fechaInicio, $fechaFin])
                ->orderBy('obras_codigos.fecha_registro', 'desc')
                ->get();

            if ($data->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se encontraron registros en el rango de fechas especificado'
                ], 404);
            }

            $fileName = 'reporte_obras_contables_' . $fechaInicio->format('Y-m-d') . '_al_' . $fechaFin->format('Y-m-d') . '_' . Carbon::now()->format('H-i-s');

            if ($request->formato === 'excel') {
                return Excel::download(new ObrasContablesGroupedExport($fechaInicio, $fechaFin), $fileName . '.xlsx');
            } else {
                // Generar el HTML desde la vista
                $html = view('reports.obras_contables', compact('data'))->render();

                // Configurar opciones de DomPDF
                $options = new Options();
                $options->set('defaultFont', 'Arial');
                $options->set('isPhpEnabled', true);
                $options->set('isRemoteEnabled', true);
                $options->set('defaultMediaType', 'print');
                $options->set('isFontSubsettingEnabled', true);

                // Crear instancia de DomPDF
                $dompdf = new Dompdf($options);
                $dompdf->loadHtml($html);
                $dompdf->setPaper('A4', 'landscape');
                $dompdf->render();

                // Retornar respuesta con PDF
                return response($dompdf->output(), 200)
                    ->header('Content-Type', 'application/pdf')
                    ->header('Content-Disposition', 'attachment; filename="' . $fileName . '.pdf"');
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al generar el reporte: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener estadísticas del reporte
     */
    public function getStats()
    {
        try {
            $totalRegistros = ObrasCodigo::count();
            $totalObras = ObrasCodigo::distinct('fk_idobras')->count();
            $totalCodigosContables = ObrasCodigo::distinct('fk_idcodigos_contables')->count();

            $registrosPorMes = ObrasCodigo::selectRaw('YEAR(fecha_registro) as year, MONTH(fecha_registro) as month, COUNT(*) as total')
                ->groupBy('year', 'month')
                ->orderBy('year', 'desc')
                ->orderBy('month', 'desc')
                ->limit(12)
                ->get();

            return response()->json([
                'success' => true,
                'stats' => [
                    'total_registros' => $totalRegistros,
                    'total_obras' => $totalObras,
                    'total_codigos_contables' => $totalCodigosContables,
                    'registros_por_mes' => $registrosPorMes
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las estadísticas: ' . $e->getMessage()
            ], 500);
        }
    }
}
