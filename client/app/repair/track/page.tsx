"use client";
import { useState } from "react";
import { RepairTicket } from "@/types/repair.types";

export default function TrackPage() {
  const [searchId, setSearchId] = useState("");
  const [ticket, setTicket] = useState<RepairTicket | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!searchId.trim()) return;

    setLoading(true);
    setError("");
    setTicket(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL?process.env.NEXT_PUBLIC_API_URL:"http://localhost:3001/"}api/repairs/${searchId}`);
      const data = await res.json();

      if (res.ok) {
        setTicket(data);
      } else {
        setError(data.message || "No encontrado");
      }
    } catch (err) {
      setError("Error al buscar");
    } finally {
      setLoading(false);
    }
  };

  // Función para darle color al estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDIENTE': return 'text-yellow-400 bg-yellow-400/10';
      case 'LISTO': return 'text-green-400 bg-green-400/10';
      case 'EN_REPARACION': return 'text-blue-400 bg-blue-400/10';
      default: return 'text-slate-200 bg-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center p-4 text-white pt-20">
      <h1 className="text-3xl font-bold mb-8 text-center">🔎 Rastrea tu Reparación</h1>

      {/* BARRA DE BÚSQUEDA */}
      <form onSubmit={handleSearch} className="w-full max-w-lg flex gap-2 mb-10">
        <input 
          type="text" 
          placeholder="Ingresa tu código de ticket (Ej: a1b2-c3d4...)"
          className="flex-1 bg-slate-800 border border-slate-600 rounded-lg p-4 focus:border-blue-500 outline-none font-mono"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button 
          type="submit"
          className="bg-blue-600 px-6 rounded-lg font-bold hover:bg-blue-500 transition"
          disabled={loading}
        >
          {loading ? "..." : "Buscar"}
        </button>
      </form>

      {/* RESULTADOS */}
      {error && (
        <div className="bg-red-500/10 text-red-400 p-4 rounded-lg border border-red-500/20">
          ❌ {error}
        </div>
      )}

      {ticket && (
        <div className="w-full max-w-lg bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl animate-fade-in">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-400 text-sm">Dispositivo</p>
              <h3 className="text-xl font-bold">{ticket.deviceModel}</h3>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold border border-white/10 ${getStatusColor(ticket.status)}`}>
              {ticket.status}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-900/50 p-3 rounded-lg">
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Costo Estimado</p>
              <p className="text-lg font-mono text-green-400">
                {ticket.estimatedCost ? `$${ticket.estimatedCost}` : "En revisión..."}
              </p>
            </div>
            
            <div className="text-xs text-slate-500 text-right">
              Actualizado: {new Date(ticket.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}