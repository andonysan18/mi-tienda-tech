"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  
  // Estado para controlar si el menú móvil está abierto (opcional, por si lo agregamos luego)
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // 1. Leer usuario del LocalStorage al cargar
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    // 2. BORRAR EL TOKEN (La "Pulsera VIP")
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/auth/login"); // Mandar al login
  };

  // Evitamos errores de hidratación (diferencias entre servidor y cliente)
  if (!isMounted) return null;

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* LOGO */}
        <Link href="/" className="text-xl font-bold flex items-center gap-2">
          📱 <span className="text-blue-500">Tienda</span>Tech
        </Link>

        {/* MENÚ DERECHA */}
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-blue-400 transition">Inicio</Link>
          <Link href="/store" className="hover:text-blue-400 transition">Tienda</Link>
          {/* Lógica: ¿Está logueado? */}
          {user ? (
            // SI ESTÁ LOGUEADO
            <div className="flex items-center gap-4">
              <span className="text-slate-300 text-sm">
                Hola, <span className="font-semibold text-white">{user.name}</span>
              </span>
              
              {/* Si es ADMIN mostramos enlace al panel */}
              {user.role === 'ADMIN' && (
                <Link href="/admin" className="text-yellow-500 hover:text-yellow-400 text-sm">
                  Panel Admin
                </Link>
              )}

              <button 
                onClick={handleLogout}
                className="bg-red-500/10 text-red-400 px-3 py-1 rounded hover:bg-red-500 hover:text-white transition text-sm border border-red-500/20"
              >
                Salir
              </button>
            </div>
          ) : (
            // NO ESTÁ LOGUEADO
            <div className="flex items-center gap-3">
              <Link 
                href="/auth/login"
                className="text-slate-300 hover:text-white transition"
              >
                Ingresar
              </Link>
              <Link 
                href="/auth/register"
                className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition font-medium"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}