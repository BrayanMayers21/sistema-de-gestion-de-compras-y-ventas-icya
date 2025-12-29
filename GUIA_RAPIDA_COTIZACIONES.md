# 📋 Guía de Importación Excel - Cotizaciones Antamina

## 🎯 Formato Simplificado

El nuevo formato del Excel es mucho más simple y directo:

### ✅ Estructura del Archivo

```
┌──────────────┬────────────────────────────────────────┐
│ PROVEEDOR:   │ Distribuidora de Materiales S.A.C.   │
└──────────────┴────────────────────────────────────────┘

┌────────────────────────────────┬──────────┬─────────────┬─────────────┐
│ Nombre Producto                │ Cantidad │Precio Unit. │  Subtotal   │
├────────────────────────────────┼──────────┼─────────────┼─────────────┤
│ Cemento Portland Tipo I        │    50    │    28.50    │  1,425.00   │
│ Arena Gruesa m3                │   100    │    45.00    │  4,500.00   │
│ Ladrillos King Kong 18 huecos  │   500    │     0.85    │    425.00   │
│ Fierro Corrugado 1/2" x 9m     │   200    │    32.50    │  6,500.00   │
│ Tubo PVC 2" x 3m               │    75    │    12.00    │    900.00   │
└────────────────────────────────┴──────────┴─────────────┼─────────────┤
│ TOTAL:                                                   │ 13,750.00   │
└──────────────────────────────────────────────────────────┴─────────────┘
```

## 📝 Instrucciones de Uso

### 1️⃣ Descargar la Plantilla

1. Ir a **Cotizaciones Antamina**
2. Click en **"Importar Excel"**
3. Click en **"Descargar Plantilla"**
4. Se descargará un archivo Excel con 3 hojas:
   - **Cotización**: Para ingresar datos
   - **Instrucciones**: Guía de uso
   - **Productos Disponibles**: Lista de productos

### 2️⃣ Llenar la Plantilla

#### 🔸 Paso 1: Ingresar Proveedor

- En la celda **B1** (amarilla), escribir el nombre del proveedor
- Ejemplo: "Distribuidora de Materiales S.A.C."

#### 🔸 Paso 2: Ingresar Productos

Desde la fila 4 en adelante, ingresar:

| Columna | Qué Ingresar                             | Ejemplo                            |
| ------- | ---------------------------------------- | ---------------------------------- |
| **A**   | Nombre del producto (debe existir en BD) | "Cemento Portland Tipo I x 42.5kg" |
| **B**   | Cantidad                                 | 50                                 |
| **C**   | Precio Unitario                          | 28.50                              |
| **D**   | Subtotal (calculado automáticamente)     | =B4\*C4                            |

**⚠️ IMPORTANTE:**

- Los nombres de productos deben coincidir con los de la base de datos
- Consulta la hoja "Productos Disponibles" para ver los nombres exactos
- Las columnas NO requieren código, solo el nombre del producto
- El subtotal se calcula automáticamente con la fórmula

### 3️⃣ Importar el Archivo

1. Guardar el archivo Excel
2. En la página, click en **"Importar Excel"**
3. Arrastrar o seleccionar el archivo
4. Click en **"Subir Excel"**
5. Esperar confirmación

## ✅ Ventajas del Nuevo Formato

- ✨ **Más Simple**: Solo necesitas el nombre del producto, no códigos
- ⚡ **Más Rápido**: Menos columnas para llenar
- 🎯 **Un Proveedor**: Una cotización por archivo
- 🔢 **Cálculo Automático**: Subtotales y total se calculan solos
- 📊 **Visual**: Formato claro tipo factura

## 🔍 Validaciones

El sistema valida:

✓ Proveedor obligatorio (celda B1)  
✓ Nombre de producto existe en base de datos  
✓ Cantidad es número entero > 0  
✓ Precio es número >= 0  
✓ Formato de archivo (xlsx/xls)  
✓ Tamaño máximo 5 MB

## 📊 Resultado

Después de importar, se creará:

```json
{
  "success": true,
  "message": "Cotización importada exitosamente",
  "numero_cotizacion": "COT-000015",
  "proveedor": "Distribuidora de Materiales S.A.C.",
  "total_productos": 5,
  "costo_total": 13750.0
}
```

## 🎨 Características del Excel

### Celdas con Colores:

- 🟡 **Amarillo**: Campo de proveedor (obligatorio)
- 🔵 **Azul**: Encabezados de columnas
- ⚪ **Gris**: Filas de ejemplo (pueden eliminarse)
- 🟢 **Verde**: Fila de TOTAL

### Fórmulas Incluidas:

- **Subtotal**: `=B4*C4` (cantidad × precio)
- **Total**: `=SUM(D4:D100)` (suma de subtotales)

## 🚫 Errores Comunes

### ❌ "El producto 'XXX' no existe"

**Solución**: Verifica el nombre exacto en la hoja "Productos Disponibles"

### ❌ "Debe ingresar el proveedor en B1"

**Solución**: Asegúrate de llenar la celda B1 con el nombre del proveedor

### ❌ "La cantidad debe ser un número"

**Solución**: Ingresa solo números en la columna Cantidad (sin texto)

## 📞 Soporte

Revisa los logs en: `RedBack/storage/logs/laravel.log`

---

**Última actualización**: Diciembre 2024  
**Versión**: 2.0.0 (Formato Simplificado)
