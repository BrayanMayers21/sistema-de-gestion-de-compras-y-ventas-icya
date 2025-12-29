# 📋 Importación de Cotizaciones Antamina desde Excel

## 🎯 Descripción

Sistema completo de importación de cotizaciones para el proyecto Antamina mediante archivos Excel. Permite crear múltiples cotizaciones con sus detalles a través de una plantilla estandarizada.

## 📁 Estructura de la Plantilla Excel

### Columnas Requeridas

| Columna             | Descripción                   | Obligatorio | Tipo           | Ejemplo                             |
| ------------------- | ----------------------------- | ----------- | -------------- | ----------------------------------- |
| **Cliente**         | Nombre del cliente            | ✅ Sí       | Texto          | "Empresa Minera S.A."               |
| **Descripción**     | Descripción de la cotización  | ❌ No       | Texto          | "Cotización para proyecto Antamina" |
| **Código Producto** | Código del producto existente | ✅ Sí       | Texto          | "PROD001"                           |
| **Cantidad**        | Cantidad a cotizar            | ✅ Sí       | Número entero  | 100                                 |
| **Precio Unitario** | Precio por unidad             | ✅ Sí       | Número decimal | 25.50                               |
| **Marca**           | Marca del producto            | ❌ No       | Texto          | "Marca A"                           |

### 📝 Ejemplo de Datos

```
Cliente                 | Descripción                          | Código Producto | Cantidad | Precio Unitario | Marca
Empresa Minera S.A.    | Cotización para proyecto Antamina   | PROD001         | 100      | 25.50          | Marca A
Empresa Minera S.A.    | Cotización para proyecto Antamina   | PROD002         | 50       | 150.00         | Marca B
Constructora ABC       | Materiales de construcción          | PROD003         | 200      | 12.75          | Marca C
```

## 🔄 Agrupación de Cotizaciones

Las filas con **el mismo Cliente y Descripción** se agruparán automáticamente en una sola cotización:

### Ejemplo:

```
Cliente: Empresa Minera S.A.
Descripción: Cotización para proyecto Antamina
    - Detalle 1: PROD001, Cantidad: 100, Precio: 25.50
    - Detalle 2: PROD002, Cantidad: 50, Precio: 150.00
Total: 10,050.00
```

## 🚀 Cómo Usar

### 1️⃣ Descargar la Plantilla

1. Ir a la página de **Cotizaciones Antamina**
2. Hacer clic en el botón **"Importar Excel"**
3. Hacer clic en **"Descargar Plantilla"**
4. Se descargará un archivo Excel con:
   - **Hoja 1 (Cotizaciones)**: Para ingresar datos
   - **Hoja 2 (Instrucciones)**: Guía de uso
   - **Hoja 3 (Productos Disponibles)**: Lista de productos con códigos

### 2️⃣ Llenar la Plantilla

1. Abrir el archivo descargado
2. Ir a la hoja **"Productos Disponibles"** para ver los códigos disponibles
3. Volver a la hoja **"Cotizaciones"**
4. Eliminar las filas de ejemplo (opcionales)
5. Ingresar los datos de las cotizaciones

**⚠️ IMPORTANTE:**

- No modificar los nombres de las columnas
- Los códigos de producto deben existir en la base de datos
- Las cantidades deben ser números enteros mayores a 0
- Los precios deben ser números mayores o iguales a 0

### 3️⃣ Importar el Archivo

1. Guardar el archivo Excel
2. En la página de Cotizaciones, hacer clic en **"Importar Excel"**
3. Arrastrar el archivo o hacer clic para seleccionarlo
4. Hacer clic en **"Subir Excel"**
5. Esperar la confirmación

## ✅ Validaciones

El sistema valida automáticamente:

- ✔️ Formato del archivo (xlsx, xls)
- ✔️ Tamaño máximo: 5 MB
- ✔️ Encabezados correctos
- ✔️ Cliente obligatorio
- ✔️ Código de producto existe
- ✔️ Cantidad es número entero mayor a 0
- ✔️ Precio es número mayor o igual a 0

## 📊 Resultado de la Importación

