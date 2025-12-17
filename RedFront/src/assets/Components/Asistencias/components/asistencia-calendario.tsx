"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Clock,
  Calendar as CalendarIcon,
  List,
  FileSpreadsheet,
  FileText
} from "lucide-react";
import { EmpleadosService } from "../services/empleados-service";
import { AsistenciasService } from "../services/asistencias-service";
import type { EmpleadoItem, AsistenciaItem } from "../type/type";
import toast from "react-hot-toast";

interface AsistenciaCalendarioProps {
  onUpdate?: () => void;
}

interface SelectedCell {
  empleadoId: number;
  fecha: string;
  estado: "ASISTIO" | "FALTA" | "TARDANZA" | "JUSTIFICADO";
}

export function AsistenciaCalendario({ onUpdate }: AsistenciaCalendarioProps) {
  const [empleados, setEmpleados] = useState<EmpleadoItem[]>([]);
  const [asistencias, setAsistencias] = useState<AsistenciaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCells, setSelectedCells] = useState<SelectedCell[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  // Generar fechas para mostrar (Mes completo)
  const getDaysToShow = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: Date[] = [];
    // Mostrar desde el día 1 hasta el último día del mes
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const days = getDaysToShow();

  // Cargar empleados y asistencias
  useEffect(() => {
    cargarDatos();
  }, [currentDate]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Cargar empleados
      const empleadosRes = await EmpleadosService.listar({
        Limite_inferior: 0,
        Limite_Superior: 1000,
      });
      setEmpleados(empleadosRes.data || []);

      // Cargar asistencias del mes
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      const asistenciasRes = await AsistenciasService.porFechas({
        fecha_inicio: firstDay.toISOString().split("T")[0],
        fecha_fin: lastDay.toISOString().split("T")[0],
      });

      setAsistencias(asistenciasRes.data || []);
    } catch (error) {
      console.error("Error cargando datos:", error);
      toast.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  // Optimización: Crear mapa de búsqueda rápida O(1)
  const asistenciaMap = useMemo(() => {
    const map = new Map<string, "ASISTIO" | "FALTA" | "TARDANZA" | "JUSTIFICADO">();
    asistencias.forEach((a) => {
      if (a.fecha_asistio) {
        const fechaStr = a.fecha_asistio.split("T")[0];
        const id = a.fk_idempleados || a.idempleados;
        if (id) {
          map.set(`${id}-${fechaStr}`, a.estado);
        }
      }
    });
    return map;
  }, [asistencias]);

  // Obtener estado de asistencia para un empleado en una fecha (O(1))
  const getAsistenciaEstado = (empleadoId: number, fecha: Date) => {
    const fechaStr = fecha.toISOString().split("T")[0];
    return asistenciaMap.get(`${empleadoId}-${fechaStr}`) || null;
  };

  // Verificar si una celda está seleccionada
  const isCellSelected = (
    empleadoId: number,
    fecha: Date,
    estado: "ASISTIO" | "FALTA"
  ) => {
    const fechaStr = fecha.toISOString().split("T")[0];
    return selectedCells.some(
      (cell) =>
        cell.empleadoId === empleadoId &&
        cell.fecha === fechaStr &&
        cell.estado === estado
    );
  };

  // Toggle selección de celda
  const toggleCellSelection = (
    empleadoId: number,
    fecha: Date,
    estado: "ASISTIO" | "FALTA"
  ) => {
    const fechaStr = fecha.toISOString().split("T")[0];
    const estadoActual = getAsistenciaEstado(empleadoId, fecha);

    if (estadoActual) {
      toast.error("Esta fecha ya tiene asistencia registrada");
      return;
    }

    const isSelected = isCellSelected(empleadoId, fecha, estado);

    if (isSelected) {
      // Deseleccionar
      setSelectedCells(
        selectedCells.filter(
          (cell) =>
            !(
              cell.empleadoId === empleadoId &&
              cell.fecha === fechaStr &&
              cell.estado === estado
            )
        )
      );
    } else {
      // Verificar si ya está seleccionado con otro estado
      const otroEstado = selectedCells.find(
        (cell) => cell.empleadoId === empleadoId && cell.fecha === fechaStr
      );

      if (otroEstado) {
        // Reemplazar el estado
        setSelectedCells(
          selectedCells.map((cell) =>
            cell.empleadoId === empleadoId && cell.fecha === fechaStr
              ? { ...cell, estado }
              : cell
          )
        );
      } else {
        // Agregar nueva selección
        setSelectedCells([
          ...selectedCells,
          { empleadoId, fecha: fechaStr, estado },
        ]);
      }
    }
  };

  // Registrar asistencias seleccionadas
  const registrarAsistenciasSeleccionadas = async () => {
    if (selectedCells.length === 0) {
      toast.error("Selecciona al menos una casilla");
      return;
    }

    setIsRegistering(true);

    try {
      // Preparar lista de asistencias
      const listaAsistencias = selectedCells.map((cell) => ({
        fecha_asistio: cell.fecha,
        estado: cell.estado,
        fk_idempleados: cell.empleadoId,
      }));

      // Enviar una sola petición
      const response = await AsistenciasService.registrarLista(listaAsistencias);

      if (response.success && response.data) {
        const { created, updated } = response.data;
        if (created > 0 || updated > 0) {
           toast.success(
            `Se procesaron ${created + updated} registros exitosamente`
          );
        } else {
             toast.success("No hubo cambios necesarios");
        }
      }

      setSelectedCells([]);
      await cargarDatos();
      onUpdate?.();
    } catch (error) {
      console.error("Error general registrando asistencias:", error);
      toast.error("Error al registrar las asistencias");
    } finally {
      setIsRegistering(false);
    }
  };

  // Limpiar selección
  const limpiarSeleccion = () => {
    setSelectedCells([]);
  };

  // Navegar entre meses
  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const formatMonthYear = (date: Date) => {
    // Capitalizar primera letra
    const str = date.toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric",
    });
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const formatDayHeader = (date: Date) => {
    const dayName = date.toLocaleDateString("es-ES", { weekday: "short" });
    const dayNameClean = dayName.replace(".", "").toUpperCase(); // LUN, MAR, MIE
    return {
      dayName: dayNameClean,
      dayNumber: date.getDate().toString().padStart(2, "0"),
    };
  };

  // Helper para iniciales
  const getInitials = (nombre: string, apellido: string) => {
      return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  };

  const getRandomColor = (id: number) => {
      const colors = [
          'bg-blue-500', 'bg-purple-500', 'bg-indigo-500', 
          'bg-pink-500', 'bg-teal-500', 'bg-cyan-500'
      ];
      return colors[id % colors.length];
  };

  if (loading) {
    return (
      <Card className="p-6 bg-[#1e293b] border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-10 w-48 bg-slate-700" />
          <Skeleton className="h-10 w-48 bg-slate-700" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-16 w-64 bg-slate-700 shrink-0" />
              <div className="flex-1 flex gap-2">
                 {[1, 2, 3, 4, 5, 6].map(j => (
                    <Skeleton key={j} className="h-16 flex-1 bg-slate-700" />
                 ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-0 bg-[#0f172a] border-slate-800 text-slate-200 shadow-xl overflow-hidden">
      {/* Header con Controles y Navegación */}
      <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-[#0f172a] border-b border-slate-800 gap-4">

        {/* Navegación Mes (Derecha) */}
        <div className="flex items-center gap-2">
            
             <div className="flex items-center bg-[#1e293b] rounded-lg border border-slate-700 p-1 mr-2">
                 <Button
                    variant="ghost"
                    size="sm"
                    className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 h-8 px-2"
                    title="Exportar Excel"
                    onClick={() => {
                        const year = currentDate.getFullYear();
                        const month = currentDate.getMonth();
                        const firstDay = new Date(year, month, 1).toISOString().split('T')[0];
                        const lastDay = new Date(year, month + 1, 0).toISOString().split('T')[0];
                        AsistenciasService.exportarExcel(firstDay, lastDay);
                    }}
                >
                    <FileSpreadsheet className="h-4 w-4 mr-1" />
                    <span className="text-xs hidden md:inline">Excel</span>
                </Button>
                 <div className="w-[1px] h-4 bg-slate-700 mx-1"></div>
                 <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 h-8 px-2"
                    title="Exportar PDF"
                    onClick={() => {
                         const year = currentDate.getFullYear();
                        const month = currentDate.getMonth();
                        const firstDay = new Date(year, month, 1).toISOString().split('T')[0];
                         const lastDay = new Date(year, month + 1, 0).toISOString().split('T')[0];
                        AsistenciasService.exportarPdf(firstDay, lastDay);
                    }}
                >
                    <FileText className="h-4 w-4 mr-1" />
                    <span className="text-xs hidden md:inline">PDF</span>
                </Button>
             </div>

            <div className="flex items-center gap-4 bg-[#1e293b] px-2 py-1 rounded-lg border border-slate-700">
            <Button
            variant="ghost"
            size="icon"
            onClick={previousMonth}
            className="text-slate-400 hover:text-white hover:bg-slate-700 h-8 w-8"
            >
            <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <span className="text-sm font-semibold min-w-[140px] text-center text-slate-200">
            {formatMonthYear(currentDate)}
            </span>
            
            <Button
            variant="ghost"
            size="icon"
            onClick={nextMonth}
            className="text-slate-400 hover:text-white hover:bg-slate-700 h-8 w-8"
            >
            <ChevronRight className="h-5 w-5" />
            </Button>
        </div>
      </div>
      </div>

      {/* Grid del Calendario (Tabla) */}
      <div className="overflow-hidden bg-[#1e293b]">
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                         <th className="p-3 text-left font-semibold text-slate-500 text-xs uppercase tracking-wider sticky left-0 z-20 bg-[#1e293b] border-b border-r border-slate-700 min-w-[250px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)]">
                            Colaborador
                        </th>
                        {days.map((day, i) => {
                            const { dayName, dayNumber } = formatDayHeader(day);
                            const isWeekend = dayName === "SAB" || dayName === "DOM";
                            return (
                                <th key={i} className="p-2 border-b border-r border-slate-800 bg-[#1e293b] min-w-[60px]">
                                    <div className="flex flex-col items-center justify-center">
                                        <span className={`text-[10px] font-bold mb-1 ${isWeekend ? 'text-slate-500' : 'text-slate-400'}`}>
                                            {dayName}
                                        </span>
                                        <span className={`text-lg font-bold ${isWeekend ? 'text-slate-500' : 'text-white'}`}>
                                            {dayNumber}
                                        </span>
                                    </div>
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {empleados.map((empleado) => (
                        <tr key={empleado.idempleados} className="hover:bg-slate-800/30 transition-colors">
                             <td className="p-3 border-b border-r border-slate-700 sticky left-0 z-10 bg-[#1e293b] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)]">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${getRandomColor(empleado.idempleados)}`}>
                                        {getInitials(empleado.nombres, empleado.primer_apell)}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-semibold text-slate-200 leading-tight truncate">
                                            {empleado.nombres} {empleado.primer_apell}
                                        </span>
                                        <span className="text-[11px] text-blue-400 font-medium uppercase mt-0.5 truncate">
                                            {empleado.nom_cargo_empleado}
                                        </span>
                                    </div>
                                </div>
                            </td>
                            {days.map((day, dayIndex) => {
                                const estado = getAsistenciaEstado(empleado.idempleados, day);
                                const hasAsistencia = estado !== null;
                                const isWeekend = day.getDay() === 0 || day.getDay() === 6;

                                return (
                                    <td 
                                        key={`${empleado.idempleados}-${dayIndex}`} 
                                        className={`border-b border-r border-slate-800 p-2 relative h-[70px] ${isWeekend ? 'bg-slate-800/20' : ''}`}
                                    >
                                        <div className="flex items-center justify-center w-full h-full">
                                        {hasAsistencia ? (
                                            <div
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg transform transition-all hover:scale-110 ${
                                                    estado === "ASISTIO"
                                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                        : estado === "FALTA"
                                                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                                        : estado === "TARDANZA"
                                                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                                        : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                                }`}
                                                title={estado}
                                            >
                                                {estado === "ASISTIO" ? (
                                                    <Check className="h-5 w-5" strokeWidth={2.5} />
                                                ) : estado === "FALTA" ? (
                                                    <X className="h-5 w-5" strokeWidth={2.5} />
                                                ) : estado === "TARDANZA" ? (
                                                    <Clock className="h-5 w-5" strokeWidth={2.5} />
                                                ) : (
                                                    <span className="text-xs font-bold">J</span>
                                                )}
                                            </div>
                                        ) : (
                                            /* Selección (Hover) */
                                            <div className="flex gap-1 opacity-0 hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => toggleCellSelection(empleado.idempleados, day, "ASISTIO")}
                                                    className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
                                                        isCellSelected(empleado.idempleados, day, "ASISTIO")
                                                        ? "bg-emerald-500 text-white"
                                                        : "bg-slate-700 text-slate-400 hover:bg-emerald-500 hover:text-white"
                                                    }`}
                                                >
                                                    <Check className="h-3 w-3" />
                                                </button>
                                                <button
                                                    onClick={() => toggleCellSelection(empleado.idempleados, day, "FALTA")}
                                                    className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
                                                        isCellSelected(empleado.idempleados, day, "FALTA")
                                                        ? "bg-rose-500 text-white"
                                                        : "bg-slate-700 text-slate-400 hover:bg-rose-500 hover:text-white"
                                                    }`}
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        )}

                                        {/* Indicador de selección activa */}
                                        {(isCellSelected(empleado.idempleados, day, "ASISTIO") || isCellSelected(empleado.idempleados, day, "FALTA")) && !hasAsistencia && (
                                            <div className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full animate-pulse ${
                                                isCellSelected(empleado.idempleados, day, "ASISTIO") 
                                                ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' 
                                                : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                                            }`}></div>
                                        )}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

       {/* Barra flotante de acción para registro masivo */}
       {selectedCells.length > 0 && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white rounded-lg shadow-2xl border border-slate-700 p-4 z-50 animate-in slide-in-from-bottom-4 flex items-center gap-4">
             <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">
                  {selectedCells.length} cambios pendientes
                </span>
                <span className="text-xs text-slate-400">
                   Se guardarán en una sola petición
                </span>
             </div>
              <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={limpiarSeleccion}
                disabled={isRegistering}
                className="border-slate-600 text-black hover:bg-slate-800"
              >
                Cancelar
              </Button>
              <Button
                onClick={registrarAsistenciasSeleccionadas}
                disabled={isRegistering}
                className="bg-blue-600 hover:bg-blue-700 text-white border-none"
              >
                {isRegistering ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
        </div>
      )}
    </Card>
  );
}
