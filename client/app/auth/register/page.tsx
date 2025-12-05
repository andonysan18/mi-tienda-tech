"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// 1. IMPORTACIONES PERSONALIZADAS
// Si "@/" te da error, cambia por: "../../../utils/validations"
import { validateRegisterForm } from "@/utils/validations"; 
// Si "@/" te da error, cambia por: "../../../types/auth.types"
import { RegisterFormData, FormErrors } from "@/types/auth.types"; 
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter(); //

  // 2. ESTADO CON TIPADO ESTRICTO
  // Solo aceptamos datos que cumplan con la interfaz RegisterFormData
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Estado de errores también tipado
  const [errors, setErrors] = useState<FormErrors>({});

  // 3. MANEJADORES DE EVENTOS
  
  // Se ejecuta cada vez que escribes una letra
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Limpiamos el error visual de este campo específico apenas el usuario corrige
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Se ejecuta cuando sales del input (pierde el foco)
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    
    // Validamos todo el formulario con los datos actuales
    const validationResult = validateRegisterForm(formData);
    
    // Verificamos si HAY un error específico para el campo que acabamos de dejar
    const errorInField = validationResult[name as keyof FormErrors];

    // Si hay error en ese campo, lo mostramos. Si no, no hacemos nada (para no borrar otros errores)
    if (errorInField) {
      setErrors((prev) => ({
        ...prev,
        [name]: errorInField
      }));
    }
  };

  // Se ejecuta al dar click en "Registrarse"
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validamos TODO el formulario antes de enviar
    const validationResult = validateRegisterForm(formData);

    if (!validationResult.isValid) {
      setErrors(validationResult); // Mostramos todos los errores encontrados
      return; // ¡DETENEMOS TODO AQUÍ!
    }

    try {
      // Separamos confirmPassword porque el Backend no lo necesita
      const { confirmPassword, ...dataToSend } = formData;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL?process.env.NEXT_PUBLIC_API_URL:"http://localhost:3001/"}api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const data = await res.json();

      if (res.ok) {
        // alert("¡Cuenta creada con éxito! 🚀");
        toast.success("¡Cuenta creada con éxito! 🚀");
        router.push("/auth/login"); // Redirigir al login
      } else {
        // Error que viene del servidor (ej: "El email ya existe")
        toast.error(data.message || "Error al registrarse");
        setErrors({ general: data.message || "Error al registrarse" });
      }
    } catch (err) {
      setErrors({ general: "No se pudo conectar con el servidor." });
    }
  };

  // 4. RENDERIZADO (JSX)
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 text-white">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-slate-800 p-8 shadow-lg border border-slate-700">
        <h2 className="text-3xl font-bold text-center text-blue-500">Crear Cuenta</h2>
        
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          
          {/* CAMPO: NOMBRE */}
          <div>
            <input
              name="name"
              type="text"
              placeholder="Nombre Completo"
              value={formData.name}
              className={`w-full rounded-lg bg-slate-700 border px-4 py-3 focus:outline-none transition-colors
                ${errors.name ? 'border-red-500 bg-red-500/10' : 'border-slate-600 focus:border-blue-500'}`}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1 ml-1">{errors.name}</p>}
          </div>

          {/* CAMPO: EMAIL */}
          <div>
            <input
              name="email"
              type="text" // Usamos text para probar nuestra validación regex manual
              placeholder="Correo Electrónico"
              value={formData.email}
              className={`w-full rounded-lg bg-slate-700 border px-4 py-3 focus:outline-none transition-colors
                ${errors.email ? 'border-red-500 bg-red-500/10' : 'border-slate-600 focus:border-blue-500'}`}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>}
          </div>

          {/* CAMPO: PASSWORD */}
          <div>
            <input
              name="password"
              type="password"
              placeholder="Contraseña (Mín. 6 caracteres)"
              value={formData.password}
              className={`w-full rounded-lg bg-slate-700 border px-4 py-3 focus:outline-none transition-colors
                ${errors.password ? 'border-red-500 bg-red-500/10' : 'border-slate-600 focus:border-blue-500'}`}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password}</p>}
          </div>

          {/* CAMPO: CONFIRM PASSWORD */}
          <div>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirmar Contraseña"
              value={formData.confirmPassword}
              className={`w-full rounded-lg bg-slate-700 border px-4 py-3 focus:outline-none transition-colors
                ${errors.confirmPassword ? 'border-red-500 bg-red-500/10' : 'border-slate-600 focus:border-blue-500'}`}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1 ml-1">{errors.confirmPassword}</p>}
          </div>

          {/* ERROR GENERAL (DEL SERVIDOR) */}
          {errors.general && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded text-sm text-center animate-pulse">
              {errors.general}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-bold hover:bg-blue-500 transition mt-6 shadow-lg shadow-blue-500/20"
          >
            Registrarse
          </button>
        </form>

        <p className="text-center text-slate-400 mt-4">
          ¿Ya tienes cuenta? <Link href="/auth/login" className="text-blue-400 hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}