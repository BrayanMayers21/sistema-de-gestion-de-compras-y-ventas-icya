<?php

namespace App\Exports;

use App\Models\ObrasCodigo;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Font;
use PhpOffice\PhpSpreadsheet\Style\Border;
use Carbon\Carbon;

class ObrasContablesExport implements FromCollection, WithHeadings, WithStyles, WithColumnWidths, WithTitle
{
    protected $fechaInicio;
    protected $fechaFin;

    public function __construct($fechaInicio = null, $fechaFin = null)
    {
        $this->fechaInicio = $fechaInicio;
        $this->fechaFin = $fechaFin;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        $query = ObrasCodigo::join('obras as o', 'o.idobras', '=', 'obras_codigos.fk_idobras')
            ->join('codigos_contables as cc', 'cc.idcodigos_contables', '=', 'obras_codigos.fk_idcodigos_contables')
            ->select([
                'obras_codigos.fecha_registro',
                'o.codigo as codigo_obra',
                'o.nom_obra',
                'cc.codigo_contable',
                'cc.nombre_contable',
                'cc.descripcion'
            ]);

        // Aplicar filtro de fechas si se proporcionan
        if ($this->fechaInicio && $this->fechaFin) {
            $query->whereBetween('obras_codigos.fecha_registro', [
                Carbon::parse($this->fechaInicio)->startOfDay(),
                Carbon::parse($this->fechaFin)->endOfDay()
            ]);
        }

        return $query->orderBy('obras_codigos.fecha_registro', 'desc')
            ->get()
            ->map(function ($row) {
                return [
                    'fecha_registro' => $row->fecha_registro ? $row->fecha_registro->format('d/m/Y') : '',
                    'codigo_obra' => $row->codigo_obra,
                    'nom_obra' => $row->nom_obra,
                    'codigo_contable' => $row->codigo_contable,
                    'nombre_contable' => $row->nombre_contable,
                    'descripcion' => $row->descripcion,
                ];
            });
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'Fecha Registro',
            'Código Obra',
            'Nombre Obra',
            'Código Contable',
            'Nombre Contable',
            'Descripción'
        ];
    }

    /**
     * @param Worksheet $sheet
     * @return array
     */
    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as bold text.
            1 => [
                'font' => [
                    'bold' => true,
                    'size' => 12,
                ],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => [
                        'argb' => 'FFE6E6FA',
                    ],
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                    ],
                ],
            ],
            // Style all data rows
            'A2:F1000' => [
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                    ],
                ],
                'alignment' => [
                    'vertical' => Alignment::VERTICAL_TOP,
                    'wrapText' => true,
                ],
            ],
        ];
    }

    /**
     * @return array
     */
    public function columnWidths(): array
    {
        return [
            'A' => 15,  // Fecha Registro
            'B' => 15,  // Código Obra
            'C' => 30,  // Nombre Obra
            'D' => 15,  // Código Contable
            'E' => 25,  // Nombre Contable
            'F' => 40,  // Descripción
        ];
    }

    /**
     * @return string
     */
    public function title(): string
    {
        $title = 'Reporte Obras Contables';

        if ($this->fechaInicio && $this->fechaFin) {
            $title .= ' (' . Carbon::parse($this->fechaInicio)->format('d-m-Y') . ' al ' . Carbon::parse($this->fechaFin)->format('d-m-Y') . ')';
        }

        return $title;
    }
}
