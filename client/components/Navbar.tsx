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
    // Agregamos sticky para que el menú te siga al bajar
    <nav className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-xl">
      <div className="container mx-auto p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* LOGO (Arriba en móvil, Izquierda en PC) */}
        <Link href="/" className="text-2xl font-bold flex items-center gap-2 hover:text-blue-400 transition">
          📱 <span className="text-blue-500">Tienda</span>Tech
        </Link>

        {/* MENÚ DE ENLACES (Abajo en móvil, Derecha en PC) */}
        {/* flex-wrap ayuda a que si no caben, bajen de línea sin romperse */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 bg-slate-800/50 md:bg-transparent p-2 md:p-0 rounded-xl w-full md:w-auto">
          
          <Link href="/" className="hover:text-blue-400 text-sm font-medium transition">Inicio</Link>
          <Link href="/store" className="hover:text-blue-400 text-sm font-medium transition">Tienda</Link>
          
          {/* CARRITO */}
          <Link href="/cart" className="relative hover:text-blue-400 transition mr-2 p-1">
              <span className="text-2xl">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-900 animate-bounce">
                  {totalItems}
                </span>
              )}
          </Link>

          {/* LÓGICA DE USUARIO */}
          {user ? (
            <div className="flex items-center gap-3 border-l border-slate-600 pl-3 md:pl-6 ml-2">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] text-slate-400 uppercase">Hola</p>
                <p className="text-sm font-bold text-white leading-none">{user.name.split(' ')[0]}</p>
              </div>
              
              {user.role === 'ADMIN' && (
                <Link href="/admin" className="text-yellow-400 border border-yellow-400/30 px-2 py-1 rounded text-xs hover:bg-yellow-400 hover:text-black transition font-bold">
                  Panel
                </Link>
              )}

              <button 
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 text-xs font-bold border border-red-400/30 px-2 py-1 rounded hover:bg-red-400/10 transition"
              >
                Salir
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 border-l border-slate-600 pl-3 md:pl-6 ml-2">
              <Link href="/auth/login" className="text-slate-300 hover:text-white text-xs font-medium">
                Ingresar
              </Link>
              <Link href="/auth/register" className="bg-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-500 text-xs font-bold transition">
                Registro
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}