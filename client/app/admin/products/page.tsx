"use client";
import { useEffect, useState, useMemo } from "react";
import { Product, ProductFormData, ProductFormErrors } from "@/types/product.types";
import { validateProductForm } from "@/utils/product.validations";
import { toast } from "sonner"; 
import { 
  Plus, X, Trash2, Edit, Image as ImageIcon, Search, 
  Filter, Package, Zap, ChevronRight, Save, LayoutTemplate
} from "lucide-react";
import ImageUpload from "@/components/ui/image-upload";

// MODAL 100% CORREGIDO – NUNCA MÁS QUEDARÁ DETRÁS DEL SIDEBAR
// --- MODAL CORREGIDO (NIVEL SUPREMO) ---
const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    // 🔥 CAMBIO CRÍTICO: z-[9999] para que NADA lo tape
    <div className="fixed inset-0 z-[9999] flex justify-center items-end sm:items-center sm:p-4">
      
      {/* Fondo oscuro */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      {/* Contenedor del Modal */}
      <div className="relative bg-zinc-900 border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:w-[90%] md:max-w-3xl h-[90vh] sm:h-auto sm:max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
        
        {/* Header Sticky */}
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-zinc-900 rounded-t-3xl shrink-0 z-20">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
            <p className="text-xs text-zinc-400 mt-1 hidden sm:block">Completa los detalles a continuación</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors">
            <X size={24}/>
          </button>
        </div>

        {/* Cuerpo con Scroll */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
            {children}
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE UI: INPUT ---
const FormInput = ({ label, error, ...props }: any) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">{label}</label>
    <input 
      className={`w-full bg-black/50 border rounded-xl p-3.5 text-white text-sm focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-zinc-600 ${error ? 'border-red-500/50' : 'border-white/10 focus:border-indigo-500'}`} 
      {...props} 
    />
    {error && <span className="text-xs text-red-400 flex items-center gap-1">⚠️ {error}</span>}
  </div>
);

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Estados de filtro
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("Todos");

  const [formData, setFormData] = useState<ProductFormData>({
    name: "", price: "", category: "Accesorios", stock: "",
    imageUrl: "", bannerUrl: "", isFeatured: false, discount: ""
  });
  const [errors, setErrors] = useState<ProductFormErrors>({ isValid: true });

  useEffect(() => { fetchProducts(); }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === "Todos" || product.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, filterCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (error) { toast.error("Error al cargar"); } 
    finally { setLoading(false); }
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name, price: product.price.toString(), category: product.category,
        stock: product.stock.toString(), imageUrl: product.imageUrl || "",
        bannerUrl: product.bannerUrl || "", isFeatured: product.isFeatured,
        discount: product.discount.toString()
      });
    } else {
      setEditingId(null);
      setFormData({ name: "", price: "", category: "Accesorios", stock: "", imageUrl: "", bannerUrl: "", isFeatured: false, discount: "" });
    }
    setErrors({ isValid: true });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    toast("¿Eliminar producto?", {
      action: {
        label: "Sí, borrar",
        onClick: async () => {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/products/${id}`, { method: "DELETE" });
            if (res.ok) { toast.success("Producto eliminado"); fetchProducts(); }
          } catch (e) { toast.error("Error"); }
        }
      },
      cancel: { label: "Cancelar", onClick: () => {} }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationResult = validateProductForm(formData);
    if (!validationResult.isValid) { setErrors(validationResult); return; }

    const promise = (async () => {
        const url = editingId 
          ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/products/${editingId}`
          : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/products`;
        
        const res = await fetch(url, {
            method: editingId ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Error");
        return res;
    })();

    toast.promise(promise, {
        loading: 'Guardando...',
        success: () => {
            setIsModalOpen(false);
            fetchProducts();
            return "¡Operación exitosa!";
        },
        error: 'Error al guardar',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(Number(price));
  };



  return (
    <div className="min-h-screen bg-black text-zinc-200 font-sans selection:bg-indigo-500/30">
      
      {/* Fondo Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto pb-24 px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight flex items-center gap-3">
               Inventario
               <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded-md border border-white/5 font-mono">v2.0</span>
            </h1>
            <p className="text-zinc-400 mt-2 flex items-center gap-2 text-sm md:text-base">
               <Package size={16} /> Gestionando <strong className="text-white">{products.length}</strong> productos
            </p>
          </div>
          
          <button 
            onClick={() => openModal()} 
            className="w-full md:w-auto bg-white text-black hover:bg-zinc-200 px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] active:scale-95 group"
          >
            <Plus size={20} /> 
            <span>Agregar Producto</span>
            <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
          </button>
        </div>

        {/* --- TOOLBAR --- */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-2 flex flex-col md:flex-row gap-2 mb-8 shadow-xl">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-3 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre..." 
              className="w-full bg-black/40 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-600" 
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute right-3 top-3 text-zinc-500 hover:text-white"><X size={16}/></button>
            )}
          </div>

          <div className="relative md:w-64 border-l-0 md:border-l border-white/5 pl-0 md:pl-2 pt-2 md:pt-0 border-t md:border-t-0">
            <Filter className="absolute left-3 md:left-5 top-5 md:top-3 text-zinc-500 pointer-events-none" size={16}/>
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full appearance-none bg-zinc-800/50 hover:bg-zinc-800 border border-white/5 rounded-xl pl-9 pr-8 py-2.5 text-zinc-300 text-sm focus:border-indigo-500/50 outline-none cursor-pointer transition-colors"
            >
              <option value="Todos">Todas las categorías</option>
              <option value="Accesorios">Accesorios</option>
              <option value="Audio">Audio</option>
              <option value="Celulares">Celulares</option>
              <option value="Cargadores">Cargadores</option>
            </select>
          </div>
        </div>

        {/* --- VISTA TABLA (Desktop) --- */}
        <div className="hidden md:block bg-zinc-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-black/20 text-xs text-zinc-500 font-bold uppercase tracking-wider">
                <th className="p-5">Producto</th>
                <th className="p-5">Categoría</th>
                <th className="p-5">Precio</th>
                <th className="p-5">Stock</th>
                <th className="p-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading && <tr><td colSpan={5} className="p-12 text-center text-zinc-500 animate-pulse">Cargando inventario...</td></tr>}
              
              {!loading && filteredProducts.map((p) => (
                <tr key={p.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center shadow-sm shrink-0 overflow-hidden">
                        {p.imageUrl ? (
                           <img src={p.imageUrl} className="w-full h-full object-contain"/> 
                        ) : (
                           <ImageIcon size={20} className="text-zinc-300"/>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">{p.name}</p>
                        <div className="flex gap-2 mt-0.5">
                            {p.isFeatured && <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-1.5 rounded border border-yellow-500/20">Destacado</span>}
                            {Number(p.discount) > 0 && <span className="text-[10px] bg-red-500/10 text-red-400 px-1.5 rounded border border-red-500/20">-{p.discount}%</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                      <span className="px-3 py-1 rounded-full bg-zinc-800 border border-white/5 text-xs text-zinc-300 font-medium">
                          {p.category}
                      </span>
                  </td>
                  <td className="p-5 text-sm font-bold text-white tabular-nums tracking-tight">
                      {formatPrice(p.price)}
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${p.stock > 5 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : p.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                      <span className={`text-sm font-medium ${p.stock === 0 ? 'text-red-400' : 'text-zinc-300'}`}>
                          {p.stock > 0 ? `${p.stock} u.` : 'Sin Stock'}
                      </span>
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal(p)} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Editar">
                          <Edit size={16}/>
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Eliminar">
                          <Trash2 size={16}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- VISTA CARDS (Móvil) --- */}
        <div className="md:hidden space-y-4">
          {loading && <div className="p-8 text-center text-zinc-500 animate-pulse">Cargando productos...</div>}
          
          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-12 text-zinc-500 bg-zinc-900/50 rounded-3xl border border-white/10 border-dashed">
               <Package className="mx-auto mb-3 opacity-20" size={40}/>
               <p className="text-sm font-medium">No se encontraron productos</p>
            </div>
          )}

          {!loading && filteredProducts.map((p) => (
            <div key={p.id} className="bg-zinc-900 p-4 rounded-2xl border border-white/5 flex gap-4 shadow-md items-center">
              
              {/* Imagen */}
              <div className="w-20 h-20 bg-white rounded-xl p-2 shrink-0 flex items-center justify-center overflow-hidden">
                 {p.imageUrl ? (
                   <img src={p.imageUrl} className="w-full h-full object-contain"/>
                 ) : (
                   <ImageIcon size={24} className="text-zinc-300"/>
                 )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                 <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-white text-sm truncate pr-2">{p.name}</h3>
                 </div>
                 <p className="text-xs text-zinc-500 mb-2">{p.category}</p>
                 
                 <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{formatPrice(p.price)}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${p.stock > 0 ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                       {p.stock > 0 ? `Stock: ${p.stock}` : 'Agotado'}
                    </span>
                 </div>
              </div>

              {/* Botones de acción móviles (Más grandes para el dedo) */}
              <div className="flex flex-col gap-2 ml-2">
                 <button onClick={() => openModal(p)} className="p-2.5 bg-zinc-800 text-zinc-400 hover:text-white rounded-lg border border-white/5">
                    <Edit size={18}/>
                 </button>
                 <button onClick={() => handleDelete(p.id)} className="p-2.5 bg-zinc-800 text-red-400 hover:bg-red-500/10 rounded-lg border border-white/5">
                    <Trash2 size={18}/>
                 </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- FORMULARIO MODAL --- */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Editar Producto" : "Nuevo Producto"}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput name="name" label="Nombre del Producto" placeholder="Ej. iPhone 15 Pro" value={formData.name} onChange={handleChange} error={errors.name} />
            
            <div className="grid grid-cols-2 gap-4">
              <FormInput name="price" label="Precio ($)" type="number" value={formData.price} onChange={handleChange} error={errors.price} />
              <FormInput name="stock" label="Stock" type="number" value={formData.stock} onChange={handleChange} error={errors.stock} />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Categoría</label>
              <select name="category" className="bg-black/50 border border-white/10 rounded-xl p-3.5 text-white text-sm focus:border-indigo-500 outline-none w-full" value={formData.category} onChange={handleChange}>
                <option>Accesorios</option><option>Audio</option><option>Celulares</option><option>Cargadores</option>
              </select>
            </div>

            {/* ✅ SECCIÓN DE MULTIMEDIA MEJORADA (GRID) */}
            <div className="p-5 bg-black/30 rounded-2xl border border-white/5">
               <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2 mb-4">
                  <ImageIcon size={14}/> Multimedia
               </h4>
               
               {/* Grid responsiva: 1 col en móvil, 2 en PC */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   {/* 1. Imagen Principal */}
                   <div className="space-y-2">
                       <label className="text-xs text-zinc-500 font-bold uppercase block">Portada</label>
                       <ImageUpload 
                         value={formData.imageUrl ? [formData.imageUrl] : []}
                         disabled={loading}
                         onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                         onRemove={() => setFormData(prev => ({ ...prev, imageUrl: "" }))}
                       />
                   </div>

                   {/* 2. Banner Promocional */}
                   <div className="space-y-2">
                       <label className="text-xs text-zinc-500 font-bold uppercase block flex items-center gap-2">
                          <LayoutTemplate size={12}/> Banner (Opcional)
                       </label>
                       <ImageUpload 
                         value={formData.bannerUrl ? [formData.bannerUrl] : []}
                         disabled={loading}
                         onChange={(url) => setFormData(prev => ({ ...prev, bannerUrl: url }))}
                         onRemove={() => setFormData(prev => ({ ...prev, bannerUrl: "" }))}
                       />
                   </div>
               </div>
               
               {/* Switches y Extras */}
               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4 border-t border-white/5 mt-4">
                  <label className="flex items-center gap-3 cursor-pointer group bg-zinc-800/30 p-2 rounded-lg border border-white/5 w-full sm:w-auto">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.isFeatured ? 'bg-indigo-500 border-indigo-500' : 'border-zinc-600 bg-transparent'}`}>
                        {formData.isFeatured && <Zap size={12} className="text-white fill-white"/>}
                    </div>
                    <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="hidden"/>
                    <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">Destacar Producto</span>
                  </label>

                  <div className="hidden sm:block h-6 w-px bg-white/10 mx-2"></div>

                  <div className="flex items-center gap-3 w-full sm:w-auto bg-zinc-800/30 p-2 rounded-lg border border-white/5">
                    <span className="text-xs text-zinc-400">Descuento %</span>
                    <input name="discount" type="number" className="bg-transparent w-full sm:w-16 text-right text-sm font-bold text-white focus:text-indigo-400 outline-none" placeholder="0" value={formData.discount} onChange={handleChange} />
                  </div>
               </div>
            </div>

            <div className="flex gap-3 pt-2 pb-6 sm:pb-0">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 font-medium transition-all">Cancelar</button>
              <button type="submit" className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2 active:scale-95 transition-all">
                 <Save size={18} /> Guardar
              </button>
            </div>
          </form>
        </Modal>

      </div>
    </div>
  );
}