Al finalizar, verás:

```json
{
  "success": true,
  "message": "Importación completada exitosamente",
  "insertados": 3,
  "errores": [],
  "debug": {
    "total_filas_procesadas": 10,
    "total_cotizaciones": 3,
    "total_errores": 0
  }
}
```

### Información mostrada:

- **Insertados**: Número de cotizaciones creadas
- **Errores**: Lista de errores encontrados (si hay)
- **Debug**: Información adicional del proceso

## 🎨 Características

### Frontend (React + TypeScript)

- 📤 Interfaz drag-and-drop para subir archivos
- ✅ Validación en tiempo real
- 📊 Barra de progreso durante la carga
- 🎯 Mensajes de error detallados
- 🔄 Recarga automática después de importar

### Backend (Laravel + PhpSpreadsheet)

- 📋 Generación dinámica de plantillas Excel
- 🔍 Validación exhaustiva de datos
- 🏗️ Agrupación inteligente de cotizaciones
- 💾 Inserción transaccional (todo o nada)
- 📝 Logs detallados para debugging
- 🔢 Generación automática de números de cotización

## 🗂️ Archivos Involucrados

### Frontend

```
RedFront/src/assets/Components/cotizacion_antamina/
├── components/
│   └── cotizacion-excel-upload.tsx    # Modal de importación
├── services/
│   └── cotizacion-service.ts          # Servicios API
└── cotizacion-page.tsx                # Página principal
```

### Backend

```
RedBack/
├── app/Http/Controllers/CotizacionAntamina/
│   └── CotizacionAntaminaControllers.php   # Controlador con métodos
└── routes/
    └── api.php                              # Rutas API
```

## 🔧 Endpoints API

### Descargar Plantilla

```
GET /api/cotizacion-antamina/plantilla-excel
Response: Archivo Excel
```

### Importar Excel

```
POST /api/cotizacion-antamina/importar-excel
Content-Type: multipart/form-data
Body: { file: [archivo.xlsx] }

Response: {
  "success": true,
  "message": "Importación completada exitosamente",
  "insertados": 3,
  "errores": []
}
```

## 🐛 Solución de Problemas

### Problema: "El archivo está vacío"

**Solución**: Asegúrate de que la hoja "Cotizaciones" tenga datos además de los encabezados.

### Problema: "Los encabezados no coinciden"

**Solución**: Descarga una nueva plantilla y no modifiques los nombres de las columnas.

### Problema: "El producto con código 'XXX' no existe"

**Solución**: Verifica en la hoja "Productos Disponibles" que el código sea correcto.

### Problema: "La cantidad debe ser un número entero mayor a 0"

**Solución**: Asegúrate de que las cantidades sean números enteros positivos (1, 2, 3...).

### Problema: "El precio unitario debe ser un número mayor o igual a 0"

**Solución**: Verifica que los precios sean números decimales válidos (25.50, 100, 0.99...).

## 📈 Proceso Interno

1. **Validación de archivo**
   - Formato válido (xlsx/xls)
   - Tamaño menor a 5 MB
2. **Lectura de Excel**
   - Carga de datos con PhpSpreadsheet
   - Validación de encabezados
3. **Procesamiento de filas**
   - Validación de cada campo
   - Búsqueda de productos por código
   - Cálculo de subtotales
4. **Agrupación**
   - Agrupar por cliente y descripción
   - Sumar detalles de cada cotización
5. **Inserción en BD**
   - Crear cotización con número único
   - Insertar detalles asociados
   - Commit de transacción

## 🔐 Seguridad

- ✅ Validación de tipos de archivo
- ✅ Límite de tamaño de archivo
- ✅ Validación de datos antes de insertar
- ✅ Transacciones de base de datos
- ✅ Logs de auditoría

## 📞 Soporte

Si encuentras algún problema:

1. Revisa los logs en `RedBack/storage/logs/laravel.log`
2. Verifica que los productos existan en la base de datos
3. Asegúrate de usar la plantilla más reciente
4. Contacta al equipo de desarrollo

---

**Última actualización**: Enero 2025
**Versión**: 1.0.0
