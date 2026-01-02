import axios from "axios";
import Cookies from "js-cookie";
import Constantes from "@/assets/constants/constantes";
import type {
  CreateRequerimientoObraData,
  RequerimientoObra,
  ObraOption,
  ProductoOption,
  UpdateRequerimientoObraData,
  // Mantener para compatibilidad
} from "../type/type";

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  total?: number;
  error?: string;
  errors?: any;
}

export class RequerimientosService {
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

  // ===== NUEVOS MÉTODOS PARA REQUERIMIENTOS DE OBRA =====

  static async listarRequerimientosObra(params?: {
    fk_idobras?: number;
    estado?: string;
    fecha_desde?: string;
    fecha_hasta?: string;
    search?: string;
  }): Promise<ApiResponse<RequerimientoObra[]>> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/requerimientos-obra`,
      {
        params,
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  static async crearRequerimientoObra(
    data: CreateRequerimientoObraData
  ): Promise<ApiResponse<RequerimientoObra>> {
    const response = await axios.post(
      `${Constantes.baseUrlBackend}/api/requerimientos-obra`,
      data,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  static async mostrarRequerimientoObra(
    id: number
  ): Promise<ApiResponse<RequerimientoObra>> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/requerimientos-obra/${id}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  static async actualizarRequerimientoObra(
    id: number,
    data: UpdateRequerimientoObraData
  ): Promise<ApiResponse<RequerimientoObra>> {
    const response = await axios.put(
      `${Constantes.baseUrlBackend}/api/requerimientos-obra/${id}`,
      data,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  static async eliminarRequerimientoObra(
    id: number
  ): Promise<ApiResponse<null>> {
    const response = await axios.delete(
      `${Constantes.baseUrlBackend}/api/requerimientos-obra/${id}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  static async cambiarEstadoRequerimientoObra(
    id: number,
    estado: string
  ): Promise<ApiResponse<RequerimientoObra>> {
    const response = await axios.patch(
      `${Constantes.baseUrlBackend}/api/requerimientos-obra/${id}/estado`,
      { estado },
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  static async marcarDetalleEntregado(
    idDetalle: number,
    cantidadEntregada: number,
    fechaEntrega?: string
  ): Promise<ApiResponse<any>> {
    const response = await axios.post(
      `${Constantes.baseUrlBackend}/api/requerimientos-obra/detalle/${idDetalle}/entregar`,
      {
        cantidad_entregada: cantidadEntregada,
        fecha_entrega: fechaEntrega,
      },
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  static async obtenerObras(): Promise<ApiResponse<ObraOption[]>> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/requerimientos-obra/opciones/obras`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  static async obtenerProductos(): Promise<ApiResponse<ProductoOption[]>> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/requerimientos-obra/opciones/productos`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  /**
   * Descargar reporte PDF del requerimiento de obra
   */
  static async descargarPDF(id: number): Promise<void> {
    try {
      const token = Cookies.get("token");
      const url = `${Constantes.baseUrlBackend}/api/requerimientos-obra/${id}/pdf`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      // Crear un enlace temporal para descargar el archivo
      const blob = new Blob([response.data], { type: "application/pdf" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `Requerimiento_Obra_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error al descargar PDF:", error);
      throw error;
    }
  }

  /**
   * Descargar reporte Excel del requerimiento de obra
   */
  static async descargarExcel(id: number): Promise<void> {
    try {
      const token = Cookies.get("token");
      const url = `${Constantes.baseUrlBackend}/api/requerimientos-obra/${id}/excel`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      // Crear un enlace temporal para descargar el archivo
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `Requerimiento_Obra_${id}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error al descargar Excel:", error);
      throw error;
    }
  }

  /**
   * Ver PDF en nueva ventana
   */
  static verPDFEnNuevaVentana(id: number): boolean {
    try {
      const token = Cookies.get("token");
      const url = `${Constantes.baseUrlBackend}/api/requerimientos-obra/${id}/pdf?token=${token}`;
      const ventana = window.open(url, "_blank");
      return ventana !== null;
    } catch (error) {
      console.error("Error al abrir PDF:", error);
      return false;
    }
  }
}
