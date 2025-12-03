"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Importaciones de tu arquitectura limpia
import { validateLoginForm } from "@/utils/validations";
import { LoginFormData, FormErrors } from "@/types/auth.types";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  // 1. Estado Tipado
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const login = useAuthStore((state) => state.login);


  // 2. Manejadores (Son iguales a los de Registro, ¡reutilización mental!)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const validationResult = validateLoginForm(formData);
    const errorInField = validationResult[name as keyof FormErrors];

    if (errorInField) {
      setErrors((prev) => ({ ...prev, [name]: errorInField }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación antes de enviar
    const validationResult = validateLoginForm(formData);
    if (!validationResult.isValid) {
      toast.error("Por favor revisa los campos en rojo");
      setErrors(validationResult);
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // --- AQUÍ OCURRE LA MAGIA DEL LOGIN ---
        // Guardamos el token que nos dio el servidor en el navegador
        // localStorage.setItem("token", data.token);
        // localStorage.setItem("user", JSON.stringify(data.user)); // Guardamos nombre/rol
        // console.log("Logueando usuario:", data.user); // Para depurar
        login(data.token, data.user);
        toast.success(`¡Bienvenido de nuevo, ${data.user.name}! 👋`);

        // alert("¡Bienvenido de nuevo! 👋");
        router.push("/"); // Redirigimos al Home (o al Dashboard después)
      } else {
        toast.error(data.message || "Credenciales incorrectas");
        setErrors({ general: data.message || "Credenciales incorrectas" });
      }
    } catch (err) {
      setErrors({ general: "Error de conexión con el servidor." });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 text-white">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-slate-800 p-8 shadow-lg border border-slate-700">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-blue-500">Iniciar Sesión</h2>
          <p className="mt-2 text-sm text-slate-400">Accede a tu cuenta de Tienda Tech</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          {/* EMAIL */}
          <div>
            <input
              name="email"
              type="text"
              placeholder="Correo Electrónico"
              value={formData.email}
              className={`w-full rounded-lg bg-slate-700 border px-4 py-3 focus:outline-none transition-colors
                ${errors.email ? 'border-red-500 bg-red-500/10' : 'border-slate-600 focus:border-blue-500'}`}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>}
          </div>

          {/* PASSWORD */}
          <div>
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              value={formData.password}
              className={`w-full rounded-lg bg-slate-700 border px-4 py-3 focus:outline-none transition-colors
                ${errors.password ? 'border-red-500 bg-red-500/10' : 'border-slate-600 focus:border-blue-500'}`}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password}</p>}
          </div>

          {/* ERROR GENERAL */}
          {errors.general && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded text-sm text-center animate-pulse">
              {errors.general}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-bold hover:bg-blue-500 transition mt-6 shadow-lg shadow-blue-500/20"
          >
            Ingresar
          </button>
        </form>

        <p className="text-center text-slate-400 mt-4">
          ¿No tienes cuenta? <Link href="/auth/register" className="text-blue-400 hover:underline">Regístrate gratis</Link>
        </p>
      </div>
    </div>
  );
}