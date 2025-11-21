import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Home, Car, CreditCard, MessageSquare, User, Search, Bell, Menu } from 'lucide-react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FRAN MOTORS - Tu próximo auto te espera",
  description: "La mejor selección de vehículos con garantía y financiación",
};

const navigationItems = [
  { name: 'Inicio', icon: Home, href: '/', badge: null },
  { name: 'Catálogo', icon: Car, href: '/catalogo', badge: '24' },
  { name: 'Financiamiento', icon: CreditCard, href: '/financiamiento', badge: null },
  { name: 'Mensajes', icon: MessageSquare, href: '/mensajes', badge: '3' },
  { name: 'Mi Cuenta', icon: User, href: '/cuenta', badge: null },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex h-screen bg-gray">
          {/* Aside - Sidebar Minimalista */}
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
              {navigationItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    index === 0
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="flex-1 font-medium">{item.name}</span>
                  {item.badge && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      index === 0 ? 'bg-white text-red-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </a>
              ))}
            </nav>

            {/* User Profile Card */}
            <div className="p-4 border-t border-gray-200">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 text-white">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center font-bold">
                    FM
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Francisco</p>
                    <p className="text-xs text-gray-400">Vendedor Premium</p>
                  </div>
                  <Bell className="w-4 h-4 text-gray-400" />
                </div>
                <button className="w-full bg-white/10 hover:bg-white/20 rounded-lg py-2 text-xs font-medium transition-colors">
                  Ver Perfil
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 ml-72 flex flex-col">
            <main className="flex-1 p-8 bg-gray-50">
              
            </main>

            {/* Footer Minimalista */}
            <footer className="bg-white border-t border-gray-200">
              <div className="px-8 py-8">
                <div className="flex items-start justify-between max-w-6xl">
                  {/* Info Principal */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                        <Car className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-black text-gray-900">FRAN MOTORS</h3>
                        <p className="text-xs text-gray-500">Calidad garantizada desde 2015</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 max-w-xs">
                      Comprometidos con brindarte la mejor experiencia en la compra de tu próximo vehículo.
                    </p>
                  </div>

                  {/* Links */}
                  <div className="grid grid-cols-3 gap-12">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 text-sm">Explorar</h4>
                      <ul className="space-y-2 text-sm">
                        <li><a href="#" className="text-gray-600 hover:text-red-600">Autos Nuevos</a></li>
                        <li><a href="#" className="text-gray-600 hover:text-red-600">Autos Usados</a></li>
                        <li><a href="#" className="text-gray-600 hover:text-red-600">Ofertas</a></li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 text-sm">Soporte</h4>
                      <ul className="space-y-2 text-sm">
                        <li><a href="#" className="text-gray-600 hover:text-red-600">Centro de Ayuda</a></li>
                        <li><a href="#" className="text-gray-600 hover:text-red-600">Financiación</a></li>
                        <li><a href="#" className="text-gray-600 hover:text-red-600">Garantías</a></li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 text-sm">Contacto</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>+54 11 4567-8900</li>
                        <li>ventas@franmotors.com</li>
                        <li>Lun - Vie: 9:00 - 18:00</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="border-t border-gray-200 px-8 py-4">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <p>© 2024 FRAN MOTORS - Todos los derechos reservados</p>
                  <div className="flex items-center space-x-4">
                    <a href="#" className="hover:text-red-600">Términos</a>
                    <a href="#" className="hover:text-red-600">Privacidad</a>
                    <a href="#" className="hover:text-red-600">Cookies</a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}