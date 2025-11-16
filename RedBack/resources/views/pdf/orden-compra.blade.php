<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $tituloDocumento }} - {{ $orden->numero_orden }}</title>
    <style>
        @page {
            margin: 10mm;
            size: A4;
        }

        body {
            font-family: 'Arial', sans-serif;
            font-size: 10px;
            margin: 0;
            padding: 0;
            line-height: 1.2;
            color: #333;
        }

        .header {
            width: 100%;
            margin-bottom: 20px;
        }

        .header-table {
            width: 100%;
            border-collapse: collapse;
            border: 3px solid #1f2937;
            margin-bottom: 10px;
        }

        .logo-cell {
            width: 15%;
            border-right: 2px solid #1f2937;
            padding: 8px;
            text-align: center;
            vertical-align: middle;
            background: #f8fafc;
        }

        .logo {
            width: 70px;
            height: 45px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
        }

        .logo img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }

        .title-cell {
            width: 60%;
            border-right: 2px solid #1f2937;
            padding: 10px;
            text-align: center;
            vertical-align: middle;
            background: #ffffff;
        }

        .title-main {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 8px;
            color: #1f2937;
            letter-spacing: 1px;
        }

        .title-sub {
            font-size: 14px;
            font-weight: bold;
            color: #374151;
        }

        .info-cell {
            width: 25%;
            padding: 8px;
            vertical-align: top;
            background: #f8fafc;
        }

        .info-table {
            width: 100%;
            border-collapse: collapse;
        }

        .info-table td {
            border: 1px solid #374151;
            padding: 6px 8px;
            font-size: 10px;
        }

        .info-label {
            background: #e5e7eb;
            font-weight: bold;
            width: 45%;
            color: #1f2937;
        }

        .company-info {
            width: 100%;
            border-collapse: collapse;
            border: 2px solid #1f2937;
            margin-bottom: 8px;
            page-break-inside: avoid;
        }

        .company-info td {
            border: 1px solid #374151;
            padding: 5px 8px;
            font-size: 9px;
            vertical-align: middle;
        }

        .section-title {
            background: #1f2937;
            color: white;
            font-weight: bold;
            text-align: center;
            padding: 6px;
            font-size: 11px;
            letter-spacing: 0.5px;
        }

        .details-table {
            width: 100%;
            border-collapse: collapse;
            border: 2px solid #1f2937;
            margin-bottom: 15px;
            page-break-inside: avoid;
        }

        .details-table th,
        .details-table td {
            border: 1px solid #374151;
            padding: 6px 4px;
            text-align: center;
            font-size: 9px;
            vertical-align: middle;
        }

        .details-table th {
            background: #1f2937;
            color: white;
            font-weight: bold;
            font-size: 10px;
            padding: 8px 4px;
            letter-spacing: 0.3px;
        }

        .details-table tbody tr:nth-child(even) {
            background: #f8fafc;
        }

        .details-table tbody tr:hover {
            background: #e5e7eb;
        }

        .text-left {
            text-align: left !important;
        }

        .text-right {
            text-align: right !important;
        }

        .totals-section {
            width: 100%;
            margin-top: 15px;
            page-break-inside: avoid;
        }

        .totals-table {
            width: 45%;
            float: right;
            border-collapse: collapse;
            border: 2px solid #1f2937;
        }

        .totals-table td {
            border: 1px solid #374151;
            padding: 6px 8px;
            font-size: 10px;
            vertical-align: middle;
        }

        .totals-label {
            background: #e5e7eb;
            font-weight: bold;
            width: 65%;
            color: #1f2937;
        }

        .totals-table tr:last-child td {
            background: #1f2937;
            color: white;
            font-weight: bold;
            font-size: 12px;
        }

        .signatures {
            width: 100%;
            margin-top: 50px;
            border-collapse: collapse;
            page-break-inside: avoid;
        }

        .signatures td {
            width: 33.33%;
            text-align: center;
            padding: 35px 10px 10px 10px;
            border-top: 3px solid #1f2937;
            font-size: 10px;
            font-weight: bold;
            color: #1f2937;
            background: #f8fafc;
        }

        .note {
            margin-top: 20px;
            font-size: 8px;
            text-align: justify;
            line-height: 1.3;
            padding: 10px;
            background: #f8fafc;
            border-left: 4px solid #1f2937;
            color: #374151;
        }

        .pedido-header {
            background: #1f2937;
            color: white;
            text-align: center;
            padding: 6px;
            border: 2px solid #1f2937;
            font-weight: bold;
            margin-bottom: 0;
            font-size: 11px;
            letter-spacing: 0.5px;
        }

        .clear {
            clear: both;
        }
    </style>
</head>

