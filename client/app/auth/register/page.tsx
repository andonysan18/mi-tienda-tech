"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Importaciones de tu arquitectura limpia
import { validateRegisterForm } from "@/utils/validations"; 
import { RegisterFormData, FormErrors } from "@/types/auth.types"; 
import { toast } from "sonner";
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  AlertCircle 
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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
    const validationResult = validateRegisterForm(formData);
    const errorInField = validationResult[name as keyof FormErrors];
    if (errorInField) {
      setErrors((prev) => ({ ...prev, [name]: errorInField }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const validationResult = validateRegisterForm(formData);
    if (!validationResult.isValid) {
      setErrors(validationResult);
      toast.error("Por favor revisa los campos");
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...dataToSend } = formData;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/"}api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("¡Cuenta creada con éxito! 🚀", {
            description: "Ya puedes iniciar sesión con tus credenciales."
        });
        router.push("/auth/login");
      } else {
        toast.error(data.message || "Error al registrarse");
        setErrors({ general: data.message || "Error al registrarse" });
      }
    } catch (err) {
      setErrors({ general: "No se pudo conectar con el servidor." });
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 text-zinc-200 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      
      {/* Fondo Grid & Glow (Consistente con Login) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/10 opacity-40 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Card Principal */}
      <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Crear Cuenta</h2>
          <p className="text-zinc-400 text-sm">Únete a la comunidad de TiendaTech</p>
        </div>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {/* NOMBRE */}
          <div className="space-y-1.5">
            <div className="relative group">
               <User className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
               <input
                 name="name"
                 type="text"
                 placeholder="Nombre Completo"
                 value={formData.name}
                 className={`w-full bg-black/50 border rounded-xl pl-12 pr-4 py-3 text-white outline-none transition-all placeholder:text-zinc-600
                   ${errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'}`}
                 onChange={handleChange}
                 onBlur={handleBlur}
               />
            </div>
            {errors.name && <p className="text-red-400 text-xs ml-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.name}</p>}
          </div>

          {/* EMAIL */}
          <div className="space-y-1.5">
            <div className="relative group">
               <Mail className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
               <input
                 name="email"
                 type="text"
                 placeholder="Correo Electrónico"
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
                 placeholder="Contraseña (Mín. 6 caracteres)"
                 value={formData.password}
                 className={`w-full bg-black/50 border rounded-xl pl-12 pr-4 py-3 text-white outline-none transition-all placeholder:text-zinc-600
                   ${errors.password ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'}`}
                 onChange={handleChange}
                 onBlur={handleBlur}
               />
            </div>
            {errors.password && <p className="text-red-400 text-xs ml-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.password}</p>}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="space-y-1.5">
            <div className="relative group">
               <Lock className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
               <input
                 name="confirmPassword"
                 type="password"
                 placeholder="Confirmar Contraseña"
                 value={formData.confirmPassword}
                 className={`w-full bg-black/50 border rounded-xl pl-12 pr-4 py-3 text-white outline-none transition-all placeholder:text-zinc-600
                   ${errors.confirmPassword ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'}`}
                 onChange={handleChange}
                 onBlur={handleBlur}
               />
            </div>
            {errors.confirmPassword && <p className="text-red-400 text-xs ml-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.confirmPassword}</p>}
          </div>

          {/* ERROR GENERAL */}
          {errors.general && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-3 rounded-xl text-sm text-center flex items-center justify-center gap-2 animate-pulse">
               <AlertCircle size={16} /> {errors.general}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-purple-900/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Registrarse <ArrowRight size={18}/></>}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-white/5">
          <p className="text-zinc-500 text-sm">
            ¿Ya tienes cuenta? <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 font-medium hover:underline transition-colors">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}