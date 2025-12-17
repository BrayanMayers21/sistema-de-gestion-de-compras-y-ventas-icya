import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import ScrollToTop from "./components/ui/ScrollTop";
import Loader3 from "./assets/Components/Loaders/Loader3";
import { ProtectedRoute } from "./assets/Auth/ProtectedRoute";
import HomeOrden from "./assets/Pages/Orden/page";
import HomeRequerimiento from "./assets/Components/Requerimientos/page";
import HomeProducto from "./assets/Pages/Productos/page";
import HomeCotizacionAntamina from "./assets/Pages/cotizacion_antamina/page";
import Homeiniciodepagina from "./assets/Pages/Landing/page";
import { ServicioDetail } from "./assets/Pages/Landing/servicio-detail";
import { ObraDetail } from "./assets/Pages/Landing/obra-detail";
import { ConsultoriaDetail } from "./assets/Pages/Landing/consultoria-detail";
import HomeObra from "./assets/Pages/Obra/page";

// Lazy imports
const LoginPage = lazy(() =>
  import("./assets/Pages/Autentificacion/login").then((module) => ({
    default: module.LoginPage,
  }))
);
const Dashboar_Stats = lazy(() => import("./assets/Pages/Inicio/Inicio"));
const Error404 = lazy(() => import("./assets/Pages/Error/404"));
const Error403 = lazy(() => import("./assets/Pages/Error/403"));
const Page = lazy(() => import("./assets/Components/Prueba"));
const Redvel = lazy(() => import("./assets/Pages/Redvel/RedvelPage"));
const PageUsuarios = lazy(() => import("./assets/Pages/Users/PageUsuarios"));
const HomeCategorias = lazy(() => import("./assets/Pages/Categoria/pageCate"));
const DashboardLayout = lazy(
  () => import("./assets/Components/Dashboard/DashboardLayout")
);
const EmployeeManagement = lazy(
  () => import("./assets/Pages/Empleados/PageEmpleados")
);
const PageAsistencias = lazy(
  () => import("./assets/Pages/Asistencias/PageAsistencias")
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<Loader3 />}>
        <Routes>
          <Route path="/" element={<Homeiniciodepagina />} />
          <Route path="/servicios/:id" element={<ServicioDetail />} />
          <Route path="/obras/:id" element={<ObraDetail />} />
          <Route path="/consultoria" element={<ConsultoriaDetail />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Error404 />} />
          <Route path="/403" element={<Error403 />} />

          {/* Rutas protegidas sin DashboardLayout persistente */}
          <Route
            path="/inicios"
            element={
              <ProtectedRoute>
                <Page />
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas con DashboardLayout persistente */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Loader3 />} />

            <Route path="/categorias" element={<HomeCategorias />} />
            <Route path="/orden" element={<HomeOrden />} />
            <Route path="/cotizaciones" element={<HomeRequerimiento />} />
            <Route path="/productos" element={<HomeProducto />} />
            <Route path="/obras" element={<HomeObra />} />
            <Route path="/asistencias" element={<PageAsistencias />} />
            <Route path="/oficina-empleados" element={<EmployeeManagement />} />
            <Route
              path="/cotizaciones-antamina"
              element={<HomeCotizacionAntamina />}
            />

            <Route path="/inicio" element={<Dashboar_Stats />} />
            <Route path="/prueba" element={<Page />} />
            <Route
              path="/usuarios/lista"
              element={
                <ProtectedRoute requiredPermissions={["usuarios.view"]}>
                  <PageUsuarios />
                </ProtectedRoute>
              }
            />
            <Route
              path="/empleados/lista"
              element={
                <ProtectedRoute requiredPermissions={["usuarios.view"]}>
                  <EmployeeManagement />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
