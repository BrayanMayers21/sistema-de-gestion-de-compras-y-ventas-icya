<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cotización {{ $cotizacion->numero_cot }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            background: white;
            margin: 0;
            padding: 20px;
        }

        .container {
            width: 100%;
            max-width: 210mm;
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
            width: 300px;
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

        .document-number {
            font-size: 14px;
            color: #666;
            background: #f0f0f0;
            padding: 5px 12px;
            border: 1px solid #ddd;
        }

        .info-box {
            width: 100%;
            margin: 20px 0;
            background: #f9f9f9;
            border: 1px solid #ddd;
            padding: 15px;
        }

        .info-table {
            width: 100%;
            border-collapse: collapse;
        }

        .info-table td {
            padding: 8px 10px;
            border-bottom: 1px solid #eee;
        }

        .info-label {
            font-weight: bold;
            color: #333;
            width: 180px;
            font-size: 12px;
        }

        .info-value {
            color: #666;
            font-size: 12px;
        }

        .section-title {
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
            font-size: 12px;
            padding-bottom: 5px;
            border-bottom: 1px solid #ddd;
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
            padding: 12px 8px;
            text-align: center;
            font-weight: bold;
            font-size: 11px;
            border: 1px solid #FF9800;
        }

        tbody td {
            padding: 10px 8px;
            text-align: center;
            border: 1px solid #ddd;
            font-size: 11px;
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
        }

        .total-row {
            font-weight: bold;
            background-color: #4CAF50 !important;
            color: white;
        }

        .total-row td {
            padding: 12px 8px;
            font-size: 12px;
            border: 1px solid #4CAF50;
        }

        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #999;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }

        .numero-cot {
            color: #FF9800;
            font-weight: bold;
            font-size: 14px;
        }

        .producto-nombre {
            font-weight: 500;
            color: #333;
            text-align: left !important;
            padding-left: 10px !important;
        }

        .categoria {
            color: #666;
            font-size: 10px;
        }

        .precio {
            color: #4CAF50;
            font-weight: 500;
        }

        .resumen-box {
            margin-top: 30px;
            padding: 15px;
            background-color: #f9f9f9;
            border-left: 4px solid #FF9800;
            font-size: 11px;
            line-height: 1.6;
        }

        @page {
            margin: 2cm;
            size: A4;
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
                        <div class="main-title">COTIZACIÓN</div>
                        <div class="document-number">{{ $cotizacion->numero_cot }}</div>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Información de la cotización -->
        <div class="info-box">
            <table class="info-table" cellpadding="0" cellspacing="0">
                <tr>
                    <td class="info-label">N° DE COTIZACIÓN:</td>
                    <td class="info-value numero-cot">{{ $cotizacion->numero_cot }}</td>
                </tr>
                <tr>
                    <td class="info-label">FECHA:</td>
                    <td class="info-value">{{ date('d/m/Y', strtotime($cotizacion->fecha_cot)) }}</td>
                </tr>
                <tr>
                    <td class="info-label">PROVEEDOR/CLIENTE:</td>
                    <td class="info-value">{{ $cotizacion->cliente }}</td>
                </tr>
                <tr>
                    <td class="info-label">DESCRIPCIÓN:</td>
                    <td class="info-value">{{ $cotizacion->descripcion ?: 'Sin descripción' }}</td>
                </tr>
            </table>
        </div>

        <div class="section-title">DETALLE DE PRODUCTOS</div>

        <!-- Tabla de productos -->
        <table cellpadding="0" cellspacing="0">
            <thead>
                <tr>
                    <th width="5%">#</th>
                    <th width="40%">Producto</th>
                    <th width="15%">Categoría</th>
                    <th width="10%">Cantidad</th>
                    <th width="15%">Precio Unit.</th>
                    <th width="15%">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @php
                    $numero = 1;
                @endphp

                @foreach($cotizacion->detalles as $detalle)
                    <tr>
                        <td class="text-center">{{ $numero++ }}</td>
                        <td class="producto-nombre">{{ $detalle->producto->nombre }}</td>
                        <td class="categoria">{{ $detalle->producto->categoria->nombre ?? '-' }}</td>
                        <td class="text-center">{{ number_format($detalle->cantidad, 2) }}</td>
                        <td class="text-right precio">S/ {{ number_format($detalle->precio_unitario, 2) }}</td>
                        <td class="text-right precio">S/ {{ number_format($detalle->sub_total, 2) }}</td>
                    </tr>
                @endforeach

                <tr class="total-row">
                    <td colspan="5" class="text-right"><strong>TOTAL:</strong></td>
                    <td class="text-right"><strong>S/ {{ number_format($cotizacion->costo_total, 2) }}</strong></td>
                </tr>
            </tbody>
        </table>

        <!-- Resumen -->
        <div class="resumen-box">
            <strong>Resumen:</strong><br>
            Total de productos: <strong>{{ $cotizacion->detalles->count() }}</strong><br>
            Cantidad total de items: <strong>{{ number_format($cotizacion->detalles->sum('cantidad'), 2) }}</strong><br>
            Costo total: <strong>S/ {{ number_format($cotizacion->costo_total, 2) }}</strong>
        </div>

        <!-- Footer -->
        <div class="footer">
            Documento generado el {{ $fecha_generacion }}<br>
            Sistema de Gestión de Cotizaciones - Antamina © {{ date('Y') }}
        </div>
    </div>
</body>

</html>