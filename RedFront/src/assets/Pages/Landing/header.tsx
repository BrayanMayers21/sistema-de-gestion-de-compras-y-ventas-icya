"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navItems = [
  { name: "Inicio", href: "#inicio" },
  { name: "La Empresa", href: "#empresa" },
  { name: "Obras", href: "#obras" },
  { name: "Servicios", href: "#servicios" },
  { name: "Consultoría", href: "#consultoria" },
  { name: "Ofertas Laborales", href: "#ofertas" },
  { name: "Contáctenos", href: "#contacto" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!isHomePage) {
      e.preventDefault();
      navigate(`/${href}`);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-lg" : ""
      }`}
    >
      <div className="bg-[#2e7d32]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <span className="text-[#f59e0b] font-bold text-xl">ICYA</span>
              <span className="text-white/80 text-sm">E.I.R.L.</span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="px-4 py-4 text-sm font-medium text-white hover:bg-[#1b5e20] transition-colors uppercase tracking-wide"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-white hover:bg-[#1b5e20] rounded-lg transition"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <nav className="lg:hidden py-4 border-t border-white/20">
              <div className="flex flex-col">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      handleNavClick(e, item.href);
                      setIsOpen(false);
                    }}
                    className="px-4 py-3 text-sm font-medium text-white hover:bg-[#1b5e20] transition uppercase"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
