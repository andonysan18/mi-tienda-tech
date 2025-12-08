"use client"; // <--- 1. ESTO SOLUCIONA EL ERROR PRINCIPAL

import Link from "next/link";
import { 
  ShoppingBag, 
  Wrench, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Truck, 
  Smartphone, 
  ChevronRight 
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-zinc-200 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      
      {/* --- FONDO --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-500/20 opacity-40 blur-[120px] rounded-full pointer-events-none"></div>
      </div>

      <div className="relative z-10">
        
        {/* --- 1. HERO SECTION --- */}
        <section className="pt-32 pb-20 px-6 text-center">
          <div className="container mx-auto max-w-4xl">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Soluciones Integrales en Tecnología
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white animate-in fade-in slide-in-from-bottom-6 duration-700">
              Tu tecnología, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400">
                llevada al siguiente nivel.
              </span>
            </h1>

            <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              Somos expertos en dispositivos móviles. Encuentra el gadget que buscas o repara el que ya amas con garantía profesional.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
              <Link 
                href="/store" 
                className="group bg-white text-black hover:bg-zinc-200 px-8 py-4 rounded-full font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)]"
              >
                <ShoppingBag size={20} /> Ir a la Tienda
              </Link>
              <Link 
                href="/repair/new" 
                className="group bg-zinc-900 hover:bg-zinc-800 text-white border border-white/10 hover:border-white/20 px-8 py-4 rounded-full font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Wrench size={20} className="text-zinc-400 group-hover:text-white transition-colors" /> Solicitar Reparación
              </Link>
            </div>
          </div>
        </section>

        {/* --- 2. BENTO GRID --- */}
        <section className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            
            {/* TARJETA 1: STORE (Sin cambios, funciona bien) */}
            <Link href="/store" className="group relative bg-zinc-900 border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden hover:border-indigo-500/50 transition-all duration-500 shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-500 -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 bg-black border border-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                   <Smartphone size={28} className="text-indigo-400" />
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-3">Accesorios Premium</h2>
                <p className="text-zinc-400 text-lg mb-8 max-w-sm">
                  Fundas, cargadores y audio de alta fidelidad. Equipa tu dispositivo con lo mejor del mercado.
                </p>
                
                <div className="mt-auto flex items-center gap-2 text-indigo-400 font-bold group-hover:text-indigo-300 transition-colors">
                  Ver Catálogo <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform"/>
                </div>
              </div>
            </Link>

            {/* TARJETA 2: REPAIR (CORREGIDA: Div + Link Absoluto) */}
            <div className="group relative bg-zinc-900 border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden hover:border-emerald-500/50 transition-all duration-500 shadow-2xl">
              
              {/* 1. ENLACE PRINCIPAL INVISIBLE (Cubre toda la tarjeta) */}
              <Link href="/repair/new" className="absolute inset-0 z-0" aria-label="Solicitar Reparación"></Link>

              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col h-full pointer-events-none"> {/* pointer-events-none permite clickear el link de fondo */}
                <div className="w-14 h-14 bg-black border border-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                   <Wrench size={28} className="text-emerald-400" />
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-3">Servicio Técnico</h2>
                <p className="text-zinc-400 text-lg mb-8 max-w-sm">
                  Expertos en micro-soldadura, cambio de pantallas y baterías. Diagnóstico en el día.
                </p>
                
                <div className="mt-auto flex flex-wrap gap-4">
                   <span className="flex items-center gap-2 text-emerald-400 font-bold group-hover:text-emerald-300 transition-colors">
                      Solicitar Turno <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform"/>
                   </span>
                   
                   {/* 2. ENLACE SECUNDARIO (Con pointer-events-auto para reactivar el click) */}
                   <Link 
                     href="/repair/track" 
                     className="flex items-center gap-1 text-sm text-zinc-500 hover:text-white transition-colors z-20 pointer-events-auto hover:underline"
                   >
                      Ya tengo una orden <ChevronRight size={12}/>
                   </Link>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* --- 3. TRUST SIGNALS --- */}
        <section className="py-20 border-t border-white/5 bg-black/50 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
              <div className="flex flex-col items-center p-4">
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mb-4 text-indigo-400 border border-white/10">
                   <Truck size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Envíos a todo el país</h3>
                <p className="text-zinc-500 text-sm">Recibe en 24/48hs estés donde estés.</p>
              </div>
              <div className="flex flex-col items-center p-4">
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mb-4 text-emerald-400 border border-white/10">
                   <ShieldCheck size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Garantía Asegurada</h3>
                <p className="text-zinc-500 text-sm">3 meses de cobertura en reparaciones.</p>
              </div>
              <div className="flex flex-col items-center p-4">
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mb-4 text-amber-400 border border-white/10">
                   <Zap size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Reparación Express</h3>
                <p className="text-zinc-500 text-sm">Tu equipo listo en tiempo récord.</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}