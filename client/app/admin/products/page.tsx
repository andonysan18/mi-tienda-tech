"use client";
import { useEffect, useState } from "react";
import { Product } from "@/types/product.types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  
  // Estado para el formulario
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Accesorios",
    stock: "10",
    imageUrl: ""
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:3001/api/products");
    const data = await res.json();
    setProducts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Producto agregado ✅");
        setFormData({ name: "", price: "", category: "Accesorios", stock: "10", imageUrl: "" });
        fetchProducts(); // Recargar la lista
      }
    } catch (error) {
      alert("Error al crear");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-white">Inventario de Productos 📦</h1>

      {/* FORMULARIO DE AGREGAR */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-8">
        <h2 className="text-xl font-bold mb-4 text-blue-400">Agregar Nuevo</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <input 
            placeholder="Nombre (Ej: Funda iPhone)" 
            className="bg-slate-900 border border-slate-600 rounded p-2 text-white"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            required
          />
          <input 
            placeholder="Precio" 
            type="number"
            className="bg-slate-900 border border-slate-600 rounded p-2 text-white"
            value={formData.price}
            onChange={e => setFormData({...formData, price: e.target.value})}
            required
          />
          <select 
            className="bg-slate-900 border border-slate-600 rounded p-2 text-white"
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}
          >
            <option>Accesorios</option>
            <option>Audio</option>
            <option>Celulares</option>
            <option>Cargadores</option>
          </select>
          <input 
            placeholder="URL Imagen (Opcional)" 
            className="bg-slate-900 border border-slate-600 rounded p-2 text-white"
            value={formData.imageUrl}
            onChange={e => setFormData({...formData, imageUrl: e.target.value})}
          />
          <button type="submit" className="bg-green-600 hover:bg-green-500 text-white font-bold rounded p-2">
            + Agregar
          </button>
        </form>
      </div>

      {/* LISTA DE PRODUCTOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700 flex flex-col items-center">
            {/* Imagen simulada o real */}
            <img 
              src={product.imageUrl || "https://via.placeholder.com/150"} 
              alt={product.name}
              className="w-24 h-24 object-cover rounded mb-3 bg-slate-700"
            />
            <h3 className="font-bold text-white text-center">{product.name}</h3>
            <p className="text-slate-400 text-sm">{product.category}</p>
            <p className="text-green-400 font-bold mt-2 text-lg">${product.price}</p>
            <div className="text-xs bg-slate-700 px-2 py-1 rounded mt-2">Stock: {product.stock}</div>
          </div>
        ))}
      </div>
    </div>
  );
}