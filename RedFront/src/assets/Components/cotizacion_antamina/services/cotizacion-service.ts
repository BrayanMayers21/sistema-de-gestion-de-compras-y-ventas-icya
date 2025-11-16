import axios from "axios";
import Cookies from "js-cookie";
import Constantes from "@/assets/constants/constantes";
import type {
  CreateCotizacionData,
  UpdateCotizacionData,
  CotizacionAntamina,
  ProductoOption,
  ApiResponse,
} from "../type/cotizacion-type";

export class CotizacionAntaminaService {
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

  // Listar todas las cotizaciones
  static async listar(params: {
    Limite_inferior: number;
    Limite_Superior: number;
    Buscar?: string;
  }): Promise<ApiResponse<CotizacionAntamina[]>> {
    try {
      const response = await axios.get(
        `${Constantes.baseUrlBackend}/api/cotizacion-antamina/list`,
        {
          params,
          headers: this.getAuthHeaders(),
        }
      );
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Error al listar cotizaciones",
      };
    }
  }

  // Crear una nueva cotización
  static async crear(
    data: CreateCotizacionData
  ): Promise<ApiResponse<CotizacionAntamina>> {
    try {
      const response = await axios.post(
        `${Constantes.baseUrlBackend}/api/cotizacion-antamina/create`,
        data,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Error al crear cotización",
        errors: error.response?.data?.errors,
      };
    }
  }

  // Mostrar una cotización específica
  static async mostrar(id: number): Promise<ApiResponse<CotizacionAntamina>> {
    try {
      const response = await axios.get(
        `${Constantes.baseUrlBackend}/api/cotizacion-antamina/show/${id}`,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Error al obtener cotización",
      };
    }
  }

  // Actualizar una cotización existente
  static async actualizar(
    id: number,
    data: UpdateCotizacionData
  ): Promise<ApiResponse<CotizacionAntamina>> {
    try {
      const response = await axios.put(
        `${Constantes.baseUrlBackend}/api/cotizacion-antamina/update/${id}`,
        data,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Error al actualizar cotización",
        errors: error.response?.data?.errors,
      };
    }
  }

  // Eliminar una cotización
  static async eliminar(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await axios.delete(
        `${Constantes.baseUrlBackend}/api/cotizacion-antamina/delete/${id}`,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Error al eliminar cotización",
      };
    }
  }

  // Obtener productos disponibles
  static async obtenerProductos(): Promise<ApiResponse<ProductoOption[]>> {
    try {
      const response = await axios.get(
        `${Constantes.baseUrlBackend}/api/productos-listar`,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Error al obtener productos",
      };
    }
  }
}
