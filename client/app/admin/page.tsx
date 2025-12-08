"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { 
  TrendingUp, 
  Users, 
  Wrench, 
  AlertCircle, 
  DollarSign, 
  Package,
  ArrowUpRight,
  Clock
} from "lucide-react";

// Tipo de dato para las estadísticas
interface DashboardStats {
  pendingTickets: number;
  completedTickets: number;
  totalProducts: number;
  lowStock: number;
  monthlyRevenue: number;
}

export default function AdminDashboard() {
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // AQUÍ HARÍAS LA LLAMADA REAL A TU API:
    // const fetchStats = async () => {
    //   const res = await fetch('/api/admin/stats');
    //   const data = await res.json();
    //   setStats(data);
    // }

    // POR AHORA: Simulamos carga de datos para ver el diseño funcional
    const timer = setTimeout(() => {
      setStats({
        pendingTickets: 5,
        completedTickets: 12,
        totalProducts: 145,
        lowStock: 3, // Productos con poco stock
        monthlyRevenue: 1250000 // Simulando ingresos
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(amount);
  };

  // --- SKELETON LOADING (Diseño de carga) ---
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-zinc-800/50 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-zinc-900/50 border border-white/5 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* 1. HEADER CON SALUDO PERSONALIZADO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Hola, {user?.name.split(" ")[0]} 👋
          </h1>
          <p className="text-zinc-400 mt-1">Aquí tienes el resumen de actividad de hoy.</p>
        </div>
        
        {/* Botón de acción rápida (Ejemplo) */}
        <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-colors shadow-[0_0_15px_-5px_rgba(255,255,255,0.3)]">
           Descargar Reporte
        </button>
      </div>
      
      {/* 2. GRID DE ESTADÍSTICAS (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* CARD 1: Ingresos */}
        <div className="group bg-zinc-900/40 border border-white/5 p-6 rounded-2xl hover:border-emerald-500/30 transition-all duration-300 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <DollarSign size={80} className="text-emerald-500" />
           </div>
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400">
                 <TrendingUp size={20} />
              </div>
              <span className="text-sm font-medium text-zinc-400">Ingresos Mes</span>
           </div>
           <div>
              <p className="text-3xl font-bold text-white tracking-tight">
                 {stats ? formatCurrency(stats.monthlyRevenue) : "$0"}
              </p>
              <div className="flex items-center gap-1 mt-2 text-xs text-emerald-400 font-medium">
                 <ArrowUpRight size={12} /> +12% vs mes anterior
              </div>
           </div>
        </div>

        {/* CARD 2: Tickets Pendientes */}
        <div className="group bg-zinc-900/40 border border-white/5 p-6 rounded-2xl hover:border-orange-500/30 transition-all duration-300">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20 text-orange-400">
                 <Wrench size={20} />
              </div>
              <span className="text-sm font-medium text-zinc-400">En Reparación</span>
           </div>
           <div>
              <p className="text-3xl font-bold text-white tracking-tight">{stats?.pendingTickets}</p>
              <p className="text-xs text-zinc-500 mt-2">Equipos esperando servicio</p>
           </div>
        </div>

        {/* CARD 3: Productos Totales */}
        <div className="group bg-zinc-900/40 border border-white/5 p-6 rounded-2xl hover:border-blue-500/30 transition-all duration-300">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-400">
                 <Package size={20} />
              </div>
              <span className="text-sm font-medium text-zinc-400">Inventario</span>
           </div>
           <div>
              <p className="text-3xl font-bold text-white tracking-tight">{stats?.totalProducts}</p>
              <p className="text-xs text-zinc-500 mt-2">Productos activos en tienda</p>
           </div>
        </div>

        {/* CARD 4: Alerta Stock */}
        <div className="group bg-zinc-900/40 border border-white/5 p-6 rounded-2xl hover:border-red-500/30 transition-all duration-300">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20 text-red-400">
                 <AlertCircle size={20} />
              </div>
              <span className="text-sm font-medium text-zinc-400">Stock Crítico</span>
           </div>
           <div>
              <p className="text-3xl font-bold text-white tracking-tight">{stats?.lowStock}</p>
              <p className="text-xs text-red-400 mt-2 font-medium">Reponer stock urgente</p>
           </div>
        </div>
      </div>

      {/* 3. SECCIÓN SECUNDARIA (Ej: Actividad Reciente) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Gráfico o Lista Principal (Ocupa 2 columnas) */}
         <div className="lg:col-span-2 bg-zinc-900/30 border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Actividad Reciente</h3>
            <div className="space-y-4">
               {/* Item de Lista Fake */}
               {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                           <Clock size={18} />
                        </div>
                        <div>
                           <p className="text-sm font-bold text-white">iPhone 13 - Cambio de Pantalla</p>
                           <p className="text-xs text-zinc-500">Actualizado hace 2 horas por Admin</p>
                        </div>
                     </div>
                     <span className="px-3 py-1 text-xs font-bold text-orange-300 bg-orange-500/10 border border-orange-500/20 rounded-full">
                        En Proceso
                     </span>
                  </div>
               ))}
            </div>
         </div>

         {/* Panel Lateral (Ocupa 1 columna) */}
         <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Accesos Rápidos</h3>
            <div className="space-y-3">
               <button className="w-full text-left px-4 py-3 bg-zinc-900/50 hover:bg-indigo-500/20 border border-white/5 hover:border-indigo-500/30 rounded-xl text-sm font-medium text-zinc-300 hover:text-white transition-all flex items-center justify-between group">
                  Crear Nuevo Ticket
                  <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
               </button>
               <button className="w-full text-left px-4 py-3 bg-zinc-900/50 hover:bg-indigo-500/20 border border-white/5 hover:border-indigo-500/30 rounded-xl text-sm font-medium text-zinc-300 hover:text-white transition-all flex items-center justify-between group">
                  Agregar Producto
                  <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}