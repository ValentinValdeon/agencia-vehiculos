import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Car } from 'lucide-react';
import Sidebar from './components/sidebar';

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

          <Sidebar />

          {/* Main Content */}
          <div className="flex-1 ml-72 flex flex-col">
            <main className="flex p-8 bg-gray-50">
              {children}
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
