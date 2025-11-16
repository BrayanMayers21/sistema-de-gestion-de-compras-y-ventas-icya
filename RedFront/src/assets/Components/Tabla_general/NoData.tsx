import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TableIcon, SearchX, RefreshCcw, Filter } from "lucide-react";

interface NoDataProps {
  type: "no-data" | "no-results";
  onClearFilters?: () => void;
  onRefetch?: () => void;
}

export default function NoData({
  type,
  onClearFilters,
  onRefetch,
}: NoDataProps) {
  if (type === "no-results") {
    return (
      <Card className="relative flex flex-col items-center justify-center py-16 bg-slate-900/50 backdrop-blur-sm border-cyan-500/30 shadow-2xl shadow-cyan-500/20 overflow-hidden">
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 animate-pulse" />

        {/* Neon grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, cyan 1px, transparent 0)`,
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        <CardHeader className="relative flex flex-col items-center space-y-6">
          {/* Neon icon container with glow effect */}
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl animate-pulse" />
            <div className="relative p-6 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full border border-cyan-400/50 shadow-lg shadow-cyan-500/25">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent rounded-full" />
              <SearchX
                className="w-12 h-12 text-cyan-400 drop-shadow-lg relative z-10"
                style={{ filter: "drop-shadow(0 0 8px rgb(34 211 238 / 0.6))" }}
              />
            </div>
            {/* Orbiting particles */}
            <div className="absolute -inset-4">
              <div
                className="absolute top-0 left-1/2 w-1 h-1 bg-cyan-400 rounded-full animate-ping"
                style={{ animationDelay: "0s" }}
              />
              <div
                className="absolute bottom-0 right-1/2 w-1 h-1 bg-blue-400 rounded-full animate-ping"
                style={{ animationDelay: "1s" }}
              />
              <div
                className="absolute left-0 top-1/2 w-1 h-1 bg-purple-400 rounded-full animate-ping"
                style={{ animationDelay: "2s" }}
              />
            </div>
          </div>

          <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-center">
            No se encontraron resultados
          </CardTitle>
        </CardHeader>

        <CardContent className="relative flex flex-col items-center gap-6">
          <p className="text-slate-300 text-center max-w-md leading-relaxed">
            No pudimos encontrar datos que coincidan con tus criterios de
            búsqueda.
            <br />
            <span className="text-cyan-400/80">
              Intenta ajustar los filtros para obtener mejores resultados.
            </span>
          </p>

          {onClearFilters && (
            <Button
              onClick={onClearFilters}
              className="relative group bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-0 px-8 py-3 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-md blur-sm group-hover:blur-md transition-all duration-300" />
              <Filter className="w-4 h-4 mr-2 relative z-10" />
              <span className="relative z-10">Limpiar filtros</span>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative flex flex-col items-center justify-center py-16 bg-slate-900/50 backdrop-blur-sm border-cyan-500/30 shadow-2xl shadow-cyan-500/20 overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 animate-pulse" />

      {/* Neon grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, cyan 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <CardHeader className="relative flex flex-col items-center space-y-6">
        {/* Neon icon container with glow effect */}
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl animate-pulse" />
          <div className="relative p-6 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full border border-cyan-400/50 shadow-lg shadow-cyan-500/25">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent rounded-full" />
            <TableIcon
              className="w-12 h-12 text-cyan-400 drop-shadow-lg relative z-10"
              style={{ filter: "drop-shadow(0 0 8px rgb(34 211 238 / 0.6))" }}
            />
          </div>
          {/* Floating geometric shapes */}
          <div className="absolute -inset-8">
            <div
              className="absolute top-2 right-2 w-2 h-2 border border-cyan-400/60 rotate-45 animate-bounce"
              style={{ animationDelay: "0s", animationDuration: "3s" }}
            />
            <div
              className="absolute bottom-2 left-2 w-3 h-3 border border-blue-400/60 rounded-full animate-bounce"
              style={{ animationDelay: "1s", animationDuration: "3s" }}
            />
            <div
              className="absolute top-6 left-0 w-1 h-6 bg-gradient-to-b from-cyan-400/60 to-transparent animate-pulse"
              style={{ animationDelay: "2s" }}
            />
          </div>
        </div>

        <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-center">
          No hay datos para mostrar
        </CardTitle>
      </CardHeader>

      <CardContent className="relative flex flex-col items-center gap-6">
        <p className="text-slate-300 text-center max-w-md leading-relaxed">
          Aún no tienes datos registrados en tu sistema.
          <br />
          <span className="text-cyan-400/80">¡Comienza agregando !</span>
        </p>

        {onRefetch && (
          <Button
            onClick={onRefetch}
            className="relative group bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-0 px-8 py-3 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-md blur-sm group-hover:blur-md transition-all duration-300" />
            <RefreshCcw className="w-4 h-4 mr-2 relative z-10 group-hover:rotate-180 transition-transform duration-500" />
            <span className="relative z-10">Recargar Datos</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
