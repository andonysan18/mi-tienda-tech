"use client";
import { useEffect, useState } from "react";
import { Product, ProductFormData, ProductFormErrors } from "@/types/product.types";
import { validateProductForm } from "@/utils/product.validations";
import { toast } from "sonner"; 

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: "",
    category: "Accesorios",
    stock: "",
    imageUrl: "",
    bannerUrl: "",
    isFeatured: false,
    discount: ""
  });

  const [errors, setErrors] = useState<ProductFormErrors>({ isValid: true });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      toast.error("Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      imageUrl: product.imageUrl || "",
      bannerUrl: product.bannerUrl || "",
      isFeatured: product.isFeatured,
      discount: product.discount.toString()
    });
    setErrors({ isValid: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ 
      name: "", price: "", category: "Accesorios", stock: "", imageUrl: "", 
      bannerUrl: "", isFeatured: false, discount: "" 
    });
    setErrors({ isValid: true });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Producto eliminado");
        fetchProducts();
      } else {
        toast.error("Error al eliminar");
      }
    } catch (error) {
      toast.error("Error de conexión");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationResult = validateProductForm(formData);
    if (!validationResult.isValid) {
      setErrors(validationResult);
      toast.warning("Revisa los campos");
      return;
    }

    const promise = (async () => {
        const url = editingId 
          ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/products/${editingId}`
          : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/products`;
        
        const method = editingId ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (!res.ok) throw new Error("Fallo en el servidor");
        return res;
    })();

    toast.promise(promise, {
        loading: 'Guardando...',
        success: () => {
            handleCancelEdit();
            fetchProducts();
            return "¡Guardado con éxito!";
        },
        error: 'Error al guardar',
    });
  };

  // Manejadores genéricos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // Manejo especial para checkboxes
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({ ...prev, [name]: val }));
    if (errors[name as keyof ProductFormErrors]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-white">Inventario PRO 📦</h1>

      <div className={`p-6 rounded-xl border mb-8 transition-colors ${editingId ? 'bg-blue-900/20 border-blue-500/50' : 'bg-slate-800 border-slate-700'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">{editingId ? "✏️ Editando" : "➕ Agregar Nuevo"}</h2>
          {editingId && <button onClick={handleCancelEdit} className="text-sm text-slate-400 underline">Cancelar</button>}
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          
          <input name="name" placeholder="Nombre" className="bg-slate-900 border border-slate-600 rounded p-2 text-white lg:col-span-2" value={formData.name} onChange={handleChange} />
          <input name="price" placeholder="Precio" type="number" className="bg-slate-900 border border-slate-600 rounded p-2 text-white" value={formData.price} onChange={handleChange} />
          <select name="category" className="bg-slate-900 border border-slate-600 rounded p-2 text-white" value={formData.category} onChange={handleChange}>
            <option>Accesorios</option><option>Audio</option><option>Celulares</option><option>Cargadores</option>
          </select>
          <input name="stock" placeholder="Stock" type="number" className="bg-slate-900 border border-slate-600 rounded p-2 text-white" value={formData.stock} onChange={handleChange} />
          
          <input name="imageUrl" placeholder="URL Foto Cuadrada" className="bg-slate-900 border border-slate-600 rounded p-2 text-white lg:col-span-3" value={formData.imageUrl} onChange={handleChange} />
          
          {/* NUEVO: URL DEL BANNER */}
          <input name="bannerUrl" placeholder="URL Banner Ancho (Opcional)" className="bg-slate-900 border border-slate-600 rounded p-2 text-white lg:col-span-3" value={formData.bannerUrl} onChange={handleChange} />

          {/* NUEVO: CONTROLES DE MARKETING */}
          <div className="lg:col-span-2 flex items-center gap-4 bg-slate-900/50 p-2 rounded border border-slate-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-4 h-4 accent-blue-500" />
              <span className="text-sm text-slate-300">Destacado</span>
            </label>
            <input name="discount" placeholder="% OFF" type="number" className="bg-slate-900 border border-slate-600 rounded p-1 text-white w-20 text-sm" value={formData.discount} onChange={handleChange} />
          </div>

          <button type="submit" className={`font-bold rounded p-2 text-white lg:col-span-4 ${editingId ? 'bg-yellow-600' : 'bg-green-600'}`}>
            {editingId ? "Actualizar Producto" : "Guardar Producto"}
          </button>
        </form>
      </div>

      {/* LISTA RESUMIDA */}
      <div className="grid grid-cols-1 gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-slate-800 p-4 rounded flex justify-between items-center border border-slate-700">
            <div className="flex items-center gap-4">
              <img src={p.imageUrl || "/placeholder.png"} className="w-12 h-12 object-cover rounded" />
              <div>
                <p className="font-bold text-white">{p.name} {p.isFeatured && "⭐"}</p>
                <p className="text-xs text-slate-400">Stock: {p.stock} | {p.bannerUrl ? "✅ Tiene Banner" : "❌ Sin Banner"}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEditClick(p)} className="text-yellow-400 border border-yellow-400/30 px-3 py-1 rounded text-sm">Editar</button>
              <button onClick={() => handleDelete(p.id)} className="text-red-400 border border-red-400/30 px-3 py-1 rounded text-sm">Borrar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}