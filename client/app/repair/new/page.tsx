"use client";
import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import { 
  Smartphone, Wrench, MessageSquare, Send, CheckCircle2, 
  ArrowRight, Loader2, FileText, Search, Activity, Calendar, X
} from "lucide-react";

// TU NÚMERO
const ADMIN_PHONE_NUMBER = "5491162198405"; 

export default function RepairPortalPage() {
  const [activeTab, setActiveTab] = useState<'CREATE' | 'TRACK'>('CREATE');
  
  // --- ESTADOS ---
  const [formData, setFormData] = useState({ deviceModel: "", issueDescription: "", contactPhone: "" });
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);
  const [loadingCreate, setLoadingCreate] = useState(false);

  const [trackId, setTrackId] = useState("");
  const [ticketStatus, setTicketStatus] = useState<any>(null);
  const [loadingTrack, setLoadingTrack] = useState(false);

  const user = useAuthStore((state) => state.user);

  // --- LÓGICA CREAR ---
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingCreate(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/"}api/repairs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId: user ? user.id : null }),
      });
      const data = await res.json();
      if (res.ok) {
        setCreatedTicketId(data.ticket.id);
        toast.success("Solicitud creada");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setLoadingCreate(false);
    }
  };

  const openWhatsAppCreate = (id: string) => {
    const message = `👋 Hola! Generé la solicitud.\n📱 *Equipo:* ${formData.deviceModel}\n🎫 *Ticket:* ${id}\n⚠️ *Falla:* ${formData.issueDescription}`;
    window.open(`https://wa.me/${ADMIN_PHONE_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // --- LÓGICA RASTREAR ---
  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTicketStatus(null);
    if (!trackId.trim()) return;
    setLoadingTrack(true);
    setTicketStatus(null); 

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/"}api/repairs/${trackId}`);
      if (!res.ok) throw new Error("No encontrado");
      const data = await res.json();
      setTicketStatus(data);
    } catch (error) {
      toast.error("No encontramos una reparación con ese código.");
    } finally {
      setLoadingTrack(false);
    }
  };

  // ✅ NUEVO: Solo limpia el estado visual, no borra nada de la BD
  const handleClearSearch = () => {
    setTicketStatus(null);
    setTrackId("");
  };

  const getStatusColor = (status: string) => {
    const map: any = {
      'PENDIENTE': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
      'EN_DIAGNOSTICO': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
      'EN_REPARACION': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
      'LISTO': 'text-green-400 bg-green-400/10 border-green-400/20',
      'ENTREGADO': 'text-zinc-400 bg-zinc-800 border-zinc-700',
    };
    return map[status] || 'text-white bg-zinc-800';
  };

  // --- RENDER: VISTA DE ÉXITO AL CREAR ---
  if (createdTicketId) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden text-white font-sans">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
         
         <div className="relative z-10 w-full max-w-md bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-center mb-2 tracking-tight">¡Solicitud Registrada!</h2>
            <p className="text-zinc-400 text-center mb-6 text-sm">Tu equipo ya está en nuestro sistema.</p>
            
            <div className="bg-black/50 p-4 rounded-xl border border-white/10 flex flex-col items-center justify-center mb-8">
               <span className="text-xs text-zinc-500 uppercase font-bold mb-2 tracking-widest">Tu Código de Rastreo</span>
               <span className="text-3xl font-mono font-bold text-indigo-400 tracking-widest select-all">{createdTicketId.slice(0, 8)}</span>
               <span className="text-[10px] text-zinc-600 mt-1">(Copia este código)</span>
            </div>
            
            <button onClick={() => openWhatsAppCreate(createdTicketId)} className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition-all mb-3">
               <MessageSquare size={20} fill="black" /> Confirmar en WhatsApp
            </button>
            
            <button onClick={() => {setCreatedTicketId(null); setFormData({deviceModel:"", issueDescription:"", contactPhone:""})}} className="w-full text-zinc-500 hover:text-white text-sm py-2 transition-colors">
                Volver al inicio
            </button>
         </div>
      </div>
    );
  }

  // --- RENDER: PORTAL PRINCIPAL ---
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative font-sans selection:bg-indigo-500/30 pt-20">
      
      {/* Fondo Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <div className="relative z-10 w-full max-w-lg">
        
        {/* --- TABS --- */}
        <div className="bg-zinc-900/90 p-1.5 rounded-2xl flex mb-6 border border-white/10 backdrop-blur-xl shadow-xl">
           <button 
             onClick={() => setActiveTab('CREATE')}
             className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'CREATE' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
           >
             <Wrench size={16} /> Iniciar Reparación
           </button>
           <button 
             onClick={() => setActiveTab('TRACK')}
             className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'TRACK' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
           >
             <Search size={16} /> Rastrear Equipo
           </button>
        </div>

        {/* --- CONTENEDOR PRINCIPAL --- */}
        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          
          {/* MODO: CREAR */}
          {activeTab === 'CREATE' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300 space-y-6">
               <div className="text-center md:text-left">
                  <h1 className="text-2xl font-bold text-white tracking-tight">Nueva Solicitud</h1>
                  <p className="text-zinc-400 text-sm mt-1">Completa los datos para obtener tu presupuesto.</p>
               </div>
               
               <form onSubmit={handleCreateSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider pl-1">Modelo del Equipo</label>
                    <input 
                        className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-zinc-700" 
                        placeholder="Ej: Samsung S21 Ultra, iPhone 12..." 
                        required 
                        value={formData.deviceModel} 
                        onChange={e => setFormData({...formData, deviceModel: e.target.value})} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider pl-1">WhatsApp de Contacto</label>
                    <input 
                        className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-zinc-700" 
                        type="tel" 
                        placeholder="Ej: 11 5555 6666" 
                        required 
                        value={formData.contactPhone} 
                        onChange={e => setFormData({...formData, contactPhone: e.target.value})} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider pl-1">Falla / Problema</label>
                    <textarea 
                        rows={3} 
                        className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-zinc-700 resize-none" 
                        placeholder="Describe qué le pasa al equipo..." 
                        required 
                        value={formData.issueDescription} 
                        onChange={e => setFormData({...formData, issueDescription: e.target.value})} 
                    />
                  </div>
                  
                  <button type="submit" disabled={loadingCreate} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-900/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-4">
                    {loadingCreate ? <Loader2 className="animate-spin" /> : <>Generar Orden <ArrowRight size={18}/></>}
                  </button>
               </form>
            </div>
          )}

          {/* MODO: RASTREAR */}
          {activeTab === 'TRACK' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="mb-6 text-center md:text-left">
                  <h1 className="text-2xl font-bold text-white tracking-tight">Estado de Reparación</h1>
                  <p className="text-zinc-400 text-sm mt-1">Ingresa el código único de tu orden.</p>
               </div>
               
               <form onSubmit={handleTrackSubmit} className="flex gap-2 mb-8">
                  <input 
                    className="flex-1 bg-black/50 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-zinc-700" 
                    placeholder="Ej: a1b2-c3d4..." 
                    value={trackId}
                    onChange={(e) => setTrackId(e.target.value)}
                  />
                  <button type="submit" disabled={loadingTrack} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 rounded-xl transition-all disabled:opacity-50 active:scale-95">
                     {loadingTrack ? <Loader2 className="animate-spin"/> : <Search size={22}/>}
                  </button>
               </form>

               {/* CARD DE RESULTADO */}
               {ticketStatus && (
                 <div className="bg-black/40 border border-white/10 rounded-2xl p-5 animate-in zoom-in-95 ring-1 ring-white/5 relative">
                    
                    {/* ✅ BOTÓN CERRAR / LIMPIAR BÚSQUEDA */}
                    <button 
                        onClick={handleClearSearch}
                        className="absolute top-4 right-4 p-2 bg-zinc-800 text-zinc-400 rounded-lg hover:bg-zinc-700 hover:text-white transition-all"
                        title="Limpiar búsqueda"
                    >
                        <X size={16} />
                    </button>

                    <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-4 pr-10">
                       <div>
                          <h3 className="text-white font-bold text-lg">{ticketStatus.deviceModel}</h3>
                          <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1 font-mono">
                             <Calendar size={12}/> {new Date(ticketStatus.updatedAt).toLocaleDateString()}
                          </div>
                       </div>
                       <div className={`px-3 py-1.5 rounded-lg text-xs font-bold border uppercase tracking-wider ${getStatusColor(ticketStatus.status)}`}>
                          {ticketStatus.status.replace(/_/g, ' ')}
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex justify-between items-center p-4 bg-zinc-900 rounded-xl border border-white/5">
                          <span className="text-sm text-zinc-400 flex items-center gap-2"><Activity size={16} className="text-indigo-500"/> Presupuesto</span>
                          <span className="text-white font-mono font-bold text-lg">
                             {ticketStatus.estimatedCost ? `$${ticketStatus.estimatedCost}` : "En revisión"}
                          </span>
                       </div>
                       
                       <a 
                         href={`https://wa.me/${ADMIN_PHONE_NUMBER}?text=${encodeURIComponent(`Hola, consulto por mi equipo ${ticketStatus.deviceModel} (Ticket: ${trackId}). Estado actual: ${ticketStatus.status}`)}`}
                         target="_blank"
                         className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors border border-white/5 hover:border-white/20"
                       >
                          <MessageSquare size={16}/> Consultar detalles
                       </a>
                    </div>
                 </div>
               )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}