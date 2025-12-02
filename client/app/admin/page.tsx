export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Bienvenido al Panel de Control</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TARJETAS DE RESUMEN (Dummies por ahora) */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-slate-400 text-sm">Tickets Pendientes</h3>
          <p className="text-3xl font-bold text-yellow-400 mt-2">5</p>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-slate-400 text-sm">Equipos Listos</h3>
          <p className="text-3xl font-bold text-green-400 mt-2">12</p>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-slate-400 text-sm">Ingresos del Mes</h3>
          <p className="text-3xl font-bold text-blue-400 mt-2">$0.00</p>
        </div>
      </div>
    </div>
  );
}