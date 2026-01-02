<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Registro de Capacitación - {{ $capacitacion->codigo }}</title>
    <style>
        @page { margin: 10mm; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 10px; color: #333;padding: 30px; }
        
        .header-table { width: 100%; border: 3px solid #4CAF50; border-collapse: collapse; margin-bottom: 8px; }
        .header-logo { width: 15%; border-right: 2px solid #4CAF50; padding: 8px; text-align: center; background: #f8fafc; }
        .logo { width: 100px; height: 100px; }
        .logo img { width: 100%; height: 100%; object-fit: contain; }
        .header-title { width: 60%; border-right: 2px solid #4CAF50; padding: 10px; text-align: center; vertical-align: middle; }
        .title-main { font-size: 11px; font-weight: bold; margin-bottom: 4px; }
        .title-sub { font-size: 9px; color: #666; }
        .header-code { width: 25%; padding: 0; }
        .info-table { width: 100%; border-collapse: collapse; }
        .info-table td { border: 1px solid #ddd; padding: 4px 6px; font-size: 8px; }
        .code-label { background: #e5e7eb; font-weight: bold; width: 50%; }
        
        .section { width: 100%; border: 2px solid #4CAF50; border-collapse: collapse; margin-bottom: 8px; }
        .section-title { background: #4CAF50; color: white; padding: 6px; font-weight: bold; text-align: center; font-size: 10px; }
        .field { border: 1px solid #ddd; padding: 5px; vertical-align: top; }
        .field-label { font-weight: bold; font-size: 8px; display: block; margin-bottom: 2px; }
        .field-value { font-size: 9px; }
        
        .activity-header { background: #4CAF50; color: white; padding: 6px; border: 2px solid #4CAF50; font-weight: bold; text-align: center; font-size: 10px; }
        .activity-type { width: 100%; border: 2px solid #4CAF50; border-top: none; border-collapse: collapse; margin-bottom: 8px; }
        .activity-cell { border-right: 1px solid #ddd; padding: 10px 6px; text-align: center; background: #f8fafc; font-size: 8px; }
        .activity-cell:last-child { border-right: none; }
        .checkbox { display: block; width: 16px; height: 16px; border: 2px solid #4CAF50; margin: 0 auto 4px; line-height: 12px; font-weight: bold; background: white; }
        .checkbox.checked { background: #4CAF50; color: white; }
        
        .table-header { background: #4CAF50; color: white; padding: 6px; border: 2px solid #4CAF50; font-weight: bold; text-align: center; font-size: 10px; }
        .table-asistentes { width: 100%; border: 2px solid #4CAF50; border-top: none; border-collapse: collapse; }
        .table-asistentes th { background: #FF9800; color: white; border: 1px solid #ddd; padding: 6px 4px; font-weight: bold; text-align: center; font-size: 9px; }
        .table-asistentes td { border: 1px solid #ddd; padding: 5px 4px; font-size: 9px; text-align: center; background: white; }
        .table-asistentes tbody tr:nth-child(even) td { background: #fafafa; }
        .col-num { width: 5%; font-weight: 600; color: #4CAF50; }
        .col-nombre { width: 30%; text-align: left !important; }
        .col-dni { width: 12%; }
        .col-area { width: 15%; }
        .col-firma { width: 15%; }
        .col-obs { width: 18%; text-align: left !important; }
        .text-uppercase { text-transform: uppercase; }
    </style>
</head>
<body>
    <table class="header-table">
        <tr>
            <td class="header-logo">
                <div class="logo">
                    @if(file_exists(public_path('logo/logo.jpg')))
                        <img src="{{ public_path('logo/logo.jpg') }}" alt="Logo">
                    @else
                        <div style="width:100%;height:100%;background:#4CAF50;color:white;font-size:18px;line-height:100px;text-align:center;">IcA</div>
                    @endif
                </div>
            </td>
            <td class="header-title">
                <div class="title-main">FORMATO</div>
                <div class="title-sub">REGISTRO DE INDUCCIÓN, CAPACITACIÓN, ENTRENAMIENTO Y SIMULACROS DE EMERGENCIA</div>
            </td>
            <td class="header-code">
                <table class="info-table">
                    <tr><td class="code-label">Código:</td><td>FM-21-12</td></tr>
                    <tr><td class="code-label">Versión:</td><td>02</td></tr>
                    <tr><td class="code-label">Fecha:</td><td>23/05/2020</td></tr>
                    <tr><td class="code-label">Página:</td><td>1 de 1</td></tr>
                    <tr><td class="code-label">N° Registro:</td><td><strong>{{ $capacitacion->codigo }}</strong></td></tr>
                </table>
            </td>
        </tr>
    </table>

    <table class="section">
        <tr><td class="section-title" colspan="4">DATOS DEL EMPLEADOR</td></tr>
        <tr>
            <td class="field" style="width:35%;">
                <span class="field-label">RAZÓN SOCIAL:</span>
                <div class="field-value">{{ $capacitacion->razon_social ?? 'N/A' }}</div>
            </td>
            <td class="field" style="width:18%;">
                <span class="field-label">RUC:</span>
                <div class="field-value">{{ $capacitacion->ruc ?? 'N/A' }}</div>
            </td>
            <td class="field" style="width:27%;">
                <span class="field-label">ACTIVIDAD ECONÓMICA:</span>
                <div class="field-value">{{ $capacitacion->actividad_economica ?? 'N/A' }}</div>
            </td>
            <td class="field" style="width:20%;">
                <span class="field-label">N° TRABAJADORES:</span>
                <div class="field-value">{{ $capacitacion->num_trabajadores ?? 'N/A' }}</div>
            </td>
        </tr>
        <tr>
            <td class="field" colspan="4">
                <span class="field-label">DOMICILIO:</span>
                <div class="field-value">{{ $capacitacion->domicilio ?? 'N/A' }}</div>
            </td>
        </tr>
    </table>

    <div class="activity-header">MARCAR (X)</div>
    <table class="activity-type">
        <tr>
            <td class="activity-cell" style="width:14.28%;">
                <span class="checkbox {{ $capacitacion->tipo_actividad === 'induccion' ? 'checked' : '' }}">{{ $capacitacion->tipo_actividad === 'induccion' ? 'X' : '' }}</span>
                INDUCCIÓN
            </td>
            <td class="activity-cell" style="width:14.28%;">
                <span class="checkbox {{ $capacitacion->tipo_actividad === 'capacitacion' ? 'checked' : '' }}">{{ $capacitacion->tipo_actividad === 'capacitacion' ? 'X' : '' }}</span>
                CAPACITACIÓN
            </td>
            <td class="activity-cell" style="width:14.28%;">
                <span class="checkbox {{ $capacitacion->tipo_actividad === 'entrenamiento' ? 'checked' : '' }}">{{ $capacitacion->tipo_actividad === 'entrenamiento' ? 'X' : '' }}</span>
                ENTRENAMIENTO
            </td>
            <td class="activity-cell" style="width:14.28%;">
                <span class="checkbox {{ $capacitacion->tipo_actividad === 'charla' ? 'checked' : '' }}">{{ $capacitacion->tipo_actividad === 'charla' ? 'X' : '' }}</span>
                CHARLA
            </td>
            <td class="activity-cell" style="width:14.28%;">
                <span class="checkbox {{ $capacitacion->tipo_actividad === 'simulacro' ? 'checked' : '' }}">{{ $capacitacion->tipo_actividad === 'simulacro' ? 'X' : '' }}</span>
                SIMULACRO DE EMERGENCIA
            </td>
            <td class="activity-cell" style="width:14.28%;">
                <span class="checkbox {{ $capacitacion->tipo_actividad === 'otros' ? 'checked' : '' }}">{{ $capacitacion->tipo_actividad === 'otros' ? 'X' : '' }}</span>
                OTROS
            </td>
        </tr>
    </table>

    <table class="section">
        <tr>
            <td class="field" colspan="4">
                <span class="field-label">TEMA:</span>
                <div class="field-value">{{ $capacitacion->tema_capacitacion }}</div>
            </td>
        </tr>
        <tr>
            <td class="field" style="width:15%;">
                <span class="field-label">FECHA:</span>
                <div class="field-value">{{ $capacitacion->fecha_capacitacion->format('d/m/Y') }}</div>
            </td>
            <td class="field" style="width:45%;">
                <span class="field-label">CAPACITADOR:</span>
                <div class="field-value">{{ $capacitacion->capacitador }}</div>
            </td>
            <td class="field" style="width:15%;">
                <span class="field-label">N° HORAS:</span>
                <div class="field-value">{{ $capacitacion->num_horas ?? 'N/A' }}</div>
            </td>
            <td class="field" style="width:25%;">
                <span class="field-label">LUGAR:</span>
                <div class="field-value">{{ $capacitacion->lugar_capacitacion ?? 'N/A' }}</div>
            </td>
        </tr>
    </table>

    <div class="table-header">LISTA DE CAPACITADOS</div>
    <table class="table-asistentes">
        <thead>
            <tr>
                <th class="col-num">N°</th>
                <th class="col-nombre">APELLIDOS Y NOMBRES</th>
                <th class="col-dni">N° DNI</th>
                <th class="col-area">ÁREA</th>
                <th class="col-firma">FIRMA</th>
                <th class="col-obs">OBSERVACIONES</th>
            </tr>
        </thead>
        <tbody>
            @php $numero = 1; @endphp
            @foreach($capacitacion->asistentes as $asistente)
            <tr>
                <td class="col-num">{{ $numero++ }}</td>
                <td class="col-nombre text-uppercase">
                    @if($asistente->empleado && $asistente->empleado->persona)
                        {{ $asistente->empleado->persona->primer_apell }} {{ $asistente->empleado->persona->segundo_apell }} {{ $asistente->empleado->persona->nombres }}
                    @else
                        N/A
                    @endif
                </td>
                <td class="col-dni">{{ $asistente->empleado->persona->dni ?? 'N/A' }}</td>
                <td class="col-area">{{ $asistente->area ?? 'N/A' }}</td>
                <td class="col-firma"></td>
                <td class="col-obs">{{ $asistente->observaciones_asistente }}</td>
            </tr>
            @endforeach
            @for ($i = count($capacitacion->asistentes) + 1; $i <= 10; $i++)
            <tr>
                <td class="col-num">{{ $i }}</td>
                <td class="col-nombre"></td>
                <td class="col-dni"></td>
                <td class="col-area"></td>
                <td class="col-firma"></td>
                <td class="col-obs"></td>
            </tr>
            @endfor
        </tbody>
    </table>
</body>
</html>
