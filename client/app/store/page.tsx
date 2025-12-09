"use client";
import { useEffect, useState, useMemo } from "react";
import { Product } from "@/types/product.types";
import { useCartStore } from "@/store/cart.store";
import { toast } from "sonner";
import { Search, ShoppingBag, Star, Zap, ArrowRight, Sparkles } from "lucide-react";

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error cargando productos");
      toast.error("No se pudo cargar el catálogo");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const featuredProduct = products.find(p => p.isFeatured) || products[0];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", { 
      style: "currency", currency: "ARS", minimumFractionDigits: 0 
    }).format(price);
  };

  // --- UI COMPONENTS ---
  
  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 font-sans">
      
      {/* 1. HERO SECTION MODERNO CON GRID BACKGROUND */}
      <div className="relative w-full overflow-hidden border-b border-white/10">
        {/* Fondo Técnico (Grid Pattern) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        {/* Spotlights de color */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-500/20 opacity-50 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
           <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
              
              {/* Badge animado */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium backdrop-blur-md animate-fade-in-up">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Nueva Colección 2025 Disponible
              </div>

              {/* Título de Alto Impacto */}
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/60">
                El futuro de la tecnología <br />
                <span className="text-white">está en tus manos.</span>
              </h1>

              <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
                Descubre dispositivos diseñados para potenciar tu creatividad y productividad. 
                Servicio técnico experto y garantía incluida en cada compra.
              </p>

              {/* Botón CTA Principal */}
              <div className="flex gap-4 pt-4">
                 <button className="group relative px-8 py-3 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-all active:scale-95 flex items-center gap-2">
                    Ver Catálogo
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* 2. CONTROLES (DISEÑO ESTÁTICO & LIMPIO) */}
      {/* CAMBIOS:
          1. Quitamos 'sticky', 'top-20', 'z-30'.
          2. Agregamos 'relative' y un margen vertical amplio 'my-12' para dar aire.
          3. Eliminamos el borde/shadow excesivo para que se integre con el fondo.
      */}
      <div className="container mx-auto px-6 relative z-10 -mt-10 mb-12">
        <div className="mx-auto max-w-5xl bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-4 flex flex-col md:flex-row gap-6 items-center justify-between">
            
            {/* Categorías (Ahora se ven más sólidas) */}
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-2 md:pb-0">
              {["Todos", "Celulares", "Audio", "Accesorios", "Cargadores"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                    selectedCategory === cat 
                      ? "bg-white text-black shadow-lg scale-105" 
                      : "bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent hover:border-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Separador visual en Desktop */}
            <div className="hidden md:block w-px h-8 bg-white/10"></div>

            {/* Buscador Integrado */}
            <div className="relative w-full md:w-72 group">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={18} className="text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
               </div>
               <input 
                  type="text"
                  placeholder="Buscar productos..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 bg-black/40 border border-white/5 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-inner"
               />
            </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* 3. GRID DE PRODUCTOS (Clean Cards) */}
        {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {[1,2,3,4,5,6,7,8].map(i => (
                 <div key={i} className="aspect-[4/5] bg-zinc-900/50 rounded-3xl animate-pulse border border-white/5"></div>
               ))}
            </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="group relative flex flex-col gap-4"
              >
                {/* Contenedor Imagen */}
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-zinc-900 border border-white/5 group-hover:border-indigo-500/30 transition-all duration-500">
                    
                    {/* Badge Descuento */}
                    {Number(product.discount) > 0 && (
                      <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                         -{product.discount}%
                      </div>
                    )}
                    
                    {/* Badge Featured */}
                    {product.isFeatured && (
                       <div className="absolute top-4 right-4 z-20 text-yellow-400">
                          <Star size={16} fill="currentColor" />
                       </div>
                    )}

                    {/* Imagen con efecto Zoom */}
                    <div className="absolute inset-0 flex items-center justify-center p-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/50 to-transparent">
                      <img 
                        src={product.imageUrl || "/placeholder.png"} 
                        alt={product.name}
                        className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
                      />
                    </div>

                    {/* Botón añadir flotante (Aparece en hover) */}
                    <div className="absolute bottom-4 left-0 right-0 px-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <button 
                            disabled={product.stock === 0}
                            onClick={() => {
                                addToCart(product);
                                toast.success("Producto agregado", { icon: <Sparkles className="text-indigo-400" size={16}/> });
                            }}
                            className="w-full py-3 bg-white text-black font-bold rounded-xl shadow-lg shadow-black/50 hover:bg-indigo-50 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                        >
                            {product.stock === 0 ? "Agotado" : (
                                <>
                                  <ShoppingBag size={16} /> Añadir
                                </>
                            )}
                        </button>
                    </div>

                     {/* Overlay Agotado */}
                     {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                            <span className="px-3 py-1 bg-zinc-800 text-white text-xs font-bold rounded border border-white/10">SIN STOCK</span>
                        </div>
                     )}
                </div>

                {/* Info Minimalista */}
                <div className="space-y-1">
                   <div className="flex justify-between items-start">
                      <h3 className="text-white font-medium text-lg leading-tight group-hover:text-indigo-400 transition-colors cursor-pointer">
                        {product.name}
                      </h3>
                      <div className="flex flex-col items-end">
                         <span className="text-white font-bold tracking-tight">{formatPrice(product.price)}</span>
                         {Number(product.discount) > 0 && (
                            <span className="text-xs text-zinc-500 line-through">
                               {formatPrice(Number(product.price) * (1 + Number(product.discount)/100))}
                            </span>
                         )}
                      </div>
                   </div>
                   <p className="text-sm text-zinc-500">{product.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
             <Search size={48} className="text-zinc-700 mb-4" />
             <p className="text-xl font-medium text-zinc-400">No encontramos productos</p>
             <button onClick={() => {setSearchTerm(""); setSelectedCategory("Todos")}} className="mt-4 text-indigo-400 hover:text-indigo-300 underline">
                Ver todo el catálogo
             </button>
          </div>
        )}
      </div>
    </div>
  );
}