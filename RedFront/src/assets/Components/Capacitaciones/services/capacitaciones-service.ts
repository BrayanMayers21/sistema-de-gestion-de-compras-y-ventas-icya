import axios from "axios";
import Cookies from "js-cookie";
import Constantes from "@/assets/constants/constantes";
import type {
  Capacitacion,
  CreateCapacitacionData,
  UpdateCapacitacionData,
  EmpleadoOption,
  TipoActividadOption,
} from "../type/type";

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  total?: number;
  error?: string;
}

export class CapacitacionesService {
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

  /**
   * Listar capacitaciones con filtros opcionales
   */
  static async listar(params?: {
    tipo_actividad?: string;
    fecha_desde?: string;
    fecha_hasta?: string;
    capacitador?: string;
    tema?: string;
    search?: string;
  }): Promise<ApiResponse<Capacitacion[]>> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/capacitaciones`,
      {
        params,
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  /**
   * Obtener una capacitación por ID
   */
  static async mostrar(id: number): Promise<ApiResponse<Capacitacion>> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/capacitaciones/${id}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  /**
   * Crear nueva capacitación
   */
  static async crear(
    data: CreateCapacitacionData
  ): Promise<ApiResponse<Capacitacion>> {
    const response = await axios.post(
      `${Constantes.baseUrlBackend}/api/capacitaciones`,
      data,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  /**
   * Actualizar capacitación existente
   */
  static async actualizar(
    id: number,
    data: UpdateCapacitacionData
  ): Promise<ApiResponse<Capacitacion>> {
    const response = await axios.put(
      `${Constantes.baseUrlBackend}/api/capacitaciones/${id}`,
      data,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  /**
   * Eliminar capacitación
   */
  static async eliminar(id: number): Promise<ApiResponse<null>> {
    const response = await axios.delete(
      `${Constantes.baseUrlBackend}/api/capacitaciones/${id}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  /**
   * Obtener lista de empleados para el select
   */
  static async obtenerEmpleados(): Promise<ApiResponse<EmpleadoOption[]>> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/capacitaciones/opciones/empleados`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  /**
   * Obtener tipos de actividad disponibles
   */
  static async obtenerTiposActividad(): Promise<
    ApiResponse<TipoActividadOption[]>
  > {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/capacitaciones/opciones/tipos-actividad`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  /**
   * Descargar PDF de la capacitación
   */
  static async descargarPDF(id: number): Promise<void> {
    try {
      const token = Cookies.get("token");
      const url = `${Constantes.baseUrlBackend}/api/capacitaciones/${id}/pdf`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `Capacitacion_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error al descargar PDF:", error);
      throw error;
    }
  }
}
