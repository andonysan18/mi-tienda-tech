"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { 
  ShoppingBag, 
  LogOut, 
  User, 
  LayoutDashboard, 
  Menu, 
  X,
  Zap 
} from "lucide-react"; // Asegúrate de tener instalada lucide-react

export default function Navbar() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const totalItems = useCartStore((state) => state.getTotalPrice()); // Asegúrate que tu store tenga este método o usa length
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
    <>
      {/* NAVBAR STICKY GLASSMORPHISM */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl transition-all">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between gap-4">

          {/* 1. LOGO: Minimalista & Tech */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-1.5 rounded-lg group-hover:scale-110 transition-transform duration-300">
               <Zap className="text-white fill-white" size={16} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Tienda<span className="text-indigo-400">Tech</span>
            </span>
          </Link>

          {/* 2. MENÚ DESKTOP (Centrado) */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5">
            {[
              { name: "Inicio", href: "/" },
              { name: "Catálogo", href: "/store" },
            ].map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className="px-5 py-1.5 rounded-full text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* 3. ACCIONES DERECHA */}
          <div className="flex items-center gap-4">
            
            {/* CARRITO (Icono limpio con badge) */}
            <Link 
              href="/cart" 
              className="relative group p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <ShoppingBag size={20} className="text-zinc-400 group-hover:text-white transition-colors" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white ring-2 ring-black">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* SEPARADOR VERTICAL */}
            <div className="h-6 w-px bg-white/10 hidden md:block"></div>

            {/* ÁREA DE USUARIO */}
            {user ? (
              <div className="hidden md:flex items-center gap-3 pl-2">
                
                {/* Info Usuario */}
                <div className="text-right hidden lg:block">
                  <p className="text-xs text-zinc-500 font-medium">Conectado como</p>
                  <p className="text-sm font-bold text-white leading-none">{user.name.split(' ')[0]}</p>
                </div>

                {/* Dropdown / Botones de Acción */}
                <div className="flex items-center gap-1 bg-zinc-900 border border-white/10 rounded-full p-1 pl-1 pr-1">
                   {/* Avatar */}
                   <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white border border-black/50">
                      {user.name.charAt(0)}
                   </div>
                   
                   {/* Botón Admin */}
                   {user.role === 'ADMIN' && (
                     <Link
                       href="/admin"
                       title="Panel Admin"
                       className="p-2 text-zinc-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-full transition-all"
                     >
                       <LayoutDashboard size={16} />
                     </Link>
                   )}

                   {/* Botón Salir */}
                   <button
                     onClick={handleLogout}
                     title="Cerrar Sesión"
                     className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all"
                   >
                     <LogOut size={16} />
                   </button>
                </div>
              </div>
            ) : (
              // NO LOGUEADO (Botones High Contrast)
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Ingresar
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
                >
                  Registrarse
                </Link>
              </div>
            )}

            {/* HAMBURGER MENU (Móvil) */}
            <button 
              className="md:hidden p-2 text-zinc-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* MENÚ MÓVIL DESPLEGABLE */}
        {isMobileMenuOpen && (
           <div className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl absolute w-full p-4 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-5">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-zinc-400 hover:text-white py-2">Inicio</Link>
              <Link href="/store" onClick={() => setIsMobileMenuOpen(false)} className="text-zinc-400 hover:text-white py-2">Catálogo</Link>
              
              <div className="h-px w-full bg-white/10 my-1"></div>
              
              {user ? (
                 <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                       <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">{user.name.charAt(0)}</div>
                       <div>
                          <p className="text-white font-bold text-sm">{user.name}</p>
                          <p className="text-zinc-500 text-xs">{user.email || "Usuario"}</p>
                       </div>
                    </div>
                    {user.role === 'ADMIN' && (
                       <Link href="/admin" className="flex items-center gap-2 text-sm text-yellow-400 py-2">
                          <LayoutDashboard size={16}/> Panel Admin
                       </Link>
                    )}
                    <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-400 py-2 text-left">
                       <LogOut size={16}/> Cerrar Sesión
                    </button>
                 </div>
              ) : (
                 <div className="flex flex-col gap-3">
                    <Link href="/auth/login" className="text-center text-white border border-white/10 py-2.5 rounded-xl">Ingresar</Link>
                    <Link href="/auth/register" className="text-center bg-white text-black py-2.5 rounded-xl font-bold">Registrarse</Link>
                 </div>
              )}
           </div>
        )}
      </nav>
    </>
  );
}