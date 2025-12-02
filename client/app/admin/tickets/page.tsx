"use client";
import { useEffect, useState } from "react";
import { RepairTicket } from "@/types/repair.types";

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<RepairTicket[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar tickets al iniciar
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/repairs");
      const data = await res.json();
      setTickets(data);
    } catch (error) {
      alert("Error al cargar tickets");
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar estado cuando cambias el select
  const handleStatusChange = async (id: string, newStatus: string) => {
    // 1. Actualización optimista (Visualmente cambia rápido)
    const originalTickets = [...tickets];
    setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus as any } : t));

    try {
      // 2. Petición al backend
      const res = await fetch(`http://localhost:3001/api/repairs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Fallo al actualizar");
      
    } catch (error) {
      alert("Error al actualizar");
      setTickets(originalTickets); // Revertimos si falló
    }
  };

  if (loading) return <div className="p-8 text-white">Cargando datos...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Gestión de Reparaciones 🔧</h1>
        <button onClick={fetchTickets} className="text-blue-400 hover:text-blue-300 text-sm">
          🔄 Refrescar
        </button>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">ID / Fecha</th>
                <th className="px-6 py-4">Dispositivo</th>
                <th className="px-6 py-4">Problema</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Costo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-700/50 transition">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-blue-400 block mb-1">
                      {ticket.id.slice(0, 8)}...
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-white">
                    {ticket.deviceModel}
                  </td>
                  <td className="px-6 py-4 text-sm max-w-xs truncate" title={ticket.issueDescription}>
                    {ticket.issueDescription}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={ticket.status}
                      onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                      className={`bg-slate-900 border border-slate-600 text-xs rounded-full px-3 py-1 outline-none cursor-pointer
                        ${ticket.status === 'LISTO' ? 'text-green-400 border-green-500/50' : 
                          ticket.status === 'PENDIENTE' ? 'text-yellow-400 border-yellow-500/50' : 'text-blue-400'}`}
                    >
                      <option value="PENDIENTE">🟡 Pendiente</option>
                      <option value="EN_DIAGNOSTICO">👀 En Diagnóstico</option>
                      <option value="ESPERANDO_REPUESTO">📦 Esperando Repuesto</option>
                      <option value="EN_REPARACION">🔨 En Reparación</option>
                      <option value="LISTO">✅ Listo</option>
                      <option value="ENTREGADO">🚀 Entregado</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 font-mono text-green-400">
                    {ticket.estimatedCost ? `$${ticket.estimatedCost}` : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {tickets.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              No hay tickets de reparación todavía.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}