"use client";
import { useEffect, useState } from "react";
import { RepairTicket } from "@/types/repair.types";
import { toast } from "sonner";
import { 
  RefreshCw, 
  Search, 
  Smartphone, 
  Tablet, 
  Laptop, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  Calendar,
  Wrench,
  Filter
} from "lucide-react";

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<RepairTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");

  // Cargar tickets al iniciar
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/repairs`);
      const data = await res.json();
      setTickets(data);
      // Solo mostramos toast si es una recarga manual (para no molestar al inicio)
      if (!loading) toast.success("Datos actualizados");
    } catch (error) {
      toast.error("Error al cargar tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    // 1. Optimistic UI
    const originalTickets = [...tickets];
    setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus as any } : t));

    const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/repairs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
    }).then(async (res) => {
        if (!res.ok) throw new Error("Error");
        return res;
    });

    toast.promise(promise, {
        loading: 'Actualizando estado...',
        success: 'Estado actualizado correctamente',
        error: () => {
            setTickets(originalTickets); // Rollback
            return 'No se pudo actualizar el estado';
        }
    });
  };

  // Filtrado local
  const filteredTickets = tickets.filter(t => {
      const matchesSearch = t.deviceModel.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.includes(searchTerm);
      const matchesStatus = statusFilter === "TODOS" || t.status === statusFilter;
      return matchesSearch && matchesStatus;
  });

  // Helper para colores de estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDIENTE': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'EN_DIAGNOSTICO': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'ESPERANDO_REPUESTO': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'EN_REPARACION': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'LISTO': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'ENTREGADO': return 'bg-zinc-800 text-zinc-400 border-zinc-700';
      default: return 'bg-zinc-800 text-white';
    }
  };

  const formatCurrency = (amount?: number) => {
      if (!amount) return "-";
      return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(amount);
  };

  const getDeviceIcon = (model: string) => {
      const m = model.toLowerCase();
      if (m.includes('macbook') || m.includes('notebook') || m.includes('pc')) return <Laptop size={18}/>;
      if (m.includes('ipad') || m.includes('tablet')) return <Tablet size={18}/>;
      return <Smartphone size={18}/>;
  };

  return (
    <div className="min-h-screen bg-black text-zinc-200 font-sans selection:bg-indigo-500/30">
      
      {/* Fondo Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto pb-24 px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        
        {/* --- HEADER & KPIs --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
               Reparaciones
               <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded-md border border-white/5 font-mono">SAT</span>
            </h1>
            <p className="text-zinc-400 mt-2 flex items-center gap-2">
               Gestión de órdenes de servicio técnico
            </p>
          </div>
          
          <button 
            onClick={fetchTickets} 
            disabled={loading}
            className="group bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium border border-white/10 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={16} className={`group-hover:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} /> 
            Actualizar Lista
          </button>
        </div>

        {/* --- TOOLBAR (Buscador y Filtros) --- */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-2 flex flex-col md:flex-row gap-2 mb-6 shadow-xl">
           <div className="relative flex-1 group">
              <Search className="absolute left-3 top-3 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
              <input 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 placeholder="Buscar por modelo o ID..." 
                 className="w-full bg-black/40 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-600" 
              />
           </div>
           
           <div className="relative md:w-64 border-l border-white/5 pl-2 md:pl-0 border-t md:border-t-0 pt-2 md:pt-0">
               <Filter className="absolute left-3 md:left-3 top-5 md:top-3 text-zinc-500 pointer-events-none" size={16}/>
               <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none bg-zinc-800/50 hover:bg-zinc-800 border border-white/5 rounded-xl pl-9 pr-8 py-2.5 text-zinc-300 text-sm focus:border-indigo-500/50 outline-none cursor-pointer transition-colors"
               >
                  <option value="TODOS">Todos los estados</option>
                  <option value="PENDIENTE">Pendientes</option>
                  <option value="EN_REPARACION">En Reparación</option>
                  <option value="LISTO">Listos para entrega</option>
                  <option value="ENTREGADO">Entregados</option>
               </select>
           </div>
        </div>

        {/* --- DESKTOP TABLE --- */}
        <div className="hidden md:block bg-zinc-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-black/20 text-xs text-zinc-500 font-bold uppercase tracking-wider">
                <th className="p-5">Ticket / Fecha</th>
                <th className="p-5">Dispositivo</th>
                <th className="p-5">Problema Reportado</th>
                <th className="p-5">Estado Actual</th>
                <th className="p-5">Costo Est.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading && <tr><td colSpan={5} className="p-12 text-center text-zinc-500 animate-pulse">Cargando reparaciones...</td></tr>}
              
              {!loading && filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="p-5">
                    <div className="flex flex-col">
                        <span className="font-mono text-xs text-indigo-400 font-bold">#{ticket.id.slice(0, 6).toUpperCase()}</span>
                        <div className="flex items-center gap-1 text-zinc-500 text-xs mt-1">
                            <Calendar size={12}/>
                            {new Date(ticket.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                  </td>
                  <td className="p-5">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-white/5 flex items-center justify-center text-zinc-400">
                           {getDeviceIcon(ticket.deviceModel)}
                        </div>
                        <span className="text-sm font-bold text-white">{ticket.deviceModel}</span>
                     </div>
                  </td>
                  <td className="p-5">
                     <p className="text-sm text-zinc-400 max-w-xs truncate" title={ticket.issueDescription}>
                        {ticket.issueDescription}
                     </p>
                  </td>
                  <td className="p-5">
                     {/* SELECTOR DE ESTADO CON ESTILO BADGE */}
                     <div className="relative inline-block w-48">
                        <select
                          value={ticket.status}
                          onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                          className={`w-full appearance-none text-xs font-bold px-3 py-2 rounded-lg border cursor-pointer outline-none focus:ring-1 focus:ring-indigo-500/50 transition-colors ${getStatusColor(ticket.status)}`}
                        >
                          <option value="PENDIENTE">🟡 Pendiente</option>
                          <option value="EN_DIAGNOSTICO">👀 En Diagnóstico</option>
                          <option value="ESPERANDO_REPUESTO">📦 Esperando Repuesto</option>
                          <option value="EN_REPARACION">🔨 En Reparación</option>
                          <option value="LISTO">✅ Listo para Retiro</option>
                          <option value="ENTREGADO">🚀 Entregado</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                           <MoreVertical size={12} className="text-current"/>
                        </div>
                     </div>
                  </td>
                  <td className="p-5">
                     <span className={`font-mono text-sm font-bold ${ticket.estimatedCost ? 'text-white' : 'text-zinc-600'}`}>
                        {formatCurrency(ticket.estimatedCost)}
                     </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- MOBILE CARDS --- */}
        <div className="md:hidden space-y-4">
           {loading && <div className="p-8 text-center text-zinc-500 animate-pulse">Cargando tickets...</div>}
           
           {!loading && filteredTickets.length === 0 && (
              <div className="text-center py-12 text-zinc-500 bg-zinc-900/50 rounded-3xl border border-white/10 border-dashed">
                 <Wrench className="mx-auto mb-3 opacity-20" size={40}/>
                 <p className="text-sm font-medium">No se encontraron reparaciones</p>
              </div>
           )}

           {!loading && filteredTickets.map((ticket) => (
              <div key={ticket.id} className="bg-zinc-900 p-4 rounded-2xl border border-white/5 shadow-md flex flex-col gap-4">
                 
                 <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                          {getDeviceIcon(ticket.deviceModel)}
                       </div>
                       <div>
                          <h3 className="font-bold text-white text-sm">{ticket.deviceModel}</h3>
                          <span className="font-mono text-xs text-indigo-400">#{ticket.id.slice(0, 6).toUpperCase()}</span>
                       </div>
                    </div>
                    <span className="text-xs text-zinc-500">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                 </div>

                 <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                    <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Problema</p>
                    <p className="text-sm text-zinc-300 line-clamp-2">{ticket.issueDescription}</p>
                 </div>

                 <div className="flex flex-col gap-2">
                    <p className="text-xs text-zinc-500 uppercase font-bold">Estado Actual</p>
                    <select
                       value={ticket.status}
                       onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                       className={`w-full appearance-none text-xs font-bold px-3 py-3 rounded-xl border outline-none ${getStatusColor(ticket.status)}`}
                    >
                       <option value="PENDIENTE">🟡 Pendiente</option>
                       <option value="EN_DIAGNOSTICO">👀 En Diagnóstico</option>
                       <option value="ESPERANDO_REPUESTO">📦 Esperando Repuesto</option>
                       <option value="EN_REPARACION">🔨 En Reparación</option>
                       <option value="LISTO">✅ Listo para Retiro</option>
                       <option value="ENTREGADO">🚀 Entregado</option>
                    </select>
                 </div>

                 <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <span className="text-xs text-zinc-500">Costo Estimado</span>
                    <span className="font-mono font-bold text-white">{formatCurrency(ticket.estimatedCost)}</span>
                 </div>
              </div>
           ))}
        </div>

      </div>
    </div>
  );
}