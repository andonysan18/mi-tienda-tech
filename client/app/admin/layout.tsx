"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import {
  LayoutDashboard,
  Ticket,
  Package,
  Store,
  Menu,
  X,
  ChevronRight,
  Zap,
} from "lucide-react";

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
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="relative flex h-6 w-6">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-6 w-6 bg-indigo-500"></span>
        </div>
        <p className="text-zinc-500 text-sm font-mono animate-pulse">Verificando credenciales...</p>
      </div>
    );
  }

  const navItems = [
    { name: "Resumen", path: "/admin", icon: LayoutDashboard },
    { name: "Reparaciones", path: "/admin/tickets", icon: Ticket },
    { name: "Productos", path: "/admin/products", icon: Package },
  ];

  return (
    <div className="flex min-h-screen bg-black text-zinc-200 font-sans selection:bg-indigo-500/30">
      {/* Grid de fondo */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Botón móvil */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed bottom-6 right-6 z-[70] bg-indigo-600 p-4 rounded-full shadow-lg shadow-indigo-900/50 text-white hover:bg-indigo-500 transition-all active:scale-95"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* SIDEBAR – z-50 es suficiente porque el modal ahora usa z-[9999] */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-black/95 backdrop-blur-xl border-r border-white/10
          flex flex-col justify-between
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:h-screen
        `}
      >
        {/* Logo y navegación */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-indigo-500/10 border border-indigo-500/20 p-2 rounded-lg">
              <Zap className="text-indigo-400 fill-indigo-400" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-none">Panel Admin</h2>
              <span className="text-xs text-zinc-500 font-medium">TiendaTech v2.0</span>
            </div>
          </div>

          <nav className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4">Principal</p>
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive
                      ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                      : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }
                  `}
                >
                  <item.icon size={18} className={isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-white"} />
                  {item.name}
                  {isActive && <ChevronRight size={14} className="ml-auto opacity-50" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Usuario y salir */}
        <div className="p-4 border-t border-white/5 bg-zinc-900/30">
          <div className="flex items-center gap-3 mb-4 p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white border border-black/50 shadow-inner">
              {user?.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user?.name.split(" ")[0]}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wide">{user?.role}</p>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg text-zinc-400 text-xs font-bold hover:text-white hover:bg-white/5 transition-colors"
          >
            <Store size={14} /> Ir a la Tienda
          </Link>
        </div>
      </aside>

      {/* Overlay móvil */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-[2px] z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto md:ml-0">
        <header className="h-16 border-b border-white/5 flex items-center px-8 bg-black/50 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center text-sm text-zinc-500">
            <span className="hover:text-zinc-300 transition-colors">Admin</span>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-white font-medium capitalize">
              {pathname === "/admin" ? "Resumen" : pathname.split("/").pop()}
            </span>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}