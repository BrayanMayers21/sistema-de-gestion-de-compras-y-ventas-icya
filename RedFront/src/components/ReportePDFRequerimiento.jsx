import React from "react";

/**
 * Componente para generar y visualizar reportes PDF de requerimientos
 *
 * @param {Object} props
 * @param {number} props.requerimientoId - ID del requerimiento
 * @param {string} props.token - Token JWT de autenticación
 * @param {string} props.apiUrl - URL base de la API (opcional)
 * @param {string} props.className - Clases CSS adicionales
 * @param {boolean} props.showViewButton - Mostrar botón de vista previa
 * @param {boolean} props.showDownloadButton - Mostrar botón de descarga
 */
const ReportePDFRequerimiento = ({
  requerimientoId,
  token,
  apiUrl = "/api",
  className = "",
  showViewButton = true,
  showDownloadButton = true,
  onError = null,
  onSuccess = null,
}) => {
  const handleDescargarPDF = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/requerimientos-pdf/${requerimientoId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Obtener el nombre del archivo de los headers si está disponible
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `solicitud_cotizacion_${requerimientoId}.pdf`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Crear blob y descargar
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      if (onSuccess) {
        onSuccess("PDF descargado correctamente");
      }
    } catch (error) {
      console.error("Error al descargar PDF:", error);
      if (onError) {
        onError(`Error al descargar PDF: ${error.message}`);
      }
    }
  };

  const handleVerPDF = () => {
    try {
      const url = `${apiUrl}/requerimientos-ver-pdf/${requerimientoId}?token=${token}`;
      const ventana = window.open(
        url,
        "_blank",
        "width=800,height=900,scrollbars=yes"
      );

      if (!ventana) {
        throw new Error("El navegador bloqueó la ventana emergente");
      }

      if (onSuccess) {
        onSuccess("PDF abierto en nueva ventana");
      }
    } catch (error) {
      console.error("Error al abrir PDF:", error);
      if (onError) {
        onError(`Error al abrir PDF: ${error.message}`);
      }
    }
  };

  return (
    <div className={`reporte-pdf-buttons ${className}`}>
      {showDownloadButton && (
        <button
          onClick={handleDescargarPDF}
          className="btn btn-danger btn-sm me-2"
          title="Descargar PDF"
        >
          <i className="fas fa-download me-1"></i>
          Descargar PDF
        </button>
      )}

      {showViewButton && (
        <button
          onClick={handleVerPDF}
          className="btn btn-info btn-sm"
          title="Ver PDF en navegador"
        >
          <i className="fas fa-eye me-1"></i>
          Ver PDF
        </button>
      )}
    </div>
  );
};

/**
 * Hook personalizado para manejar reportes PDF
 *
 * @param {string} token - Token JWT
 * @param {string} apiUrl - URL base de la API
 */
export const useReportePDF = (token, apiUrl = "/api") => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const descargarPDF = React.useCallback(
    async (requerimientoId) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${apiUrl}/requerimientos-pdf/${requerimientoId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `solicitud_cotizacion_${requerimientoId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        return { success: true };
      } catch (err) {
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    [token, apiUrl]
  );

  const verPDF = React.useCallback(
    (requerimientoId) => {
      try {
        const url = `${apiUrl}/requerimientos-ver-pdf/${requerimientoId}?token=${token}`;
        window.open(url, "_blank", "width=800,height=900,scrollbars=yes");
        return { success: true };
      } catch (err) {
        setError(err.message);
        return { success: false, error: err.message };
      }
    },
    [token, apiUrl]
  );

  return {
    descargarPDF,
    verPDF,
    loading,
    error,
    clearError: () => setError(null),
  };
};

export default ReportePDFRequerimiento;

// Ejemplo de uso:
/*

// Uso básico del componente
<ReportePDFRequerimiento
    requerimientoId={123}
    token="tu_jwt_token_aqui"
    onError={(message) => toast.error(message)}
    onSuccess={(message) => toast.success(message)}
/>

// Uso personalizado con hook
function MiComponente() {
    const { descargarPDF, verPDF, loading, error } = useReportePDF(token);
    
    return (
        <div>
            {error && <div className="alert alert-danger">{error}</div>}
            
            <button 
                onClick={() => descargarPDF(123)} 
                disabled={loading}
            >
                {loading ? 'Generando...' : 'Descargar PDF'}
            </button>
        </div>
    );
}

// Uso en tabla de requerimientos
function TablaRequerimientos({ requerimientos, token }) {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Número</th>
                    <th>Proveedor</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {requerimientos.map(req => (
                    <tr key={req.id}>
                        <td>{req.id}</td>
                        <td>{req.numero_requerimiento}</td>
                        <td>{req.proveedor}</td>
                        <td>
                            <ReportePDFRequerimiento
                                requerimientoId={req.id}
                                token={token}
                                className="d-flex gap-1"
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

*/
