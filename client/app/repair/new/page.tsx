"use client";
import { useState } from "react";
import Link from "next/link";
import { CreateTicketData } from "@/types/repair.types";

import { useAuthStore } from "@/store/auth.store";


export default function NewRepairPage() {
  const [formData, setFormData] = useState<CreateTicketData>({
    deviceModel: "",
    issueDescription: "",
  });
  const [ticketId, setTicketId] = useState<string | null>(null); // Aquí guardamos el ID si sale bien
  const [loading, setLoading] = useState(false);

  const user = useAuthStore((state) => state.user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Nota: Si el usuario está logueado, podríamos enviar su ID también (lo veremos luego)

      const payload = { ...formData, userId: user? user.id : null};

      const res = await fetch("http://localhost:3001/api/repairs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setTicketId(data.ticket.id); // ¡ÉXITO! Guardamos el ID para mostrarlo
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  // VISTA DE ÉXITO (Cuando ya se creó el ticket)
  if (ticketId) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-white">
        <div className="bg-slate-800 p-8 rounded-xl border border-green-500/30 shadow-2xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">¡Solicitud Recibida!</h2>
          <p className="text-slate-400 mb-6">Tu equipo está en buenas manos. Guarda este código para rastrear la reparación:</p>
          
          <div className="bg-black/40 p-4 rounded-lg border border-slate-700 font-mono text-xl text-yellow-400 mb-6 break-all select-all">
            {ticketId}
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/repair/track" className="bg-blue-600 py-2 rounded-lg hover:bg-blue-500 transition">
              Ir a Rastrear
            </Link>
            <button onClick={() => setTicketId(null)} className="text-slate-400 hover:text-white">
              Crear otra solicitud
            </button>
          </div>
        </div>
      </div>
    );
  }

  // VISTA DEL FORMULARIO (Normal)
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-white">
      <div className="w-full max-w-md bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700">
        <h1 className="text-2xl font-bold mb-6 text-blue-400">🔧 Iniciar Reparación</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Modelo del Dispositivo</label>
            <input 
              type="text" 
              placeholder="Ej: iPhone 13 Pro, Samsung S21..."
              className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 focus:border-blue-500 outline-none"
              required
              value={formData.deviceModel}
              onChange={(e) => setFormData({...formData, deviceModel: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Descripción del Problema</label>
            <textarea 
              rows={4}
              placeholder="Ej: La pantalla no prende, se cayó al agua..."
              className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 focus:border-blue-500 outline-none resize-none"
              required
              value={formData.issueDescription}
              onChange={(e) => setFormData({...formData, issueDescription: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold transition disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar Solicitud"}
          </button>
        </form>
      </div>
    </div>
  );
}