"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import { 
  Trash2, 
  ArrowRight, 
  ShoppingBag, 
  CreditCard, 
  ShieldCheck, 
  Zap, 
  Package, 
  Lock,
  ChevronLeft
} from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  
  const { cart, removeFromCart, clearCart, getTotalPrice } = useCartStore();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error("Acceso requerido", {
        description: "Inicia sesión para proteger tu compra.",
        action: { label: "Login", onClick: () => router.push("/auth/login") }
      });
      return;
    }

    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)), 
      {
        loading: 'Conectando con pasarela segura...',
        success: () => {
          clearCart();
          router.push("/");
          return `¡Pago exitoso! Orden generada.`;
        },
        error: 'Error en el procesamiento',
      }
    );
  };

  if (!isMounted) return null;

  // --- EMPTY STATE ---
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-500 max-w-md">
           <div className="w-20 h-20 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-2xl shadow-indigo-500/10 rotate-3 transition-transform hover:rotate-6">
              <ShoppingBag size={32} className="text-zinc-400" />
           </div>
           <h1 className="text-2xl font-bold mb-2 tracking-tight text-white">Tu carrito está vacío</h1>
           <p className="text-zinc-500 mb-8 leading-relaxed">
             Explora nuestra colección de tecnología premium y encuentra tu próximo upgrade.
           </p>
           <Link 
             href="/store" 
             className="group flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-zinc-200 transition-all active:scale-95"
           >
             <ArrowRight size={18} className="rotate-180 group-hover:-translate-x-1 transition-transform"/> Volver a la Tienda
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-200 font-sans selection:bg-indigo-500/30 pt-24 pb-20">
      
      {/* Background FX */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
        
        {/* Header de Página */}
        <div className="mb-8">
           <Link href="/store" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-white transition-colors mb-4">
              <ChevronLeft size={14}/> Seguir comprando
           </Link>
           <div className="flex items-end justify-between border-b border-white/10 pb-6">
              <div>
                 <h1 className="text-3xl font-bold text-white tracking-tight">Tu Carrito</h1>
                 <p className="text-zinc-500 text-sm mt-1 flex items-center gap-2">
                    <Package size={14}/> {cart.length} productos agregados
                 </p>
              </div>
              <button 
                onClick={clearCart}
                className="text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-all flex items-center gap-2"
              >
                <Trash2 size={14} /> Vaciar
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* --- COLUMNA IZQUIERDA: LISTA --- */}
          <div className="lg:col-span-8">
            <div className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                
                {/* Cabecera de Tabla (3 Columnas ahora) */}
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-white/[0.02] text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    <div className="col-span-6">Producto</div>
                    <div className="col-span-3 text-center">Cantidad</div>
                    <div className="col-span-3 text-right">Total</div>
                </div>

                {/* Items */}
                <div className="divide-y divide-white/5">
                    {cart.map((item) => (
                    <div key={item.id} className="p-4 md:p-6 hover:bg-white/[0.02] transition-colors">
                        
                        {/* LAYOUT MÓVIL (Flex) - Sin cambios, ya se veía bien */}
                        <div className="flex md:hidden gap-4">
                            <div className="w-20 h-20 bg-white rounded-xl p-2 flex-shrink-0 flex items-center justify-center border border-zinc-800">
                                <img src={item.imageUrl || "/placeholder.png"} alt={item.name} className="w-full h-full object-contain mix-blend-multiply"/>
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-white text-base leading-tight mb-1">{item.name}</h3>
                                    <p className="text-xs text-zinc-500 uppercase tracking-wide">{item.category}</p>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-indigo-400 font-bold text-sm bg-indigo-500/10 px-2 py-0.5 rounded">x{item.quantity}</span>
                                    <span className="font-bold text-white">{formatPrice(item.price * item.quantity)}</span>
                                </div>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-zinc-500 hover:text-red-400 self-start">
                                <Trash2 size={18}/>
                            </button>
                        </div>

                        {/* LAYOUT DESKTOP (Grid - 3 Columnas) */}
                        <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                            
                            {/* 1. Info + Precio Unitario (Columna 1) */}
                            <div className="col-span-6 flex items-center gap-4">
                                <div className="w-16 h-16 bg-white rounded-lg p-2 flex-shrink-0 flex items-center justify-center border border-zinc-800">
                                    <img src={item.imageUrl || "/placeholder.png"} alt={item.name} className="w-full h-full object-contain mix-blend-multiply"/>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm mb-1">{item.name}</h3>
                                    <p className="text-xs text-zinc-500 uppercase mb-1">{item.category}</p>
                                    {/* Precio unitario aquí, pequeño y sutil */}
                                    <p className="text-xs text-zinc-600 font-mono">
                                        {formatPrice(item.price)} unitario
                                    </p>
                                </div>
                            </div>

                            {/* 2. Cantidad (Columna 2) */}
                            <div className="col-span-3 text-center">
                                <span className="px-4 py-1.5 bg-black/50 border border-white/10 rounded-lg text-sm text-white font-mono">
                                    x{item.quantity}
                                </span>
                            </div>

                            {/* 3. Total y Borrar (Columna 3) */}
                            <div className="col-span-3 text-right flex items-center justify-end gap-4">
                                <span className="font-bold text-white font-mono text-lg tracking-tight">
                                    {formatPrice(item.price * item.quantity)}
                                </span>
                                <button 
                                    onClick={() => { removeFromCart(item.id); toast.info("Eliminado"); }} 
                                    className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                    title="Eliminar del carrito"
                                >
                                    <Trash2 size={16}/>
                                </button>
                            </div>
                        </div>

                    </div>
                    ))}
                </div>
            </div>
          </div>

          {/* --- COLUMNA DERECHA: SUMMARY --- */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
                
                <div className="bg-zinc-900 border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl shadow-black relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] rounded-full pointer-events-none"></div>

                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                     Resumen de Orden
                  </h2>
                  
                  <div className="space-y-4 mb-6 relative z-10">
                    <div className="flex justify-between text-zinc-400 text-sm">
                      <span>Subtotal</span>
                      <span className="text-white font-mono">{formatPrice(getTotalPrice())}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400 text-sm">
                      <span className="flex items-center gap-1">Envío <Zap size={12} className="text-yellow-400 fill-yellow-400"/></span>
                      <span className="text-emerald-400 font-bold text-xs bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">GRATIS</span>
                    </div>
                    <div className="flex justify-between text-zinc-400 text-sm">
                      <span>Impuestos</span>
                      <span className="text-zinc-600 text-xs">Calculados al pagar</span>
                    </div>
                  </div>

                  <div className="h-px bg-white/10 mb-6"></div>

                  <div className="flex justify-between items-end mb-8 relative z-10">
                    <span className="text-zinc-400 font-medium pb-1">Total</span>
                    <span className="text-4xl font-bold text-white tracking-tighter">
                       {formatPrice(getTotalPrice())}
                    </span>
                  </div>

                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-white hover:bg-zinc-200 text-black py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 mb-4 relative z-10"
                  >
                    Pagar Ahora <ArrowRight size={20} />
                  </button>
                  
                  <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 font-medium uppercase tracking-widest">
                    <Lock size={10} /> Transacción Encriptada SSL
                  </div>
                </div>

                <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                      <ShieldCheck size={20} />
                   </div>
                   <div>
                      <p className="text-sm font-bold text-white">Garantía TiendaTech</p>
                      <p className="text-xs text-zinc-500">Compra protegida por 30 días.</p>
                   </div>
                </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}