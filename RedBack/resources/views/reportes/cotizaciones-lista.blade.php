<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista de Cotizaciones Antamina</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            line-height: 1.4;
            color: #333;
            background: white;
            margin: 0;
            padding: 20px;
        }

        .container {
            width: 100%;
            max-width: 297mm;
            margin: 0 auto;
            background: white;
        }

        .header {
            width: 100%;
            border-bottom: 2px solid #4CAF50;
            margin-bottom: 25px;
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
            width: 150px;
            padding-right: 20px;
        }

        .logo {
            width: 100px;
            height: 100px;
            border: 1px solid #ddd;
        }

        .logo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        .company-cell {
            width: 400px;
            padding-left: 10px;
        }

        .company-name {
            font-size: 14px;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }

        .company-subtitle {
            font-size: 11px;
            color: #FF9800;
            font-weight: bold;
        }

        .title-cell {
            text-align: right;
            padding-left: 20px;
        }

        .main-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
        }

        .document-subtitle {
            font-size: 12px;
            color: #666;
        }

        .info {
            background: #f9f9f9;
            border: 1px solid #ddd;
            padding: 10px 15px;
            margin-bottom: 15px;
            font-size: 10px;
            color: #666;
        }

        table {
            width: 100%;
            margin: 20px 0;
            border-collapse: collapse;
            border: 1px solid #ddd;
        }

        thead {
            background: #FF9800;
            color: white;
        }

        thead th {
            padding: 10px 8px;
            text-align: center;
            font-weight: bold;
            font-size: 10px;
            border: 1px solid #FF9800;
        }

        tbody td {
            padding: 8px;
            text-align: center;
            border: 1px solid #ddd;
            font-size: 10px;
            background: white;
        }

        tbody tr:nth-child(even) td {
            background-color: #f9f9f9;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .text-left {
            text-align: left !important;
            padding-left: 10px !important;
        }

        .total-row {
            font-weight: bold;
            background-color: #4CAF50 !important;
            color: white;
        }

        .total-row td {
            padding: 10px 8px;
            font-size: 11px;
            border: 1px solid #4CAF50;
        }

        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 9px;
            color: #999;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }

        .page-number:after {
            content: "Página " counter(page);
        }

        .numero-cot {
            color: #FF9800;
            font-weight: bold;
        }

        .costo {
            color: #4CAF50;
            font-weight: bold;
        }

        @page {
            margin: 2cm;
            size: A4 landscape;
        }

        @media print {
            body {
                background: white;
                margin: 0;
                padding: 0;
            }

            .container {
                max-width: none;
                margin: 0;
                padding: 0;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <table class="header-table" cellpadding="0" cellspacing="0">
                <tr>
                    <td class="logo-cell">
                        <div class="logo">
                            @if(file_exists(public_path('logo/logo.jpg')))
                                <img src="{{ public_path('logo/logo.jpg') }}" alt="Logo ICA">
                            @else
                                <div
                                    style="width: 100%; height: 100%; background: #4CAF50; color: white; font-weight: bold; font-size: 18px; text-align: center; line-height: 100px;">
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
                        <div class="main-title">COTIZACIONES ANTAMINA</div>
                        <div class="document-subtitle">Lista completa de cotizaciones registradas</div>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Info -->
        <div class="info">
            <strong>Fecha de generación:</strong> {{ $fecha_generacion }}<br>
            <strong>Total de cotizaciones:</strong> {{ count($cotizaciones) }}
        </div>

        <!-- Tabla de cotizaciones -->
        <table cellpadding="0" cellspacing="0">
            <thead>
                <tr>
                    <th width="10%">N° Cotización</th>
                    <th width="8%">Fecha</th>
                    <th width="18%">Proveedor/Cliente</th>
                    <th width="32%">Descripción</th>
                    <th width="8%">Productos</th>
                    <th width="10%">Cant. Total</th>
                    <th width="14%">Costo Total</th>
                </tr>
            </thead>
        <tbody>
            @php
                $totalGeneral = 0;
                $totalCantidad = 0;
                $totalProductos = 0;
            @endphp

            @foreach($cotizaciones as $cotizacion)
                @php
                    $cantidadTotal = $cotizacion->detalles->sum('cantidad');
                    $numProductos = $cotizacion->detalles->count();
                    $totalGeneral += $cotizacion->costo_total;
                    $totalCantidad += $cantidadTotal;
                    $totalProductos += $numProductos;
                @endphp
                    <tr>
                        <td class="numero-cot">{{ $cotizacion->numero_cot }}</td>
                        <td class="text-center">{{ date('d/m/Y', strtotime($cotizacion->fecha_cot)) }}</td>
                        <td class="text-left">{{ $cotizacion->cliente }}</td>
                        <td class="text-left">{{ $cotizacion->descripcion ?: '-' }}</td>
                        <td class="text-center">{{ $numProductos }}</td>
                        <td class="text-center">{{ number_format($cantidadTotal, 2) }}</td>
                        <td class="text-right costo">S/ {{ number_format($cotizacion->costo_total, 2) }}</td>
                    </tr>
                @endforeach

                <tr class="total-row">
                    <td colspan="4" class="text-right"><strong>TOTALES:</strong></td>
                    <td class="text-center"><strong>{{ $totalProductos }}</strong></td>
                    <td class="text-center"><strong>{{ number_format($totalCantidad, 2) }}</strong></td>
                    <td class="text-right"><strong>S/ {{ number_format($totalGeneral, 2) }}</strong></td>
                </tr>
            </tbody>
        </table>

        <!-- Footer -->
        <div class="footer">
            <div class="page-number"></div>
            Sistema de Gestión de Cotizaciones - Antamina © {{ date('Y') }}
        </div>
    </div>
</body>

</html>