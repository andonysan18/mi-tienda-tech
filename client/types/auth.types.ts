// client/types/auth.types.ts

// Esta es la "plantilla" de los datos del formulario de registro
export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

// Esta es la "plantilla" de los errores posibles
export interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
    isValid?: boolean;
}

// --- LOGIN ---
export interface LoginFormData {
    email: string;
    password: string;
}