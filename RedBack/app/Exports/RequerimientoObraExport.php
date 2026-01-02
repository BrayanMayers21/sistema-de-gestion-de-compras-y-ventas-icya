<?php

namespace App\Exports;

use App\Models\RequerimientoObra;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class RequerimientoObraExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle, ShouldAutoSize
{
    protected $requerimiento;

    public function __construct(RequerimientoObra $requerimiento)
    {
        $this->requerimiento = $requerimiento;
    }

    public function collection()
    {
        return $this->requerimiento->detalles;
    }

    public function headings(): array
    {
        return [
            ['REQUERIMIENTO DE OBRA'],
            [''],
            ['Número de Requerimiento:', $this->requerimiento->numero_requerimiento],
            ['Obra:', $this->requerimiento->obra->nom_obra ?? 'N/A'],
            ['Residente de Obra:', $this->requerimiento->residente_obra],
            ['Fecha de Requerimiento:', $this->requerimiento->fecha_requerimiento],
            ['Fecha de Atención:', $this->requerimiento->fecha_atencion ?? 'No atendido'],
            ['Lugar de Entrega:', $this->requerimiento->lugar_entrega ?? 'N/A'],
            ['Estado:', strtoupper($this->requerimiento->estado)],
            [''],
            ['DETALLE DE PRODUCTOS'],
            ['#', 'Producto', 'Marca', 'Color', 'Tipo', 'Calidad', 'Medida', 'Cantidad Solicitada', 'Cantidad Entregada', 'Pendiente', '% Avance', 'Estado', 'Observaciones']
        ];
    }

    public function map($detalle): array
    {
        $cantidadPendiente = $detalle->cantidad - ($detalle->cantidad_entregada ?? 0);
        $porcentajeAvance = $detalle->cantidad > 0 ? (($detalle->cantidad_entregada ?? 0) / $detalle->cantidad) * 100 : 0;

        return [
            $detalle->id_detalle,
            $detalle->producto->nombre ?? 'N/A',
            $detalle->marca ?? '-',
            $detalle->color ?? '-',
            $detalle->tipo ?? '-',
            $detalle->calidad ?? '-',
            $detalle->medida ?? '-',
            $detalle->cantidad,
            $detalle->cantidad_entregada ?? 0,
            $cantidadPendiente,
            round($porcentajeAvance, 2) . '%',
            strtoupper($detalle->estado ?? 'pendiente'),
            $detalle->observaciones ?? '-'
        ];
    }

    public function styles(Worksheet $sheet)
    {
        // Título principal
        $sheet->mergeCells('A1:M1');
        $sheet->getStyle('A1')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 16,
                'color' => ['rgb' => 'FFFFFF']
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '2563EB']
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER
            ]
        ]);

        // Información del requerimiento
        $sheet->getStyle('A3:A9')->applyFromArray([
            'font' => ['bold' => true],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => 'E5E7EB']
            ]
        ]);

        // Título de detalle
        $sheet->mergeCells('A11:M11');
        $sheet->getStyle('A11')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 14,
                'color' => ['rgb' => 'FFFFFF']
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '059669']
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER
            ]
        ]);

        // Encabezados de tabla
        $sheet->getStyle('A12:M12')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF']
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '047857']
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
        ]);

        // Bordes para datos
        $lastRow = 12 + $this->requerimiento->detalles->count();
        $sheet->getStyle('A12:M' . $lastRow)->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => 'D1D5DB']
                ]
            ]
        ]);

        // Altura de filas
        $sheet->getRowDimension(1)->setRowHeight(30);
        $sheet->getRowDimension(11)->setRowHeight(25);
        $sheet->getRowDimension(12)->setRowHeight(25);

        return [];
    }

    public function title(): string
    {
        return 'Requerimiento';
    }
}
