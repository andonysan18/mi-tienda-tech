"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation"; 
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    setIsMounted(true);
    if (!user) {
      router.push("/auth/login");
      return;
    }
    if (user.role !== "ADMIN" && user.role !== "TECNICO") {
      router.push("/");
      return;
    }
    setAuthorized(true);
  }, [user, router]);

  if (!isMounted || !authorized) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-blue-500 animate-pulse">Cargando sistema...</div>;
  }

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 
      ${isActive 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50 translate-x-1" 
        : "text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1"
      }`;
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white relative font-sans">
      
      {/* BOTÓN FLOTANTE MÓVIL */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed bottom-6 right-6 z-50 bg-blue-600 p-4 rounded-full shadow-2xl text-white hover:bg-blue-500 transition-transform active:scale-95"
      >
        <span className="text-xl font-bold leading-none block">
          {isSidebarOpen ? "✕" : "☰"}
        </span>
      </button>

      {/* --- SIDEBAR --- */}
      {/* AGREGAMOS 'pt-24' AQUÍ PARA BAJAR EL CONTENIDO EN MÓVIL */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 
        p-6 pt-24 md:pt-6  
        transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1)
        ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"} 
        md:translate-x-0 md:static md:h-screen md:sticky md:top-0
      `}>
        
        {/* LOGO ADMIN (Oculto en móvil si quieres ganar espacio, o visible) */}
        <div className="mb-10 px-2 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-lg"></div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Panel<span className="text-blue-500">Admin</span>
          </h2>
        </div>
        
        {/* TARJETA DE USUARIO */}
        <div className="mb-8 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-blue-400 font-bold border border-slate-600 flex-shrink-0">
              {user?.name.charAt(0).toUpperCase()}
           </div>
           <div className="overflow-hidden">
             <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Hola,</p>
             <p className="font-bold text-white truncate text-sm">{user?.name.split(" ")[0]}</p>
           </div>
        </div>

        {/* NAVEGACIÓN */}
        <nav className="space-y-2">
          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 mt-6">Menu</p>
          
          <Link href="/admin" onClick={() => setIsSidebarOpen(false)} className={getLinkClass("/admin")}>
            <span>📊</span> <span className="font-medium">Resumen</span>
          </Link>
          
          <Link href="/admin/tickets" onClick={() => setIsSidebarOpen(false)} className={getLinkClass("/admin/tickets")}>
            <span>🎫</span> <span className="font-medium">Reparaciones</span>
          </Link>
          
          <Link href="/admin/products" onClick={() => setIsSidebarOpen(false)} className={getLinkClass("/admin/products")}>
            <span>📦</span> <span className="font-medium">Productos</span>
          </Link>
          
          <div className="my-6 border-t border-slate-800/50"></div>
          
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors group">
            <span className="group-hover:-translate-x-1 transition-transform">⬅</span> 
            <span className="font-medium">Ir a la Tienda</span>
          </Link>
        </nav>
      </aside>

      {/* OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto h-screen bg-slate-950 w-full relative">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-900/10 to-transparent -z-10 pointer-events-none"></div>
        <div className="p-4 md:p-10 max-w-7xl mx-auto pt-24 md:pt-10">
          {children}
        </div>
      </main>
    </div>
  );
}