<body>
    <!-- Encabezado -->
    <table class="header-table">
        <tr>
            <td class="logo-cell">
                <div class="logo">
                    <img src="{{ public_path('/logo/image.png') }}" alt="logo">
                </div>
            </td>
            <td class="title-cell">
                <div class="title-main">FORMATO</div>
                <div class="title-sub">{{ $tituloDocumento }}</div>
            </td>
            <td class="info-cell">
                <table class="info-table">
                    <tr>
                        <td class="info-label">Código:</td>
                        {{-- <td>{{ $orden->codigo_contable }}</td> --}}
                        <td>FM-20-02</td>
                    </tr>
                    <tr>
                        <td class="info-label">Versión:</td>
                        <td>01</td>
                    </tr>
                    <tr>
                        <td class="info-label">Página:</td>
                        <td>1 de 1</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- Información de la empresa y orden -->
    <table class="company-info">
        <tr>
            <td class="section-title" colspan="3">INGENIERÍA DEL CONCRETO Y ALBAÑILERIA E.I.R.L.</td>
        </tr>
        <tr>
            <td><strong>{{ $tituloDocumento }}</strong></td>
            <td><strong>ORDEN N°:</strong></td>
            <td><strong>{{ $orden->numero_orden }}</strong></td>
        </tr>
        <tr>
            <td>Jr. Campos N° 1123 Independencia - Huaraz</td>
            <td><strong>FECHA DE PEDIDO:</strong></td>
            <td>{{ date('d/m/Y', strtotime($orden->fecha_emision)) }}</td>
        </tr>
        <tr>
            <td><strong>RUC:</strong> 20551968402</td>
            <td><strong>FECHA DE ENTREGA:</strong></td>
            <td>{{ date('d/m/Y', strtotime($orden->fecha_entrega)) }}</td>
        </tr>
        <tr>
            <td>Jr. Cahuide N° 164 Independencia - Huaraz</td>
            <td><strong>LUGAR DE ENTREGA:</strong></td>
            <td>{{ $orden->lugar_entrega }}</td>
        </tr>
        <tr>
            <td><strong>CEL:</strong> 930721704</td>
            <td><strong>CONDICIÓN DE PAGO:</strong></td>
            <td>{{ strtoupper($orden->estado) }}</td>
        </tr>
        <tr>
            <td colspan="3"><strong>Email:</strong> IngenieriaconcretoyALBAÑILERIA@gmail.com</td>
        </tr>
    </table>

    <!-- Información del proveedor -->
    <table class="company-info">
        <tr>
            <td class="section-title" style="width: 20%;">
                <strong>PROVEEDOR:</strong>
            </td>
            <td class="section-title" colspan="3"><strong>{{ $orden->proveedor_razon_social }}</strong></td>
        </tr>
        <tr>
            <td><strong>REPRESENTANTE:</strong></td>
            <td style="width: 40%;"></td>
            <td><strong>CÓDIGO:</strong></td>
            <td>{{ $orden->codigo_obra }}</td>
        </tr>
        <tr>
            <td><strong>USUARIO:</strong></td>
            <td colspan="3">{{ $orden->nom_obra }}</td>
        </tr>
        <tr>
            <td><strong>REQUERIMIENTO N°:</strong></td>
            <td>{{ $orden->numero_orden }}</td>
            <td><strong>RESPONSABLE:</strong></td>
            <td><strong>JHONY MENDOZA</strong></td>
        </tr>
    </table>

    <!-- Título de la sección de productos -->
    <div class="pedido-header">
        SÍRVASE POR ESTE MEDIO ATENDER EL SIGUIENTE PEDIDO:
    </div>

    <!-- Tabla de detalles -->
    <table class="details-table">
        <thead>
            <tr>
                <th>N°</th>
                <th style="width: 40%;">DESCRIPCIÓN</th>
                <th>CANTIDAD</th>
                <th>UNIDAD</th>
                <th>PREC. UNIT.</th>
                <th>PREC. PARC.</th>
            </tr>
        </thead>
        <tbody>
            @foreach($detalles as $index => $detalle)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td class="text-left">{{ $detalle->producto_codigo }} - {{ $detalle->producto_nombre }}
                        {{ $detalle->producto_descripcion ? '(' . $detalle->producto_descripcion . ')' : '' }}
                    </td>
                    <td>{{ number_format($detalle->cantidad, 2) }}</td>
                    <td>UND</td>
                    <td class="text-right">S/ {{ number_format($detalle->precio_unitario, 2) }}</td>
                    <td class="text-right">S/ {{ number_format($detalle->subtotal, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <!-- Totales -->
    <div class="totals-section">
        <table class="totals-table">
            <tr>
                <td class="totals-label">TOTAL ORDEN DE COMPRA:</td>
                <td class="text-right">S/ {{ number_format($orden->subtotal, 2) }}</td>
            </tr>
            @if($orden->igv > 0)
                <tr>
                    <td class="totals-label">IGV (18%):</td>
                    <td class="text-right">S/ {{ number_format($orden->igv, 2) }}</td>
                </tr>
            @endif
            @if($orden->adelanto > 0)
                <tr>
                    <td class="totals-label">PAGO A CUENTA (ADELANTO):</td>
                    <td class="text-right">S/ {{ number_format($orden->adelanto, 2) }}</td>
                </tr>
            @endif
            <tr>
                <td>SALDO POR PAGAR:</td>
                <td class="text-right">S/ {{ number_format($orden->total, 2) }}</td>
            </tr>
        </table>
    </div>

    <div class="clear"></div>

    <!-- Firmas -->
    <table class="signatures">
        <tr>
            <td>
                LOGÍSTICA<br>
                OBSERVACIONES
            </td>
            <td>
                PROVEEDOR
            </td>
            <td>
                GERENTE
            </td>
        </tr>
    </table>

    <!-- Nota al pie -->
    <div class="note">
        <strong>NOTA:</strong> Al aceptar la presente OC, los proveedores se comprometen a cumplir con nuestra Política
        y Sistema de Gestión Ambiental.<br>
        <strong>R.E.A:</strong> Entregar según tipo de material, dentro de plazo en correo como proveedor de nuestra
        empresa.<br>
        <strong>Si deseas algún otro de nuestros servicios relacionados, dirígete mediante por siguiente correo:
            IngenieriaconcretoyALBAÑILERIA@gmail.com</strong>
    </div>
</body>

</html>