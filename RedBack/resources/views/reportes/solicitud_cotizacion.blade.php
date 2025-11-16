<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solicitud de Cotización</title>
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

        /* Header simple y efectivo */
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

        /* Información del proveedor */
        .proveedor-info {
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
            width: 120px;
            font-size: 12px;
        }

        .info-value {
            color: #666;
            font-size: 12px;
        }

        /* Tabla de productos simple */
        .productos-table {
            width: 100%;
            margin: 20px 0;
            border-collapse: collapse;
            border: 1px solid #ddd;
        }

        .productos-table th {
            background: #FF9800;
            color: white;
            padding: 12px 8px;
            text-align: center;
            font-weight: bold;
            font-size: 11px;
            border: 1px solid #FF9800;
        }

        .productos-table td {
            padding: 10px 8px;
            text-align: center;
            border: 1px solid #ddd;
            font-size: 11px;
            background: white;
        }

        .productos-table tbody tr:nth-child(even) td {
            background-color: #f9f9f9;
        }

        .descripcion {
            text-align: left !important;
            padding-left: 10px !important;
        }

        .cantidad-col {
            width: 80px;
        }

        .descripcion-col {
            width: 300px;
        }

        .precio-col {
            width: 100px;
        }

        .total-col {
            width: 100px;
        }

        /* Sección de totales simple */
        .totales-section {
            margin-top: 25px;
            width: 100%;
        }

        .totales-table {
            width: 100%;
            border-collapse: collapse;
        }

        .totales-table td {
            vertical-align: top;
            padding: 0;
        }

        .observaciones-cell {
            width: 60%;
            padding-right: 30px;
        }

        .observaciones-title {
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
            font-size: 12px;
            padding-bottom: 5px;
            border-bottom: 1px solid #ddd;
        }

        .observaciones-content {
            background: #f9f9f9;
            padding: 15px;
            border: 1px solid #ddd;
            font-size: 11px;
            line-height: 1.4;
        }

        .totales-cell {
            width: 40%;
        }

        .totales-box {
            border: 1px solid #ddd;
            background: white;
        }

        .total-row {
            padding: 10px 15px;
            border-bottom: 1px solid #eee;
            font-size: 11px;
        }

        .total-row:after {
            content: "";
            display: table;
            clear: both;
        }

        .total-subtotal {
            background: #f5f5f5;
        }

        .total-impuesto {
            background: #fff3cd;
        }

        .total-final {
            background: #FF9800;
            color: white;
            font-weight: bold;
            border-bottom: none;
        }

        .total-label {
            float: left;
            font-weight: bold;
        }

        .total-value {
            float: right;
            font-weight: bold;
        }


        /* Ajustes para PDF */
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
                        <div class="main-title">Solicitud de Cotización</div>
                        <div class="document-number">
                            {{ date('Y') }}-{{ str_pad($requerimiento->numero_requerimiento ?? '0001', 4, '0', STR_PAD_LEFT) }}
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Información del proveedor -->
        <div class="proveedor-info">
            <table class="info-table" cellpadding="0" cellspacing="0">
                <tr>
                    <td class="info-label">PROVEEDOR:</td>
                    <td class="info-value">{{ $proveedor->razon_social ?? 'No especificado' }}</td>
                </tr>
                <tr>
                    <td class="info-label">FECHA:</td>
                    <td class="info-value">{{ $requerimiento->fecha_requerimiento->format('d/m/Y') }}</td>
                </tr>
                <tr>
                    <td class="info-label">E-MAIL:</td>
                    <td class="info-value">{{ $proveedor->email ?? 'No especificado' }}</td>
                </tr>
                <tr>
                    <td class="info-label">DIRECCIÓN:</td>
                    <td class="info-value">{{ $proveedor->direccion ?? 'No especificado' }}</td>
                </tr>
            </table>
        </div>

        <!-- Tabla de productos -->
        <table class="productos-table" cellpadding="0" cellspacing="0">
            <thead>
                <tr>
                    <th class="cantidad-col">Cant.</th>
                    <th class="descripcion-col">Descripción</th>
                    <th class="unidad-col">UNIDAD</th>
                    <th class="precio-col">OBSERVACIONES</th>
                </tr>
            </thead>
            <tbody>
                @foreach($detalles as $detalle)
                    <tr>
                        <td>{{ number_format((float) ($detalle['cantidad'] ?? 0), 0) }}</td>
                        <td class="descripcion">{{ $detalle['descripcion'] ?? '' }}</td>
                        <td>{{ $detalle['unidad_medida'] ?? '' }}</td>
                        <td>{{ $detalle['observaciones'] ?? '' }}</td>

                    </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Observaciones y totales -->
        <div class="totales-section">
            <table class="totales-table" cellpadding="0" cellspacing="0">
                <tr>
                    <td class="observaciones-cell">
                        <div class="observaciones-title">Observaciones</div>
                        <div class="observaciones-content">
                            <strong>Asunto:</strong> Atención urgente - Solicitud con plazo máximo hoy.<br><br>
                            Estimados proveedores, agradezco su pronta respuesta y confirmación de atención para
                            proceder con la evaluación correspondiente.
                        </div>
                    </td>
                    <td class="totales-cell">
                        <div class="totales-box">
                            <div class="total-row total-subtotal">
                                <span class="total-label">Subtotal</span>
                                <span class="total-value">S/. --------</span>
                            </div>
                            <div class="total-row total-impuesto">
                                <span class="total-label">Impuestos</span>
                                <span class="total-value">S/. --------</span>
                            </div>
                            <div class="total-row total-final">
                                <span class="total-label">Total a Pagar</span>
                                <span class="total-value">S/. --------</span>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>



    </div>
</body>

</html>