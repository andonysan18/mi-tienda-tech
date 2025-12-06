export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string | null;
  // Nuevos
  bannerUrl: string | null;
  isFeatured: boolean;
  discount: number;
}

// NUEVO: Datos del formulario (todo es string porque viene de inputs)
export interface ProductFormData {
  name: string;
  price: string;
  category: string;
  stock: string;
  imageUrl: string;
  // Nuevos para el formulario
  bannerUrl: string;
  isFeatured: boolean;
  discount: string;
}

// NUEVO: Errores
export interface ProductFormErrors {
  name?: string;
  price?: string;
  category?: string;
  stock?: string;
  imageUrl?: string;
  isValid: boolean;
  
}