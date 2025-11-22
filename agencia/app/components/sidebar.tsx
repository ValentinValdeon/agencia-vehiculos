"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Menu, Search, CreditCard, MessageSquare, User } from "lucide-react";

const navigationItems = [
  { name: 'Cargar Vehículo', icon: Car, href: '/vehiculo/create', badge: null },
  { name: 'Ingresar Cliente', icon: User, href: '/client/create', badge: null },
  { name: 'Mostrar Clientes', icon: User, href: '/client/show', badge: null },
  { name: 'Financiamiento', icon: CreditCard, href: '/financiamiento', badge: null },
  { name: 'Mensajes', icon: MessageSquare, href: '/mensajes', badge: '3' },
  { name: 'Mi Cuenta', icon: User, href: '/cuenta', badge: null },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-white border-r border-gray-200 fixed h-full flex flex-col">

      {/* Logo Area */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 opacity-90"></div>
              <Car className="w-7 h-7 text-white relative z-10" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">FRAN</h1>
              <p className="text-xs font-semibold text-red-600 tracking-wider">MOTORS</p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar vehículo..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigationItems.map((item) => {
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                active
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1 font-medium">{item.name}</span>

              {item.badge && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    active
                      ? "bg-white text-red-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
