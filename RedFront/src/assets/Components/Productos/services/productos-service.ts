import axios from "axios";
import Cookies from "js-cookie";
import Constantes from "@/assets/constants/constantes";
import type {
  CreateProductoData,
  UpdateProductoData,
  ProductoItem,
  CategoriaOption,
} from "../type/type";

export interface ApiResponse<T> {
  message: string;
  data?: T;
  total?: number;
  error?: string;
  categorias?: T;
  // Campos adicionales para importación Excel
  insertados?: number;
  omitidos?: number;
  errores?: string[];
  debug?: {
    total_filas_procesadas?: number;
    categorias_disponibles?: string[];
    encabezados_encontrados?: string[];
  };
}

export class ProductosService {
  private static getAuthHeaders() {
    const token = Cookies.get("token");
    if (!token) {
      throw new Error("Token de autenticación no encontrado");
    }
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  // Headers para FormData (sin Content-Type, lo gestiona axios automáticamente)
  private static getAuthHeadersForFormData() {
    const token = Cookies.get("token");
    if (!token) {
      throw new Error("Token de autenticación no encontrado");
    }
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  static async listar(params: {
    Limite_inferior: number;
    Limite_Superior: number;
    Buscar?: string;
  }): Promise<ApiResponse<ProductoItem[]>> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/productos-materiales`,
      {
        params,
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  static async crear(
    data: CreateProductoData | FormData
  ): Promise<ApiResponse<ProductoItem>> {
    const response = await axios.post(
      `${Constantes.baseUrlBackend}/api/productos-crear`,
      data,
      {
        headers:
          data instanceof FormData
            ? this.getAuthHeadersForFormData()
            : this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  static async mostrar(id: number): Promise<ApiResponse<ProductoItem>> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/productos-mostrar/${id}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  static async actualizar(
    id: number,
    data: UpdateProductoData | FormData
  ): Promise<ApiResponse<ProductoItem>> {
    // Laravel requiere _method para FormData con PUT
    if (data instanceof FormData) {
      data.append("_method", "PUT");
      // Usar POST con _method=PUT para FormData
      const response = await axios.post(
        `${Constantes.baseUrlBackend}/api/productos-actualizar/${id}`,
        data,
        {
          headers: this.getAuthHeadersForFormData(),
        }
      );
      return response.data;
    } else {
      const response = await axios.put(
        `${Constantes.baseUrlBackend}/api/productos-actualizar/${id}`,
        data,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    }
  }

  static async eliminar(id: number): Promise<ApiResponse<null>> {
    const response = await axios.delete(
      `${Constantes.baseUrlBackend}/api/productos-eliminar/${id}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  // Método para obtener detalles completos de un producto
  static async obtenerPorId(id: number): Promise<ApiResponse<ProductoItem>> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/productos-mostrar/${id}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  // Método para obtener categorías para el select
  static async obtenerCategorias(): Promise<ApiResponse<CategoriaOption[]>> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/productos-categorias`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    // El backend retorna "categorias" en lugar de "data"
    return {
      message: response.data.message,
      data: response.data.categorias || response.data.data,
    };
  }

  // Método para subir archivo Excel con productos
  static async subirExcel(file: File): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append("archivo", file);

    const response = await axios.post(
      `${Constantes.baseUrlBackend}/api/productos-importar-excel`,
      formData,
      {
        headers: this.getAuthHeadersForFormData(),
      }
    );
    return response.data;
  }

  // Método para descargar plantilla Excel
  static async descargarPlantillaExcel(): Promise<void> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/productos-plantilla-excel`,
      {
        headers: this.getAuthHeaders(),
        responseType: "blob", // Importante para archivos
      }
    );

    // Crear un link temporal para descargar el archivo
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "plantilla_productos.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
}
