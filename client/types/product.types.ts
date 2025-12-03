export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string | null;
}

// NUEVO: Datos del formulario (todo es string porque viene de inputs)
export interface ProductFormData {
  name: string;
  price: string;
  category: string;
  stock: string;
  imageUrl: string;
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