// client/utils/validations.ts

// 1. Importamos los tipos que acabamos de crear
import { RegisterFormData, FormErrors, LoginFormData } from "@/types/auth.types"; 
// (O usa "../types/auth.types" si @ no te funciona)

export const validateRegisterForm = (data: RegisterFormData): FormErrors => {
  const errors: FormErrors = { isValid: true };

  // ... (El resto de la lógica sigue IGUAL, solo cambiaron las importaciones arriba) ...
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.email = "Debes ingresar un correo válido.";
    errors.isValid = false;
  }

  if (!data.password || data.password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres.";
    errors.isValid = false;
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Las contraseñas no coinciden.";
    errors.isValid = false;
  }

  if (!data.name || data.name.trim().length < 2) {
    errors.name = "El nombre es obligatorio.";
    errors.isValid = false;
  }

  return errors;
};

export const validateLoginForm = (data: LoginFormData): FormErrors => {
  const errors: FormErrors = { isValid: true };

  // 1. Email (Igual de estricto que en registro)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.email = "Ingresa un correo válido.";
    errors.isValid = false;
  }

  // 2. Password (Solo verificamos que haya escrito algo)
  if (!data.password) {
    errors.password = "La contraseña es obligatoria.";
    errors.isValid = false;
  }

  return errors;
};