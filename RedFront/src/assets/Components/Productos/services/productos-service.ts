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
    data: CreateProductoData
  ): Promise<ApiResponse<ProductoItem>> {
    const response = await axios.post(
      `${Constantes.baseUrlBackend}/api/productos-crear`,
      data,
      {
        headers: this.getAuthHeaders(),
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
    data: UpdateProductoData
  ): Promise<ApiResponse<ProductoItem>> {
    const response = await axios.put(
      `${Constantes.baseUrlBackend}/api/productos-actualizar/${id}`,
      data,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
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
}
