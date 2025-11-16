import axios from "axios";
import Cookies from "js-cookie";
import Constantes from "@/assets/constants/constantes";
import type {
  CreateRequerimientoData,
  RequerimientoItem,
  ProveedorOption,
  ProductoOption,
} from "../type/type";

export interface ApiResponse<T> {
  message: string;
  data?: T;
  total?: number;
  error?: string;
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

  static async listar(params: {
    Limite_inferior: number;
    Limite_Superior: number;
    Buscar?: string;
  }): Promise<ApiResponse<RequerimientoItem[]>> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/requerimientos-listar`,
      {
        params,
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  static async crear(data: CreateRequerimientoData): Promise<ApiResponse<any>> {
    const response = await axios.post(
      `${Constantes.baseUrlBackend}/api/requerimientos-crear`,
      data,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  static async mostrar(id: number): Promise<ApiResponse<RequerimientoItem>> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/requerimiento-mostrar/${id}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  static async actualizar(
    id: number,
    data: CreateRequerimientoData
  ): Promise<ApiResponse<any>> {
    const response = await axios.put(
      `${Constantes.baseUrlBackend}/api/requerimiento-update/${id}`,
      data,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  static async eliminar(id: number): Promise<ApiResponse<null>> {
    const response = await axios.delete(
      `${Constantes.baseUrlBackend}/api/requerimiento-eliminar/${id}`,
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

  static async obtenerProductos(): Promise<ApiResponse<ProductoOption[]>> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/productos-listar`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  // Métodos para reportes PDF
  static async generarReportePDF(id: number): Promise<Blob> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/requerimientos-pdf/${id}`,
      {
        headers: this.getAuthHeaders(),
        responseType: "blob", // Importante para recibir el archivo como blob
      }
    );
    return response.data;
  }

  static getUrlVerPDF(id: number): string {
    const token = Cookies.get("token");
    return `${Constantes.baseUrlBackend}/api/requerimientos-ver-pdf/${id}?token=${token}`;
  }

  // Método de utilidad para descargar PDF
  static async descargarPDF(
    id: number,
    nombreArchivo?: string
  ): Promise<boolean> {
    try {
      const blob = await this.generarReportePDF(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = nombreArchivo || `solicitud_cotizacion_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error("Error al descargar PDF:", error);
      throw error;
    }
  }

  // Método de utilidad para ver PDF en nueva ventana
  static verPDFEnNuevaVentana(id: number): boolean {
    try {
      const url = this.getUrlVerPDF(id);
      const ventana = window.open(
        url,
        "_blank",
        "width=800,height=900,scrollbars=yes"
      );
      return ventana !== null;
    } catch (error) {
      console.error("Error al abrir PDF:", error);
      throw error;
    }
  }
}
