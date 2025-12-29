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

  // Método para subir archivo Excel con cotizaciones
  static async subirExcel(file: File): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);

    const token = Cookies.get("token");
    const response = await axios.post(
      `${Constantes.baseUrlBackend}/api/cotizacion-antamina/importar-excel`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  // Método para descargar plantilla Excel
  static async descargarPlantillaExcel(): Promise<void> {
    const token = Cookies.get("token");
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/cotizacion-antamina/plantilla-excel`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );

    // Crear un link temporal para descargar el archivo
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "plantilla_cotizaciones_antamina.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  // Método para exportar lista de cotizaciones a Excel
  static async exportarExcel(): Promise<void> {
    const token = Cookies.get("token");
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/cotizacion-antamina/exportar-excel`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `cotizaciones_antamina_${new Date().toISOString().split("T")[0]}.xlsx`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  // Método para exportar lista de cotizaciones a PDF
  static async exportarPDF(): Promise<void> {
    const token = Cookies.get("token");
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/cotizacion-antamina/exportar-pdf`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `cotizaciones_antamina_${new Date().toISOString().split("T")[0]}.pdf`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  // Método para exportar una cotización específica a Excel
  static async exportarCotizacionExcel(id: number): Promise<void> {
    const token = Cookies.get("token");
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/cotizacion-antamina/exportar-excel/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `cotizacion_${id}_${new Date().toISOString().split("T")[0]}.xlsx`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  // Método para exportar una cotización específica a PDF
  static async exportarCotizacionPDF(id: number): Promise<void> {
    const token = Cookies.get("token");
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/cotizacion-antamina/exportar-pdf/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `cotizacion_${id}_${new Date().toISOString().split("T")[0]}.pdf`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
}
