import { useState } from "react";
import toast from "react-hot-toast";
import { RequerimientosService } from "../services/requerimiento-service";

export interface UseReportesPDFReturn {
  isGenerating: boolean;
  descargarPDF: (id: number, nombreArchivo?: string) => Promise<void>;
  verPDF: (id: number) => void;
  error: string | null;
  clearError: () => void;
}

/**
 * Hook personalizado para manejar reportes PDF de requerimientos
 *
 * @returns Objeto con métodos y estado para manejar reportes PDF
 */
export const useReportesPDF = (): UseReportesPDFReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const descargarPDF = async (
    id: number,
    nombreArchivo?: string
  ): Promise<void> => {
    setIsGenerating(true);
    setError(null);

    try {
      await toast.promise(
        RequerimientosService.descargarPDF(id, nombreArchivo),
        {
          loading: "Generando PDF...",
          success: "PDF descargado correctamente",
          error: (err: any) => `Error al generar PDF: ${err.message || err}`,
        }
      );
    } catch (err: any) {
      const errorMessage = err.message || "Error desconocido al generar PDF";
      setError(errorMessage);
      console.error("Error en descargarPDF:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const verPDF = (id: number): void => {
    setError(null);

    try {
      const ventanaAbierta = RequerimientosService.verPDFEnNuevaVentana(id);

      if (!ventanaAbierta) {
        const mensaje =
          "El navegador bloqueó la ventana emergente. Permite ventanas emergentes para ver el PDF.";
        toast.error(mensaje);
        setError(mensaje);
      } else {
        toast.success("PDF abierto en nueva ventana");
      }
    } catch (err: any) {
      const errorMessage = `Error al abrir PDF: ${err.message || err}`;
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error en verPDF:", err);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  return {
    isGenerating,
    descargarPDF,
    verPDF,
    error,
    clearError,
  };
};

// Versión con callback personalizado para mayor flexibilidad
export interface UseReportesPDFWithCallbacksOptions {
  onSuccess?: (action: "download" | "view", id: number) => void;
  onError?: (error: string, action: "download" | "view", id: number) => void;
  showToasts?: boolean;
}

export const useReportesPDFWithCallbacks = (
  options: UseReportesPDFWithCallbacksOptions = {}
): UseReportesPDFReturn => {
  const { onSuccess, onError, showToasts = true } = options;
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const descargarPDF = async (
    id: number,
    nombreArchivo?: string
  ): Promise<void> => {
    setIsGenerating(true);
    setError(null);

    try {
      if (showToasts) {
        await toast.promise(
          RequerimientosService.descargarPDF(id, nombreArchivo),
          {
            loading: "Generando PDF...",
            success: "PDF descargado correctamente",
            error: (err: any) => `Error al generar PDF: ${err.message || err}`,
          }
        );
      } else {
        await RequerimientosService.descargarPDF(id, nombreArchivo);
      }

      onSuccess?.("download", id);
    } catch (err: any) {
      const errorMessage = err.message || "Error desconocido al generar PDF";
      setError(errorMessage);
      onError?.(errorMessage, "download", id);
      console.error("Error en descargarPDF:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const verPDF = (id: number): void => {
    setError(null);

    try {
      const ventanaAbierta = RequerimientosService.verPDFEnNuevaVentana(id);

      if (!ventanaAbierta) {
        const mensaje =
          "El navegador bloqueó la ventana emergente. Permite ventanas emergentes para ver el PDF.";
        if (showToasts) toast.error(mensaje);
        setError(mensaje);
        onError?.(mensaje, "view", id);
      } else {
        if (showToasts) toast.success("PDF abierto en nueva ventana");
        onSuccess?.("view", id);
      }
    } catch (err: any) {
      const errorMessage = `Error al abrir PDF: ${err.message || err}`;
      setError(errorMessage);
      if (showToasts) toast.error(errorMessage);
      onError?.(errorMessage, "view", id);
      console.error("Error en verPDF:", err);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  return {
    isGenerating,
    descargarPDF,
    verPDF,
    error,
    clearError,
  };
};

// Ejemplo de uso:
/*
// Uso básico
const Component = () => {
  const { isGenerating, descargarPDF, verPDF, error } = useReportesPDF();
  
  return (
    <div>
      {error && <div className="error">{error}</div>}
      
      <button 
        onClick={() => descargarPDF(123)} 
        disabled={isGenerating}
      >
        {isGenerating ? 'Generando...' : 'Descargar PDF'}
      </button>
      
      <button onClick={() => verPDF(123)}>
        Ver PDF
      </button>
    </div>
  );
};

// Uso con callbacks personalizados
const ComponentWithCallbacks = () => {
  const { descargarPDF, verPDF } = useReportesPDFWithCallbacks({
    onSuccess: (action, id) => {
      console.log(`Acción ${action} exitosa para requerimiento ${id}`);
      // Lógica personalizada de éxito
    },
    onError: (error, action, id) => {
      console.error(`Error en ${action} para requerimiento ${id}:`, error);
      // Lógica personalizada de error
    },
    showToasts: false // Deshabilitar toasts automáticos
  });
  
  return (
    <div>
      <button onClick={() => descargarPDF(123)}>Descargar</button>
      <button onClick={() => verPDF(123)}>Ver</button>
    </div>
  );
};
*/
