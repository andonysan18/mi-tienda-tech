import { ProductFormData, ProductFormErrors } from "@/types/product.types";

export const validateProductForm = (data: ProductFormData): ProductFormErrors => {
  const errors: ProductFormErrors = { isValid: true };

  // 1. Validar Nombre
  if (!data.name.trim()) {
    errors.name = "El nombre es obligatorio.";
    errors.isValid = false;
  } else if (data.name.length < 3) {
    errors.name = "El nombre debe tener al menos 3 letras.";
    errors.isValid = false;
  }

  // 2. Validar Precio (Debe ser número positivo)
  const priceNumber = parseFloat(data.price);
  if (!data.price) {
    errors.price = "El precio es obligatorio.";
    errors.isValid = false;
  } else if (isNaN(priceNumber) || priceNumber <= 0) {
    errors.price = "El precio debe ser mayor a 0.";
    errors.isValid = false;
  }

  // 3. Validar Stock (Debe ser número entero y no negativo)
  const stockNumber = parseFloat(data.stock);
  if (!data.stock) {
    errors.stock = "El stock es obligatorio.";
    errors.isValid = false;
  } else if (isNaN(stockNumber) || stockNumber < 0 || !Number.isInteger(stockNumber)) {
    errors.stock = "El stock debe ser un número entero positivo (ej: 0, 1, 10).";
    errors.isValid = false;
  }

  // 4. Validar Categoría
  if (!data.category) {
    errors.category = "Selecciona una categoría.";
    errors.isValid = false;
  }

  return errors;
};