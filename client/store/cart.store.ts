import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product.types';

// Definimos cómo se ve un Item del carrito (Producto + Cantidad)
export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product) => {
        const { cart } = get();
        // 1. ¿Ya existe en el carrito?
        const exists = cart.find((item) => item.id === product.id);

        if (exists) {
          // Si existe, aumentamos la cantidad
          set({
            cart: cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          // Si no existe, lo agregamos con cantidad 1
          set({ cart: [...cart, { ...product, quantity: 1 }] });
        }
      },

      removeFromCart: (productId) => {
        set({ cart: get().cart.filter((item) => item.id !== productId) });
      },

      clearCart: () => set({ cart: [] }),

      getTotalPrice: () => {
        return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'shopping-cart', // Nombre para guardar en localStorage automáticamente
    }
  )
);