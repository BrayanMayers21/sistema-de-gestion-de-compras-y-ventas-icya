import { Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1a365d]">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-[#f59e0b] font-bold text-sm">IC</span>
              </div>
              <div>
                <span className="text-[#f59e0b] font-bold text-lg">
                  ICYA E.I.R.L.
                </span>
              </div>
            </div>
            <p className="text-white/70 mb-6 max-w-md">
              Ingeniería del Concreto y Albañilería. Líderes en ejecución de
              obras civiles, consultoría y alquiler de maquinaria pesada en
              Huaraz y Ancash.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-white/70">
                <Phone size={16} className="flex-shrink-0" />
                <span>(043) 428371 / 975446070</span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <Mail size={16} className="flex-shrink-0" />
                <a
                  href="mailto:jwmcarranza@gmail.com"
                  className="hover:text-[#f59e0b] transition-colors"
                >
                  jwmcarranza@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Locations */}
          <div>
            <h3 className="text-white font-semibold mb-4">Ubicaciones</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 text-white/70">
                <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                <span>Huaraz: Jr. Corongo No. 335, Independencia</span>
              </div>
              <div className="flex items-start gap-3 text-white/70">
                <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                <span>
                  Lima: Jr. Jose de la Torre Ugarte N° 160, Of 902, Lince
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-white/60 text-sm mb-2">
            <span className="text-[#f59e0b]">ICYA E.I.R.L.</span> - Ingeniería
            del Concreto y Albañilería
          </p>
          <p className="text-white/50 text-sm mb-4">
            Constructoras y Consultoras en Huaraz | Ejecución de Obras Civiles
            en Ancash
          </p>
          <p className="text-white/40 text-xs mb-4">
            © {new Date().getFullYear()} ICYA E.I.R.L. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
