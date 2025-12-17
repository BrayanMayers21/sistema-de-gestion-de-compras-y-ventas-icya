<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Reporte de Asistencias</title>
    <style>
        @page {
            margin: 10px;
        }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 10px;
            color: #333;
        }

        /* Header */
        .header {
            width: 100%;
            border-bottom: 2px solid #4CAF50;
            margin-bottom: 20px;
            padding-bottom: 15px;
        }

        .header-table {
            width: 100%;
            border-collapse: collapse;
        }

        .header-table td {
            vertical-align: top;
            padding: 0;
        }

        .logo-cell {
            width: 100px;
            padding-right: 15px;
        }

        .logo {
            width: 80px;
            height: 80px;
            border: 1px solid #ddd;
        }

        .logo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        .company-cell {
            padding-left: 10px;
        }

        .company-name {
            font-size: 12px;
            font-weight: bold;
            color: #333;
            margin-bottom: 3px;
        }

        .company-subtitle {
            font-size: 9px;
            color: #FF9800;
            font-weight: bold;
        }

        .title-cell {
            text-align: right;
            padding-left: 20px;
        }

        .main-title {
            font-size: 14px;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }

        .period-text {
            font-size: 11px;
            color: #666;
            background: #f0f0f0;
            padding: 5px 10px;
            border-radius: 3px;
            display: inline-block;
            text-transform: uppercase;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            table-layout: fixed;
        }

        th,
        td {
            border: 1px solid #e2e8f0;
            padding: 2px;
            text-align: center;
            vertical-align: middle;
        }

        /* Headers */
        th.col-empleado {
            width: 12%;
            white-space: nowrap;
            text-align: left;
            font-weight: bold;
            padding: 4px 6px;
            font-size: 9px;
        }

        th.col-dia {
            font-size: 7px;
            background-color: #FF9800;
            color: white;
            padding: 2px 1px;
            font-weight: bold;
        }

        th.col-dia.weekend {
            background-color: #f57c00;
            color: white;
        }

        /* Rows */
        td.col-empleado {
            padding: 3px 6px;
            width: 12%;
            white-space: nowrap;
            font-size: 8px;
            font-weight: 500;
        }

        td.cell-day {
            height: 24px;
            font-size: 10px;
            padding: 2px 1px;
        }

        td.cell-day.weekend {
            background-color: #f8fafc;
        }

        /* Badges */
        .badge {
            display: inline-block;
            width: 16px;
            height: 16px;
            line-height: 16px;
            border-radius: 4px;
            font-weight: bold;
            color: white;
        }

        .bg-asistio {
            background-color: #10b981;
            color: white;
        }

        /* Emerald 500 */
        .bg-falta {
            background-color: #f43f5e;
            color: white;
        }

        /* Rose 500 */
        .bg-tardanza {
            background-color: #f59e0b;
            color: white;
        }

        /* Amber 500 */
        .bg-justificado {
            background-color: #3b82f6;
            color: white;
        }

        /* Blue 500 */

        .text-check {
            color: #10b981;
            font-weight: bold;
            font-size: 12px;
        }

        .text-x {
            color: #f43f5e;
            font-weight: bold;
            font-size: 11px;
        }

        .text-clock {
            color: #f59e0b;
            font-weight: bold;
            font-size: 11px;
        }
    </style>
</head>

<body>
    <!-- Header -->
    <div class="header">
        <table class="header-table" cellpadding="0" cellspacing="0">
            <tr>
                <td class="logo-cell">
                    <div class="logo">
                        @php
                            $logoPath = public_path('logo/logo.jpg');
                            $logoExists = file_exists($logoPath);
                        @endphp
                        @if($logoExists)
                            @php
                                $imageData = base64_encode(file_get_contents($logoPath));
                                $src = 'data:image/jpeg;base64,' . $imageData;
                            @endphp
                            <img src="{{ $src }}" alt="Logo ICA" style="width: 100%; height: 100%; object-fit: contain;">
                        @else
                            <div
                                style="width: 100%; height: 100%; background: #4CAF50; color: white; font-weight: bold; font-size: 16px; text-align: center; line-height: 80px;">
                                IcA
                            </div>
                        @endif
                    </div>
                </td>
                <td class="company-cell">
                    <div class="company-name">INGENIERÍA DEL CONCRETO Y ALBAÑILERÍA</div>
                    <div class="company-subtitle">CONSULTORÍA & CONSTRUCCIÓN</div>
                    <div class="company-subtitle">RUC: 20533984992</div>
                </td>
                <td class="title-cell">
                    <div class="main-title">Reporte de Asistencias</div>
                    <div class="period-text">
                        {{ ucfirst($fechaInicio->locale('es')->isoFormat('MMMM YYYY')) }}
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <table>
        <thead>
            <tr>
                <th class="col-empleado" style="text-align: left; white-space: nowrap; width: 12%;">TRABAJADOR</th>
                @foreach($dias as $dia)
                    @php
                        $isWeekend = $dia->isWeekend();
                    @endphp
                    <th class="col-dia {{ $isWeekend ? 'weekend' : '' }}">
                        {{ $dia->format('d') }}<br>
                        {{ strtoupper(substr($dia->isoFormat('ddd'), 0, 1)) }}
                    </th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @foreach($empleados as $emp)
                <tr>
                    <td class="col-empleado"
                        style="text-align: left; vertical-align: middle; white-space: nowrap; width: 12%;">
                        {{ strtoupper($emp->nombre_completo) }}<br>
                        <span
                            style="font-size: 6px; color: #94a3b8; font-weight: normal;">{{ strtoupper($emp->nom_cargo_empleado) }}</span>
                    </td>
                    @foreach($dias as $dia)
                        @php
                            $fechaStr = $dia->format('Y-m-d');
                            $estado = $asistenciasMap[$emp->idempleados][$fechaStr] ?? null;
                            $isWeekend = $dia->isWeekend();
                        @endphp
                        <td class="cell-day {{ $isWeekend ? 'weekend' : '' }}">
                            @if($estado === 'ASISTIO')
                                <span class="text-check">&#10003;</span>
                            @elseif($estado === 'FALTA')
                                <span class="text-x">&#10007;</span>
                            @elseif($estado === 'TARDANZA')
                                <span class="text-clock">T</span>
                            @elseif($estado === 'JUSTIFICADO')
                                <span style="color: blue; font-weight: bold;">J</span>
                            @endif
                        </td>
                    @endforeach
                </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>