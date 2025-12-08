"use client";
import { useEffect, useState, useMemo } from "react";
import { Product, ProductFormData, ProductFormErrors } from "@/types/product.types";
import { validateProductForm } from "@/utils/product.validations";
import { toast } from "sonner"; 
import { 
  Plus, X, Trash2, Edit, Image as ImageIcon, Search, 
  ChevronLeft, ChevronRight, Filter, ShoppingBag, MoreVertical
} from "lucide-react";

// --- COMPONENTE UI: MODAL ---
const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors"><X size={20}/></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// --- COMPONENTE UI: INPUT ---
const FormInput = ({ label, error, ...props }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">{label}</label>
    <input 
      className={`bg-slate-950 border rounded-lg p-3 text-white text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all ${error ? 'border-red-500/50' : 'border-slate-800 focus:border-blue-500'}`} 
      {...props} 
    />
    {error && <span className="text-xs text-red-400">{error}</span>}
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

  return (
    <div className="max-w-7xl mx-auto min-h-screen pb-24 px-4 sm:px-6 lg:px-8 pt-6">
      
      {/* --- HEADER RESPONSIVE --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Inventario</h1>
          <p className="text-slate-400 text-sm mt-1">
             Gestiona {products.length} productos
          </p>
        </div>
        <button onClick={() => openModal()} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95">
          <Plus size={20} /> <span className="sm:hidden">Nuevo</span> <span className="hidden sm:inline">Agregar Producto</span>
        </button>
      </div>

      {/* --- CONTROLES (Búsqueda + Filtro) --- */}
      <div className="bg-slate-900 p-4 rounded-xl sm:rounded-b-none border border-slate-800 sm:border-b-0 flex flex-col md:flex-row gap-3 mb-4 sm:mb-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3.5 text-slate-500" size={18} />
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar producto..." 
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition-all" 
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-3 top-3.5 text-slate-500 hover:text-white"><X size={16}/></button>
          )}
        </div>

        <div className="relative md:w-64">
          <Filter className="absolute left-3 top-3.5 text-slate-500 pointer-events-none" size={18}/>
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full appearance-none bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-8 py-3 text-slate-300 text-sm focus:border-blue-500 outline-none cursor-pointer"
          >
            <option value="Todos">Todas las categorías</option>
            <option value="Accesorios">Accesorios</option>
            <option value="Audio">Audio</option>
            <option value="Celulares">Celulares</option>
            <option value="Cargadores">Cargadores</option>
          </select>
        </div>
      </div>

      {/* --- VISTA 1: TABLA PARA PC (Hidden en móvil) --- */}
      <div className="hidden md:block overflow-x-auto bg-slate-900 rounded-b-xl border border-slate-800 shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider bg-slate-950/50">
              <th className="p-4 font-medium">Producto</th>
              <th className="p-4 font-medium">Categoría</th>
              <th className="p-4 font-medium">Precio</th>
              <th className="p-4 font-medium">Stock</th>
              <th className="p-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading && <tr><td colSpan={5} className="p-8 text-center text-slate-500">Cargando...</td></tr>}
            {!loading && filteredProducts.map((p) => (
              <tr key={p.id} className="group hover:bg-slate-800/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-slate-950 border border-slate-800 overflow-hidden shrink-0">
                      {p.imageUrl ? <img src={p.imageUrl} className="w-full h-full object-cover"/> : <div className="flex items-center justify-center h-full"><ImageIcon size={16} className="text-slate-600"/></div>}
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">{p.name} {p.isFeatured && "⭐"}</p>
                      {Number(p.discount) > 0 && <span className="text-[10px] text-red-400 font-bold">-{p.discount}% OFF</span>}
                    </div>
                  </div>
                </td>
                <td className="p-4"><span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-xs text-slate-300">{p.category}</span></td>
                <td className="p-4 text-sm text-slate-200 font-mono">${p.price}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${p.stock > 5 ? 'bg-green-500' : p.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm text-slate-300">{p.stock}</span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openModal(p)} className="p-2 text-slate-400 hover:text-blue-400 rounded"><Edit size={18}/></button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 text-slate-400 hover:text-red-400 rounded"><Trash2 size={18}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- VISTA 2: TARJETAS PARA MÓVIL (Hidden en PC) --- */}
      {/* --- VISTA 2: TARJETAS PARA MÓVIL (CORREGIDO) --- */}
      <div className="md:hidden space-y-3">
        {loading && <div className="p-8 text-center text-slate-500 animate-pulse">Cargando productos...</div>}
        
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-10 text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
             <ShoppingBag className="mx-auto mb-2 opacity-50" size={32}/>
             <p className="text-sm">No se encontraron productos</p>
          </div>
        )}

        {!loading && filteredProducts.map((p) => (
          <div key={p.id} className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-stretch gap-3 shadow-sm">
            
            {/* 1. Imagen (Lado Izquierdo) */}
            <div className="w-20 h-auto bg-slate-950 rounded-lg border border-slate-800 overflow-hidden shrink-0 relative">
               {p.imageUrl ? (
                 <img src={p.imageUrl} className="w-full h-full object-cover absolute inset-0"/>
               ) : (
                 <div className="w-full h-full flex items-center justify-center"><ImageIcon size={20} className="text-slate-600"/></div>
               )}
            </div>

            {/* 2. Info del Producto (Centro) */}
            <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
               <h3 className="font-bold text-white text-sm truncate mb-1">{p.name}</h3>
               <p className="text-xs text-slate-400 mb-2">{p.category}</p>
               
               <div className="flex items-center gap-2 mt-auto">
                  <span className="font-mono text-white font-medium bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-xs shadow-inner">
                    ${p.price}
                  </span>
                  {p.stock <= 5 && (
                    <span className="text-[10px] text-red-400 font-bold bg-red-400/10 px-1.5 py-0.5 rounded">
                      ¡Quedan {p.stock}!
                    </span>
                  )}
               </div>
            </div>
            
            {/* 3. Botones de Acción (Columna Derecha) */}
            <div className="flex flex-col justify-center gap-2 pl-2 border-l border-slate-800 ml-1">
               <button 
                 onClick={() => openModal(p)} 
                 className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 active:scale-95 transition-all flex items-center justify-center"
               >
                 <Edit size={18} />
               </button>
               <button 
                 onClick={() => handleDelete(p.id)} 
                 className="p-2.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 active:scale-95 transition-all flex items-center justify-center"
               >
                 <Trash2 size={18} />
               </button>
            </div>

          </div>
        ))}
      </div>

      {/* --- FORMULARIO EN MODAL (Responsive por defecto) --- */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Editar Producto" : "Nuevo Producto"}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormInput name="name" label="Nombre del Producto" placeholder="Ej. Smart TV 4K" value={formData.name} onChange={handleChange} error={errors.name} />
          
          <div className="grid grid-cols-2 gap-4">
            <FormInput name="price" label="Precio" type="number" value={formData.price} onChange={handleChange} error={errors.price} />
            <FormInput name="stock" label="Stock" type="number" value={formData.stock} onChange={handleChange} error={errors.stock} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">Categoría</label>
            <select name="category" className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-sm" value={formData.category} onChange={handleChange}>
              <option>Accesorios</option><option>Audio</option><option>Celulares</option><option>Cargadores</option>
            </select>
          </div>

          <div className="space-y-3 pt-2">
             <FormInput name="imageUrl" label="URL Imagen" value={formData.imageUrl} onChange={handleChange} error={errors.imageUrl} />
             
             {/* ✅ NUEVO: INPUT PARA BANNER */}
             <FormInput 
                name="bannerUrl" 
                label="URL Banner (Opcional)" 
                placeholder="https://..." 
                value={formData.bannerUrl} 
                onChange={handleChange} 
             />
             
             <div className="flex gap-4 items-center bg-slate-950 p-3 rounded-lg border border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-white">
                  <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="accent-blue-500 w-4 h-4"/>
                  Destacar Producto
                </label>
                <div className="flex items-center gap-2 border-l border-slate-800 pl-4 ml-auto">
                  <span className="text-xs text-slate-400">Desc. %</span>
                  <input name="discount" type="number" className="bg-transparent w-12 text-center text-sm text-white border-b border-slate-700 focus:border-blue-500 outline-none" value={formData.discount} onChange={handleChange} />
                </div>
             </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 text-slate-400 hover:text-white font-medium">Cancelar</button>
            <button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg shadow-blue-900/20">Guardar</button>
          </div>
        </form>
      </Modal>

    </div>
  );
}