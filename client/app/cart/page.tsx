"use client";
import Link from "next/link";
import { useCartStore } from "@/store/cart.store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  
  // TRAEMOS TODO DEL STORE
  const { cart, removeFromCart, clearCart, getTotalPrice } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Función simulada de pago
  const handleCheckout = () => {
    const user = localStorage.getItem("user");
    
    if (!user) {
      alert("Debes iniciar sesión para comprar 🔒");
      router.push("/auth/login");
      return;
    }

    // AQUÍ IRÍA LA CONEXIÓN CON EL BACKEND PARA CREAR LA ORDEN
    if (confirm("¿Confirmar compra por $" + getTotalPrice() + "?")) {
      alert("¡Compra realizada con éxito! 🎉 Enviaremos tu pedido.");
      clearCart();
      router.push("/");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!isMounted) return null;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío 😢</h1>
        <p className="text-slate-400 mb-8">Parece que no has agregado nada todavía.</p>
        <Link 
          href="/store" 
          className="bg-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-500 transition"
        >
          Volver a la Tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 pt-24">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          🛒 Tu Carrito <span className="text-lg text-slate-500 font-normal">({cart.length} productos)</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LISTA DE PRODUCTOS (Izquierda) */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex gap-4 items-center">
                {/* Imagen Mini */}
                <div className="w-20 h-20 bg-white rounded-lg p-2 flex-shrink-0">
                  <img 
                    src={item.imageUrl || "/placeholder.png"} 
                    alt={item.name} 
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-sm text-slate-400">{item.category}</p>
                  <p className="text-blue-400 font-bold mt-1">
                    {formatPrice(item.price)} x {item.quantity}
                  </p>
                </div>

                {/* Subtotal Item */}
                <div className="text-right">
                  <p className="font-bold text-lg mb-2">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 text-sm hover:text-red-300 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}

            <button 
              onClick={clearCart}
              className="text-slate-500 text-sm hover:text-white transition mt-4"
            >
              Vaciar Carrito
            </button>
          </div>

          {/* RESUMEN DE PAGO (Derecha) */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 sticky top-24">
              <h2 className="text-xl font-bold mb-6 border-b border-slate-700 pb-4">Resumen de Compra</h2>
              
              <div className="flex justify-between mb-2 text-slate-300">
                <span>Subtotal</span>
                <span>{formatPrice(getTotalPrice())}</span>
              </div>
              <div className="flex justify-between mb-6 text-slate-300">
                <span>Envío</span>
                <span className="text-green-400">Gratis</span>
              </div>

              <div className="flex justify-between mb-8 text-xl font-bold">
                <span>Total</span>
                <span className="text-blue-400">{formatPrice(getTotalPrice())}</span>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full bg-green-600 hover:bg-green-500 py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-900/20 transition active:scale-95"
              >
                Finalizar Compra
              </button>
              
              <p className="text-center text-xs text-slate-500 mt-4">
                🔒 Pago seguro procesado localmente (Simulado)
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}