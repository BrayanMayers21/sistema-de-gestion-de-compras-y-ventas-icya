<?php

namespace App\Exports;

use App\Models\ObrasCodigo;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Font;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use Carbon\Carbon;

class ObrasContablesGroupedExport implements FromCollection, WithHeadings, WithStyles, WithColumnWidths, WithTitle
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

        $data = $query->orderBy('o.codigo')
            ->orderBy('obras_codigos.fecha_registro', 'desc')
            ->get();

        // Agrupar datos por obra para el formato mejorado
        $result = collect();
        $groupedData = $data->groupBy('codigo_obra');

        foreach ($groupedData as $codigoObra => $registrosObra) {
            $primeraObra = $registrosObra->first();
            $totalCodigos = $registrosObra->count();

            // Agregar fila de encabezado de obra con información completa
            $result->push([
                'fecha_registro' => '',
                'codigo_obra' => "CÓDIGO: {$codigoObra}",
                'nom_obra' => strtoupper($primeraObra->nom_obra),
                'codigo_contable' => '',
                'nombre_contable' => '',
                'descripcion' => "({$totalCodigos} código" . ($totalCodigos != 1 ? 's' : '') . " contable" . ($totalCodigos != 1 ? 's' : '') . ")"
            ]);

            // Agregar registros de códigos contables
            foreach ($registrosObra as $registro) {
                $result->push([
                    'fecha_registro' => $registro->fecha_registro ? $registro->fecha_registro->format('d/m/Y') : '',
                    'codigo_obra' => '',
                    'nom_obra' => '',
                    'codigo_contable' => $registro->codigo_contable,
                    'nombre_contable' => $registro->nombre_contable,
                    'descripcion' => $registro->descripcion,
                ]);
            }

            // Agregar fila vacía para separar obras
            $result->push([
                'fecha_registro' => '',
                'codigo_obra' => '',
                'nom_obra' => '',
                'codigo_contable' => '',
                'nombre_contable' => '',
                'descripcion' => ''
            ]);
        }

        return $result;
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
        $styles = [
            // Estilo del encabezado principal
            1 => [
                'font' => [
                    'bold' => true,
                    'size' => 12,
                    'color' => ['rgb' => 'FFFFFF']
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '2980B9']
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => ['rgb' => '2C3E50']
                    ]
                ]
            ]
        ];

        // Aplicar estilos dinámicamente basándose en el contenido
        $data = $this->collection();
        $currentRow = 2; // Empezamos después del encabezado

        foreach ($data as $row) {
            if ($row['codigo_obra'] && $row['nom_obra'] && strpos($row['descripcion'], 'código') !== false) {
                // Es un encabezado de obra
                $styles[$currentRow] = [
                    'font' => [
                        'bold' => true,
                        'size' => 12,
                        'color' => ['rgb' => 'FFFFFF']
                    ],
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => '2C3E50']
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_LEFT,
                        'vertical' => Alignment::VERTICAL_CENTER
                    ],
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THICK,
                            'color' => ['rgb' => '3498DB']
                        ]
                    ]
                ];
            } elseif ($row['codigo_contable']) {
                // Es un registro de código contable
                $styles[$currentRow] = [
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                            'color' => ['rgb' => 'CCCCCC']
                        ]
                    ],
                    'alignment' => [
                        'vertical' => Alignment::VERTICAL_TOP,
                        'wrapText' => true
                    ]
                ];

                // Alternar colores para mejor legibilidad
                if ($currentRow % 2 == 0) {
                    $styles[$currentRow]['fill'] = [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'F8F9FA']
                    ];
                }
            }

            $currentRow++;
        }

        return $styles;
    }

    /**
     * @return array
     */
    public function columnWidths(): array
    {
        return [
            'A' => 15,  // Fecha Registro
            'B' => 15,  // Código Obra
            'C' => 35,  // Nombre Obra
            'D' => 15,  // Código Contable
            'E' => 25,  // Nombre Contable
            'F' => 45,  // Descripción
        ];
    }

    /**
     * @return string
     */
    public function title(): string
    {
        $title = 'Obras Contables Agrupadas';

        if ($this->fechaInicio && $this->fechaFin) {
            $title .= ' (' . Carbon::parse($this->fechaInicio)->format('d-m-Y') . ' al ' . Carbon::parse($this->fechaFin)->format('d-m-Y') . ')';
        }

        return $title;
    }
}
