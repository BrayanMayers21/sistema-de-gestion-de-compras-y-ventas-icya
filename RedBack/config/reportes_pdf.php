<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Configuración de Reportes PDF
    |--------------------------------------------------------------------------
    |
    | Configuraciones para la generación de reportes PDF de requerimientos
    |
    */

    // Información de la empresa
    'empresa' => [
        'nombre' => env('EMPRESA_NOMBRE', 'INGENIERÍA DEL CONCRETO Y ALBAÑILERÍA'),
        'slogan' => env('EMPRESA_SLOGAN', 'CONSULTORÍA & CONSTRUCCIÓN'),
        'logo_texto' => env('EMPRESA_LOGO_TEXTO', 'ICA'),
        'telefono' => env('EMPRESA_TELEFONO', '(55) 1234-5678'),
        'email' => env('EMPRESA_EMAIL', 'hola@sitioincreible.com'),
        'website' => env('EMPRESA_WEBSITE', 'www.sitioincreible.com'),
        'direccion' => env('EMPRESA_DIRECCION', 'Calle Cualquiera 123, Cualquier Lugar'),
        'redes_sociales' => env('EMPRESA_REDES', '@sitioincreible'),
    ],

    // Configuración de colores
    'colores' => [
        'primario' => env('PDF_COLOR_PRIMARIO', '#4CAF50'),
        'secundario' => env('PDF_COLOR_SECUNDARIO', '#2E7D32'),
        'acento' => env('PDF_COLOR_ACENTO', '#FF9800'),
        'acento_oscuro' => env('PDF_COLOR_ACENTO_OSCURO', '#F57C00'),
    ],

    // Configuración de impuestos
    'impuestos' => [
        'iva' => env('IVA_PORCENTAJE', 0.19), // 19% IVA por defecto
        'incluir_impuestos' => env('INCLUIR_IMPUESTOS', true),
        'etiqueta_impuesto' => env('ETIQUETA_IMPUESTO', 'Impuesto'),
    ],

    // Precios estimados por defecto
    'precios_estimados' => [
        'apertura' => 50000,
        'chapa' => 30000,
        'llave' => 5000,
        'instalacion' => 5000,
        'cambio' => 20000,
        'cerradura' => 75000,
        'copia' => 5000,
        'por_defecto' => 10000,
    ],

    // Configuración del PDF
    'pdf' => [
        'papel' => env('PDF_PAPEL', 'A4'),
        'orientacion' => env('PDF_ORIENTACION', 'portrait'),
        'margenes' => [
            'superior' => 20,
            'inferior' => 20,
            'izquierdo' => 15,
            'derecho' => 15,
        ],
    ],

    // Textos por defecto
    'textos' => [
        'titulo_documento' => 'Solicitud de Cotización',
        'asunto_por_defecto' => 'Atención urgente - Solicitud con plazo máximo hoy. Estimados. Agradezcoo su pronta respuesta y confirmación de atención.',
        'etiquetas' => [
            'proveedor' => 'PROVEEDOR:',
            'fecha' => 'FECHA:',
            'email' => 'E-MAIL:',
            'numero' => 'NÚMERO:',
            'cantidad' => 'Cant.',
            'descripcion' => 'Descripción',
            'precio_unitario' => 'P. Unit.',
            'total' => 'Total',
            'subtotal' => 'Total',
            'impuesto' => 'Impuesto',
            'total_pagar' => 'Total a pagar',
        ],
    ],

    // Configuración de archivos
    'archivos' => [
        'prefijo_nombre' => 'solicitud_cotizacion_',
        'sufijo_nombre' => '', // se puede agregar fecha, etc.
        'plantilla' => 'reportes.solicitud_cotizacion',
    ],

    // Configuración de seguridad
    'seguridad' => [
        'requireAuth' => true,
        'allowedRoles' => ['admin', 'supervisor', 'vendedor'],
        'maxPdfGenerationPerMinute' => 10,
    ],

    // Opciones avanzadas
    'avanzadas' => [
        'usar_cache' => env('PDF_USAR_CACHE', false),
        'cache_duracion' => env('PDF_CACHE_DURACION', 3600), // 1 hora
        'marca_agua' => env('PDF_MARCA_AGUA', true),
        'footer_personalizado' => env('PDF_FOOTER_PERSONALIZADO', false),
        'incluir_qr' => env('PDF_INCLUIR_QR', false),
    ],

    // Configuración de logging
    'logging' => [
        'log_generacion' => env('PDF_LOG_GENERACION', true),
        'log_errores' => env('PDF_LOG_ERRORES', true),
        'canal_log' => env('PDF_CANAL_LOG', 'default'),
    ],

];
