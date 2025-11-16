import axios from "axios";
import Cookies from "js-cookie";
import Constantes from "@/assets/constants/constantes";
import type {
  CreateOrdenCompraData,
  OrdenCompraItem,
  ProveedorOption,
  TipoOrdenOption,
  ProductoOption,
  CodigoContableOption,
} from "../type/type";

export interface ApiResponse<T> {
  message: string;
  data?: T;
  total?: number;
  error?: string;
}

export class CategoriasService {
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
  }): Promise<ApiResponse<OrdenCompraItem[]>> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/ordenCompra-listar`,
      {
        params,
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  static async crear(
    data: CreateOrdenCompraData | FormData
  ): Promise<ApiResponse<OrdenCompraItem>> {
    const headers = this.getAuthHeaders();

    // Si es FormData, agregar el header multipart/form-data
    if (data instanceof FormData) {
      headers["Content-Type"] = "multipart/form-data";
    }

    const response = await axios.post(
      `${Constantes.baseUrlBackend}/api/ordenCompra-create`,
      data,
      {
        headers,
      }
    );
    return response.data;
  }

  static async mostrar(id: number): Promise<ApiResponse<OrdenCompraItem>> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/ordenCompra-mostrar/${id}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  static async actualizar(
    id: number,
    data: CreateOrdenCompraData | FormData
  ): Promise<ApiResponse<OrdenCompraItem>> {
    const headers = this.getAuthHeaders();

    // Si es FormData, agregar el header multipart/form-data
    if (data instanceof FormData) {
      headers["Content-Type"] = "multipart/form-data";
    }

    const response = await axios.put(
      `${Constantes.baseUrlBackend}/api/ordenCompra-update/${id}`,
      data,
      {
        headers,
      }
    );
    return response.data;
  }

  static async eliminar(id: number): Promise<ApiResponse<null>> {
    const response = await axios.delete(
      `${Constantes.baseUrlBackend}/api/ordenCompra-eliminar/${id}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  // Método para obtener detalles completos de una orden
  static async obtenerPorId(id: number): Promise<ApiResponse<any>> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/ordenCompra-mostrar/${id}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  // Método específico para obtener detalles completos con joins
  static async obtenerDetalles(id: number): Promise<any> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/ordenCompra-mostrar/${id}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  // Métodos adicionales para obtener opciones de los selects
  static async obtenerProveedores(): Promise<ApiResponse<ProveedorOption[]>> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/proveedores-listar`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  static async obtenerTiposOrden(): Promise<ApiResponse<TipoOrdenOption[]>> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/tipos-orden-listar`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  static async obtenerProductos(): Promise<ApiResponse<ProductoOption[]>> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/productos-listar`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  static async obtenerCodigosContables(): Promise<
    ApiResponse<CodigoContableOption[]>
  > {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/contables-listar`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  // Método para generar PDF de la orden
  static async generarPDF(id: number): Promise<void> {
    try {
      const token = Cookies.get("token");

      // Crear enlace para descargar el PDF
      const link = document.createElement("a");
      link.href = `${Constantes.baseUrlBackend}/api/ordenCompra-pdf-public/${id}`;

      // Agregar el token como parámetro de consulta si existe
      if (token) {
        link.href += `?token=${token}`;
      }

      link.target = "_blank";
      link.download = `orden_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      throw new Error("Error al generar el PDF de la orden");
    }
  }
}
