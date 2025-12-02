"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("Cargando...");

  useEffect(() => {
    // Intentamos conectar con tu Backend
    fetch("http://localhost:3001/api/health")
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message); // Debería decir "Server up!" o similar
      })
      .catch((err) => {
        console.error(err);
        setMessage("Error: No pude conectar con el servidor 😢");
      });
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Mi Tienda Tech 📱</h1>
      <div className="p-6 border border-blue-500 rounded-lg bg-slate-800">
        <p className="text-lg">Estado del Backend:</p>
        <p className="text-2xl font-mono text-green-400 mt-2">
          {message}
        </p>
      </div>
    </div>
  );
}