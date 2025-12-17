// /**
//  * Configuración de rutas para el módulo de Obras
//  *
//  * Este archivo centraliza las rutas de navegación para facilitar
//  * la integración con el router principal de la aplicación.
//  */

// export const OBRAS_ROUTES = {
//   // Rutas de obras
//   OBRAS_LIST: "/obras",
//   OBRAS_CREATE: "/obras/crear",
//   OBRAS_EDIT: "/obras/editar/:id",
//   OBRAS_DETAIL: "/obras/detalle/:id",

//   // Rutas de productos (legacy - mantener compatibilidad)
//   PRODUCTOS_LIST: "/productos",
//   PRODUCTOS_CREATE: "/productos/crear",
//   PRODUCTOS_EDIT: "/productos/editar/:id",
//   PRODUCTOS_DETAIL: "/productos/detalle/:id",
// } as const;

// /**
//  * Configuración de endpoints del backend
//  */
// export const OBRAS_API_ENDPOINTS = {
//   // Endpoints de obras
//   OBRAS_LISTAR: "/api/obras-listar",
//   OBRAS_CREAR: "/api/obras-crear",
//   OBRAS_ACTUALIZAR: "/api/obras-actualizar",
//   OBRAS_ELIMINAR: "/api/obras-eliminar",

//   // Endpoints de productos (legacy)
//   PRODUCTOS_LISTAR: "/api/productos-materiales",
//   PRODUCTOS_CREAR: "/api/productos-crear",
//   PRODUCTOS_MOSTRAR: "/api/productos-mostrar",
//   PRODUCTOS_ACTUALIZAR: "/api/productos-actualizar",
//   PRODUCTOS_ELIMINAR: "/api/productos-eliminar",
//   PRODUCTOS_CATEGORIAS: "/api/productos-categorias",
// } as const;

// /**
//  * Configuración de permisos
//  */
// export const OBRAS_PERMISSIONS = {
//   // Permisos de obras
//   OBRAS_VIEW: "productos.view",
//   OBRAS_CREATE: "productos.create",
//   OBRAS_UPDATE: "productos.update",
//   OBRAS_DELETE: "productos.delete",

//   // Permisos de productos
//   PRODUCTOS_VIEW: "productos.view",
//   PRODUCTOS_CREATE: "productos.create",
//   PRODUCTOS_UPDATE: "productos.update",
//   PRODUCTOS_DELETE: "productos.delete",
// } as const;

// /**
//  * Configuración de mensajes
//  */
// export const OBRAS_MESSAGES = {
//   // Mensajes de obras
//   OBRA_CREATED: "Obra creada correctamente",
//   OBRA_UPDATED: "Obra actualizada correctamente",
//   OBRA_DELETED: "Obra eliminada correctamente",
//   OBRA_ERROR_CREATE: "Error al crear la obra",
//   OBRA_ERROR_UPDATE: "Error al actualizar la obra",
//   OBRA_ERROR_DELETE: "Error al eliminar la obra",
//   OBRA_ERROR_LOAD: "Error al cargar las obras",

//   // Mensajes de productos
//   PRODUCTO_CREATED: "Producto creado correctamente",
//   PRODUCTO_UPDATED: "Producto actualizado correctamente",
//   PRODUCTO_DELETED: "Producto eliminado correctamente",
//   PRODUCTO_ERROR_CREATE: "Error al crear el producto",
//   PRODUCTO_ERROR_UPDATE: "Error al actualizar el producto",
//   PRODUCTO_ERROR_DELETE: "Error al eliminar el producto",
//   PRODUCTO_ERROR_LOAD: "Error al cargar los productos",
// } as const;

// /**
//  * Configuración de validaciones
//  */
// export const OBRAS_VALIDATION = {
//   // Validaciones de obras
//   CODIGO_MAX_LENGTH: 45,
//   NOM_OBRA_MAX_LENGTH: 255,

//   // Validaciones de productos
//   PRODUCTO_CODIGO_MAX_LENGTH: 50,
//   PRODUCTO_NOMBRE_MAX_LENGTH: 255,
//   PRODUCTO_DESCRIPCION_MAX_LENGTH: 500,
//   PRODUCTO_UNIDAD_MAX_LENGTH: 100,
// } as const;
