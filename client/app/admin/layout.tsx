"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // 1. Leemos el usuario
    const userStr = localStorage.getItem("user");
    
    if (!userStr) {
      // Si no hay usuario, fuera
      router.push("/auth/login");
      return;
    }

    const user = JSON.parse(userStr);

    // 2. Verificamos ROL (Solo ADMIN o TECNICO pasan)
    if (user.role !== "ADMIN" && user.role !== "TECNICO") {
      alert("Acceso denegado: Se requieren permisos de administrador.");
      router.push("/"); // Lo mandamos al inicio
      return;
    }

    // 3. Si pasa las pruebas, mostramos el contenido
    setAuthorized(true);
  }, [router]);

  if (!authorized) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Verificando permisos...</div>;
  }

  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      {/* SIDEBAR (Menú lateral fijo) */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 p-6 hidden md:block">
        <h2 className="text-xl font-bold text-blue-500 mb-8">Panel Admin 🛠️</h2>
        <nav className="space-y-4">
          <Link href="/admin" className="block p-3 rounded hover:bg-slate-700 transition">
            📊 Resumen
          </Link>
          <Link href="/admin/tickets" className="block p-3 rounded hover:bg-slate-700 transition">
            🎫 Reparaciones
          </Link>
          <Link href="/admin/products" className="block p-3 rounded hover:bg-slate-700 transition">
            📦 Productos
          </Link>
          <Link href="/" className="block p-3 rounded hover:bg-slate-700 transition text-slate-400 mt-8 border-t border-slate-700">
            ⬅ Volver a la Tienda
          </Link>
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}