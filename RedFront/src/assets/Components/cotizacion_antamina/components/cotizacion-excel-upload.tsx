import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Download,
  FileSpreadsheet,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { CotizacionAntaminaService } from "../services/cotizacion-service";
import toast from "react-hot-toast";

interface CotizacionExcelUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CotizacionExcelUpload({
  isOpen,
  onClose,
  onSuccess,
}: CotizacionExcelUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar que sea un archivo Excel
      const validExtensions = [".xlsx", ".xls"];
      const fileExtension = file.name.substring(file.name.lastIndexOf("."));

      if (!validExtensions.includes(fileExtension.toLowerCase())) {
        toast.error(
          "Por favor selecciona un archivo Excel válido (.xlsx o .xls)"
        );
        return;
      }

      // Validar tamaño (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error("El archivo es demasiado grande. Tamaño máximo: 5MB");
        return;
      }

      setSelectedFile(file);
      toast.success("Archivo seleccionado correctamente");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Por favor selecciona un archivo");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simular progreso
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const result = await CotizacionAntaminaService.subirExcel(selectedFile);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Mostrar información detallada
      console.log("Resultado de importación:", result);

      if (result.errores && result.errores.length > 0) {
        console.error("Errores durante la importación:", result.errores);

        const primerosErrores = result.errores.slice(0, 5);
        const mensajeErrores = primerosErrores.join("\n");

        toast.error(
          `⚠️ Importación con errores:\n${result.insertados || 0} insertados, ${
            result.omitidos || 0
          } omitidos\n\nPrimeros errores:\n${mensajeErrores}${
            result.errores.length > 5
              ? "\n... y " + (result.errores.length - 5) + " más"
              : ""
          }`,
          { duration: 10000 }
        );
      } else {
        toast.success(
          `✅ ${result.message || "Cotizaciones importadas correctamente"}\n${
            result.insertados || 0
          } cotizaciones importadas exitosamente`,
          { duration: 4000 }
        );
      }

      // Mostrar información de debug
      if (result.debug) {
        console.log("Debug info:", result.debug);
      }

      setTimeout(
        () => {
          onSuccess?.();
          handleClose();
        },
        result.errores && result.errores.length > 0 ? 2000 : 1000
      );
    } catch (error: any) {
      console.error("Error uploading excel:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Error al subir el archivo Excel";

      if (error.response?.data?.trace) {
        console.error("Trace:", error.response.data.trace);
      }

      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await CotizacionAntaminaService.descargarPlantillaExcel();
      toast.success("Plantilla descargada correctamente");
    } catch (error) {
      console.error("Error downloading template:", error);
      toast.error("Error al descargar la plantilla");
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setSelectedFile(null);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onClose();
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Importar Cotizaciones desde Excel
          </DialogTitle>
          <DialogDescription>
            Sube un archivo Excel con las cotizaciones para importarlas
            masivamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Descargar plantilla */}
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Download className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="flex-1 space-y-2">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  ¿Primera vez?
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Descarga la plantilla Excel con el formato correcto para
                  importar cotizaciones.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadTemplate}
                  className="mt-2"
                  disabled={uploading}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar Plantilla
                </Button>
              </div>
            </div>
          </div>

          {/* Área de selección de archivo */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Seleccionar archivo Excel
            </label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />

              {!selectedFile ? (
                <div className="space-y-3">
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      Arrastra tu archivo o haz clic para seleccionar
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Formatos soportados: .xlsx, .xls (máx. 5MB)
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    Seleccionar Archivo
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <CheckCircle2 className="w-12 h-12 mx-auto text-green-600" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  {!uploading && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cambiar archivo
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Barra de progreso */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subiendo archivo...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Instrucciones */}
          <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                  Instrucciones importantes:
                </p>
                <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1 list-disc list-inside">
                  <li>
                    El archivo debe tener las columnas: Cliente, Descripción,
                    Código Producto, Cantidad, Precio Unitario, Marca
                  </li>
                  <li>Los códigos de producto deben existir en el sistema</li>
                  <li>Las cantidades y precios deben ser números válidos</li>
                  <li>Descarga la plantilla para ver el formato correcto</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={uploading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
          >
            {uploading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Importando...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Importar Cotizaciones
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
