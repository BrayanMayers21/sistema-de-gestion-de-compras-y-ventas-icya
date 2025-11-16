<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Reporte de Obras Contables</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            margin: 0;
            padding: 20px;
            line-height: 1.4;
        }

        .header {
            background-color: #1e3c72;
            color: white;
            padding: 30px;
            margin: -20px -20px 30px -20px;
            border-bottom: 8px solid #f39c12;
        }

        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin: 0;
        }

        .header-table td {
            vertical-align: top;
            padding: 0;
            border: none;
        }

        .company-section {
            width: 60%;
        }

        .company-name {
            font-size: 28px;
            font-weight: bold;
            margin: 0 0 8px 0;
            color: #ffffff;
            text-transform: uppercase;
        }

        .company-subtitle {
            font-size: 16px;
            color: #bdc3c7;
            margin: 0;
        }

        .report-section {
            width: 40%;
            text-align: right;
        }

        .report-title {
            font-size: 24px;
            font-weight: bold;
            margin: 0 0 10px 0;
            color: #f39c12;
            text-transform: uppercase;
        }

        .report-date {
            font-size: 14px;
            color: #ecf0f1;
            margin: 0;
            background-color: #2a5298;
            padding: 8px 15px;
            border-radius: 20px;
            display: inline-block;
        }

        .obra-section {
            margin-bottom: 25px;
            page-break-inside: avoid;
        }

        .obra-header {
            background-color: #1e3c72;
            color: white;
            padding: 5px 10px;
            margin-bottom: 0;
        }

        .obra-title-line {
            font-size: 14px;
            font-weight: bold;
            margin: 0;
            color: #ffffff;
            line-height: 1.3;
        }

        .obra-name {
            color: #ffffff;
        }

        .obra-code {
            color: #f39c12;
            margin-left: 15px;
        }

        .codigos-table {
            width: 100%;
            border-collapse: collapse;
            margin: 0;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            border-radius: 0 0 8px 8px;
            overflow: hidden;
        }

        .codigos-table th {
            background-color: #34495e;
            color: white;
            font-weight: bold;
            padding: 10px 8px;
            text-align: left;
            border-bottom: 2px solid #2c3e50;
            font-size: 10px;
        }

        .codigos-table td {
            padding: 8px;
            border-bottom: 1px solid #ecf0f1;
            vertical-align: top;
        }

        .codigos-table tr:nth-child(even) {
            background-color: #f8f9fa;
        }

        .codigos-table tr:hover {
            background-color: #e8f4f8;
        }

        .fecha-column {
            width: 15%;
            text-align: center;
        }

        .codigo-contable-column {
            width: 15%;
            text-align: center;
            font-weight: bold;
            color: #2980b9;
        }

        .nombre-contable-column {
            width: 25%;
            font-weight: 500;
        }

        .descripcion-column {
            width: 45%;
        }

        .no-data {
            text-align: center;
            padding: 20px;
            color: #7f8c8d;
            font-style: italic;
        }

        .footer {
            position: fixed;
            bottom: 10mm;
            left: 15mm;
            right: 15mm;
            background-color: #1e3c72;
            color: white;
            padding: 15px 25px;
            border-top: 4px solid #f39c12;
        }

        .footer-table {
            width: 100%;
            border-collapse: collapse;
        }

        .footer-table td {
            border: none;
            padding: 0;
            vertical-align: middle;
        }

        .footer-left {
            font-size: 11px;
            font-weight: 500;
        }

        .footer-right {
            font-size: 11px;
            color: #f39c12;
            font-weight: bold;
            text-align: right;
        }

        .page-number:after {
            content: counter(page);
        }

        .summary-stats {
            background-color: #f8f9fa;
            padding: 20px;
            margin-bottom: 25px;
            border-left: 8px solid #f39c12;
            border-top: 2px solid #f39c12;
            border-bottom: 2px solid #f39c12;
        }

        .stats-table {
            width: 100%;
            border-collapse: collapse;
        }

        .stat-item {
            text-align: center;
            padding: 15px;
            background-color: white;
            border: 2px solid #ecf0f1;
            width: 33.33%;
        }

        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #1e3c72;
            display: block;
            margin-bottom: 5px;
        }

        .stat-label {
            font-size: 11px;
            color: #6c757d;
            text-transform: uppercase;
            font-weight: 600;
            letter-spacing: 0.5px;
        }

        .stat-icon {
            font-size: 20px;
            margin-bottom: 5px;
            display: block;
        }

        @page {
            margin: 15mm 15mm 25mm 15mm;
        }

        @media print {
            .obra-section {
                page-break-inside: avoid;
            }
        }
    </style>
</head>

<body>
    @php
        $obrasPorCodigo = $data->groupBy('codigo_obra');
    @endphp



    @if($obrasPorCodigo->count() > 0)
        @foreach($obrasPorCodigo as $codigoObra => $registrosObra)
            @php
                $primeraObra = $registrosObra->first();
            @endphp

            <div class="obra-section">
                <div class="obra-header">
                    <div class="obra-title-line">
                        <span class="obra-name"> {{ $primeraObra->nom_obra }}</span>
                        <span class="obra-code">- CÓDIGO: {{ $codigoObra }}</span>
                    </div>

                </div>

                <table class="codigos-table">
                    <thead>
                        <tr>

                            <th class="codigo-contable-column">Código Contable</th>
                            <th class="nombre-contable-column">Nombre Contable</th>
                            <th class="descripcion-column">Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($registrosObra as $registro)
                            <tr>

                                <td class="codigo-contable-column">{{ $registro->codigo_contable }}</td>
                                <td class="nombre-contable-column">{{ $registro->nombre_contable }}</td>
                                <td class="descripcion-column">{{ $registro->descripcion }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endforeach
    @else
        <div class="no-data">
            <p>No se encontraron registros para mostrar.</p>
        </div>
    @endif


</body>

</html>