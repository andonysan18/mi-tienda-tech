"use client";
import { useEffect, useState } from "react";
import { Product } from "@/types/product.types"; // Reutilizamos el tipo que creaste

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error cargando productos");
    } finally {
      setLoading(false);
    }
  };

  // Función para que el dinero se vea bonito
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", { // Cambia "es-AR" por tu país si quieres
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 pt-24">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center">Nuestros Productos 🚀</h1>
        <p className="text-slate-400 text-center mb-12">La mejor tecnología al mejor precio</p>

        {loading ? (
          <div className="text-center">Cargando catálogo...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-blue-500 transition shadow-lg flex flex-col group"
              >
                {/* IMAGEN DEL PRODUCTO */}
                <div className="h-48 overflow-hidden bg-white relative">
                  <img 
                    src={product.imageUrl || "/placeholder.png"} 
                    alt={product.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-110 transition duration-300"
                  />
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white font-bold">
                      AGOTADO
                    </div>
                  )}
                </div>

                {/* INFO */}
                <div className="p-5 flex-1 flex flex-col">
                  <span className="text-xs text-blue-400 font-bold uppercase mb-1">
                    {product.category}
                  </span>
                  <h2 className="text-lg font-bold mb-2">{product.name}</h2>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-400">
                      {formatPrice(product.price)}
                    </span>
                    
                    <button 
                      className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={product.stock === 0}
                      title="Agregar al Carrito"
                      onClick={() => alert(`Agregaste ${product.name} al carrito (Próximamente)`)}
                    >
                      🛒
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {products.length === 0 && !loading && (
          <p className="text-center text-slate-500 mt-10">No hay productos disponibles por ahora.</p>
        )}
      </div>
    </div>
  );
}