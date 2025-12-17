<?php

namespace App\Exports;

use App\Models\AsistenciaEmpleado;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AsistenciaMensualExport implements FromCollection, WithHeadings, WithStyles, WithColumnWidths, WithTitle
{
    protected $fechaInicio;
    protected $fechaFin;

    public function __construct($fechaInicio, $fechaFin)
    {
        $this->fechaInicio = $fechaInicio;
        $this->fechaFin = $fechaFin;
    }

    public function collection()
    {
        return DB::table('asistencias_empleados as ae')
            ->join('empleados as e', 'e.idempleados', '=', 'ae.fk_idempleados')
            ->join('personas as p', 'p.idpersonas', '=', 'e.fk_idpersonas')
            ->join('cargos_empleados as ce', 'ce.idcargos_empleados', '=', 'e.fk_idcargos_empleados')
            ->select(
                DB::raw("CONCAT(p.nombres, ' ', p.primer_apell, ' ', p.segundo_apell) as nombre_completo"),
                'ce.nom_cargo_empleado',
                'ae.fecha_asistio',
                'ae.estado',
                'ae.observacion'
            )
            ->whereBetween('ae.fecha_asistio', [$this->fechaInicio, $this->fechaFin])
            ->orderBy('ae.fecha_asistio', 'asc')
            ->orderBy('p.primer_apell', 'asc')
            ->get()
            ->map(function ($row) {
                return [
                    'nombre_completo' => $row->nombre_completo,
                    'cargo' => $row->nom_cargo_empleado,
                    'fecha' => Carbon::parse($row->fecha_asistio)->format('d/m/Y'),
                    'estado' => $row->estado,
                    'observacion' => $row->observacion ?? '',
                ];
            });
    }

    public function headings(): array
    {
        return [
            'Colaborador',
            'Cargo',
            'Fecha',
            'Estado',
            'Observación'
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true, 'size' => 12],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                'borders' => ['bottom' => ['borderStyle' => Border::BORDER_THIN]],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['argb' => 'FFE0E0E0'],
                ],
            ],
            'A:E' => [
                'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
            ]
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 35,
            'B' => 20,
            'C' => 15,
            'D' => 15,
            'E' => 40,
        ];
    }

    public function title(): string
    {
        return 'Asistencias ' . Carbon::parse($this->fechaInicio)->format('M Y');
    }
}
