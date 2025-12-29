import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Constantes from "@/assets/constants/constantes";
import {
  Building2,
  Package,
  TrendingUp,
  ShoppingCart,
  Loader2,
  DollarSign,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Interfaces
interface Obra {
  idobras: number;
  nom_obra: string;
  codigo: string;
}

interface Producto {
  id_producto: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  unidad_medida: string;
  imagen: string | null;
  total_comprado: number;
  total_unidades: number;
  total_ordenes: number;
  total_gastado: number;
}

export default function Dashboard_Stats() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [obraSeleccionada, setObraSeleccionada] = useState<number | null>(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState<
    number | null
  >(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingObras, setLoadingObras] = useState(true);

  // Estadísticas reales del backend
  const [estadisticas, setEstadisticas] = useState({
    total_ordenes: 0,
    ordenes_pendientes: 0,
    ordenes_aprobadas: 0,
    total_gastado: 0,
    total_pendiente: 0,
  });

  const [gastosTemporales, setGastosTemporales] = useState<
    Array<{
      fecha: string;
      pagado: number;
      pendiente: number;
    }>
  >([]);

  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
  ];

  const getAuthHeaders = () => {
    const token = Cookies.get("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Dashboard de Compras por Obra";
    cargarObras();
    return () => {
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    if (obraSeleccionada) {
      cargarProductosPorObra(obraSeleccionada);
    }
  }, [obraSeleccionada]);

  const cargarObras = async () => {
    try {
      setLoadingObras(true);
      const response = await axios.get(
        `${Constantes.baseUrlBackend}/api/dashboard/obras`,
        { headers: getAuthHeaders() }
      );
      console.log("Respuesta de obras:", response.data);
      if (response.data.success) {
        console.log("Obras cargadas:", response.data.data);
        setObras(response.data.data);
      } else {
        console.error("Error en la respuesta:", response.data);
      }
    } catch (error) {
      console.error("Error al cargar obras:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Detalles del error:", error.response.data);
      }
    } finally {
      setLoadingObras(false);
    }
  };

  const cargarProductosPorObra = async (idObra: number) => {
    try {
      setLoading(true);
      setProductos([]);
      const response = await axios.post(
        `${Constantes.baseUrlBackend}/api/dashboard/productos-por-obra`,
        { id_obra: idObra },
        { headers: getAuthHeaders() }
      );
      if (response.data.success) {
        console.log("Productos cargados:", response.data.data);
        console.log("Primer producto imagen:", response.data.data[0]?.imagen);
        setProductos(response.data.data);
        setEstadisticas(
          response.data.estadisticas || {
            total_ordenes: 0,
            ordenes_pendientes: 0,
            ordenes_aprobadas: 0,
            total_gastado: 0,
            total_pendiente: 0,
          }
        );
        setGastosTemporales(response.data.gastos_temporales || []);
        if (response.data.data.length > 0) {
          setProductoSeleccionado(response.data.data[0].id_producto);
        }
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(valor);
  };

  const formatearNumero = (valor: number) => {
    return new Intl.NumberFormat("es-PE").format(valor);
  };

  // Calcular totales generales
  const totalGeneral =
    estadisticas.total_gastado ||
    productos.reduce((sum, p) => sum + p.total_gastado, 0);
  const totalUnidades = productos.reduce((sum, p) => sum + p.total_unidades, 0);
  const totalOrdenes =
    estadisticas.total_ordenes ||
    productos.reduce((sum, p) => sum + p.total_ordenes, 0);

  const productoActual = productos.find(
    (p) => p.id_producto === productoSeleccionado
  );

  // Datos para gráficos
  const datosGastosPorProducto = productos.slice(0, 5).map((p) => ({
    nombre: p.nombre.length > 15 ? p.nombre.substring(0, 15) + "..." : p.nombre,
    gasto: p.total_gastado,
  }));

  const datosDistribucionObra = productos.slice(0, 4).map((p, index) => ({
    name: p.nombre,
    value: p.total_gastado,
    color: COLORS[index % COLORS.length],
  }));

  // Usar datos temporales reales del backend o generar datos de ejemplo
  const datosGastosTemporalesFormateados =
    gastosTemporales.length > 0
      ? gastosTemporales.map((item) => ({
          fecha: new Date(item.fecha).toLocaleDateString("es-PE", {
            day: "2-digit",
            month: "short",
          }),
          pagado: item.pagado,
          pendiente: item.pendiente,
        }))
      : productos.slice(0, 6).map((p, index) => ({
          fecha: `${index + 1}-dic`,
          pagado: p.total_gastado * 0.7,
          pendiente: p.total_gastado * 0.3,
        }));

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className=" rounded-lg shadow-sm border border-gray-200 p-4">
        <h1 className="text-3xl font-bold">Dashboard de Compras por Obra</h1>
        <p className=" mt-2">
          Gestiona y visualiza las compras de materiales organizadas por obra,
          producto y orden de compra
        </p>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda - Producto destacado */}
        <div className="lg:col-span-3 space-y-4">
          {productoActual && (
            <>
              {/* Imagen del Producto */}
              <div className=" rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  {productoActual.imagen ? (
                    <img
                      src={productoActual.imagen}
                      alt={productoActual.nombre}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error(
                          "Error cargando imagen:",
                          productoActual.imagen
                        );
                        e.currentTarget.style.display = "none";
                        e.currentTarget.parentElement
                          ?.querySelector(".fallback-icon")
                          ?.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <Package
                    className={`w-20 h-20 text-gray-400 fallback-icon ${
                      productoActual.imagen ? "hidden" : ""
                    }`}
                  />
                </div>
                <div className="p-4 border-t border-gray-200">
                  <h3 className="font-semibold  mb-1">
                    {productoActual.nombre}
                  </h3>
                  <p className="text-sm ">{productoActual.codigo}</p>
                </div>
              </div>

              {/* Total General */}
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-sm p-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-6 h-6" />
                  <span className="text-lg font-semibold">Total General</span>
                </div>
                <div className="text-4xl font-bold mb-4">
                  {formatearMoneda(totalGeneral)}
                </div>
                <div className="space-y-1 text-emerald-50">
                  <p className="text-lg font-medium">
                    {formatearNumero(totalUnidades)} unidades
                  </p>
                  <p className="text-sm">{totalOrdenes} órdenes en total</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Columna Central y Derecha */}
        <div className="lg:col-span-9 space-y-6">
          {/* Tarjetas de Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Número de Compras */}
            <div className=" rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-sm font-medium ">
                    Número de Compras
                  </span>
                </div>
                <ShoppingCart className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-3xl font-bold  mb-1">{totalOrdenes}</div>
              <div className="text-sm text-purple-600 font-medium">
                Órdenes procesadas
              </div>
            </div>

            {/* Número de Compras Pendientes */}
            <div className=" rounded-lg shadow-sm border border-orange-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-sm font-medium ">
                    Número de Compras Pendientes
                  </span>
                </div>
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
              <div className="text-3xl font-bold  mb-1">
                {estadisticas.ordenes_pendientes}
              </div>
              <div className="text-sm text-orange-600 font-medium">
                Órdenes no procesadas
              </div>
            </div>

            {/* Total Gastado */}
            <div className=" rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium ">Total Gastado</span>
                </div>
                <DollarSign className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold  mb-1">
                {formatearMoneda(estadisticas.total_gastado)}
              </div>
              <div className="text-sm text-blue-600 font-medium">
                En {estadisticas.ordenes_aprobadas} compras
              </div>
            </div>

            {/* Total Pendiente */}
            <div className=" rounded-lg shadow-sm border border-red-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-sm font-medium ">Total Pendiente</span>
                </div>
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-3xl font-bold  mb-1">
                {formatearMoneda(estadisticas.total_pendiente)}
              </div>
              <div className="text-sm text-red-600 font-medium">
                {estadisticas.ordenes_pendientes} órdenes pendientes
              </div>
            </div>
          </div>

          {/* Selectores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Selector de Obra */}
            <div className=" rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 " />
                <label className="text-sm font-medium">Obra</label>
              </div>
              <select
                value={obraSeleccionada || ""}
                onChange={(e) => setObraSeleccionada(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:border-gray-600 truncate"
                disabled={loadingObras}
              >
                <option value="" className="truncate">Seleccione una obra</option>
                {obras.map((obra) => {
                  const nombreCorto = obra.nom_obra.length > 40 
                    ? obra.nom_obra.substring(0, 40) + "..." 
                    : obra.nom_obra;
                  return (
                    <option key={obra.idobras} value={obra.idobras} className="truncate" title={`${obra.codigo} - ${obra.nom_obra}`}>
                      {obra.codigo} - {nombreCorto}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Selector de Producto */}
            <div className=" rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 " />
                <label className="text-sm font-medium ">Producto</label>
              </div>
              <select
                value={productoSeleccionado || ""}
                onChange={(e) =>
                  setProductoSeleccionado(Number(e.target.value))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:border-gray-600 truncate"
                disabled={!obraSeleccionada || loading}
              >
                <option value="" className="truncate">Seleccione un producto</option>
                {productos.map((producto) => (
                  <option
                    key={producto.id_producto}
                    value={producto.id_producto}
                    className="truncate"
                  >
                    {producto.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gastos a lo largo del Tiempo */}
            <div className="bg-slate-800 rounded-lg shadow-sm border border-gray-700 p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-white mb-2">
                Gastos a lo largo del Tiempo
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Comparación de compras pagadas vs pendientes
              </p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={datosGastosTemporalesFormateados}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="fecha" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#F9FAFB",
                      }}
                      formatter={(value: any) => formatearMoneda(value)}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="pagado"
                      stackId="1"
                      stroke="#10B981"
                      fill="#10B981"
                      name="Pagado"
                    />
                    <Area
                      type="monotone"
                      dataKey="pendiente"
                      stackId="1"
                      stroke="#F59E0B"
                      fill="#F59E0B"
                      name="Pendiente"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Distribución de Gastos por Obra */}
            <div className="rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold  mb-2">
                Distribución de Gastos por Obra
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Porcentaje del gasto total asignado a cada obra
              </p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={datosDistribucionObra}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) =>
                        `${entry.name} ${(
                          (entry.value / totalGeneral) *
                          100
                        ).toFixed(1)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {datosDistribucionObra.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => formatearMoneda(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gastos por Producto */}
            <div className="bg-slate-800 rounded-lg shadow-sm border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Gastos por Producto
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Comparación del gasto total por tipo de material
              </p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={datosGastosPorProducto}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="nombre"
                      stroke="#9CA3AF"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#F9FAFB",
                      }}
                      formatter={(value: any) => formatearMoneda(value)}
                    />
                    <Bar dataKey="gasto" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="rounded-lg p-8 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            <p className="text-gray-700 font-medium">Cargando datos...</p>
          </div>
        </div>
      )}
    </div>
  );
}
