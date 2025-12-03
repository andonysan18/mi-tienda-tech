"use client";
import { useEffect, useState } from "react";
import { Product, ProductFormData, ProductFormErrors } from "@/types/product.types";
import { validateProductForm } from "@/utils/product.validations";
// 1. IMPORTAMOS SONNER
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
    imageUrl: ""
  });

  const [errors, setErrors] = useState<ProductFormErrors>({ isValid: true });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      toast.error("Error al cargar los productos"); // Error de carga
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
      imageUrl: product.imageUrl || ""
    });
    setErrors({ isValid: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Notificación opcional (a veces es mucho, pero para que sepas que se puede)
    // toast.info(`Editando: ${product.name}`); 
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", price: "", category: "Accesorios", stock: "", imageUrl: "" });
    setErrors({ isValid: true });
    // toast.info("Edición cancelada");
  };

  const handleDelete = (id: number) => {
    // En lugar de borrar directo, lanzamos un Toast personalizado
    toast("¿Estás seguro de eliminar este producto?", {
      description: "Esta acción no se puede deshacer.",
      action: {
        label: "Eliminar",
        onClick: () => deleteProductConfirmed(id), // Llamamos a la función real si confirma
      },
      cancel: {
        label: "Cancelar",
        onClick: () => toast.dismiss(),
      },
      duration: 5000, // Se queda 5 segundos esperando
      actionButtonStyle: { backgroundColor: '#EF4444', color: 'white' } // Botón rojo peligroso
    });
  };

  // Esta es la función que REALMENTE borra (separada para mayor orden)
  const deleteProductConfirmed = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3001/api/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Producto eliminado correctamente 🗑️");
        fetchProducts(); // Recargar la lista
        if (editingId === id) handleCancelEdit();
      } else {
        toast.error("No se pudo eliminar");
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
      toast.warning("Revisa los campos marcados en rojo"); // ADVERTENCIA
      return;
    }

    // Promesa para mostrar carga mientras guarda (Efecto "Loading...")
    const promise = (async () => {
        let res;
        if (editingId) {
            res = await fetch(`http://localhost:3001/api/products/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
        } else {
            res = await fetch("http://localhost:3001/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
        }

        if (!res.ok) throw new Error("Fallo en el servidor");
        return res;
    })();

    // Sonner maneja la promesa automáticamente:
    toast.promise(promise, {
        loading: 'Guardando producto...',
        success: () => {
            handleCancelEdit(); // Limpia formulario
            fetchProducts();    // Recarga lista
            return editingId ? "¡Producto actualizado! 🔄" : "¡Producto creado! 🎉";
        },
        error: 'Ocurrió un error al guardar',
    });
  };

  // ... (El resto del código de los inputs y la tabla sigue IGUAL) ...
  // Solo copio la parte de arriba porque el HTML no cambia, solo la lógica.
  
  // --- MANEJADORES DE INPUTS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ProductFormErrors]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    const validationResult = validateProductForm(formData);
    // @ts-ignore
    const errorInField = validationResult[name];
    if (errorInField) setErrors(prev => ({ ...prev, [name]: errorInField }));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-white">Inventario de Productos 📦</h1>

      {/* FORMULARIO */}
      <div className={`p-6 rounded-xl border mb-8 transition-colors ${editingId ? 'bg-blue-900/20 border-blue-500/50' : 'bg-slate-800 border-slate-700'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {editingId ? "✏️ Editando Producto" : "➕ Agregar Nuevo"}
          </h2>
          {editingId && (
            <button onClick= { () => {
              handleCancelEdit();
              toast.info("Edición cancelada");
            }} 
            className="text-sm text-slate-400 hover:text-white underline">
              Cancelar edición
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          
          {/* NOMBRE */}
          <div className="lg:col-span-2">
            <input 
              name="name"
              placeholder="Nombre" 
              className={`w-full bg-slate-900 border rounded p-2 text-white outline-none ${errors.name ? 'border-red-500' : 'border-slate-600 focus:border-blue-500'}`}
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* PRECIO */}
          <div>
            <input 
              name="price"
              placeholder="Precio" 
              type="number"
              className={`w-full bg-slate-900 border rounded p-2 text-white outline-none ${errors.price ? 'border-red-500' : 'border-slate-600 focus:border-blue-500'}`}
              value={formData.price}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
          </div>

          {/* CATEGORÍA */}
          <div>
            <select 
              name="category"
              className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white outline-none"
              value={formData.category}
              onChange={handleChange}
            >
              <option>Accesorios</option>
              <option>Audio</option>
              <option>Celulares</option>
              <option>Cargadores</option>
            </select>
          </div>

          {/* STOCK */}
          <div>
            <input 
              name="stock"
              placeholder="Stock" 
              type="number"
              className={`w-full bg-slate-900 border rounded p-2 text-white outline-none ${errors.stock ? 'border-red-500' : 'border-slate-600 focus:border-blue-500'}`}
              value={formData.stock}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.stock && <p className="text-red-400 text-xs mt-1">{errors.stock}</p>}
          </div>

          {/* IMAGEN */}
          <div>
            <input 
              name="imageUrl"
              placeholder="URL Imagen" 
              className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white outline-none"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </div>

          {/* BOTÓN */}
          <button 
            type="submit" 
            className={`font-bold rounded p-2 lg:col-span-1 md:col-span-2 text-white transition shadow-lg
              ${editingId ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-green-600 hover:bg-green-500'}`}
          >
            {editingId ? "Actualizar" : "+ Agregar"}
          </button>
        </form>
      </div>

      {/* LISTA DE PRODUCTOS */}
      {loading ? <p className="text-center text-slate-500">Cargando...</p> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className={`bg-slate-800 rounded-lg p-4 border flex flex-col items-center group relative transition-all
              ${editingId === product.id ? 'border-yellow-500 ring-2 ring-yellow-500/20' : 'border-slate-700 hover:border-blue-500'}`}>
              
              <div className="absolute top-2 right-2 flex gap-2 z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEditClick(product)}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black p-1.5 rounded shadow"
                  title="Editar"
                >
                  ✏️
                </button>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 hover:bg-red-400 text-white p-1.5 rounded shadow"
                  title="Eliminar"
                >
                  🗑️
                </button>
              </div>

              {product.stock === 0 && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow">
                  AGOTADO
                </span>
              )}

              <img 
                src={product.imageUrl || "https://via.placeholder.com/150"} 
                alt={product.name}
                className="w-24 h-24 object-contain rounded mb-3 bg-white p-2"
              />
              <h3 className="font-bold text-white text-center text-sm mb-1">{product.name}</h3>
              <p className="text-slate-400 text-xs uppercase font-bold">{product.category}</p>
              
              <div className="mt-3 flex items-center gap-3">
                <span className="text-green-400 font-bold text-lg">${product.price}</span>
                <span className={`text-xs px-2 py-1 rounded font-bold ${product.stock > 0 ? 'bg-slate-700' : 'bg-red-900 text-red-200'}`}>
                  Stock: {product.stock}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}