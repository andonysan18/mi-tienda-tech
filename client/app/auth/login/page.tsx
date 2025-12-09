"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { validateLoginForm } from "@/utils/validations";
import { LoginFormData, FormErrors } from "@/types/auth.types";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  AlertCircle 
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState<LoginFormData>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

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
    if (errorInField) setErrors((prev) => ({ ...prev, [name]: errorInField }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const validationResult = validateLoginForm(formData);
    if (!validationResult.isValid) {
      toast.error("Por favor revisa los campos");
      setErrors(validationResult);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token, data.user);
        toast.success(`¡Bienvenido, ${data.user.name.split(' ')[0]}!`, {
            description: "Has iniciado sesión correctamente."
        });
        router.push("/"); 
      } else {
        toast.error("Error de acceso", { description: data.message || "Credenciales inválidas" });
        setErrors({ general: data.message || "Credenciales incorrectas" });
      }
    } catch (err) {
      toast.error("Error de conexión");
      setErrors({ general: "No se pudo conectar con el servidor." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 text-zinc-200 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      
      {/* Fondo Grid & Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/20 opacity-40 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Card Principal */}
      <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Bienvenido de nuevo</h2>
          <p className="text-zinc-400 text-sm">Ingresa tus credenciales para continuar.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          
          {/* EMAIL */}
          <div className="space-y-1.5">
            <div className="relative group">
               <Mail className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
               <input
                 name="email"
                 type="text"
                 placeholder="nombre@ejemplo.com"
                 value={formData.email}
                 className={`w-full bg-black/50 border rounded-xl pl-12 pr-4 py-3 text-white outline-none transition-all placeholder:text-zinc-600
                   ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'}`}
                 onChange={handleChange}
                 onBlur={handleBlur}
               />
            </div>
            {errors.email && <p className="text-red-400 text-xs ml-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.email}</p>}
          </div>

          {/* PASSWORD */}
          <div className="space-y-1.5">
            <div className="relative group">
               <Lock className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
               <input
                 name="password"
                 type="password"
                 placeholder="••••••••••••"
                 value={formData.password}
                 className={`w-full bg-black/50 border rounded-xl pl-12 pr-4 py-3 text-white outline-none transition-all placeholder:text-zinc-600
                   ${errors.password ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'}`}
                 onChange={handleChange}
                 onBlur={handleBlur}
               />
            </div>
            {errors.password && <p className="text-red-400 text-xs ml-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.password}</p>}
          </div>

          {/* ERROR GENERAL */}
          {errors.general && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-3 rounded-xl text-sm text-center flex items-center justify-center gap-2">
               <AlertCircle size={16} /> {errors.general}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-900/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Ingresar <ArrowRight size={18}/></>}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-white/5">
          <p className="text-zinc-500 text-sm">
            ¿Aún no tienes cuenta? <Link href="/auth/register" className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline transition-colors">Regístrate gratis</Link>
          </p>
        </div>
      </div>
    </div>
  );
}