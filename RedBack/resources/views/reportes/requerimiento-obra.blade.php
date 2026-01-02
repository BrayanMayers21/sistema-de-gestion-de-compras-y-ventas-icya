<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Requerimiento de Obra - {{ $requerimiento->numero_requerimiento }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 10px;
            color: #333;
            padding: 20px;
        }

        .header {
            background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%);
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
            margin-bottom: 0;
        }

        .header h1 {
            font-size: 20px;
            margin-bottom: 5px;
        }

        .header p {
            font-size: 11px;
            opacity: 0.9;
        }

        .info-section {
            background: #F3F4F6;
            padding: 15px;
            border-radius: 0 0 8px 8px;
            margin-bottom: 20px;
        }

        .info-grid {
            display: table;
            width: 100%;
            border-collapse: collapse;
        }

        .info-row {
            display: table-row;
        }

        .info-label {
            display: table-cell;
            font-weight: bold;
            padding: 5px 10px;
            width: 30%;
            background: #E5E7EB;
            border: 1px solid #D1D5DB;
        }

        .info-value {
            display: table-cell;
            padding: 5px 10px;
            border: 1px solid #D1D5DB;
        }

        .status-badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .status-pendiente {
            background: #FEF3C7;
            color: #92400E;
        }

        .status-aprobado {
            background: #DBEAFE;
            color: #1E40AF;
        }

        .status-en_proceso {
            background: #E0E7FF;
            color: #4338CA;
        }

        .status-atendido {
            background: #D1FAE5;
            color: #065F46;
        }

        .status-cancelado {
            background: #FEE2E2;
            color: #991B1B;
        }

        .status-entregado {
            background: #D1FAE5;
            color: #065F46;
        }

        .summary-box {
            background: white;
            border: 2px solid #059669;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
        }

        .summary-title {
            background: #059669;
            color: white;
            padding: 8px;
            margin: -15px -15px 10px -15px;
            border-radius: 6px 6px 0 0;
            font-weight: bold;
            font-size: 12px;
        }

        .summary-stats {
            display: table;
            width: 100%;
        }

        .stat {
            display: table-cell;
            text-align: center;
            padding: 10px;
            border-right: 1px solid #E5E7EB;
        }

        .stat:last-child {
            border-right: none;
        }

        .stat-value {
            font-size: 18px;
            font-weight: bold;
            color: #059669;
            display: block;
            margin-bottom: 3px;
        }

        .stat-label {
            font-size: 9px;
            color: #6B7280;
            text-transform: uppercase;
        }

        .progress-bar {
            background: #E5E7EB;
            height: 20px;
            border-radius: 10px;
            overflow: hidden;
            margin-top: 10px;
        }

        .progress-fill {
            background: linear-gradient(90deg, #059669 0%, #10B981 100%);
            height: 100%;
            text-align: center;
            line-height: 20px;
            color: white;
            font-weight: bold;
            font-size: 9px;
        }

        .table-container {
            margin-top: 20px;
        }

        .section-title {
            background: #047857;
            color: white;
            padding: 10px;
            font-size: 12px;
            font-weight: bold;
            border-radius: 6px 6px 0 0;
            margin-bottom: 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        thead th {
            background: #059669;
            color: white;
            padding: 8px 5px;
            text-align: left;
            font-size: 9px;
            font-weight: bold;
            border: 1px solid #047857;
        }

        tbody td {
            padding: 6px 5px;
            border: 1px solid #E5E7EB;
            font-size: 9px;
        }

        tbody tr:nth-child(even) {
            background: #F9FAFB;
        }

        tbody tr:hover {
            background: #F3F4F6;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .font-bold {
            font-weight: bold;
        }

        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 8px;
            color: #6B7280;
            padding-top: 10px;
            border-top: 1px solid #E5E7EB;
        }

        .observaciones-cell {
            max-width: 100px;
            word-wrap: break-word;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>REQUERIMIENTO DE OBRA</h1>
        <p>{{ $requerimiento->numero_requerimiento }}</p>
    </div>

    <div class="info-section">
        <div class="info-grid">
            <div class="info-row">
                <div class="info-label">Obra:</div>
                <div class="info-value">{{ $requerimiento->obra->nom_obra ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Código de Obra:</div>
                <div class="info-value">{{ $requerimiento->obra->codigo ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Residente de Obra:</div>
                <div class="info-value">{{ $requerimiento->residente_obra }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Fecha Requerimiento:</div>
                <div class="info-value">
                    {{ \Carbon\Carbon::parse($requerimiento->fecha_requerimiento)->format('d/m/Y') }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Fecha Atención:</div>
                <div class="info-value">
                    {{ $requerimiento->fecha_atencion ? \Carbon\Carbon::parse($requerimiento->fecha_atencion)->format('d/m/Y') : 'No atendido' }}
                </div>
            </div>
            <div class="info-row">
                <div class="info-label">Lugar de Entrega:</div>
                <div class="info-value">{{ $requerimiento->lugar_entrega ?? 'No especificado' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Estado:</div>
                <div class="info-value">
                    <span class="status-badge status-{{ $requerimiento->estado }}">
                        {{ strtoupper(str_replace('_', ' ', $requerimiento->estado)) }}
                    </span>
                </div>
            </div>
            @if($requerimiento->justificacion)
                <div class="info-row">
                    <div class="info-label">Justificación:</div>
                    <div class="info-value">{{ $requerimiento->justificacion }}</div>
                </div>
            @endif
        </div>
    </div>

    <div class="summary-box">
        <div class="summary-title">📊 RESUMEN DE ATENCIÓN</div>
        <div class="summary-stats">
            <div class="stat">
                <span class="stat-value">{{ $totalProductos }}</span>
                <span class="stat-label">Productos</span>
            </div>
            <div class="stat">
                <span class="stat-value">{{ number_format($totalSolicitado, 2) }}</span>
                <span class="stat-label">Total Solicitado</span>
            </div>
            <div class="stat">
                <span class="stat-value">{{ number_format($totalEntregado, 2) }}</span>
                <span class="stat-label">Total Entregado</span>
            </div>
            <div class="stat">
                <span class="stat-value">{{ number_format($totalSolicitado - $totalEntregado, 2) }}</span>
                <span class="stat-label">Pendiente</span>
            </div>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" style="width: {{ $porcentajeAvance }}%">
                {{ $porcentajeAvance }}% Completado
            </div>
        </div>
    </div>

    <div class="table-container">
        <div class="section-title">DETALLE DE PRODUCTOS</div>
        <table>
            <thead>
                <tr>
                    <th class="text-center">#</th>
                    <th>Producto</th>
                    <th>Marca</th>
                    <th>Color</th>
                    <th>Tipo</th>
                    <th>Calidad</th>
                    <th>Medida</th>
                    <th class="text-center">Solicitado</th>
                    <th class="text-center">Entregado</th>
                    <th class="text-center">Pendiente</th>
                    <th class="text-center">%</th>
                    <th class="text-center">Estado</th>
                    <th>Observaciones</th>
                </tr>
            </thead>
            <tbody>
                @foreach($requerimiento->detalles as $index => $detalle)
                    @php
                        $cantidadPendiente = $detalle->cantidad - ($detalle->cantidad_entregada ?? 0);
                        $porcentaje = $detalle->cantidad > 0 ? (($detalle->cantidad_entregada ?? 0) / $detalle->cantidad) * 100 : 0;
                    @endphp
                    <tr>
                        <td class="text-center">{{ $index + 1 }}</td>
                        <td class="font-bold">{{ $detalle->producto->nombre ?? 'N/A' }}</td>
                        <td>{{ $detalle->marca ?? '-' }}</td>
                        <td>{{ $detalle->color ?? '-' }}</td>
                        <td>{{ $detalle->tipo ?? '-' }}</td>
                        <td>{{ $detalle->calidad ?? '-' }}</td>
                        <td>{{ $detalle->medida ?? '-' }}</td>
                        <td class="text-center font-bold">{{ number_format($detalle->cantidad, 2) }}</td>
                        <td class="text-center" style="color: #059669; font-weight: bold;">
                            {{ number_format($detalle->cantidad_entregada ?? 0, 2) }}</td>
                        <td class="text-center"
                            style="color: {{ $cantidadPendiente > 0 ? '#DC2626' : '#059669' }}; font-weight: bold;">
                            {{ number_format($cantidadPendiente, 2) }}
                        </td>
                        <td class="text-center">{{ number_format($porcentaje, 0) }}%</td>
                        <td class="text-center">
                            <span class="status-badge status-{{ $detalle->estado ?? 'pendiente' }}">
                                {{ strtoupper($detalle->estado ?? 'pendiente') }}
                            </span>
                        </td>
                        <td class="observaciones-cell">{{ $detalle->observaciones ?? '-' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="footer">
        <p>Reporte generado el {{ $fecha_generacion }}</p>
        <p>Sistema de Gestión - REDVEL Framework</p>
    </div>
</body>

</html>