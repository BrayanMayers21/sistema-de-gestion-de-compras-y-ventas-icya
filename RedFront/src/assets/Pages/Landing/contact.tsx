"use client"

import type React from "react"
import { useState } from "react"
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react"

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
  }

  return (
    <section id="contacto" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2e7d32] mb-2">CONTÁCTENOS</h2>
          <div className="w-24 h-1 bg-[#8bc34a]"></div>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#2e7d32]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-[#2e7d32]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1a365d] mb-1">Teléfono</h3>
                <p className="text-gray-600">(043) 428371</p>
                <p className="text-gray-600">975 446 070</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#2e7d32]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-[#2e7d32]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1a365d] mb-1">Email</h3>
                <a href="mailto:jwmcarranza@gmail.com" className="text-[#2e7d32] hover:underline">
                  jwmcarranza@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#2e7d32]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-[#2e7d32]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1a365d] mb-1">Sede Huaraz</h3>
                <p className="text-gray-600">Jr. Corongo No. 335, Independencia</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#f59e0b]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-[#f59e0b]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1a365d] mb-1">Sede Lima</h3>
                <p className="text-gray-600">Jr. Jose de la Torre Ugarte N° 160, Of 902, Lince</p>
              </div>
            </div>

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/51975446070"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-[#25d366] text-white rounded-xl font-medium hover:bg-[#20bd5a] transition-colors mt-4"
            >
              <MessageCircle size={20} />
              Escríbenos por WhatsApp
            </a>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3 bg-gray-50 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#1a365d] mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2e7d32]/50 focus:border-[#2e7d32] transition-colors"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#1a365d] mb-2">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="correo@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2e7d32]/50 focus:border-[#2e7d32] transition-colors"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[#1a365d] mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="+51 999 999 999"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2e7d32]/50 focus:border-[#2e7d32] transition-colors"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#1a365d] mb-2">
                  Cuéntanos sobre tu proyecto
                </label>
                <textarea
                  id="message"
                  placeholder="Describe tu proyecto, ubicación, plazos estimados..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2e7d32]/50 focus:border-[#2e7d32] transition-colors resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#2e7d32] text-white rounded-xl font-semibold hover:bg-[#1b5e20] transition-colors"
              >
                <Send size={18} />
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
