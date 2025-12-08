"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";

export default function Navbar() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // CORRECCIÓN IMPORTANTE: Usamos getTotalItems() para la cantidad, no el precio.
  const totalItems = useCartStore((state) => state.getTotalPrice());
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    clearCart();
    logout();
    router.push("/auth/login");
  };

  if (!isMounted) return null;

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-xl backdrop-blur-md bg-opacity-90">
      <div className="container mx-auto p-4 flex flex-col md:flex-row justify-between items-center gap-4">

        {/* LOGO */}
        <Link href="/" className="text-2xl font-bold flex items-center gap-2 hover:text-blue-400 transition group">
          <span className="text-3xl group-hover:scale-110 transition-transform">📱</span>
          <span><span className="text-blue-500">Tienda</span>Tech</span>
        </Link>

        {/* MENÚ */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 w-full md:w-auto">

          {/* Enlaces de Navegación */}
          <div className="flex items-center gap-4 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50">
            <Link href="/" className="hover:text-blue-400 text-sm font-medium transition px-2">Inicio</Link>
            <Link href="/store" className="hover:text-blue-400 text-sm font-medium transition px-2">Tienda</Link>

            {/* CARRITO */}
            <Link href="/cart" className="relative hover:text-blue-400 transition pl-2 border-l border-slate-700 group">
              <span className="text-xl group-hover:scale-110 inline-block">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-900 shadow-sm animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* ÁREA DE USUARIO */}
          {user ? (
            <div className="flex items-center gap-2 bg-slate-800 rounded-full p-1 pl-2 pr-2 border border-slate-700 shadow-sm transition hover:border-slate-600">

              {/* Avatar con Inicial */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center shadow-lg">
                <span className="text-xs font-bold text-white uppercase">
                  {user.name.charAt(0)}
                </span>
              </div>

              {/* Nombre y Rol */}
              <div className="hidden sm:block px-2 text-left">
                <p className="text-[10px] text-slate-400 leading-none font-medium">Hola,</p>
                <p className="text-sm font-bold text-white leading-none max-w-[100px] truncate">
                  {user.name.split(' ')[0]}
                </p>
              </div>

              {/* Separador */}
              <div className="w-px h-6 bg-slate-700 mx-1"></div>

              {/* Botones de Acción */}
              <div className="flex items-center gap-1">
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    title="Panel de Administrador"
                    className="p-1.5 text-yellow-400 hover:bg-yellow-400/10 rounded-full transition"
                  >
                    {/* Icono de Ajustes (Tuerca) */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {/* Estructura de la casa */}
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      {/* La puerta */}
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  title="Cerrar Sesión"
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition"
                >
                  {/* Icono de Salir (Log out) */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            // NO LOGUEADO: Botones estilo "Pill" modernos
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="text-slate-300 hover:text-white text-sm font-medium px-4 py-2 hover:bg-slate-800 rounded-full transition"
              >
                Ingresar
              </Link>
              <Link
                href="/auth/register"
                className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-5 py-2 rounded-full shadow-lg shadow-blue-900/20 transition hover:scale-105 active:scale-95"
              >
                Registro
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}